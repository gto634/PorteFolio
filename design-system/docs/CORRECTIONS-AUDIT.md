# Ajustements après les retours de Ryad

12 octobre 2026 · Design system version 1.0

La direction Toon / Slime est désormais adoptée, avec les réglages de Ryad
sauvegardés dans `toon.css`. Elle remplace les prescriptions ci-dessous sur
l’absence de contour au repos. Les anciennes vérifications restent un
historique ; elles ne constituent pas une nouvelle validation de la version 1.0.
Les logiciels affichent maintenant leur nom à côté du logo, les menus ont leur
contour organique et le lecteur n’a plus de contour rose ni d’ombre.

Ces décisions remplacent les prescriptions antérieures concernant le bandeau
du lecteur et le bouton Menu. Le gabarit reste extensible, avec un seul
défilement principal. La section Intro et son animation sont conservées.

| Retour | Correction appliquée |
| --- | --- |
| Le fond se décale et la fiche précédente réapparaît en ouvrant les détails. | Fond décoratif de hauteur viewport, maintenu par `sticky` pendant la lecture. Désactivation du recalage automatique de scroll et limites calculées sur les dimensions réelles, sans dépassement dû aux arrondis. |
| Le bandeau du lecteur est inutile. | Vidéo seule, sans bandeau, titre visible ni croix. Nom du gameplay conservé pour les lecteurs d’écran ; focus dans les commandes natives. Fermeture au clic extérieur ou par Échap, retour au bouton et son conservé. |
| La collection manque dans le panneau. | Lien Tous les projets ajouté entre À la une et Contact sur les trois pages et dans la galerie. État courant de collection présent. |
| Menu + trois barres et cadre redondants. | Icône SVG à trois barres seule, sans cadre ni fond au repos, rose au survol. Cible de 48 px, nom accessible Ouvrir/Fermer le menu et focus clavier visible. |
| Le raccourci « Tous les projets » encombre les contrôles. | Retiré du coin supérieur droit ; l’accès reste dans le menu et dans la bannière de contact. |
| Courriel et destination à corriger. | `rmahiou.pro@gmail.com`, lien vers la rédaction Gmail avec destinataire prérempli, dans un nouvel onglet. |
| Ajouter français / anglais. | Globe à gauche des trois barres, textes publics et libellés accessibles traduits ; choix conservé entre accueil, collection et SpaceRunner et au rechargement. |

Vérifications locales :

- 30 configurations de fiches : cinq fiches à 1280 × 720, 1440 × 900,
  1280 × 600, 640 × 360, 390 × 844 et 320 × 640. Ouverture des détails sans
  déplacement du scroll vers la fiche précédente, aucune barre interne ni
  débordement horizontal, actions finales accessibles.
- Comparaison des fonds au début et à la fin des détails : régions visuelles
  identiques sur les cinq fiches, à 1280 × 720 et à 390 × 844. Aucun déplacement
  de cadrage, y compris les deux cas mobiles sensibles aux arrondis.
- Menu sur les trois pages, mobile et galerie : icône seule, absence de bordure
  et de fond, cible confortable, couleur rose au survol, collection présente,
  fermeture et retour du focus au clavier, panneau dans la fenêtre.
- Quatre vidéos lues : aucune bande visible, média entier, marges extérieures,
  parcours Tab et Shift+Tab contenu, clic extérieur et Échap, arrêt et libération
  du média, retour du focus et conservation du son. Premier Échap en plein
  écran réservé à la sortie de ce mode.
- Molette : lecture des détails avant changement de fiche, inertie filtrée,
  transition au geste suivant et retour immédiat. L’HTML de l’Intro reste
  inchangé par ce lot. D’autres fichiers de cet écran ont évolué en parallèle
  dans le dépôt ; ces modifications ont été conservées, sans intervention ici.

