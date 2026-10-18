# Sport Mimi 🎀

Application mobile pour tonifier les épaules en douceur, à la maison : programme de la semaine sur mesure, bibliothèque d'exercices (mur, chaise, élastique, petits poids), lecteur de séance avec chrono, et suivi du poids.

C'est une **PWA** (Progressive Web App) : elle s'installe sur l'écran d'accueil du téléphone comme une vraie application, s'ouvre en plein écran et **fonctionne hors connexion**.

## 🌊 Marée (dossier `maree/`)

Une deuxième appli dans ce dépôt : **Marée**, le suivi de cycle en douceur (phases, énergie, symptômes, check-in du jour).
Elle s'installe et marche hors connexion de la même façon, à l'adresse :
**https://zcabande-arch.github.io/Sport-Mimi-/maree/**

Ses données restent aussi sur le téléphone. Après une modification de `maree/`, incrémenter `VERSION` dans `maree/sw.js`.

## 🛁 Maison Reconnue (dossier `maison/`)

La salle de bain qui te reconnaît : la caméra frontale analyse ton visage en direct avec le modèle **Teachable Machine** `https://teachablemachine.withgoogle.com/models/PGEUfeFRV/`, puis applique tes réglages (douche, cuvette japonaise, lavabo, lumière, chauffage, bain).
Adresse : **https://zcabande-arch.github.io/Sport-Mimi-/maison/**

- Le modèle se charge tout seul depuis Teachable Machine ; chaque classe devient une personne (prénom modifiable), « Invité » ou « Pièce vide » dans **Personnes du modèle**.
- **Apprentissage continu** : à chaque reconnaissance, l'appli garde quelques images du visage ; le bouton « Ce n'est pas la bonne personne ? » corrige et lui apprend à ne plus se tromper ; « Apprendre son visage » (dans Personnes du modèle) enregistre 4 secondes de la personne. Tout reste sur l'appareil.
- Les réglages changés pendant que quelqu'un est reconnu sont mémorisés pour cette personne. Option **Enfant** : douche bloquée à 40 °C.
- Si tu ré-entraînes le modèle dans Teachable Machine, clique « Upload my model » : le lien reste le même et l'appli prend la nouvelle version.
- Les images ne quittent jamais le téléphone. Les équipements sont simulés.

Après une modification de `maison/`, incrémenter `VERSION` dans `maison/sw.js`.

## 📸 ZO Studio (dossier `zo/`)

Le planning Instagram de ZO Studio (19 posts du 14 octobre au 14 novembre 2026) en appli :
**https://zcabande-arch.github.io/Sport-Mimi-/zo/**

- **Aujourd'hui** : le post du jour (ou celui en retard, ou le prochain) avec le compte à rebours, ses visuels, et les boutons « Enregistrer les visuels » (feuille de partage → « Enregistrer les images » dans Photos), « Copier la légende », « Instagram » et « C'est publié ».
- **Planning** : tous les posts par semaine, filtres par thème ou « À faire », coche « Publié » directement dans la liste.
- **Calendrier** : octobre et novembre, une pastille par post (couleur du thème, ✓ quand c'est publié, cerclé s'il est en retard).
- Chaque post s'ouvre en grand : visuels en plein écran (balayer pour passer au suivant), légende modifiable, et pour « Ta photo » un bouton pour ajouter ta propre photo.
- **Réglages** : « Ajouter les rappels au calendrier » (un fichier .ics, alerte 15 min avant chaque post), thème clair / sombre.
- Les visuels sont dans `zo/img/` et les textes dans `zo/posts.js`. Tout marche hors connexion ; les coches, légendes retouchées et photos restent sur le téléphone.

**Boutique Etsy reliée** (onglet « Boutique ») : chaque matin, le workflow « Boutique Etsy → appli ZO Studio » (`.github/workflows/etsy.yml`) récupère les annonces actives de **zoestudioapp** avec `zo/scripts/etsy-sync.mjs` et les enregistre dans `zo/shop.json` (photos dans `zo/shop/`). L'appli montre les annonces, leur prix, combien de posts sont prévus pour chacune, signale celles qui n'ont aucun post à venir, et « Créer le post » ajoute au planning un carrousel avec les photos de l'annonce et une légende prête (au premier jour libre).

Pour l'activer (une seule fois) :
1. Sur https://www.etsy.com/developers : « Create a new app », puis noter la *Keystring* et le *Shared secret*.
2. Sur GitHub : Settings → Secrets and variables → Actions → New repository secret : `ETSY_API_KEY` (la Keystring) et `ETSY_SHARED_SECRET`.
3. Onglet Actions → « Boutique Etsy → appli ZO Studio » → Run workflow.

Après une modification de `zo/`, incrémenter `VERSION` dans `zo/sw.js` (et dans `zo/index.html`). Si tu ajoutes des images, ajoute-les aussi à la liste `IMAGES` de `zo/sw.js`.

## Mettre l'application en ligne (une seule fois)

1. Sur GitHub : **Settings → Pages**.
2. **Source : Deploy from a branch**, branche **`claude/new-session-1k03bk`**, dossier **`/ (root)`**, puis **Save**.
3. Une à deux minutes plus tard, l'application est disponible à l'adresse :
   **https://zcabande-arch.github.io/Sport-Mimi-/** (et Marée sur **…/Sport-Mimi-/maree/**)

## Installer sur le téléphone

- **iPhone (Safari)** : ouvrir l'adresse → bouton Partager → **Sur l'écran d'accueil**.
- **Android (Chrome)** : ouvrir l'adresse → menu ⋮ → **Installer l'application**.

## Données

Tout reste sur l'appareil (stockage local du navigateur), rien n'est envoyé sur internet.
Dans l'onglet **Profil**, les boutons **💾 Sauvegarder** et **📂 Restaurer** permettent d'exporter ses données dans un fichier et de les retrouver sur un autre téléphone.

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (HTML, CSS et JavaScript) |
| `manifest.webmanifest` | Nom, couleurs et icônes pour l'installation |
| `sw.js` | Service worker : cache pour le mode hors connexion |
| `icons/` | Icônes de l'application |
| `.github/workflows/pages.yml` | Déploiement automatique sur GitHub Pages |

> Après une modification des fichiers, incrémenter `VERSION` dans `sw.js` pour que les téléphones récupèrent bien la nouvelle version.
