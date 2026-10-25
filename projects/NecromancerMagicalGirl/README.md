# Visuels — Necromancer x Magical Girl

Même convention de fichiers que les autres projets du portfolio :

- `Splashscreen.png` : image de fond du projet à la une (déjà présente).
- `Thumbnail.png` : miniature dans la collection et affiche de la vidéo
  (déjà présente ; reprend provisoirement le fond).
- `Gameplay.mp4` : vidéo originale de gameplay, conservée sans modification.

Conserver ces noms et leur casse pour remplacer les images sans modifier les
liens du site. Préférer des images paysage en 16:9.

Le site utilise désormais les dérivés WebP dans `assets/backgrounds/` et
`assets/thumbnails/`. Après remplacement d’un PNG, exécuter
`python tools/media/optimize-media.py` depuis la racine pour les régénérer.
Voir [le guide des médias](../../assets/README.md).

La vidéo utilise le lecteur commun depuis l'écran du projet, avec l'affiche
`assets/thumbnails/necromancer.webp`. Le dérivé web est
`assets/videos/necromancer.mp4` : H.264, CRF 26, AAC 160 kbit/s et `faststart`,
généré par la fonction `video` de `tools/media/optimize-media.py`. La résolution,
la cadence et la durée de la source sont conservées.

Le dérivé reste sous la limite de 100 Mio de GitHub pour la publication sur
GitHub Pages. L'original `Gameplay.mp4`, plus volumineux, est versionné avec
Git LFS ; un clonage doit récupérer cet objet pour retrouver la vidéo complète.

La fiche présente deux actions : « Voir la vidéo » et « Code source »,
vers le dépôt public fourni par Ryad le 13 octobre 2026 :
`https://github.com/gto634/Necromancer-x-MagicalGirl`.
Le langage C# et Unity 6 reprennent les technologies
fournies par Ryad ; les logos restent Unity 6, Blender et Figma.

Les quatre réalisations sont directement visibles, sans dépliable. La durée
actuelle de 10 jours et le rôle « Gameplay & assets visuels » reprennent le
dernier HTML fourni par Ryad. Le français du HTML est conservé par le système
de langues ; actualiser également sa traduction anglaise dans `assets/scripts/i18n.js`.
