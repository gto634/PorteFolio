# Règles communes

Version 1.1 · 13 octobre 2026 · [Sommaire](../README.md) · [Galerie](../index.html)

## 1. Direction graphique

- Une interface sombre et calme laisse les jeux occuper l’espace.
- Le rose pastel guide le regard : titres de projets, actions et états actifs.
- Chaque projet conserve ses visuels, mais ne crée pas sa propre couleur de
  bouton, police, bordure ou animation d’interface.
- La lisibilité passe avant l’effet : protéger les textes posés sur une image,
  garder les actions visibles, laisser les contenus longs défiler.
- Montrer rapidement ce que le jeu propose et ce que **Ryad a réalisé**.

## 2. Couleurs

Les variables de [tokens.css](../styles/tokens.css) définissent la palette ;
[toon.css](../styles/toon.css) définit les formes et mouvements adoptés.

| Variable | Valeur | Usage |
| --- | --- | --- |
| `--ds-color-background` | `#0C0B14` | Fond global, texte sur bouton rose. |
| `--ds-color-surface` | `#232136` | Bannière contact, panneaux, infobulles. |
| `--ds-color-card` | `#161420` | Cartes de la collection. |
| `--ds-color-text` | `#E0DEF4` | Texte principal. |
| `--ds-color-muted` | `#B9B6C9` | Métadonnées et légendes, jamais texte rendu illisible. |
| `--ds-color-accent` | `#F7BACF` | Actions principales, titres de projets, focus. |
| `--ds-color-accent-hover` | `#FFDAE7` | Survol d’une action rose. |
| `--ds-color-border` | `#E0DEF426` | Séparateurs et bordures discrètes. |
| `--ds-color-border-accent` | `#F7BACF40` | Bordures teintées et séparateurs de réalisations. |

Ne pas utiliser le rose pour tous les paragraphes. Ne pas inventer un nouvel
accent pour chaque jeu. Les couleurs des images et des logos officiels sont
conservées ; une variante monochrome peut être utilisée pour leur lisibilité.

Sur un fond illustré, utiliser un voile basé sur le fond global : plus opaque
derrière le texte, plus transparent du côté du visuel. Inverser le dégradé si le
texte change de côté. Sur mobile, renforcer le voile sur toute la zone de texte.
Le dégradé est un réglage de lisibilité, pas une nouvelle palette par projet.

## 3. Typographie

Police commune : `Segoe UI, Roboto, Helvetica, Arial, sans-serif`.
Pas de police décorative par projet. Le logo d’un jeu peut apparaître dans son
visuel, sans remplacer le titre textuel accessible.

| Niveau | Taille cible | Interligne / graisse |
| --- | --- | --- |
| Titre d’accueil ou de collection | `clamp(2.5rem, 6vw, 4.5rem)` | 1.1 / 700 |
| Titre de projet | `clamp(2rem, 3.3vw, 3.1rem)` | 1.1 / 700 |
| Titre de bannière | `clamp(1.5rem, 2.8vw, 2.4rem)` | 1.15 / 700 |
| Titre de carte | `1.5rem` | 1.2 / 700 |
| Pitch / texte principal | `1rem` | 1.65 / 400 |
| Réalisations, valeurs, boutons | `0.9rem` | 1.6 / 400 ou 600 pour les actions |
| Légendes / infobulles | `0.8rem` | 1.5 / 400 |
| Libellés des faits | `0.75rem` | 1.5 / 400, capitales, espacement `0.05em` |

Garder une colonne de texte autour de **620 px maximum**. Ne pas réduire la
police pour faire tenir une fiche dans un écran. Préférer le défilement et le
bloc « Mes réalisations ». Un seul `h1` par document ; les projets de l’accueil
utilisent des `h2`, ceux de la collection des `h2` également.

## 4. Espacement et surfaces

Échelle commune : **4, 8, 12, 16, 24, 32, 48, 64, 96 px**.

