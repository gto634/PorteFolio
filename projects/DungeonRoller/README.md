# Visuels et contenu — Dungeon Roller

Les fichiers originaux du projet sont conservés ici :

- `Splashscreen.png` : fond de la fiche à la une, avec la voiture à droite pour
  laisser la place au texte.
- `Thumbnail.png` : miniature de la collection, avec le titre intégré.
- `Visual.png` : illustration sans titre, avec la voiture au centre.
- `Texte à intégrer.txt` : texte et caractéristiques fournis pour le portfolio.
- `Gameplay.mp4` : source de gameplay de 1,18 Go, conservée en local et ignorée par Git.
- `Stuff/` : captures, visuels de travail et présentation sources.

Le site utilise les dérivés WebP `assets/backgrounds/dungeonroller.webp`
(1920 × 1080, qualité 90) et `assets/thumbnails/dungeonroller.webp`
(960 × 540, qualité 88). Après remplacement des PNG, exécuter
`python tools/media/optimize-media.py` depuis la racine pour les régénérer.
Voir [le guide des médias](../../assets/README.md).

La fiche reprend la structure de Necromancer x Magical Girl. Les informations
proviennent de `Texte à intégrer.txt` : deux semaines, équipe de trois personnes,
rôle de développement gameplay, C#, Unity, Blender et Photoshop. La version de
Unity et la spécialité des autres membres de l’équipe ne sont pas précisées.

Le bouton « Voir la vidéo » ouvre le lecteur commun sur l’accueil et la fiche
dédiée. Le lecteur utilise `assets/videos/dungeonroller.mp4` et la miniature
WebP du projet comme affiche. Le MP4 web fait 87 Mo, en H.264 à 1920 × 1080
et 60 i/s, avec `faststart`. Sa piste AAC stéréo est silencieuse, comme celle de
la vidéo source. Le bouton « Code source » ouvre le dépôt
[Dungeon Roller sur GitHub](https://github.com/gto634/Dungeon-Roller).