Vérifications de la langue (version 0.5) : 36 configurations de navigation et
60 configurations de fiches, français et anglais, sur les six tailles ci-dessus.
Conservation entre pages, rechargement, nouvel onglet et onglets déjà ouverts ;
filtre sélectionné et détails ouverts conservés. Panneaux exclusifs, focus et
Échap, absence de débordement et messages du lecteur traduits. Stockage bloqué :
sélection disponible pour la session. Le lien Gmail contient l’adresse corrigée
et ouvre un nouvel onglet, sans envoi de message.

Galerie et documents synchronisés en version 0.5. Les ressources publiques à
fournir et les mesures sur hébergement restent celles décrites dans l’historique.

---

## Historique : corrections de l’audit — révision 3

11 octobre 2026 · Design system version 0.3

Cette entrée concerne la révision 3 fournie par Ryad, qui remplace la révision 2
comme liste de travail. **La section Intro et les textes des projets sont exclus** :
leur HTML, CSS, animation, pitchs, rôles, faits et réalisations ont été conservés.
Seules les commandes communes, les métadonnées techniques et les comportements
d’interface évoluent. Les décisions de la révision 2 ci-dessous restent un historique.

## Résultat appliqué

| Point de la révision 3 | Correction | Adoption |
| --- | --- | --- |
| Grande bannière permanente | Accès compact langue + menu dans le coin supérieur droit, surface locale, panneau de navigation de 260 px. | Accueil, collection, SpaceRunner ; composant interactif identique dans la galerie. |
| Menu utilisable et lisible | Entrée / Espace / clic, Tab, Échap avec retour au bouton, clic extérieur ; `aria-expanded`, liens HTML, état courant. Défilement du menu isolé du projet derrière. | `components.js`, `components.css`, dimensions dans les tokens. |
| Retour au défilement par écrans | Transition de 350 ms ; filtrage de l’inertie, inversion immédiate. Ctrl + molette et raccourcis préservés ; aucune transition pendant une vidéo. | Sélection à la une ; collection et SpaceRunner restent naturels. |
| Détails et zoom coupés | Fiches de hauteur minimale égale au viewport, extensibles ; un seul défilement principal. Arrêt à la fin du contenu, transition au geste suivant. | Cinq fiches ; protection sombre conservée. |
| Deux actions communes | Vidéo principale, puis GitHub secondaire, mêmes composants et emplacement. Boutons à venir désactivés lisibles, sans faux lien ni fichier factice. | Quatre vidéos actives ; vidéo Necromancer et cinq liens GitHub à venir. |
| Lecteur trop large et commandes doublées | Fenêtre calculée sur le ratio réel et la hauteur disponible, marges 32 px / 16 px sur petit écran ; en-tête compact, une seule série de commandes natives. | Lecteur partagé et galerie. |
| Son imposé à chaque ouverture | Volume et sourdine conservés pendant la visite, y compris entre deux médias ; position conservée par vidéo. | `assets/scripts/video-modal.js`. |
| Chargement et erreur | Annuler libère la source ; Réessayer recharge. Message fidèle à l’état. Refus de lecture automatique : instruction vers la commande native. | Lecteur de production ; messages simulés explicitement identifiés dans la galerie. |
| Cadre rose autour de l’écran | Focus placé sur le titre, contour limité au titre en mode clavier ; aucun contour de section. Tab reste logique ; focus du lecteur rendu au déclencheur. | Ancres, points, liens d’évitement et historique. |
| Langages mélangés aux outils | Langage visible, technologie avec sa catégorie réelle, groupe Outils en logos. C++ et DirectX retirés du groupe de logiciels. | Necromancer C# / Unity 6 ; Tatamiam C++ / EntreCôte ; IsekaiWar! C++ / SFML ; EntreCôte C++ / Direct3D 12 ; SpaceRunner C++ / GC Engine. |
| Collection trop basse | Introduction et espace avant grille raccourcis ; noms des premiers projets visibles dès le premier écran aux formats demandés. | Ordre, descriptions, miniature 16:9, filtres et liens uniques conservés. |
| Règles obsolètes | Documents et galerie en version 0.3 ; tokens du menu, de la vidéo et de la transition communs. | `DESIGN-SYSTEM.md`, `REGLES-PAGES.md`, `README.md`, galerie. |