- 8 px entre les logos et entre une icône et son libellé.
- 16 à 24 px entre les blocs d’une fiche ; 12 px entre deux réalisations.
- 24 px entre les cartes et entre les colonnes de métadonnées.
- Marges latérales cibles : `clamp(24px, 6vw, 96px)` ; 16 px sous 380 px.
- Réserver 48 px côté navigation à points sur petit écran.
- Rayons de référence : 12 px pour les petites surfaces, 20 px pour les
  commandes, 24 px pour les cartes. Les contours Toon varient légèrement ces
  rayons pour leur irrégularité. Bordures de 2 px sur les composants Toon.
- Une ombre courte donne du volume au bouton principal et aux cartes ; le
  bouton secondaire reste transparent, sans ombre. Infobulles et lecteur
  restent sans ombre portée.

La collection est limitée à 1280 px. Les fiches immersives utilisent la largeur
de l’écran avec une colonne de texte limitée. La navigation compacte protège
seulement ses contrôles dans le coin supérieur droit. Aucune bande pleine
largeur ni réserve globale de 88 px. Les fiches à droite et les petits écrans
réservent la place réellement occupée par les contrôles, puis par le panneau
quand il est ouvert. Les fiches peuvent s’allonger dans le défilement principal.

## 5. Composants et états

| Composant | Règle | Interaction |
| --- | --- | --- |
| Action principale | Fond rose, texte nuit, contour organique autour de 20 px, hauteur min. 48 px, marge intérieure 12 × 16 px. Une action prioritaire par bloc. | Survol rose clair et rebond atténué de 700 ms ; contenu et fond se déforment ensemble. |
| Action secondaire | Fond transparent, bordure rose, texte rose, mêmes dimensions. | Même rebond, fond transparent au survol et au focus, sans ombre y compris à la pression. |
| Action rose sans ombre | `ds-button--flat` pour les vidéos et « Tout mes projets ». Même forme et couleur que l’action principale. | Rebond et pression communs ; aucune ombre au repos, au survol, au focus ou à la pression. |
| Icône de destination | `ds-icon` : silhouettes pleines de maison, étincelles, téléphone, quatre carrés en grille 2 × 2. 24 px dans les boutons, 20 px dans le menu, 16 px dans l’invitation de contact. | Décorative (`aria-hidden`), couleur héritée ; ne remplace pas le nom du lien. |
| Actions de contact | Deux boutons dans `ds-contact-actions`, largeur commune et rangées de même hauteur. Icônes à gauche, sans flèches. | Même surface de clic, focus et rebond que les boutons partagés ; adaptation aux libellés français et anglais. |
| Lien textuel | Libellé explicite ; soulignement pour les liens dans un paragraphe. | Changement de couleur, focus visible ; cible de 44 px dans la navigation. |
| Triangle de navigation | Triangle rose de l’intro, SVG 24 px sans cercle dans une cible transparente de 48 × 48 px. | Rebond squash-and-stretch de 900 ms, au survol et au focus ; répétition toutes les 1,5 s avec commande d’arrêt. |
| Commande iconique | Cible 48 px avec contour souple ; les menus utilisent leur surface bleu-violet dédiée. Le triangle d’orientation utilise son propre composant. | Rebond sur interaction ; nom accessible obligatoire. |
| Point de navigation | Cible 44 px, point visible 13 px. | Point actif rempli, nom au survol/focus, `aria-current` ; rebond identique sur tous les points, joué jusqu’au bout. |
| Logiciel | Logo 24 px et nom toujours visible sur une même ligne. Pas de badge textuel en doublon. | Information ordinaire sans étape Tab ; une précision facultative peut utiliser une infobulle séparée. |
| Faits du projet | Liste `dl` : « Mon rôle », « Équipe », « Durée ». | Retour à la ligne naturel, aucune donnée tronquée. |
| Mes réalisations | Quatre contributions directement visibles dans `ul.ds-proof`, sans dépliable sur les fiches. | Lecture continue dans le défilement principal, sans hauteur fixe. |
| Profil social | Logo LinkedIn ou GitHub monochrome de 24 px dans une cible de 44 × 44 px. | Rose, rebond atténué et infobulle au survol/focus ; nom accessible annonçant le nouvel onglet. |
| Carte de projet | Image 16:9, titre, année si renseignée, pitch bref, catégorie éventuelle. | Une seule destination par carte ; bordure rose, déformation limitée à 12 % de la recette initiale et focus sur toute la carte. |

