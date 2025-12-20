# 🎓 Plateforme Éducative MSPC

Plateforme éducative moderne pour la gestion de ressources pédagogiques avec 9 chapitres organisés.

## 🚀 Fonctionnalités

- ✅ 9 chapitres organisés avec ressources par type (TP, Synthèse, Exercice, Ressource, Correction)
- ✅ Gestion des ressources par le professeur (ajout, modification, suppression)
- ✅ Système de demande d'accès aux corrections avec approbation
- ✅ Téléchargement des fichiers
- ✅ Interface moderne et responsive
- ✅ Stockage local avec localStorage

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd mspc-site
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase Authentication (optionnel mais recommandé)**

   Pour utiliser l'authentification Firebase :
   - Créez un compte sur [Firebase Console](https://console.firebase.google.com)
   - Créez un projet Firebase
   - Suivez les instructions dans `FIREBASE_SETUP.md`
   - Créez le fichier `.env.local` avec vos clés Firebase

   **Note** : Si Firebase n'est pas configuré, l'authentification ne fonctionnera pas mais l'application utilisera localStorage pour les données.

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📚 Les 9 chapitres

1. Électricité et électrotechnique
2. Les composants électriques
3. Les composants pneumatiques
4. Les composants hydrauliques
5. Les automatismes
6. La fabrication
7. La mécanique
8. Les méthodes de gestion et qualité
9. Sécurité professionnelle, hygiène, environnement

## 👨‍🏫 Accès Administration

- URL: `/admin` (nécessite une authentification Firebase)
- URL de connexion: `/login`
- Permet de gérer toutes les ressources et demandes d'accès

## 📖 Utilisation

### Pour les étudiants :
1. Entrez votre email en haut à droite
2. Parcourez les chapitres et leurs ressources
3. Téléchargez les ressources disponibles
4. Demandez l'accès aux corrections si nécessaire

### Pour les professeurs :
1. Allez sur `/login` pour vous connecter avec vos identifiants Firebase
2. Accédez à l'interface admin (`/admin`)
3. Ajoutez des ressources en sélectionnant le chapitre et le type
4. Uploadez les fichiers (stockés localement dans le navigateur)
5. Gérez les demandes d'accès aux corrections

## 🔧 Configuration

### Authentification Firebase
- Authentification sécurisée avec Firebase Auth
- Voir `FIREBASE_SETUP.md` pour la configuration

### Stockage des données
- Utilise localStorage du navigateur
- Les données sont locales au navigateur
- Les fichiers sont stockés en base64 dans localStorage

## 📁 Structure du projet

```
mspc-site/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Page d'accueil (étudiants)
│   │   ├── login/
│   │   │   └── page.tsx      # Page de connexion
│   │   └── admin/
│   │       └── page.tsx      # Interface admin
│   └── lib/
│       ├── firebase.ts       # Configuration Firebase
│       ├── auth.ts           # Fonctions d'authentification
│       └── storage.ts        # Gestion du stockage localStorage
├── FIREBASE_SETUP.md         # Guide de configuration Firebase
└── package.json
```

## 🎨 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Firebase** - Authentification

## 📝 Notes importantes

- Les ressources sont organisées par chapitre et par type
- Les corrections nécessitent une demande d'accès approuvée
- Les fichiers sont stockés localement dans le navigateur (base64)
- Les données persistent dans localStorage même après déconnexion

## 🐛 Dépannage

Si les ressources disparaissent :
- Vérifiez la console pour les erreurs
- Vérifiez que le navigateur n'a pas nettoyé les données localStorage
- Les données sont stockées localement, elles peuvent être perdues si vous nettoyez le cache du navigateur

## 📄 Licence

Projet éducatif - Usage interne