Le C# de Necromancer provient des informations explicitement fournies par Ryad
dans sa fiche initiale. Il n’a pas été déduit du logo Unity. Les trois logos
Unity 6, Blender et Figma restent ceux qui ont été validés.

## Vérifications de cette révision

- **30 contrôles de fiches** : cinq fiches × 1280 × 720, 1440 × 900,
  1280 × 600, 640 × 360, 390 × 844 et 320 × 640. Aucun débordement horizontal,
  pas de défilement interne, titre dégagé à la destination, deux actions
  atteignables avec les détails ouverts.
- Menu testé sur les trois pages : ouverture, Entrée, Espace, Tab, Échap,
  retour du focus, fermeture extérieure et limites du panneau. Contrôles
  complémentaires sur mobile et avec texte agrandi à 200 %.
- Molette réellement envoyée au navigateur, train d’inertie simulé,
  inversion pendant la transition, contenu long arrêté avant changement de
  fiche, contact court, Ctrl + molette, ancres et historique. La molette sur
  le Menu ne déplace plus la fiche en arrière-plan.
- **Six dimensions de lecteur** contrôlées : ratio 16:9 respecté, marges
  extérieures, aucun défilement de fenêtre, aucune commande doublée en lecture,
  parcours Tab, retour du focus et position du projet conservée.
- Les **quatre vidéos disponibles ont été lues** dans le lecteur actuel.
  Lecture, pause à la fermeture, conservation du volume et de la sourdine à
  la réouverture et entre deux sources, croix, clic extérieur, Échap et sortie
  du plein écran vérifiés. Premier Échap réservé au plein écran.
- Annulation puis réessai vérifiés avec un événement de chargement contrôlé ;
  erreur vérifiée avec une URL temporaire absente injectée uniquement dans le
  DOM de test. Aucun média de test ni lien cassé laissé dans les pages.
- Reflow à 640 × 360 et agrandissement typographique 200 %, espacements de
  texte personnalisés, filtre Moteurs, état vide de galerie, navigation et
  cartes sans JavaScript contrôlés. Ce reflow est équivalent à la mise en page
  d’un écran 1280 × 720 au zoom 200 % ; il ne certifie pas le zoom UI de chaque
  navigateur ni tous les appareils réels.
- Contraste des cinq fonds réels à 1280 × 720 : méthode conservatrice utilisant
  le pixel le plus lumineux de la région de texte. Minimum secondaire **8,53:1**,
  principal **12,82:1** ; voile et palette conservés. Résultats limités à ces
  régions et cette configuration, sans certification globale.
- Liens de ressources locaux vérifiés : aucun fichier manquant. Syntaxe des
  scripts valide et contrôle des espaces de diff réussi. Empreintes de l’Intro
  et comparaison des blocs éditoriaux inchangées par ce lot.

Les vérifications locales automatisées ont passé sans échec. La durée 350 ms
et la fenêtre de geste 160 ms restent des réglages modifiables dans les tokens ;
un essai sur le trackpad physique de Ryad peut affiner ce choix entre 300 et 400 ms.

## Publication différée et mesures sur hébergement

Les cinq URL GitHub publiques doivent être fournies ou confirmées par Ryad.
L’ancienne URL Necromancer est conservée dans le README de son dossier, mais
son action est indisponible conformément à l’audit. Vérifier les futures URL
sans connexion avant activation. La vidéo Necromancer reste également à fournir.
Ces ressources manquantes ne bloquent plus la cohérence du gabarit.

Les médias web optimisés et le chargement à la demande sont conservés. Requêtes
partielles vidéo, cache, LCP / INP / CLS et lecture sur réseau lent seront
mesurés sur l’hébergement après publication. Aucun résultat de performance
terrain ni validation humaine avec lecteur d’écran n’est revendiqué ici.