Les flèches purement décoratives sont `aria-hidden`. Un lien qui ouvre un nouvel
onglet l’indique aux technologies d’assistance et utilise `rel="noopener
noreferrer"`. Un changement de page est un lien ; une ouverture de lecteur ou
un filtre est un bouton. Chaque fiche garde deux actions dans cet ordre :
« ▶ Voir la vidéo » principale, puis « Code source ↗ » secondaire avec logo GitHub. Une ressource
non publiée utilise un vrai bouton désactivé « Vidéo — à venir » ou
« GitHub — à venir ». Sa couleur secondaire reste lisible, sans opacité globale.
Aucun faux lien, href vide ou chargement d’un média manquant.

Pour Necromancer x Magical Girl, afficher **Unity 6, Blender et Figma**. Les
logos C#, Git et GitHub ne figurent pas dans la liste des outils, à la demande
de Ryad. GitHub identifie désormais le lien de code source et son profil social.
Choisir les logiciels réellement
utilisés pour les autres projets, sans recopier automatiquement cette liste.

### Icônes et logos — référence commune

La galerie montre les six symboles actuels : `Home.svg`, `Sparkles.svg`,
`Collection.svg`, `Phone.svg`, `GitHub.svg` et `LinkedIn.svg`. Réutiliser
`ds-icon` et sa variante pour la navigation ; `ds-repo-icon` pour le code source,
`ds-social-icon` et le lien de profil pour les réseaux. Les masques reprennent
`currentColor`, restent à 24 px et portent `aria-hidden="true"` quand le libellé
ou le nom accessible du lien fournit déjà l’information.

Les actions principales du portfolio utilisent `ds-button ds-button--flat` :
rose plein, sans ombre au repos, au survol ou à la pression. Le bouton secondaire
reste transparent, avec un contour rose. Le logo GitHub accompagne « Code source » ;
la maison accompagne le retour à l’accueil. Les profils gardent leur cible de
44 px, leur infobulle et leur rebond. Les logos de logiciels restent accompagnés
d’un nom visible et ne deviennent pas des commandes.

### Triangle de navigation — référence bouncy

La nouvelle flèche de l’intro devient un composant du système : `.ds-scroll-cue`
pour le lien et `.ds-scroll-cue-icon` pour son SVG. Reprendre le triangle arrondi
de l’intro (`viewBox="0 0 24 24"`, chemin `M3.5 6.5H20.5L12 20Z`, contour 2.5 px,
jonctions arrondies), sans pastille ni cercle au repos. Le nom accessible décrit
la destination ; le SVG décoratif utilise `aria-hidden="true"`.

La recette reprend exactement les poses d’[intro-navigation.js](../../assets/scripts/intro-navigation.js) :
compression à `scale(1.22, .8)`, saut de **−7 px** à `scale(.76, 1.32)`, légère tenue
en l’air, retombée à `scale(1.24, .78)`, puis retour au repos. Durée **900 ms**,
courbe `ease-in-out`, origine de transformation `50% 85%`. Seul le triangle
se déforme : cible de clic et contour de focus restent stables.

[scroll-cue.js](../scripts/scroll-cue.js) expose cette recette dans les deux galeries.
Ajouter `data-scroll-cue` au lien pour l’activer. Pour une répétition automatique,
ajouter `data-scroll-cue-repeat` et `data-scroll-cue-toggle="id-du-bouton"` : une
commande d’arrêt visible est obligatoire. Le bouton utilise `aria-pressed`,
`aria-controls` vers le lien et un `span[data-cue-state]` pour son état.
Sans cette commande, aucune répétition automatique n’est lancée.
Cette commande concerne le spécimen de galerie. Le menu du portfolio ne la
présente plus, à la demande de Ryad ; `assets/scripts/intro-navigation.js` conserve le rebond
de l’intro, suspendu hors écran, dans un onglet masqué et avec mouvement réduit.

