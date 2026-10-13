# Ressources pour le web

Les dossiers de projet conservent les fichiers originaux. Le site charge leurs
dérivés optimisés :

- `backgrounds/<projet>.webp` : fond, largeur maximale 1920 px, qualité 90.
- `thumbnails/<projet>.webp` : carte et affiche vidéo, largeur maximale 960 px,
  qualité 88. Les proportions sont conservées ; le composant peut recadrer la carte.
- `videos/<projet>.mp4` : vidéo complète en H.264, CRF 20, AAC 160 kbit/s,
  `faststart`. Résolution, cadence et durée conservées.
- `media-manifest.json` : correspondance avec les sources, tailles et données
  vérifiées lors de la migration.

Les ressources de l’introduction, dans `models/` et `vendor/`, ont leur propre
processus de production et ne sont pas générées par ce script.

## Remplacer des visuels

Déposer `Splashscreen.png`, `Thumbnail.png` et éventuellement `Gameplay.mp4`
dans le dossier du projet, puis générer les dérivés depuis la racine du dépôt :

```powershell
python tools/media/optimize-media.py
python tools/media/optimize-media.py --ffmpeg "C:/chemin/vers/ffmpeg.exe"
```

La première commande ne traite que les images. Pillow est requis. La seconde
traite aussi les vidéos avec un FFmpeg compatible libx264. Les identifiants des
projets sont dans `PROJECTS` du script ; ajouter une entrée pour un nouveau jeu.

Le HTML doit référencer les dérivés correspondants. Une vidéo absente n’a ni
fichier factice ni bouton. Ne pas remplacer les sources par leurs versions
compressées : elles restent utiles pour un nouvel export.

## Contrôles avant publication

Comparer les visuels, notamment les petits textes du gameplay ; vérifier les
dimensions, la cadence, la durée et la lecture dans le navigateur. Le lecteur
charge la vidéo à l’ouverture, avec des métadonnées placées avant les données
vidéo, puis demande la lecture à l’action de l’utilisateur.

Sur l’hébergement, vérifier les bons types MIME, les requêtes partielles vidéo
(Range), le cache des ressources et le comportement sur un réseau plus lent.
Mesurer les performances réelles après déploiement ; les tailles locales ne
constituent pas une mesure de LCP, INP ou CLS.
