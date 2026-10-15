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