Les tokens `--ds-cue-bounce-duration`, `--ds-cue-bounce-period` et
`--ds-cue-bounce-delay` valent respectivement **900, 1500 et 650 ms**. La période
comprend **600 ms de repos** après chaque rebond, suivant la cadence actuelle de
l’intro. Le mouvement s’arrête hors
écran, dans un onglet masqué, avec `prefers-reduced-motion: reduce`, avec la
commande locale ou avec `data-motion="off"` sur un parent. Sans JavaScript,
le triangle reste un lien utilisable.

La composition de l’intro et son script restent dans leurs fichiers actuels.
Le [design system Toon / Slime](../index.html) emploie ce triangle comme référence de
caractère ; les autres commandes reprennent sa logique de compression et
d’amortissement avec des amplitudes adaptées, sur interaction seulement.

### Toon / Slime — direction adoptée

La [galerie](../index.html) est la référence graphique adoptée dans le portfolio. Elle propose **deux styles d’action** : rose plein pour
l’action principale, contour rose et fond transparent pour l’alternative.
Le bouton secondaire garde son fond transparent au survol et au focus.
La bannière contact reprend le quadrillage en perspective de l’intro sur fond
nuit avec `ds-contact--grid`. Le même SVG est recadré sans étirement ; le décor
reste statique et discret derrière les coordonnées. Garder la hauteur courte
et les boutons Toon. La galerie montre ce même composant.

- **Boutons** : déformation atténuée à 25 % de la recette initiale : saut de −0,5 px,
  largeur réduite au maximum de 4 % et hauteur augmentée de 7 %. Retombée et
  petits rebonds amortis. Le contour
  change aussi de courbure pendant le saut pour donner une forme organique.
  Durée 700 ms avec la recette validée. La pression dure 110 ms et le relâchement a sa propre
  retombée. Le texte et les icônes suivent exactement le mouvement du fond.
  Le cadre et le contenu d’une carte utilisent 12 % de la recette initiale
  (contre 18 % précédemment), soit au maximum 1,92 % en largeur et 3,36 % en hauteur.
- **Points** : grossissement à 1.45, réduction à .88, puis oscillations de
  plus en plus faibles jusqu’à 1, en 650 ms. Pas de saut
  vertical. Le point courant a la même animation de survol que les autres ;
  son clic ne relance pas la navigation. La sortie du pointeur et la perte du
  focus ne coupent pas ce rebond. Une nouvelle entrée pendant l’animation ne
  la redémarre pas ; une fois terminée, le point peut rejouer au prochain survol.
  Le mouvement réduit conserve sa priorité.
- **Fin du survol** : retour à la forme et à la taille normales même si le
  pointeur reste présent. Aucun zoom, élargissement ou déplacement permanent
  ne complète le rebond. Les changements de couleur et le contour de focus
  assurent le retour visuel une fois l’animation terminée.

La peau du composant (`::before`) et ses contenus sont animés avec les mêmes
poses, la même origine et la même chronologie ; cible et focus restent fixes.
Les infobulles restent indépendantes pour conserver leur lisibilité.
Les oscillations ont une interpolation progressive sur chaque
segment. Les animations peuvent être interrompues, sans revenir brutalement à
leur première pose. La préférence de mouvement réduit les annule. Le triangle garde sa recette dédiée ci-dessus.

