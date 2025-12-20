# 🔥 Configuration Firebase Authentication

Ce guide explique comment configurer Firebase Authentication pour votre application.

## 📋 Prérequis

- Un compte Google (pour accéder à Firebase Console)
- Node.js installé

## 🚀 Étapes de Configuration

### Étape 1 : Créer un projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez sur **"Add project"** ou **"Créer un projet"**
3. Entrez un nom de projet (ex: `mspc-site`)
4. Cliquez sur **"Continue"**
5. Désactivez Google Analytics (optionnel) ou activez-le si vous le souhaitez
6. Cliquez sur **"Create project"**
7. Attendez que le projet soit créé (30 secondes environ)

### Étape 2 : Créer une application Web

1. Dans votre projet Firebase, cliquez sur l'icône **Web** (`</>`)
2. Entrez un nom d'app (ex: `mspc-site-web`)
3. **Ne cochez PAS** "Also set up Firebase Hosting" (on n'en a pas besoin)
4. Cliquez sur **"Register app"**
5. Vous verrez une configuration JavaScript avec vos clés

### Étape 3 : Récupérer les clés de configuration

Copiez les valeurs suivantes depuis la configuration affichée :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                    // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "votre-projet.firebaseapp.com",  // ← NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "votre-projet-id",         // ← NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "votre-projet.appspot.com",   // ← NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",       // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef"       // ← NEXT_PUBLIC_FIREBASE_APP_ID
}
```

### Étape 4 : Activer l'authentification Email/Password

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"Get started"** si c'est la première fois
3. Allez dans l'onglet **"Sign-in method"**
4. Cliquez sur **"Email/Password"**
5. Activez le toggle **"Enable"**
6. Cliquez sur **"Save"**

### Étape 5 : Configurer le fichier .env.local

1. Copiez le fichier `env.local.example` en `.env.local` :
   ```bash
   cp env.local.example .env.local
   ```

2. Ouvrez `.env.local` et remplacez les valeurs par vos clés Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Étape 6 : Créer un compte administrateur

1. Dans Firebase Console, allez dans **Authentication** > **Users**
2. Cliquez sur **"Add user"**
3. Entrez :
   - **Email** : `admi.23@gmail.com` (ou l'email que vous voulez)
   - **Password** : Votre mot de passe
4. Cliquez sur **"Add user"**

**Note** : Vous pouvez aussi créer le compte directement depuis l'application en vous connectant avec un email/mot de passe (Firebase créera automatiquement le compte).

### Étape 7 : Redémarrer le serveur

```bash
npm run dev
```

## ✅ Vérification

1. Allez sur http://localhost:3000/login
2. Connectez-vous avec l'email et le mot de passe que vous avez créés
3. Vous devriez être redirigé vers `/admin`

## 🔧 Dépannage

### Erreur "Firebase: Error (auth/configuration-not-found)"
→ Vérifiez que toutes les variables dans `.env.local` sont correctes et commencent par `NEXT_PUBLIC_`

### Erreur "Firebase: Error (auth/invalid-api-key)"
→ Vérifiez que `NEXT_PUBLIC_FIREBASE_API_KEY` est correcte dans `.env.local`

### Erreur "Firebase: Error (auth/user-not-found)"
→ Le compte n'existe pas. Créez-le dans Firebase Console ou via l'application

### Erreur "Firebase: Error (auth/wrong-password)"
→ Le mot de passe est incorrect

### Le serveur ne charge pas les variables
→ Redémarrez le serveur après avoir modifié `.env.local`

## 📝 Notes importantes

- Les variables d'environnement doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client
- Firebase Authentication fonctionne uniquement côté client (dans le navigateur)
- Les sessions sont gérées automatiquement par Firebase
- Vous pouvez créer des utilisateurs directement depuis Firebase Console ou depuis l'application

## 🎉 C'est tout !

Votre authentification est maintenant migrée vers Firebase ! 🚀

