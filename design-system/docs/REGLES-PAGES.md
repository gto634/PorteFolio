# Règles de chaque page

Version 1.0 · 12 octobre 2026 · [Sommaire](../README.md)

Les pages partagent les [règles graphiques](DESIGN-SYSTEM.md). Seuls leur
objectif, leur structure et leur mode de défilement changent.

## Vue d’ensemble

| Écran | Destination actuelle | Objectif | Défilement |
| --- | --- | --- | --- |
| Introduction | `index.html#intro` | Identifier Ryad et inviter à découvrir ses projets. | Premier écran de l’accueil. |
| Projets à la une | `index.html#necromancer-magical-girl`, `#projet-1`, `#projet-2`, `#projet-3` | Présenter une sélection et les compétences démontrées. | Écrans extensibles ; un défilement principal, passage automatique par geste. |
| Contact | `index.html#contact` | Faciliter la prise de contact et l’accès à la collection. | Bannière courte, dernière étape de l’accueil. |
| Collection | `projets.html` | Explorer l’ensemble des projets. | Page à défilement naturel. |
| Projet autonome | `spacerunner.html#projet-4` | Conserver un projet hors de la sélection à la une. | Contenu du projet accessible sans dépendre de l’accueil. |

## 1. Navigation compacte commune

Dans le coin supérieur droit : icône globe de langue puis icône à trois barres,
sans libellé visible, chacun dans son contour irrégulier bleu-violet au repos. Survol et focus en rose,
nom accessible « Ouvrir le menu ». Le panneau contient Accueil, À la une,
Contact puis Tout mes projets et reste à proximité
du bouton. Utiliser le composant `ds-compact-nav`, commun à l’accueil,
la collection et SpaceRunner. Aucune bande permanente sur toute la largeur. Le contour du contrôle devient
celui du panneau ; le globe se décale avec l’inertie définie dans les règles Toon.
Chaque entrée place son icône à droite : maison pour Accueil, étincelles pour
À la une, téléphone pour Contact et quatre carrés pour Tout mes projets. Les icônes
restent présentes après traduction ; seule leur étiquette est `data-i18n`.
Aucun réglage des rebonds du triangle dans ce menu.

