# Design system du portfolio

Version 1.1 · 13 octobre 2026 · Toon / Slime adopté

Le design system Toon / Slime remplace la version 0.5. La galerie de référence
est désormais `index.html` ; l’ancienne adresse `toon.html` y redirige en
conservant l’ancre. L’accueil, la collection et SpaceRunner utilisent les mêmes
surfaces, états et animations. Les textes de projets et la composition de
l’introduction sont conservés.

## Consulter le système

Les pages de galerie restent dans ce dossier. Les styles sont dans `styles/`,
les comportements dans `scripts/` et les documents détaillés dans `docs/`.
Le portfolio utilise les mêmes fichiers partagés, avec des chemins relatifs.

| Document | Utilité |
| --- | --- |
| [Galerie interactive](index.html) | Composants, états, icônes, menus, logiciels et lecteur avec les mouvements validés. |
| [Règles communes](docs/DESIGN-SYSTEM.md) | Palette, typographie, espacements, mouvements et accessibilité. |
| [Règles des pages](docs/REGLES-PAGES.md) | Structure des pages et checklist d’intégration. |
| [Tokens](styles/tokens.css) | Palette, typographie, espacements et dimensions partagées. |
| [Thème Toon / Slime](styles/toon.css) | Formes, surfaces et valeurs de mouvement validées. |
| [Mouvements partagés](scripts/toon-motion.js) | Déformations du fond et du contenu, menus et points de navigation. |
| [Comportements partagés](scripts/components.js) | Navigation, langue et infobulles. |
| [Triangle d’intro](scripts/scroll-cue.js) | Recette du triangle démontrée dans la galerie. |
| [Corrections de l’audit](docs/CORRECTIONS-AUDIT.md) | Décisions et historique des vérifications. |
| [Ancienne galerie](legacy.html) | Archive 0.5, conservée pour référence uniquement. |

## Réglages validés par Ryad

Les valeurs par défaut sont enregistrées dans `toon.css` et reprises par les
trois pages publiques et la galerie. Mode **Flamby**, animations actives lorsque
la préférence système de mouvement réduit le permet.

| Variable | Valeur |
| --- | --- |
| `--ds-toon-menu-open` | 300 ms |
| `--ds-toon-globe-stretch` | 200 ms |
| `--ds-toon-globe-hang` | 100 ms |
| `--ds-toon-globe-settle` | 200 ms |
| `--ds-toon-globe-travel` | 15 px |
| `--ds-toon-globe-widen` | 5 % |
| `--ds-toon-globe-flatten` | 7 % |
| `--ds-toon-globe-start` | 55 % de l’ouverture |

La libération du globe commence à 165 ms. L’étirement atteint son maximum à
365 ms, la suspension se termine à 465 ms et le retour se termine à 665 ms.
Le panneau atteint sa taille finale à 300 ms, sans élasticité propre.
La galerie présente désormais uniquement les composants de référence :
curseurs, choix d’intensité, comparateur et commandes de personnalisation ont
été retirés. Les valeurs validées restent enregistrées dans les CSS ; la
préférence système de mouvement réduit reste respectée. Le triangle de la
galerie joue au survol et au focus, sans répétition automatique.

Les boutons utilisent 25 % de la déformation initiale, les cartes 12 %.
Le texte et les icônes suivent le fond ; la zone de clic et le focus restent
stables. Tous les points terminent leur rebond de 650 ms, y compris le point
courant et après la sortie du pointeur. Les logiciels ont un nom visible à côté
du logo et ne créent pas d’étapes Tab. La vidéo garde ses commandes natives,
sans bandeau, croix, contour rose ni ombre sous le cadre.

## Charger les composants

Charger `tokens.css`, `components.css`, les styles de composition de la page,
puis `toon.css`. Ajouter `ds-ui ds-toon`, `data-toon-root`,
`data-intensity="flamby"`, `data-motion="on"` et `data-tooltip-policy="quiet"`
au `body`. Charger `components.js` puis `toon-motion.js` après le contenu.
Chaque contrôle compact et son panneau sont regroupés dans un
`ds-compact-item[data-toon-compact-item]` ; utiliser `ds-language-item` et
`ds-navigation-item` pour leurs rôles respectifs.

Les trois pages publiques et la galerie chargent les mêmes fichiers partagés
`toon.css` et `toon-motion.js`. La galerie de référence est en version **1.1**. Les fiches réutilisent `ds-stack`,
`ds-stack-technical` et `ds-stack-tools` pour présenter langage, technologie et
logiciels. Les actions du menu, liens comme boutons, utilisent la même recette
de pression et de rebond. Sur petit écran, le panneau réserve aussi la place du
globe pendant son déplacement, sans modifier les réglages du mouvement.

La bannière de contact utilise `ds-contact--grid` pour reprendre le quadrillage
en perspective de l’intro, avec le même asset SVG, un fond nuit et un voile
discret. Ce décor statique garde la bannière légère et laisse ses liens accessibles.

Les fiches montrent directement leurs quatre réalisations, sans dépliable.
L’action secondaire « Code source » mène au dépôt public de chaque projet.
La bannière présente les profils LinkedIn et GitHub par leurs logos : cibles
de 44 px, noms accessibles, infobulles et rebond commun au survol et au focus.

Les actions vidéo et « Tout mes projets » utilisent `ds-button--flat` : fond rose
et animation commune, sans ombre au repos, au survol ou à la pression. Le retour
à l’accueil reprend le bouton secondaire Code source avec une maison.
`ds-icon` partage quatre symboles pleins : maison, étincelles, téléphone et carré de
quatre carrés. Ils figurent à droite des catégories du menu ; la collection
les place à gauche de son bouton et l’invitation de contact à droite de son texte.
Le menu public ne contient plus de commande des rebonds du triangle.
Son ordre est Accueil, À la une, Contact, Tout mes projets. Les deux boutons
de la bannière utilisent `ds-contact-actions` : largeur et hauteur communes,
icône à gauche et aucune flèche. Le même exemple figure dans la galerie.

Le HTML est la référence pour le texte français. `assets/scripts/i18n.js` conserve ce texte
au chargement et le restitue après un passage en anglais ; sa table fournit
l’anglais et les libellés dynamiques. Lors d’une modification, actualiser aussi
la version anglaise et garder des clés propres au projet pour son rôle et sa durée.

## Lancer depuis le bureau

Les raccourcis **Portfolio - Ryad** et **Design System - Ryad** exécutent
`tools/launch-local.py` avec Python sans fenêtre de console. Le lancement
réutilise le serveur du projet sur `127.0.0.1:8766`, ou le démarre s’il est
absent. Si un autre service occupe ce port, il utilise un port voisin libre.
Il ouvre ensuite la page dans le navigateur par défaut. Aucune installation
ni commande manuelle n’est nécessaire.

Le serveur est limité à la machine locale. Il reste disponible pendant les
essais et s’arrête au redémarrage de Windows. Les raccourcis le relanceront.
Si le dossier du projet ou le runtime Python est déplacé, recréer les
raccourcis avec `tools/create-shortcuts.ps1` après adaptation du
chemin Python.

## Faire évoluer le portfolio

Réutiliser les composants et valeurs existants. Documenter toute nouvelle
règle et la montrer dans la galerie. Vérifier en priorité le rendu desktop,
le clavier, le survol, les textes longs et le mouvement réduit. Les styles de
page gèrent la composition ; les styles partagés gèrent les interactions.
Une nouvelle décision explicite de Ryad prime sur ces conventions.