**Menus irréguliers** : le globe et les trois barres restent deux
commandes séparées, sans titres de catégories ajoutés. Chacun possède une surface
qui s’agrandit depuis le contour de son icône pour devenir son panneau. La forme fermée
est conservée dans `--ds-toon-menu-shape` ; la forme ouverte, plus bouffie, dans
`--ds-toon-menu-expanded-shape`. Déploiement initial en 300 ms directement à la taille
finale, sans dépassement ni aplatissement élastique du panneau. Les deux menus
partagent cette recette. Fermeture en 280 ms.
Les liens apparaissent par fondu à 38 % de l’ouverture (114 ms avec le
réglage validé), sans déformation. Le panneau
s’affiche en superposition, sans déplacer la mise en page.
Le fond reprend `#232136` avec une opacité de 84 % et un flou de fond de 14 px.
Le contour reste violet discret ; les trois barres roses et le panneau visible
indiquent l’état ouvert. Les commandes clavier, Échap et le clic extérieur
conservent leur comportement. La réduction des mouvements rend l’ouverture
immédiate. Cette direction est adoptée sur les trois pages publiques.

La largeur du panneau s’adapte à la place disponible à droite du composant.
Réserver à gauche la cible du globe, l’écart de 8 px et son dépassement élastique
pour que toute la commande reste visible à 320 px, pendant et après le mouvement.
Les liens du panneau reprennent les symboles du portfolio : maison, étincelles,
téléphone et projets. Les icônes décoratives suivent la déformation de leur ligne.

**Langues** : le globe ouvre son propre panneau « Français /
English ». La langue active utilise `aria-pressed`, une coche et un texte rose.
Le choix change les libellés traduits, ferme le panneau et rend le focus au globe.
Les noms des langues restent dans leur propre langue. Un seul panneau est ouvert
à la fois. Quand la navigation s’ouvre, le globe se décale à gauche de la largeur
déployée du panneau, avec un écart de 8 px au début de la poussée. Le
déplacement partage l’horloge et la trajectoire du panneau, puis se libère avant
la fin de son ouverture. La libération intervient à 55 % de l’ouverture,
soit 165 ms avec le réglage validé.
La courbe de poussée est découpée à cet instant ; la vitesse instantanée passe
à l’élan sans arrêt intermédiaire à la position de repos.
L’élan porte le globe 15 px plus loin ; la résistance l’élargit de 5 % et
l’aplatit de 7 % en 200 ms. Un temps suspendu de 100 ms donne l’effet cartoon
« coyote », avant un retour unique en 200 ms. L’ensemble dure 665 ms :
300 ms d’ouverture, 200 ms d’étirement déclenchés à 165 ms, 100 ms de suspension
et 200 ms de retour. Ces valeurs sont les réglages validés par Ryad.
La fermeture préserve la pose courante, puis le ramène à sa place
avec la même courbe que le panneau, en 280 ms.
Les valeurs validées sont enregistrées dans `toon.css`. La galerie expose les
composants avec cette recette, sans curseurs, choix d’intensité, comparateur ou
interrupteur d’animation. La durée totale reste de 665 ms. La préférence système
de mouvement réduit reste prioritaire. Son triangle joue sur interaction ;
la répétition automatique de l’intro reste gérée par son script de page.
Les tokens correspondants sont `--ds-toon-menu-open`, `--ds-toon-globe-stretch`,
`--ds-toon-globe-hang`, `--ds-toon-globe-settle`, `--ds-toon-globe-travel`,
`--ds-toon-globe-widen`, `--ds-toon-globe-flatten` et `--ds-toon-globe-start`.
Les choix de langue et les liens de navigation utilisent les mêmes lignes :
typographie, hauteur minimale de 44 px, espacements, contour de survol,
focus et déformation. La coche de langue active suit aussi le mouvement.
Au survol et au focus clavier, les deux icônes rebondissent avec la recette des
boutons. Le contour fermé suit ce mouvement ; une fois le panneau ouvert, seule
l’icône rebondit pour préserver la stabilité du texte. Sans mouvement, les mêmes
positions et états restent disponibles immédiatement.

**Logiciels lisibles** : langage, moteur et outils occupent des groupes distincts.
Le moteur associe son logo à son nom/version ; chaque logiciel associe un logo
de 24 px à un nom en texte, sur la même ligne. Les noms restent dans le flux et
n’apparaissent plus dans une bulle flottante. Ces informations ne sont pas des
liens ou des boutons et n’ajoutent pas d’étapes dans le parcours Tab.