Garder les liens d’évitement. Clic, Entrée, Espace, Tab, Échap et clic extérieur
suivent [le composant de référence](DESIGN-SYSTEM.md#navigation-compacte).
Après Échap, rendre le focus au bouton ; après choix d’un lien, fermer le Menu
puis rejoindre la destination. L’état courant de collection porte sur son lien
dans le panneau ; à la une, celui du panneau suit Introduction / Projets / Contact.

Français et anglais sont disponibles sur les trois pages publiques. Conserver
le choix entre les pages et au rechargement via `portfolio.language`. Toute
nouvelle fiche doit fournir son français dans le HTML et son anglais dans
`assets/scripts/i18n.js`, ainsi que les deux versions des noms accessibles et libellés dynamiques.
Utiliser des clés propres au projet pour son rôle et sa durée.
Voir [la règle de langue commune](DESIGN-SYSTEM.md#langues).

Les points appartiennent à la sélection à la une. Leur ordre suit les sections,
avec nom au survol, au focus et accessible aux lecteurs d’écran. Garder les ancres
stables et les liens de cartes cohérents avec les destinations.

## 2. Introduction

Ordre de lecture : **nom → spécialité → invitation à découvrir les projets**.

- Un seul `h1` « MAHIOU Ryad » et une courte présentation du métier.
- Hypercube animé comme signature graphique, sur fond transparent ; aucune
  vidéo de fond nécessitant de faire correspondre deux couleurs.
- Texte à gauche et animation à droite sur grand écran ; composition verticale
  sur mobile. L’animation ne recouvre ni le titre ni le bouton.
- Flèche vers le premier projet réel de la sélection, avec un nom accessible.
- Le canvas reste décoratif, ignoré par les lecteurs d’écran et les interactions.
  Respecter l’arrêt hors écran et la réduction des animations.
- Conserver les symétries et la logique de rotation déjà travaillées. Une future
  retouche esthétique ne doit pas modifier arbitrairement la géométrie validée.

## 3. Projet à la une — gabarit commun

La référence de structure est **Necromancer x Magical Girl**. Les textes
des projets restent rédigés et validés par Ryad ; ce lot ne les réécrit pas. Le contenu suit cet
ordre, que la colonne soit à gauche ou à droite :

1. **Titre** du projet en rose, sans ligne de contexte au-dessus.
2. **Langage et technologie principale**, en texte visible, puis **Outils** en
   logos de 24 px avec nom toujours visible. Garder les logiciels validés de Necromancer.
3. **Pitch court**, deux ou trois phrases : gameplay, objectif et un peu d’univers.
4. **Mon rôle · Équipe · Durée**, dans une liste de faits compacte.
5. **Mes réalisations** : quatre contributions directement visibles dans
   `ul.ds-proof`, sans dépliable « Détails de mes réalisations ».
6. **Deux actions constantes** : Vidéo principale, puis Code source secondaire,
   avec le logo GitHub et un lien vers le dépôt du projet.
   Si une ressource manque : bouton désactivé « Vidéo — à venir » ou
   « GitHub — à venir », sans faux href ni lecteur vide.

Le groupe technique réutilise `ds-stack` : `ds-stack-technical` pour le langage
et la technologie, `ds-stack-tools` pour les logiciels. Logo et nom d’un
logiciel partagent une ligne ; pas de doublon du moteur dans les outils.
L’animation des actions du menu s’applique aussi aux boutons de réglage.

### Règles de contenu

Pour un **jeu**, parler au visiteur à la deuxième personne et à l’impératif.
Les nouveaux pitches validés utilisent le vouvoiement : « Incarnez… »,
« Explorez… », « Protégez… ». Conserver la rédaction validée de SpaceRunner.
Expliquer ce que le joueur fait ; les détails techniques appartiennent aux réalisations.

Pour un **moteur ou outil**, décrire directement son usage et son intérêt. Ne
pas inventer du lore ou une promesse de gameplay pour imiter une fiche de jeu.
La structure et la présentation restent communes.

Les réalisations forment une liste de contributions concrètes : système
créé, capacité développée, intégration effectuée. Les cinq fiches actuelles
montrent quatre points chacune. Éviter les formules vagues.

Ne pas ajouter : ligne « année · cadre scolaire » au-dessus du titre, liste de
points forts répétant le pitch, biographie technique du binôme, second inventaire
des outils ou long contexte scolaire. Ces éléments allongent la lecture sans
mettre en valeur le travail personnel. L’année peut apparaître dans la collection.

### Composition et média

Un fond de projet plein écran, un voile sombre, une colonne de texte limitée à
620 px. Garder le sujet visuel dégagé autant que possible. La position du fond
peut varier par jeu ; les composants et la hiérarchie restent identiques.

Vidéo disponible : le bouton ouvre le lecteur natif commun, dimensionné au
ratio du média, avec son conservé, chargement/erreur, Échap et clic
extérieur. La fiche garde sa position. Les actions à venir restent visibles
sans réserver un rectangle de média vide. Aucun bandeau ni croix au-dessus
de la vidéo ; le nom du gameplay reste disponible pour les lecteurs d’écran.

La hauteur minimale est celle du viewport ; la section s’allonge lorsque les
contenus ou le zoom l’exigent. **Un seul conteneur principal défile.** Les fiches
n’ont pas de panneau interne défilant. Réserver localement la place des
contrôles compacts si la colonne de texte est à droite ou si l’écran est petit.
Le voile sombre reste continu derrière toute la colonne. Le fond garde une
hauteur égale au viewport et reste immobile pendant la lecture des réalisations.
Le changement de langue préserve le point de lecture.

Pour une fiche courte, un geste de molette/trackpad déclenche la transition de
350 ms. Pour une fiche longue, lire d’abord jusqu’aux actions, puis déclencher
la transition au geste suivant. Filtrer l’inertie d’un même geste ; permettre
immédiatement l’inversion. Le mouvement réduit rejoint la même destination
sans grande animation. La molette ne déplace jamais le focus. Les ancres et
l’historique restent fonctionnels et les sauts explicites focalisent le titre,
sans cadre sur tout l’écran.

### Contenu de référence pour Necromancer x Magical Girl

- Logiciels visibles : **Unity 6, Blender, Figma**.
- Pitch : « Incarnez un Nécromancien ou une Magical Girl et explorez un donjon à
  deux en coopération locale. Terrassez les ennemis, puis enrôlez-les dans votre
  armée pour surpasser celle de votre camarade. »
- Faits : **Gameplay & assets visuels · 2 personnes · 10 jours**.
- Réalisations : systèmes de combat ; moveset des deux personnages ; intégration
  et modification des assets et animations ; intégration des feedbacks visuels.
- Langage : **C#**, renseigné par Ryad dans sa fiche initiale ; moteur **Unity 6**.
- Actions : **Vidéo — à venir** et **Code source**, vers
  `https://github.com/gto634/Necromancer-x-MagicalGirl`.
- Les quatre autres fiches ont une vidéo disponible et un lien Code source :
  Tatamiam → `https://github.com/gto634/Tata-Miam`,
  IsekaiWar! → `https://github.com/gto634/IsekaiWar`,
  EntreCôte → `https://github.com/gto634/EntreCote`,
  SpaceRunner → `https://github.com/gto634/SpaceRunner`.
- À la publication, utiliser les URL exactes fournies par Ryad et les vérifier
  dans une session sans connexion avant activation.

## 4. Bannière de contact

Elle suit le dernier projet et constitue **une étape supplémentaire de scroll**.
Elle conserve une hauteur courte : référence desktop `clamp(220px, 30vh, 300px)`.
Une grande partie du projet précédent reste visible. Ne pas lui appliquer le
gabarit plein écran des projets.

Ordre de lecture : petite invitation facultative → « Restons en contact » →
coordonnées → bouton de collection → retour en haut.

- Courriel : **rmahiou.pro@gmail.com**. Le lien ouvre la rédaction Gmail dans un
  nouvel onglet, avec cette adresse préremplie comme destinataire :
  `https://mail.google.com/mail/?view=cm&fs=1&to=rmahiou.pro%40gmail.com`.
  Nom accessible explicitant Gmail et le nouvel onglet ; `rel="noopener noreferrer"`.
- Localisation : **Lyon, France** ; aucune adresse précise nécessaire.
- Profils : logos [LinkedIn](https://www.linkedin.com/in/ryad-mahiou-98a06532b/)
  et [GitHub](https://github.com/gto634), dans `ds-contact-socials`.
  Icônes de 24 px, liens de 44 × 44 px, nom accessible avec annonce du nouvel
  onglet, infobulle au survol et au focus, rose et rebond partagé.
- Invitation : téléphone de 16 px à droite de « Et si on échangeait ? ».
- Action principale : **« Tout mes projets »**, vers `projets.html`, avec une icône
  de quatre carrés à gauche, fond rose sans ombre et animation partagée.
- Retour à l’accueil : bouton secondaire identique à Code source, avec maison
  à gauche, texte « Retour à l’accueil » et lien vers `#intro`.
- Les deux boutons sont dans `ds-contact-actions`, de mêmes largeur et hauteur,
  sans flèche. Les icônes de destination utilisent une silhouette pleine.
- Fond nuit et quadrillage en perspective de l’intro via `ds-contact--grid`.
  Réutiliser `assets/models/intro-grid.svg`, recadré sans déformation, avec un
  fondu discret et le contour Toon. Le décor n’intercepte aucun clic.
  Garder les mêmes boutons que les projets.
- Sur mobile, empiler les colonnes et laisser grandir la bannière si nécessaire.
  Ne pas couper les coordonnées pour préserver une hauteur arbitraire.

L’état actif du dernier point correspond à la dernière position de défilement,
même lorsque le projet précédent occupe encore plus de surface que la bannière.

## 5. Collection « Tous les projets »

Ordre de lecture : en-tête → `h1` → phrase d’introduction → filtres et nombre
de résultats → grille → pied de page.

- Défilement naturel, sans hauteur verrouillée ni navigation à points.
- Conteneur de 1280 px maximum ; deux colonnes, puis une sous 700 px.
- Introduction et espace avant grille compacts. À 1280 × 720 et 1440 × 900,
  le premier écran montre titre, filtres et noms des premiers projets.
- Cartes de structure identique : miniature 16:9, titre, année renseignée,
  description courte et catégorie si utile. Même rayon et même interaction.
- Un lien principal sur toute la carte ; aucune action imbriquée dans ce lien.
- La catégorie (« Jeu », « Moteur ») décrit le type de projet ; ce n’est pas
  un badge de logiciel. Éviter les longues listes de technologies sur les cartes.
- Filtres « Tous », « Jeux », « Moteurs » avec état `aria-pressed` et nombre
  de résultats annoncé. Prévoir un message si un filtre n’a aucun résultat.
- Sans JavaScript, les cartes restent visibles et leurs liens utilisables.
- Les projets de la sélection renvoient à leur ancre d’accueil ; les autres
  disposent d’une fiche autonome. Garder les titres et les visuels cohérents
  entre une carte et sa destination.

Ordre actuel : Necromancer x Magical Girl, Tatamiam, IsekaiWar!, EntreCôte,
SpaceRunner. **SpaceRunner est conservé dans la collection, hors de l’accueil.**

## 6. Fiche autonome / projet conservé

Réutiliser le gabarit : titre, langage / technologie, outils, pitch, faits,
réalisations, Vidéo / GitHub et média disponible. Le défilement reste naturel ;
aucun geste ne déclenche une navigation vers une autre page. Le titre devient le `h1` du document. Fournir un
lien explicite « Tous les projets » pour revenir à la collection.

SpaceRunner utilise désormais un `h1` et reste accessible via `spacerunner.html#projet-4`. Conserver sa page,
son ancre et ses médias, même s’il n’apparaît plus à la une. Retirer un projet
de la sélection ne signifie pas supprimer ses fichiers.

## 7. Ajouter un projet

Rassembler les informations suivantes, sans inventer celles qui manquent :

| Donnée | Forme attendue |
| --- | --- |
| Nom et type | Jeu, moteur ou outil ; orthographe officielle. |
| Pitch | Deux ou trois phrases suivant les règles ci-dessus. |
| Rôle, équipe, durée | Trois faits courts et vérifiables. |
| Réalisations personnelles | Liste de contributions précises. |
| Langage et technologie | Champs confirmés : langage, moteur ou bibliothèque ou API de rendu. |
| Outils à montrer | Liste courte de logiciels et logos disponibles. |
| Année | Pour la collection, si renseignée. |
| Fond et miniature | Images paysage, idéalement 16:9 ; sujet à préserver au recadrage. |
| Vidéo | Facultative ; fichier disponible et affiche du lecteur. |
| Liens | URL publique GitHub confirmée ; sinon état à venir. |
| Position | À la une ou collection seule ; ordre voulu et éventuel projet remplacé. |

Créer un dossier de projet selon la convention existante, par exemple
`projects/NecromancerMagicalGirl/`, contenant `Splashscreen.png`, `Thumbnail.png` et,
lorsqu’il est fourni, `Gameplay.mp4`. Respecter exactement la casse des fichiers.
Un fichier déposé n’intègre pas automatiquement un nouveau lecteur : adapter
le HTML et vérifier ses états. Ajouter un README si un média manque.
Les fonds des fiches sont définis dans `assets/styles/projets.css`, avec des URL
relatives à cette feuille de styles. Ne pas les placer dans une variable CSS
inline dont le chemin serait résolu ailleurs lors de son utilisation.

### Checklist de livraison

- [ ] Hiérarchie, boutons, logos et espacements conformes aux composants communs.
- [ ] Pitch distinct des réalisations ; faits cohérents sur carte et fiche.
- [ ] Ordre des projets, ancres et navigation mis à jour ensemble.
- [ ] Aucun contenu fictif, lien vide, média cassé ou lecteur sans vidéo.
- [ ] Deux actions Vidéo / GitHub dans cet ordre ; états à venir explicites.
- [ ] Langage visible distinct des outils ; technologie correctement classée.
- [ ] Menu testé au clic, Entrée, Espace, Tab, Échap et clic extérieur.
- [ ] Rendu vérifié à 320, 390, 768 et 1440 px et au zoom 200 %.
- [ ] Les quatre puces et les actions restent accessibles sans dépliable.
- [ ] Clavier, focus, tactile et préférence de mouvement réduit vérifiés.
- [ ] Lisibilité contrôlée sur les images réelles, pas seulement sur fond uni.
- [ ] Vidéo : commandes natives, son conservé, ratio, fermeture, annulation et erreur.
- [ ] Molette / trackpad : une transition par geste, inertie, inversion et contenu long.
- [ ] Un projet retiré de la une reste accessible dans la collection si demandé.

## 8. Adoption et décisions

Les cinq fiches, la collection, les filtres, la bannière de contact et l’en-tête
utilisent les composants partagés. Le titre de SpaceRunner est un `h1`.
Les cartes présentent une catégorie uniforme Jeu/Moteur, un pitch et une preuve
distinctive ; les listes de technologies ont été retirées.

Convention : **→** pour une destination interne, **↗** pour une destination
externe, **▶** pour demander une vidéo. Une flèche verticale peut exprimer un
déplacement dans la page. Les textes des liens annoncent leur destination.

Exceptions autorisées : cadrage du fond et côté de la colonne. Même dans une
composition inversée, les textes restent alignés à gauche. Les sauts explicites
placent le point de lecture sur le titre ; pas de contour sur toute la section.

Un lien CV sera ajouté lorsqu’un fichier validé sera disponible ; aucun CV
n’a été trouvé dans le dépôt. Voir [le suivi de l’audit](CORRECTIONS-AUDIT.md)
pour le périmètre, les contrôles effectués et les validations sur hébergement.
