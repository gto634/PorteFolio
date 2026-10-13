# Portfolio — Ryad Mahiou

Portfolio statique de jeux et moteurs. Les trois pages publiques restent à la
racine : `index.html`, `projets.html` et `spacerunner.html`. Aucun build ni
serveur applicatif n’est nécessaire pour les publier.

## Organisation

| Dossier | Contenu |
| --- | --- |
| `assets/styles/` | CSS de mise en page du portfolio. |
| `assets/scripts/` | Navigation, traductions, hypercube, collection et lecteur vidéo. |
| `assets/icons/` | Favicon, pictogrammes et logos ; licences conservées. |
| `assets/backgrounds/`, `thumbnails/`, `videos/` | Médias optimisés utilisés par le site. |
| `assets/models/`, `vendor/` | Modèle de l’intro et dépendance Three.js locale. |
| [design-system/](design-system/README.md) | Galerie, `styles/`, `scripts/` et règles dans `docs/`. |
| [projects/](projects/README.md) | Médias originaux de chaque projet, conservés pour les prochains exports. |
| [sources/](sources/README.md) | Fichiers Blender et anciennes ressources de référence. |
| [docs/](docs/README.md) | Notes de palette et références de design. |
| [tools/](tools/README.md) | Lancement local, exports et contrôles de maintenance. |
| [tools/ai/](tools/ai/README.md) | Références et archives réservées aux travaux de l’IA. |

Les brouillons, captures, sauvegardes et expériences de l’IA restent en local
dans `tools/ai/archive/`, ignoré par Git. Les originaux des projets et les
fichiers Blender principaux restent versionnables.

## Lancer en local

Depuis la racine du dépôt, avec Python 3 :

```powershell
python tools/launch-local.py
python tools/launch-local.py design-system
```

Le lanceur ouvre la bonne page, démarre un serveur limité à la machine locale
et réutilise celui qui tourne déjà. Les raccourcis du bureau gardent leur chemin
de lancement. Pour les recréer sous Windows : `tools/create-shortcuts.ps1`.

## Modifier le contenu

Le français se modifie dans le HTML. L’anglais et les libellés dynamiques se
trouvent dans [i18n.js](assets/scripts/i18n.js). Les règles graphiques sont dans
[les règles de pages](design-system/docs/REGLES-PAGES.md).

Déposer les visuels dans `projects/<NomDuProjet>/`, puis suivre
[le guide des médias](assets/README.md) pour régénérer les versions web.
Ne pas remplacer les médias originaux par les versions compressées.
Les fonds de chaque fiche sont définis dans `assets/styles/projets.css` ;
leurs URL restent relatives à cette feuille de styles.

## Vérifier avant un push

```powershell
python tools/check-site.py
node tools/hypercube/check-hypercube.mjs
git diff --check
git status --short
```

Le premier contrôle vérifie les chemins, leur casse, les imports, les ressources
CSS et les ancres locales. Le second contrôle le modèle et l’animation de l’intro.
Vérifier aussi la navigation, FR/EN, les filtres et la lecture vidéo dans le
navigateur. Lors du prochain commit, inclure les déplacements et leurs anciens
chemins supprimés avec `git add -A` depuis la racine.

Pour servir le site, garder la structure des pages, de `assets/` et du
`design-system/`. Les outils et les sources originales ne sont pas requis par
le navigateur. Éviter de publier les dossiers locaux ignorés par Git.