---

## Historique : corrections de la révision 2 — 11 octobre 2026

Référence : audit du portfolio, révision 2 du 11 octobre 2026 fourni par Ryad.
Demande : corriger les problèmes, **hors partie consacrée à l’écran d’introduction**.
Le texte, le fond et l’hypercube de cette introduction sont exclus de ce lot.
Les éventuelles évolutions de cet écran réalisées en parallèle sont conservées.

## Décisions et adoption

| Problème relevé | Correction appliquée | Où |
| --- | --- | --- |
| Titres sous l’en-tête, contenu long coupé | Réserve basée sur la hauteur réelle de l’en-tête ; défilement interne, sans réduction de la police. | Toutes les fiches, `assets/styles/projets.css`, mesure dans `components.js`. |
| Zones claires derrière les textes | Voile sombre constant jusqu’après la fin de la colonne, puis fondu vers le visuel ; direction inversée si nécessaire. | Fiches et tokens de voile. |
| Réalisations peu visibles et formulations génériques | Deux contributions visibles ; autres contributions dans un dépliable ; reformulation à partir des informations présentes, sans chiffres de résultat inventés. | Les cinq fiches et la galerie. |
| Fiches anciennes de formats différents | Titre, logos, pitch, rôle/équipe/durée, réalisations et actions communs. Textes alignés à gauche, même à droite de l’écran. | Necromancer, Tatamiam, IsekaiWar!, EntreCôte, SpaceRunner. |
| Flèche ambiguë et déplacement latéral pour la vidéo | « ▶ Voir la vidéo » et lecteur modal natif centré ; composition de la fiche conservée. | `assets/scripts/video-modal.js` et composant commun. |
| Contrôle du lecteur | Croix, clic extérieur et Échap ; pause et libération de la source ; focus contenu dans la fenêtre puis rendu au déclencheur. Premier Échap réservé à la sortie du plein écran. | Lecteur partagé. |
| Contact difficile à atteindre depuis la collection | Lien Contact dans l’en-tête commun et le pied de collection. | Pages publiques. |
| Libellé ne décrivant pas toute la collection | « Voir tous mes projets », flèche interne → ; ↗ pour les liens externes. | Contact, cartes et navigation. |
| Liste de logiciels dense sur les cartes | Catégorie Jeu/Moteur uniforme, pitch bref et contribution distinctive. | Collection. |
| Adoption incomplète du design system | Tokens et composants chargés par les pages ; anciens styles concurrents retirés de leur chaîne de chargement. | En-tête, actions, logiciels, faits, détails, cartes, filtres, contact et lecteur. |
| Deux références de palette | Alias de `assets/styles/base.css` vers les tokens ; `docs/Colors.md` devient un lien vers la source commune. | Fond `#0C0B14` partagé. |
| Galerie limitée à l’apparence initiale | États figés des actions, lien long, état courant, infobulle longue, détails longs, lecteur réel, messages simulés identifiés, filtre et liste vide. | Galerie du système. |
| Saut d’ancre sans point de lecture clavier | Focus sur la section à la navigation explicite ; aucun déplacement du focus à la molette. Liens modifiés conservant leurs comportements usuels. | `assets/scripts/script.js`. |
| Historique des ancres remplacé | Entrée ajoutée aux sauts explicites ; retour/précédent retrouve la section. | `assets/scripts/script.js`. |
| Scroll intercepté trop contraignant | Molette, tactile et clavier natifs ; ancrage de proximité. Animation seulement pour les liens, interrompue par une nouvelle action. | Structure des écrans et navigation. |
| Infobulles fragiles | Position limitée au viewport, survol maintenu, focus visible, fermeture par Échap, nom accessible. | Logiciels et points de navigation. |
| Absence de titre principal dans SpaceRunner | Titre en `h1`, retour vers la collection, page et ancre conservées. | `spacerunner.html#projet-4`. |
| Ressources trop lourdes | Dérivés WebP et MP4 optimisés, chargement vidéo à la demande ; sources conservées. | `assets/`, script de génération. |
| Finitions de texte | « Durée », « DirectX 12 », « 3 jours », architecture et développement corrigés ; EC explicité comme entités/composants, sans le transformer en ECS. | Fiches et collection. |

