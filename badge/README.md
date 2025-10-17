# Go Talent PWA

Une Progressive Web Application (PWA) pour l'événement minier Go Talent, développée avec Vanilla JavaScript, TailwindCSS, et Anime.js.

## Fonctionnalités

- 🔐 **Connexion par email** : Accès sécurisé avec validation des participants
- 📱 **Design responsive** : Optimisé pour mobile et desktop
- 🎴 **Carte de participant interactive** : Affichage élégant des informations
- 📊 **Code QR généré** : Code QR avec informations de contact
- 🔄 **Animation de retournement de carte** : Interface utilisateur moderne
- ✨ **Animations fluides** : Animations avec Anime.js
- 📴 **Fonctionnement hors ligne** : Service Worker pour le cache
- 🚀 **Installation PWA** : Installable sur appareil mobile

## Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Styling** : TailwindCSS
- **Animations** : Anime.js
- **QR Code** : QRCode.js
- **PWA** : Service Worker, Web App Manifest

## Structure du projet

```
gotalent2/
├── index.html              # Page principale
├── manifest.json           # Manifeste PWA
├── sw.js                  # Service Worker
├── js/
│   └── app.js             # Logique principale de l'application
├── icons/                 # Icônes PWA
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ...
├── data/
│   └── participants.json  # Données des participants
└── README.md              # Ce fichier
```

## Installation et utilisation locale

### Prérequis

- Un serveur web local (les PWAs nécessitent HTTPS ou localhost)
- Navigateur moderne supportant les PWAs

### Méthode 1 : Serveur Python

```bash
# Cloner ou télécharger le projet
cd gotalent2

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Ouvrir http://localhost:8000 dans le navigateur
```

### Méthode 2 : Node.js avec http-server

```bash
# Installer http-server globalement
npm install -g http-server

# Dans le dossier du projet
http-server -p 8000

# Ouvrir http://localhost:8000 dans le navigateur
```

### Méthode 3 : Live Server (VS Code)

1. Installer l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html`
3. Sélectionner "Open with Live Server"

## Utilisation de l'application

1. **Connexion** :
   - Entrer l'adresse email d'un participant enregistré
   - Cliquer sur "Se connecter"

2. **Carte de participant** :
   - Voir les informations détaillées du participant
   - Cliquer sur l'icône de rotation pour voir le QR code
   - Utiliser le bouton "Retour" pour revenir aux détails

3. **Déconnexion** :
   - Cliquer sur "Déconnexion" pour retourner à la page de connexion

## Déploiement

### GitHub Pages

1. **Préparer le repository** :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/gotalent-pwa.git
   git push -u origin main
   ```

2. **Activer GitHub Pages** :
   - Aller dans Settings > Pages
   - Source : Deploy from a branch
   - Branch : main / (root)
   - Cliquer sur Save

3. **Accéder à l'app** : `https://votre-username.github.io/gotalent-pwa/`

### Netlify

1. **Déploiement par glisser-déposer** :
   - Aller sur [Netlify](https://netlify.com)
   - Glisser le dossier du projet sur la zone de déploiement

2. **Déploiement par Git** :
   - Connecter votre repository GitHub
   - Build command : (laisser vide)
   - Publish directory : (laisser vide ou mettre ".")

### Vercel

1. **Installation de Vercel CLI** :
   ```bash
   npm i -g vercel
   ```

2. **Déploiement** :
   ```bash
   cd gotalent2
   vercel
   ```

3. **Suivre les instructions** pour configurer le projet

## Configuration PWA

### Manifest.json

Le fichier `manifest.json` configure l'installation PWA :

- **name** : "Go Talent"
- **theme_color** : "#667eea"
- **background_color** : "#1a202c"
- **display** : "standalone"

### Service Worker

Le Service Worker (`sw.js`) gère :

- ✅ Mise en cache des ressources critiques
- ✅ Fonctionnement hors ligne
- ✅ Mise à jour automatique du cache

## Personnalisation

### Modifier les couleurs

Dans `index.html`, section `<style>` :

```css
.gradient-bg {
    background: linear-gradient(135deg, #votre-couleur1 0%, #votre-couleur2 100%);
}

.mining-gradient {
    background: linear-gradient(135deg, #couleur1 0%, #couleur2 100%);
}
```

### Ajouter des animations

Dans `js/app.js`, méthode `initAnimations()` :

```javascript
anime({
    targets: '.votre-element',
    // vos propriétés d'animation
    duration: 1000,
    easing: 'easeOutExpo'
});
```

### Modifier les données

Éditer `data/participants.json` avec la structure suivante :

```json
[
    {
        "Timestamp": "7/7/2025 23:43:37",
        "Email": "participant@example.com",
        "Contact Number": "0123456789",
        "Genre": "Homme/Femme",
        // ... autres champs
    }
]
```

## Dépannage

### L'application ne se charge pas

1. Vérifier que le serveur web fonctionne
2. Ouvrir les outils de développement (F12)
3. Vérifier la console pour les erreurs JavaScript
4. S'assurer que `data/participants.json` est accessible

### Le Service Worker ne fonctionne pas

1. Les Service Workers nécessitent HTTPS ou localhost
2. Vérifier dans DevTools > Application > Service Workers
3. Forcer la mise à jour avec "Update on reload"

### Les icônes PWA ne s'affichent pas

1. Vérifier que les fichiers dans `/icons/` existent
2. S'assurer que les chemins dans `manifest.json` sont corrects
3. Tester l'installation PWA sur mobile

### Problèmes de connexion

1. Vérifier que l'email existe dans `participants.json`
2. Respecter la casse exacte de l'email
3. S'assurer que le fichier JSON est valide

## Support des navigateurs

- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Edge
- ❌ Internet Explorer

## Licence

Ce projet est développé pour l'événement Go Talent. Tous droits réservés.

## Contact

Pour toute question ou support, contactez l'équipe Go Talent.

---

**Note** : Cette PWA est optimisée pour l'événement minier Go Talent et inclut des animations thématiques liées au secteur minier.
