"""Check static pages, resources, module imports and local anchors before publishing."""
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import posixpath
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'projets.html', 'spacerunner.html',
         'design-system/index.html', 'design-system/legacy.html', 'design-system/toon.html']
CSS_URL = re.compile(r'url\(\s*[\"\x27]?([^\"\x27)]+)[\"\x27]?\s*\)')
MODULE_URL = re.compile(r'(?:from\s+|import\(\s*|new URL\(\s*)[\"\x27]([^\"\x27]+)[\"\x27]')


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.references = []
        self.duplicates = set()
        self.importmap = False
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if values.get('id'):
            if values['id'] in self.ids:
                self.duplicates.add(values['id'])
            self.ids.add(values['id'])
        for attribute in ['src', 'href', 'data-video-src', 'data-video-poster', 'data-project-image']:
            if values.get(attribute):
                self.references.append(values[attribute])
        self.references.extend(CSS_URL.findall(values.get('style', '')))
        if tag == 'script':
            self.importmap = values.get('type') == 'importmap'

    def handle_endtag(self, tag):
        if tag == 'script':
            self.importmap = False

    def handle_data(self, data):
        if self.importmap:
            self.references.extend(json.loads(data).get('imports', {}).values())


def check():
    actual = {file.relative_to(ROOT).as_posix(): file for file in ROOT.rglob('*')
              if file.is_file() and '.git' not in file.relative_to(ROOT).parts
              and not file.relative_to(ROOT).as_posix().startswith('tools/ai/archive/')}
    folded = {name.casefold(): name for name in actual}
    pages = {}
    errors = []
    checked = set()
    queue = deque(PAGES)
    references = 0

    def page(name):
        if name not in pages:
            pages[name] = Page(actual[name].read_text(encoding='utf-8'))
        return pages[name]

    while queue:
        name = queue.popleft()
        if name in checked:
            continue
        checked.add(name)
        if name not in actual:
            errors.append(f'{name}: file not found')
            continue
        suffix = actual[name].suffix
        if suffix == '.html':
            content = page(name)
            refs = content.references
            errors.extend(f'{name}: duplicate id {value}' for value in content.duplicates)
        elif suffix in {'.css', '.js', '.mjs'}:
            text = actual[name].read_text(encoding='utf-8')
            refs = CSS_URL.findall(text) if suffix == '.css' else MODULE_URL.findall(text)
        else:
            continue
        for value in refs:
            parts = urlsplit(value.strip())
            if parts.scheme or parts.netloc:
                continue
            references += 1
            target = posixpath.normpath(posixpath.join(posixpath.dirname(name), unquote(parts.path))) if parts.path else name
            if parts.path.startswith('/'):
                errors.append(f'{name}: absolute path {value} is not portable to a project subdirectory')
                continue
            if target not in actual:
                real = folded.get(target.casefold())
                errors.append(f'{name}: wrong case {value} (actual: {real})' if real else f'{name}: missing {value}')
                continue
            if parts.fragment and target.endswith('.html') and unquote(parts.fragment) not in page(target).ids:
                errors.append(f'{name}: missing anchor {value}')
            if actual[target].suffix in {'.html', '.css', '.js', '.mjs'}:
                queue.append(target)
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        print(f'{len(errors)} error(s).', file=sys.stderr)
        return 1
    print(f'OK: {len(checked)} files and {references} local references checked, including filename case.')
    return 0


if __name__ == '__main__':
    sys.exit(check())
