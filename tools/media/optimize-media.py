"""Create web derivatives without replacing project source media.

Images: Pillow. Videos: FFmpeg installed separately, supplied via --ffmpeg.
Run from any directory; outputs always stay inside this repository.
"""
from argparse import ArgumentParser
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import subprocess
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PROJECTS = [('DungeonRoller','dungeonroller'), ('NecromancerMagicalGirl','necromancer'), ('Tatamiam','tatamiam'),
            ('IsekaiWar','isekaiwar'), ('Entrecote','entrecote'), ('SpaceRunner','spacerunner'),
            ('Out-Tanked!','outtanked')]
SILENT_VIDEOS = {'tatamiam', 'entrecote'}
VIDEO_CRF = {'necromancer': 26}
VIDEO_OPTIONS = {
    # Keep the 3:39 Dungeon Roller gameplay within GitHub's 100 MiB file limit.
    'dungeonroller': [
        '-filter_threads', '3',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos',
        '-threads', '12', '-preset', 'fast', '-b:v', '3000k',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    ],
}

def images():
    report=[]
    for folder, key in PROJECTS:
        for source_name, destination, width, quality in [('Splashscreen.png','backgrounds',1920,90), ('Thumbnail.png','thumbnails',960,88)]:
            source=ROOT/'projects'/folder/source_name
            target=ROOT/'assets'/destination/(key+'.webp')
            target.parent.mkdir(parents=True, exist_ok=True)
            image=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
            if image.width > width:
                image=image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS)
            image.save(target,'WEBP',quality=quality,method=6)
            report.append(dict(source=str(source.relative_to(ROOT)),output=str(target.relative_to(ROOT)),source_bytes=source.stat().st_size,output_bytes=target.stat().st_size,size=image.size))
    return report

def video(item, ffmpeg):
    folder,key=item
    source=ROOT/'projects'/folder/'Gameplay.mp4'
    if not source.exists(): return None
    target=ROOT/'assets'/'videos'/(key+'.mp4')
    target.parent.mkdir(parents=True,exist_ok=True)
    audio_options=['-an'] if key in SILENT_VIDEOS else ['-map','0:a?','-c:a','aac','-b:a','160k']
    video_options = VIDEO_OPTIONS.get(key, ['-preset', 'medium', '-crf', str(VIDEO_CRF.get(key, 20)), '-threads', '2'])
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(source),'-map','0:v:0',*audio_options,
                    '-c:v','libx264',*video_options,'-pix_fmt','yuv420p',
                    '-movflags','+faststart',str(target)],check=True)
    print(f'{key}: {source.stat().st_size} -> {target.stat().st_size} bytes',flush=True)
    return dict(source=source.relative_to(ROOT).as_posix(),output=target.relative_to(ROOT).as_posix(),source_bytes=source.stat().st_size,output_bytes=target.stat().st_size)

if __name__=='__main__':
    parser=ArgumentParser()
    parser.add_argument('--ffmpeg',help='Path to an FFmpeg executable; omit to generate only images.')
    args=parser.parse_args()
    report={'images':images(),'videos':[]}
    print('Images optimized.',flush=True)
    if args.ffmpeg:
        with ThreadPoolExecutor(max_workers=2) as pool:
            report['videos']=[r for r in pool.map(lambda item:video(item,args.ffmpeg),PROJECTS) if r]
    target=ROOT/'assets'/'media-manifest.json'
    target.write_text(json.dumps(report,indent=2),encoding='utf-8')
    print('Manifest: assets/media-manifest.json',flush=True)