## Vérifications réalisées

- Vingt combinaisons des quatre fiches à la une aux formats 1280 × 720,
  1280 × 450, 768 × 720, 390 × 844 et 320 × 640 : titres hors de l’en-tête,
  contenu aligné à gauche, absence de débordement horizontal et action finale
  atteignable avec les détails ouverts. SpaceRunner et la collection contrôlés
  aux mêmes formats.
- Reflow à 640 × 360, équivalent de mise en page d’un écran 1280 × 720 au zoom
  200 %, puis agrandissement typographique à 200 % : accès au contenu et absence
  de débordement horizontal. Ce contrôle automatisé ne remplace pas une recette
  avec le zoom de chaque navigateur.
- Parcours clavier après un saut d’ancre, historique précédent, point actif de
  la bannière courte ; filtres Tous/Moteurs, compteur et accès sans JavaScript.
- Lecteur Tatamiam : lecture, pause, focus initial et cycle Tab, retour du focus,
  trois modes de fermeture, plein écran et premier Échap. Annulation et erreur
  vérifiées avec des événements et une source de test contrôlés, sans altérer
  les fichiers publiés.
- Infobulle longue : limite de la fenêtre, survol et fermeture par Échap ; état
  vide et messages simulés dans la galerie ; contrôles avec mouvement réduit.
- Contraste : captures des cinq fonds réels derrière les colonnes, à 1280 × 720,
  sans texte. Calcul conservateur utilisant le pixel le plus lumineux de chaque
  région. Minimum obtenu pour le texte secondaire : **8,53:1** ; texte principal :
  **12,82:1**. Cela décrit ces régions et cette configuration, pas une certification
  globale de tous les médias ou états possibles.
- Médias : dix WebP valides ; quatre vidéos avec mêmes dimensions, cadence et
  durée que les sources, et métadonnées MP4 avant les données vidéo (`faststart`).
  Comparaison visuelle d’une frame de gameplay Tatamiam à 15 s : HUD lisible.

## Volume des ressources

Les totaux comparent les dix images et les quatre vidéos sources à leurs dérivés.
Les fichiers d’introduction sont hors de cette comparaison.

| Lot | Sources | Versions web | Réduction |
| --- | --- | --- | --- |
| Fonds et miniatures | 27,15 Mio | 0,87 Mio | 96,8 % |
| Vidéos complètes | 313,45 Mio | 154,86 Mio | 50,6 % |

La compression vidéo est avec perte, sans réduction de résolution ni de cadence.
Une vidéo reste une ressource volumineuse : le chargement à la demande, le lecteur
et le support des requêtes partielles sur l’hébergement complètent ce travail.

## Éléments dépendant d’une publication ou d’un contenu fourni

- Aucun CV disponible dans le dépôt : ajouter le lien lorsqu’un fichier validé
  sera fourni. Aucun lien vide n’a été créé.
- LCP, INP, CLS, cache et lecture sur réseau lent devront être mesurés sur
  l’hébergement réel. Les vérifications locales ne permettent pas d’annoncer
  ces résultats.
- Les retours de lecteurs ou recruteurs et une vérification avec lecteur d’écran
  restent des validations humaines ; aucun résultat utilisateur n’est revendiqué.

Ces dépendances n’empêchent pas l’application des corrections d’interface.

## Vérifications de l’adoption Toon / Slime — 12 octobre 2026

- Les huit valeurs validées réapparaissent après rechargement de la galerie :
  300 / 200 / 100 / 200 ms, 15 px, 5 / 7 / 55 %, total 665 ms.
