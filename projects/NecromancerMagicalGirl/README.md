# Visuels — Necromancer x Magical Girl

Même convention de fichiers que les autres projets du portfolio :

- `Splashscreen.png` : image de fond du projet à la une (déjà présente).
- `Thumbnail.png` : miniature dans la collection, puis affiche de la vidéo
  lorsqu'un lecteur sera ajouté (déjà présente ; reprend provisoirement le fond).
- `Gameplay.mp4` : déposer ici la future vidéo de gameplay.

Conserver ces noms et leur casse pour remplacer les images sans modifier les
liens du site. Préférer des images paysage en 16:9.

Le site utilise désormais les dérivés WebP dans `assets/backgrounds/` et
`assets/thumbnails/`. Après remplacement d’un PNG, exécuter
`python tools/media/optimize-media.py` depuis la racine pour les régénérer.
Voir [le guide des médias](../../assets/README.md).

Aucune vidéo n'a encore été fournie : il n'y a donc pas de fichier MP4 factice
ni de lecteur vide. Une fois `Gameplay.mp4` déposé, il restera à intégrer son
lecteur dans l'écran du projet.

La fiche présente deux actions : « Vidéo — à venir » et « Code source »,
vers le dépôt public fourni par Ryad le 13 octobre 2026 :
`https://github.com/gto634/Necromancer-x-MagicalGirl`.
Le langage C# et Unity 6 reprennent les technologies
fournies par Ryad ; les logos restent Unity 6, Blender et Figma.

Les quatre réalisations sont directement visibles, sans dépliable. La durée
actuelle de 10 jours et le rôle « Gameplay & assets visuels » reprennent le
dernier HTML fourni par Ryad. Le français du HTML est conservé par le système
de langues ; actualiser également sa traduction anglaise dans `assets/scripts/i18n.js`.
