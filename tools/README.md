# Outils de maintenance

Ces outils peuvent être utilisés directement, indépendamment de l’IA.

| Outil | Usage |
| --- | --- |
| `launch-local.py` | Ouvrir le portfolio ou le design system avec un serveur local. Son chemin est conservé pour les raccourcis existants. |
| `create-shortcuts.ps1` | Créer les deux raccourcis Windows ; accepte `-PythonWindowless` si nécessaire. |
| `check-site.py` | Contrôler les liens, ressources, imports, ancres et leur casse avant publication. |
| `media/optimize-media.py` | Générer les WebP avec Pillow et les MP4 avec FFmpeg optionnel. |
| `media/faststart.cjs` | Déplacer les métadonnées des MP4 originaux sans réencoder leur contenu. |
| `hypercube/export-hypercube.py` | Exporter le modèle Blender et sa miniature. |
| `hypercube/export-hypercube-rig.py` | Extraire les sommets, segments et poses depuis Blender. |
| `hypercube/check-hypercube.mjs` | Vérifier les poses, la continuité de la boucle et le cadrage. |
| [ai/](ai/README.md) | Travaux ponctuels et archives de l’IA, séparés de la maintenance du site. |

Les scripts calculent les chemins depuis leur emplacement dans le dépôt.
L’export des médias est décrit dans [assets/README.md](../assets/README.md) et
celui de l’hypercube dans [assets/models/README.md](../assets/models/README.md).