**Infobulles** : contenu complémentaire seulement, une seule
visible à la fois, apparition après 350 ms de survol et immédiate au focus
clavier. Le déclencheur d’aide peut également être activé au clic. Échap et le
clic extérieur ferment la bulle ; le pointeur peut rejoindre sa surface sans
la faire disparaître. Le texte reste fixe, à 12 px et interligne 1,5, dans un
cadre de 260 px maximum sans ombre lourde. La bulle d’aide privilégie l’espace
à droite ou sous son déclencheur pour préserver la lecture des logiciels.
Une infobulle se ferme lorsque son déclencheur sort de l’écran ; elle ne reste
pas accrochée au bord de la fenêtre après une navigation ou un défilement.

**Lecteur** : bandeau, croix, contour et ombre sous le cadre retirés.
Le visuel occupe le lecteur. Le titre du dialogue reste disponible aux
technologies d’assistance. Sur le portfolio, le focus arrive sur le lecteur
natif ; dans la galerie, sur le dialogue. Aucun contour rose ne cadre le média. Clic extérieur, Échap
et retour du focus au bouton d’ouverture restent fonctionnels. La galerie
utilise une image fixe pour démontrer ce cadre.

### Navigation compacte

Une icône globe pour la langue, puis une icône à trois barres restent visibles
dans le coin supérieur droit. Les deux icônes sont sans texte, dans un contour organique
bleu-violet au repos ; elles deviennent roses au survol, au focus et lorsque leur panneau
est ouvert. Le bouton direct « Tous les projets » est retiré des contrôles.
Le nom accessible du menu est « Ouvrir le menu » / « Fermer le menu ».
Le globe annonce le choix de langue et la langue courante. Les contrôles ont une hauteur minimale de 48 px,
un écart de 8 px et une marge extérieure de 16 px (12 px sur petit écran).
Le panneau de 260 px contient des liens HTML Accueil, À la une, Tous les projets,
Contact dans
un élément `nav` ; aucun rôle ARIA menu. Son nom long peut revenir à la ligne.

Le bouton annonce `aria-expanded` et `aria-controls`. Clic, Entrée et Espace
ouvrent ou ferment ; Échap ferme puis rend le focus au bouton. Clic extérieur
et choix d’une destination ferment également. Tab parcourt les liens.
Quand le focus quitte la navigation, fermer aussi le panneau. Seules les cibles
fixes réservent de l’espace dans la page ; l’ouverture des panneaux n’en modifie
ni la position de lecture ni la composition.
L’état courant utilise `aria-current`. Le panneau reste dans le viewport et
défile seulement si la fenêtre est plus petite que la navigation elle-même.
Pendant une vidéo, la navigation et les points sont masqués. Sans JavaScript,
les destinations restent disponibles, le bouton Menu est masqué.

Le globe ouvre un panneau de 180 px proposant **Français** et **English**, avec
un état `aria-pressed` et une coche pour le choix courant. Un seul panneau est
ouvert à la fois. Échap et le choix d’une langue rendent le focus au globe ;
un clic extérieur ferme. Garder les noms de langues dans leur propre langue.

### Langues

La langue par défaut est le français. Le choix explicite est enregistré dans
`localStorage` sous `portfolio.language` (`fr` ou `en`) et repris par l’accueil,
la collection et SpaceRunner, y compris après rechargement. Les onglets déjà
ouverts se synchronisent ; si le stockage est indisponible, le choix fonctionne
pour la page en cours. Aucune traduction ne remplace une ancre ou un nom de projet.

