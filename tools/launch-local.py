"""Open the portfolio or its design system, starting a loopback server if needed."""
from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.request import ProxyHandler, build_opener
import argparse
import ctypes
import os
import subprocess
import sys
import time
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
PAGES = {'portfolio': 'index.html', 'design-system': 'design-system/index.html'}
ASSET = 'design-system/styles/toon.css'
OPENER = build_opener(ProxyHandler({}))


def project_is_running(port):
    """Do not open an unrelated project that happens to occupy the same port."""
    try:
        with OPENER.open(f'http://127.0.0.1:{port}/{ASSET}?launcher=1.0', timeout=.4) as response:
            return sha256(response.read()).digest() == sha256((ROOT / ASSET).read_bytes()).digest()
    except (URLError, OSError):
        return False


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Local editing should never require clearing the browser's cache.
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, format, *args):
        pass


def serve(port):
    server = ThreadingHTTPServer(('127.0.0.1', port), partial(PreviewHandler, directory=str(ROOT)))
    server.daemon_threads = True
    server.serve_forever()


def ensure_server(preferred=8766):
    # Reuse our server; if another application owns the port, try the next one.
    for port in range(preferred, preferred + 11):
        if project_is_running(port):
            return port
        flags = subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        process = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), '--serve', str(port)],
                                   cwd=ROOT, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                   stderr=subprocess.DEVNULL, creationflags=flags)
        deadline = time.monotonic() + 8
        while time.monotonic() < deadline:
            if project_is_running(port):
                return port
            if process.poll() is not None:
                break
            time.sleep(.1)
        if process.poll() is None:
            process.terminate()
    raise RuntimeError('Impossible de démarrer le serveur local du portfolio.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('page', nargs='?', choices=PAGES, default='portfolio')
    parser.add_argument('--serve', type=int)
    parser.add_argument('--port', type=int, default=8766)
    parser.add_argument('--check', action='store_true', help='Start/check the server without opening a browser.')
    args = parser.parse_args()
    if args.serve is not None:
        serve(args.serve)
        return
    port = ensure_server(args.port)
    url = f'http://127.0.0.1:{port}/{PAGES[args.page]}?v=1.0'
    # Validate the requested page as well as the project's identifying asset.
    with OPENER.open(url, timeout=3) as response:
        if response.status != 200:
            raise RuntimeError('La page demandée est indisponible.')
    if args.check:
        print(url)
    elif not webbrowser.open(url):
        raise RuntimeError('Aucun navigateur par défaut ne peut ouvrir la page.')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Background server children stay silent. A shortcut launch reports errors.
        if '--serve' in sys.argv:
            raise
        if os.name == 'nt' and 'pythonw' in Path(sys.executable).stem.lower():
            ctypes.windll.user32.MessageBoxW(None, str(error), 'Portfolio · Lancement local', 0x10)
        else:
            print(str(error), file=sys.stderr)
        sys.exit(1)