- Accueil, collection et SpaceRunner chargent le thème et les deux surfaces
  de menus. Navigation, sélection FR/EN et retour du focus au globe vérifiés.
- Filtre Moteurs : EntreCôte seule, puis retour aux cinq cartes avec Tous.
- Tatamiam : lecture réelle, commandes natives, absence de contour et d’ombre,
  fermeture par Échap, source libérée et focus rendu au bouton.
- Identifiants, ancres et ressources des quatre pages contrôlés. Les textes
  rédigés des projets sont conservés. Aucune erreur console observée.
- Les deux fichiers .lnk du bureau existent et ciblent le lanceur Python sans
  console avec la bonne page. Démarrage à froid vérifié sur un port de test,
  réutilisation du serveur principal vérifiée ; le serveur de test a été arrêté.

### Intégration des composants — révision 1.0.2

- Accueil, collection, SpaceRunner et galerie chargent les mêmes composants
  et animations. Les cinq fiches utilisent le bloc technique `ds-stack`.
- Les boutons du menu suivent la recette commune. Les actions désactivées
  gardent leur état visuel au survol. Boutons et cartes gardent leur zone de
  clic pendant la déformation du fond, du texte et des images.
- Les panneaux se superposent sans déplacer le contenu. Leur largeur laisse
  la place au globe et à son élan, y compris à 320 px ; recalcul au redimensionnement.
- 36 configurations de pages et 60 de fiches : français et anglais, aux formats
  1280 × 720, 1440 × 900, 768 × 720, 640 × 360, 390 × 844 et 320 × 640.
  Aucun débordement, détails et actions accessibles, changement de langue conservé.
- Rebond complet du point actif après sortie du pointeur, pression des boutons,
  détails, menus à 300 ms et globe à 665 ms, interruption, réduction des mouvements
  et filtres après traduction vérifiés dans le navigateur local.
- Quatre vidéos lues, cadre sans bandeau ni ombre, retour du focus et libération
  du média à la fermeture. Le bouton de récupération garde l’animation commune.
- Les fichiers de l’intro, de l’hypercube et les textes bilingues sont inchangés.

### Quadrillage de contact — 13 octobre 2026, révision 1.0.3

- La bannière et son exemple de galerie utilisent `ds-contact--grid` : le même
  asset `intro-grid.svg` que l’intro, recadré sans étirement, sur fond nuit avec
  fondu discret. Décor statique sans interception des clics ; hauteur courte conservée.
- Le lien d’évitement reste fixé malgré le thème de bouton : il ne décale plus
  le conteneur principal et ne coupe plus le bas de la bannière.
- Douze configurations français / anglais, de 320 à 1440 px : bannière entière,
  liens visibles, aucun débordement, retour à l’intro et lien d’évitement au
  clavier vérifiés. Les fichiers de l’intro et de l’hypercube sont inchangés.

### Textes, réalisations et liens — 13 octobre 2026, révision 1.0.4

- Le dernier HTML fourni par Ryad contenait les textes actualisés, mais
  `assets/scripts/i18n.js` les remplaçait par ses anciennes versions françaises. Le HTML
  devient la référence du français ; l’anglais et les libellés dynamiques
  restent dans le dictionnaire. Les rôles et durées propres aux projets ont
  leurs clés distinctes, notamment 10 jours pour Necromancer et 4 semaines
  pour Tatamiam. Les traductions anglaises et les cartes sont actualisées.
- Le quadrillage de contact est rétabli. Son style couvre aussi
  `.end-banner.ds-contact`, pour éviter de perdre le décor si un ancien HTML
  omet la classe dédiée. Les trois pages publiques et la galerie chargent
  les fichiers partagés avec la révision 1.0.4 pour renouveler leur cache.