Le **HTML est la référence du français** pour `data-i18n` et `data-i18n-html`.
Le script conserve le texte initial et le restitue en français, même si la
langue enregistrée au chargement est l’anglais. Une modification du HTML ne
doit donc plus être écrasée par une ancienne traduction française.
Ajouter une clé dans [i18n.js](../../assets/scripts/i18n.js) avec l’anglais correspondant ; garder
les deux versions dans sa table pour les libellés dynamiques, les attributs
et noms accessibles (`data-i18n-aria-label`). Le français reste lisible sans JS.
Actualiser l’anglais lors d’une modification et utiliser des clés propres à
chaque projet pour le rôle et la durée afin d’éviter de modifier les autres fiches.
Traduire aussi les pitches, réalisations, métadonnées, filtres, compteurs,
messages du lecteur et infobulles. La sélection du filtre et le point de lecture
sont conservés au changement. Le document public annonce sa langue via `lang`.
La documentation reste française ; son exemple de navigation suit la langue
choisie et porte un `lang` local.

### Métadonnées techniques

Langage en texte toujours visible, suivi de la technologie principale avec
sa catégorie réelle : Moteur, Bibliothèque ou API de rendu. Corps de 0.9rem,
libellé secondaire et valeur contrastée, sans grands badges. Les logiciels de
création gardent leurs logos dans le groupe « Outils ». Le composant `ds-stack`
aligne ces libellés et valeurs ; la technologie utilise `ds-stack-technical`,
les outils `ds-stack-tools`. Aucun logo C++ dupliqué.
Unity 6, Blender et Figma restent les logos validés pour Necromancer.

Champs actuels : Necromancer C# / Unity 6 (C# fourni par Ryad dans la fiche
initiale, pas déduit du logo) ; Tatamiam C++ / EntreCôte ; IsekaiWar! C++ / SFML ;
EntreCôte C++ / Direct3D 12 ; SpaceRunner C++ / GC Engine.

## 6. Mouvement et navigation

- Micro-interactions Toon : boutons 700 ms, points 650 ms, pression 110 ms.
  Les transitions de couleur restent brèves ; les amplitudes des cartes sont atténuées.
- Ouverture structurante d’un projet : 500 ms `ease-in-out` au maximum.
- Transition entre projets à la une : **350 ms**, réglable entre 300 et 400 ms
  après essai. Un geste de molette ou de trackpad déclenche au plus une transition.
  Les événements d’inertie restent dans ce geste ; une pause de 160 ms identifie
  une nouvelle intention, une inversion de direction est acceptée immédiatement.
- Fiche longue : parcourir naturellement les pixels jusqu’à la fin du contenu,
  puis attendre le geste suivant pour changer de projet. Un seul conteneur
  principal défile ; aucune hauteur fixe ni barre interne dans une fiche.
  Le fond décoratif reste à la taille du viewport et se maintient derrière le
  texte avec `position: sticky`. Les quatre réalisations restent visibles ;
  `overflow-anchor: none` évite de recaler la lecture vers la fiche précédente.
- La collection et SpaceRunner conservent le défilement naturel. Le tactile et
  les touches de lecture restent natifs. Ctrl + molette, liens modifiés,
  historique et raccourcis du navigateur gardent leurs comportements.
- Les points et ancres donnent un accès direct ; les liens ajoutent une entrée
  d’historique et focalisent le titre. La molette ne déplace pas le focus.
- Suspendre les transitions pendant la vidéo et ne pas intercepter le Menu.
  La bannière courte de contact reste une destination, alignée en fin de page.
- Animer `transform`, `opacity` et les couleurs ; éviter `transition: all`.
- Les boutons réagissent à l’interaction ; le triangle d’orientation peut
  rebondir périodiquement suivant la recette ci-dessus. Son réglage local reste
  dans la galerie, pas dans le menu public.
  Pas de clignotement ni d’animation autonome des autres commandes.
- `prefers-reduced-motion: reduce` supprime les déplacements, les transitions
  et le défilement animé. Arrêter l’hypercube dans ce mode et hors visibilité.

## 7. Adaptation et accessibilité

Repères communs : **1024 px** pour empiler texte et média ; **700 px** pour la
collection et la bannière en une colonne ; **600 px** pour l’en-tête compact ;
**380 px** pour les marges réduites. Ce sont des seuils de mise en page, pas une
raison de masquer des informations utiles.

