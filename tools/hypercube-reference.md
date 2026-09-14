# Reconstruction du mouvement de référence

Référence locale fournie : `150px-8-cell-simple.gif`, 150 × 150 pixels,
48 images de 70 ms (boucle de 3,36 secondes).

## Relevés et précision

Les 16 sommets sont identifiés de 0 à 15. Les bits 0, 1, 2, 3 de
l'identifiant donnent les signes de x, y, z, w : 0 signifie −1, 1 signifie +1.
Les coordonnées écran ont leur origine dans le coin supérieur gauche du GIF.

42 positions visibles ont été relevées manuellement, au centre des arêtes,
sur les images 0, 12, 24 et 36. Les sommets occultés n'ont pas été considérés
comme des mesures exactes. Une projection 4D → 3D → 2D a été ajustée à ces
observations par moindres carrés : erreur quadratique moyenne de 1,29 pixel
par coordonnée (1,83 pixel par sommet). Cette précision concerne les points
d'ajustement, pas une validation indépendante de tous les pixels du GIF.

`hypercube-reference.json` sépare les observations manuelles des 768 positions
reconstruites (16 sommets × 48 images). Ces dernières proviennent du modèle,
elles ne sont pas 768 relevés manuels.

## Logique du mouvement

- Une seule rotation dans le plan (x, w). Les coordonnées y et z restent fixes.
- Quatre carrés, formés par les paires (y, z), changent de taille et de position
  ensemble. Les sommets ne suivent pas des interpolations indépendantes.
- La perspective 4D applique le même facteur aux trois coordonnées d'un sommet.
- Une caméra fixe projette ensuite le volume. L'orientation de la version
  précédente était différente de celle du GIF.
- Après un quart de tour, `(x, w)` devient `(-w, x)`. Le graphe retrouve
  exactement sa forme, en permutant ses sommets selon les cycles :
  `(0 1 9 8)`, `(2 3 11 10)`, `(4 5 13 12)`, `(6 7 15 14)`.
- La vitesse angulaire est constante : π/2 radians en 3 360 ms. L'animation
  continue au-delà du quart de tour pour préserver l'identité des sommets.

## Paramètres ajustés

Angles en radians : lacet 0,538086766 ; inclinaison −0,343615790 ;
roulis −0,008714286 ; phase initiale −0,016638775.
Distances de projection : 2,98189109 en 4D et 8,65078570 en 3D.

Pour retrouver les coordonnées du GIF depuis les coordonnées normalisées
du moteur : multiplier par 24,4258823 puis ajouter (74,4720899 ; 74,4085196).
La page adapte seulement l'échelle et la position à son espace disponible.

## Vérifications

Les 768 positions produites par le moteur correspondent aux positions
reconstruites à moins de 0,006 pixel (arrondi du fichier JSON inclus).
La symétrie par quart de tour a été vérifiée sur les 48 phases ; le rendu
ordinateur/mobile, la réduction des animations et l'arrêt hors écran ont
également été contrôlés dans Chrome.