- Les cinq fiches montrent directement leurs quatre contributions. Les liens
  Code source mènent aux cinq dépôts `gto634` fournis par Ryad ; chaque dépôt
  a répondu publiquement à l’API GitHub sans authentification.
- Les profils LinkedIn et GitHub apparaissent comme logos dans la bannière
  et sa référence de galerie : cible de 44 × 44 px, nom accessible bilingue,
  infobulle, focus, rose au survol et rebond partagé de 700 ms.
- Vérification locale de 36 configurations : accueil, collection et SpaceRunner,
  français et anglais, 1280 × 720, 1440 × 900, 768 × 720, 640 × 360,
  390 × 844 et 320 × 640. Aucun débordement horizontal ; quatre contributions
  et actions accessibles, coordonnées et profils visibles.
- Régression vérifiée avec un pitch modifié uniquement dans le HTML : le
  français est conservé au chargement et après aller-retour en anglais.
  Démarrage en anglais enregistré, navigation entre pages, filtres conservés
  après traduction et consultation sans JavaScript vérifiés.
- Rebond des logos sans déplacement de leur zone de clic, focus clavier,
  position des infobulles, Échap, liens en nouvel onglet et préférence de
  mouvement réduit vérifiés. Syntaxe JS contrôlée, aucune erreur de page ni
  ressource en erreur observée dans les vérifications locales.

### Boutons et icônes de navigation — 13 octobre 2026, révision 1.0.5

- Les actions vidéo et « Ma collection » utilisent la variante rose
  `ds-button--flat`, sans ombre au repos, au survol, au focus ni à la pression.
  Le rebond commun est conservé. Les boutons secondaires restent eux aussi
  sans ombre pendant la pression.
- Le bouton de collection porte le texte « Ma collection » / « My collection »
  et une grille de quatre carrés à gauche. Le retour à l’accueil utilise le
  même bouton secondaire que Code source, avec une maison. L’invitation de
  contact affiche un téléphone à droite.
- Accueil, collection, SpaceRunner et le spécimen de galerie placent les
  symboles à droite des quatre catégories : maison, étincelles, quatre carrés,
  téléphone. Les textes traduits sont dans des spans séparés des icônes.
- Le menu public ne contient plus de commande des rebonds du triangle.
  L’animation d’intro continue et s’arrête avec mouvement réduit, hors écran
  et dans un onglet masqué ; le réglage du spécimen reste dans la galerie.
- Trente configurations vérifiées : trois pages publiques, deux langues,
  1440 × 900, 768 × 720, 640 × 360, 390 × 844 et 320 × 640. Menu dans la
  fenêtre, icônes à droite, liens de contact visibles, aucun débordement.
  Échap et retour du focus, choix de langue enregistré, ouverture du lecteur,
  rebond d’intro et mouvement réduit vérifiés sans erreur de page ni ressource.

### Icônes pleines et boutons de contact — 13 octobre 2026, révision 1.0.6

- Les symboles de maison, téléphone et étincelles utilisent désormais des
  silhouettes pleines, comme la grille de quatre carrés. Leurs URL de masque
  sont versionnées pour renouveler les SVG en cache.
- « Ma collection » devient « Tout mes projets » / « All my projects » dans
  les boutons et le menu. Le menu suit l’ordre Accueil, À la une, Contact,
  Tout mes projets sur les trois pages publiques et dans la galerie.
- Les deux actions de la bannière utilisent `ds-contact-actions` : même
  largeur, rangées de même hauteur, icônes à gauche et aucune flèche.
- Vingt-quatre configurations vérifiées : accueil, collection et SpaceRunner,
  deux langues, 1440 × 900, 640 × 360, 390 × 844 et 320 × 640. Menu dans la
  fenêtre, boutons de mêmes dimensions, liens visibles, aucun débordement.
  Dimensions égales et libellés contenus également contrôlés avec un texte
  agrandi à 200 %. Le spécimen de galerie suit les mêmes règles.