- Focus commun : contour rose **3 px**, décalé de **5 px**, jamais supprimé sans
  alternative visible. Le focus doit rester visible sur l’image comme sur le fond.
  Après une ancre, le point de lecture est le titre (`tabindex="-1"`) ; son
  contour apparaît seulement en interaction clavier. Aucun cadre autour de toute
  la fiche, notamment après un clic sur un point. Le focus ne passe pas sous
  les contrôles fixes ni sous leur panneau.
- Cible interactive d’au moins 44 × 44 px ; boutons principaux de 48 px de haut.
- Préserver l’ordre du DOM sur mobile, même si la disposition desktop alterne.
- Vérifier à 320, 390, 768 et 1440 px, puis au zoom 200 %. Aucun défilement
  horizontal ; les contenus longs restent accessibles.
- Viser un contraste de 4.5:1 pour le texte courant et 3:1 pour le grand texte et
  les indicateurs essentiels. Vérifier les zones sur image séparément : une
  palette lisible sur fond uni ne garantit pas leur contraste.
- Ne pas transmettre un état uniquement par couleur ; compléter avec remplissage,
  libellé, soulignement ou attribut accessible selon le composant.
- Les infobulles complètent un nom accessible ; aucune action essentielle ne
  dépend du survol. Garder le nom disponible au clavier et sur écran tactile.
  Leur position est limitée à la fenêtre ; elles restent survolables et Échap
  les masque sans déplacer le focus.

Ces règles constituent des objectifs de conception, pas une certification
d’accessibilité du site existant.

## 8. Médias

Les fonds peuvent être recadrés en `cover`, en préservant le sujet principal.
Le gameplay utilise `contain` pour garder l’interface du jeu visible. Fournir
une miniature stable pour éviter un rectangle vide avant lecture.

Un bouton « ▶ Voir la vidéo » ouvre un `dialog` natif centré et demande la
lecture explicitement, sans déplacer la fiche. Si le navigateur refuse, un
message indique de lancer la lecture dans les commandes natives.

Le ratio réel est lu dans les métadonnées (16:9 avant chargement). La largeur
est le minimum de 1120 px, de la largeur disponible et de la hauteur disponible
multipliée par le ratio. Marge extérieure : 32 px (16 px sur petit écran).
Aucun bandeau, titre ni croix visibles au-dessus du média. Le nom du gameplay
reste accessible aux lecteurs d’écran. Le média reste entier, sans barre de
défilement inutile dans la fenêtre ; le focus initial arrive dans le lecteur.

Une seule série de commandes : celles du navigateur pour lecture, pause,
volume, progression et plein écran. L’option « Image dans l’image » est
désactivée avec `disablepictureinpicture` : pas de lecteur détaché dans un coin.
Un message compact sur l’image apparaît
pour le chargement ou l’erreur, avec Annuler ou Réessayer seulement dans ces
états. Aucun second bouton de lecture ou de plein écran. Le script conserve
volume et sourdine pendant la visite, y compris entre deux vidéos différentes,
ainsi que la position par vidéo. Pas de mise en sourdine forcée à l’ouverture.

Échap et clic extérieur ferment la fenêtre, mettent la vidéo en pause,
libèrent sa source et rendent le focus au bouton. En plein écran, le premier
Échap quitte ce mode avant de fermer la fenêtre. Tab reste dans la fenêtre
tout en permettant de parcourir les commandes natives.

Utiliser les dérivés `assets/backgrounds/*.webp`, `assets/thumbnails/*.webp` et
`assets/videos/*.mp4`. Les originaux restent dans les dossiers de projets.
Voir [assets/README.md](../../assets/README.md) pour régénérer les ressources. Les
vidéos gardent leurs dimensions et leur fréquence d’images ; le MP4 utilise
`faststart`. Ne pas baisser arbitrairement la résolution si les informations du
gameplay deviennent illisibles.

Les images décoratives ne répètent pas le texte dans leur alternative. Les
images porteuses d’information ont un texte alternatif bref. Préserver les
proportions des logos. Ne pas ajouter de faux visuel ou de faux lecteur pour
combler un élément non fourni.
