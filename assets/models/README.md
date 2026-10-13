# Hypercube de l’introduction

Le modèle et ses 46 cibles de déformation proviennent du fichier fourni
`sources/hypercube/Hypercube.blend`. Le fichier source n’est pas modifié.
L’export rétablit la séquence complète des cibles, dont la dernière rejoint
la forme initiale, et applique le rose du portfolio.

Depuis la racine du dépôt, avec Blender 5.2 :

```powershell
blender --background --disable-autoexec sources/hypercube/Hypercube.blend --python tools/hypercube/export-hypercube.py
```

- `hypercube.glb` : géométrie et animation exportées.
- `hypercube.glb.gz` : même modèle compressé, décompressé dans le navigateur.
- `hypercube-poster.png` : rendu transparent pour le chargement, le mouvement
  réduit et les navigateurs sans WebGL.
- `hypercube.json` : empreinte du fichier source et paramètres de l’export.
- `hypercube-rig.json` : 16 centres de sphères, 32 connexions et 47 poses
  extraits directement du même fichier Blender pour le rendu animé.

L’export oriente la déformation vers la droite. Pour éviter les torsions des
barres et les variations de normales lors du mélange des morphs,
`tools/hypercube/export-hypercube-rig.py` relève les centres des sphères dans chaque
cible et les extrémités des cylindres dans la pose initiale. Les sphères
conservent leurs centres ; leur rayon affiché est réduit de 15 %, tandis que
les barres gardent leur épaisseur d’origine. Le matériau est légèrement plus
mat (rugosité 0,5, métallicité 0,08). `assets/scripts/hypercube-animation.js`
interpole uniquement les centres, avec une tangente continue au raccord.
`assets/scripts/hypercube-scene.js` ajuste des cylindres rigides entre ces centres à chaque
image. La pose finale, qui duplique la première, ne crée plus de changement
d’état à chaque tour. Le fichier source reste intact.

```powershell
blender --background --disable-autoexec sources/hypercube/Hypercube.blend --python tools/hypercube/export-hypercube-rig.py
node tools/hypercube/check-hypercube.mjs
```

`assets/scripts/hypercube.js` charge les fichiers par des chemins relatifs. L’animation joue
à un seizième de la vitesse source (environ 30,67 secondes par tour), soit
deux fois plus lentement que la version précédente. Elle s’arrête lorsque l’introduction quitte l’écran, lorsque
l’onglet est masqué ou lorsque la réduction des animations est activée.
Dans ce dernier cas, la scène 3D reste fixe.

Le site n’a besoin ni d’un serveur applicatif ni d’une étape de compilation.

Le sol et l’hypercube utilisent une seule scène et une même caméra en
perspective. Le cadrage suit la position du modèle dans la mise en page,
sans modifier son orientation par rapport au sol. Les axes utilisent deux
roses distincts, sans lettres. La grille est calculée dans le repère 3D,
avec un fondu selon la distance et l’angle de vue, et un filtrage des lignes
trop fines à l’horizon. Le bord du grand plan est situé bien au-delà de la
distance où ses lignes deviennent invisibles. `intro-grid.svg` reste un
arrière-plan de secours pour les navigateurs sans WebGL.