- Les quatre SVG ont été décodés et rendus dans le navigateur ; leurs
  silhouettes et le rendu final du menu ont été vérifiés visuellement.
  Aucune erreur de page ni de chargement de ressource observée.

### Lecteur vidéo — 13 octobre 2026, script révision 1.0.7

- L’attribut `disablepictureinpicture` désactive le lecteur détaché dans un
  coin. Accueil et SpaceRunner chargent la nouvelle version de `assets/scripts/video-modal.js`.
- Lecture réelle de Tatamiam et SpaceRunner vérifiée dans le navigateur local.
  Les demandes d’image dans l’image sont refusées avec `InvalidStateError`.
  Commandes natives, lecture normale, fermeture par Échap, libération de la
  source et retour du focus vérifiés sans erreur de page.

### Organisation du dépôt — 13 octobre 2026

- Les pages publiques restent à la racine. CSS et JavaScript de page sont
  regroupés dans `assets/styles/` et `assets/scripts/`, les logos et le favicon
  dans `assets/icons/`. Le design system sépare ses `styles/`, `scripts/` et
  documents détaillés dans `docs/`.
- Les médias originaux sont dans `projects/<NomDuProjet>/`. Les fichiers
  Blender, l’ancienne vidéo d’intro et les anciens styles sont dans `sources/`.
  Les outils maintenus sont regroupés par média et hypercube ; le chemin du
  lanceur local est conservé pour les raccourcis existants.
- Les anciens brouillons, scripts ponctuels, rapports, captures et sauvegardes
  sont conservés localement dans `tools/ai/archive/`, ignoré par Git avec les
  caches et sauvegardes automatiques Blender. Les références de l’IA sont
  séparées dans `tools/ai/reference/`.
- 125 fichiers déplacés. Intégrité de 83 fichiers binaires vérifiée par SHA-256 ;
  textes des quatre pages principales conservés. Les manifestes, outils et
  liens de documentation suivent leurs nouveaux chemins.
- `tools/check-site.py` vérifie 200 références locales dans 30 fichiers,
  notamment les imports, URL de médias, noms sensibles à la casse et ancres.
  Les images de fond sont définies à côté de leur CSS consommateur pour éviter
  les URL ambiguës des variables inline après déplacement.
- Contrôle de l’hypercube, syntaxe de 15 scripts JavaScript et du script de
  raccourcis, syntaxe Python, 47 liens de documentation et serveur du lanceur
  vérifiés. Test navigateur de 26 configurations et scénarios à la racine et
  dans un sous-dossier : desktop/mobile, FR/EN, filtres, menus, scènes 3D,
  quatre vidéos et trois entrées de galerie. Aucune ressource manquante ni
  erreur de script observée ; captures finales inspectées.
- Un README à la racine décrit la structure et les commandes avant commit.
  Aucun commit ni push effectué pendant ce rangement.

## Galerie de référence 1.1 — 13 octobre 2026

Les icônes Accueil, À la une, Projets, Contact, GitHub et LinkedIn sont réunies
avec les composants actuels : action vidéo rose sans ombre, Code source avec
logo GitHub, profils sociaux et bannière quadrillée. La galerie utilise les
mêmes fichiers partagés que le portfolio. Les descriptions des cartes restent
celles rédigées dans la collection actuelle.

Les curseurs, presets, comparateur et commandes de personnalisation ont été
retirés du HTML, du script et des styles de galerie. Les huit valeurs validées
restent inchangées. Le mouvement réduit du système reste pris en compte ; le
triangle de la galerie se joue sur interaction, sans répétition automatique.

Vérifications : aucune commande de personnalisation dans le DOM ; icônes
24 px visibles, boutons principaux sans ombre, menu avec ses quatre icônes,
Échap et retour du focus pour le menu et l’aperçu vidéo. Aucune erreur console
observée. Identifiants, ancres et ressources contrôlés. L’export autonome
embarque désormais aussi les masques SVG, le fond quadrillé et le favicon.
