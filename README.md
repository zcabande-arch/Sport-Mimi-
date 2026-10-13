# Sport Mimi 🎀

Application mobile pour tonifier les épaules en douceur, à la maison : programme de la semaine sur mesure, bibliothèque d'exercices (mur, chaise, élastique, petits poids), lecteur de séance avec chrono, et suivi du poids.

C'est une **PWA** (Progressive Web App) : elle s'installe sur l'écran d'accueil du téléphone comme une vraie application, s'ouvre en plein écran et **fonctionne hors connexion**.

## 🌊 Marée (dossier `maree/`)

Une deuxième appli dans ce dépôt : **Marée**, le suivi de cycle en douceur (phases, énergie, symptômes, check-in du jour).
Elle s'installe et marche hors connexion de la même façon, à l'adresse :
**https://zcabande-arch.github.io/Sport-Mimi-/maree/**

Ses données restent aussi sur le téléphone. Après une modification de `maree/`, incrémenter `VERSION` dans `maree/sw.js`.

## Mettre l'application en ligne (une seule fois)

1. Fusionner cette branche dans `main`.
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
3. Le workflow `Publier sur GitHub Pages` se lance à chaque push sur `main`.
   L'application est alors disponible à l'adresse :
   **https://zcabande-arch.github.io/Sport-Mimi-/**

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
