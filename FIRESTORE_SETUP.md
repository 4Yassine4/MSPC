# 🔥 Configuration Firestore

Ce guide explique comment activer et configurer Firestore pour stocker vos cours et ressources.

## 📋 Prérequis

- Un projet Firebase configuré (voir `FIREBASE_SETUP.md`)
- Les variables d'environnement configurées dans `.env.local`

## 🚀 Étapes de Configuration

### Étape 1 : Activer Firestore dans Firebase Console

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet `mspc-site`
3. Dans le menu de gauche, cliquez sur **Firestore Database**
4. Cliquez sur **Create database**
5. Choisissez **Start in test mode** (pour le développement)
   - ⚠️ **Important** : En production, vous devrez configurer les règles de sécurité
6. Choisissez une région (ex: `europe-west` pour l'Europe)
7. Cliquez sur **Enable**

### Étape 2 : Configurer les règles de sécurité (Important)

1. Dans Firestore Database, allez dans l'onglet **Rules**
2. Pour le développement, vous pouvez utiliser ces règles (⚠️ **Temporaires, à sécuriser en production**) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture/écriture pour les utilisateurs authentifiés
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Cliquez sur **Publish**

**📖 Pour des règles de sécurité plus complètes, consultez `REGLES_SECURITE_FIREBASE.md`**

### Étape 3 : Activer Firebase Storage (pour les fichiers)

1. Dans le menu de gauche, cliquez sur **Storage**
2. Cliquez sur **Get started**
3. Choisissez **Start in test mode**
4. Choisissez la même région que Firestore
5. Cliquez sur **Next** puis **Done**

### Étape 4 : Configurer les règles Storage (Important)

1. Dans Storage, allez dans l'onglet **Rules**
2. Pour le développement, vous pouvez utiliser ces règles (⚠️ **Temporaires, à sécuriser en production**) :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permettre la lecture/écriture pour les utilisateurs authentifiés
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Cliquez sur **Publish**

**📖 Pour des règles de sécurité plus complètes, consultez `REGLES_SECURITE_FIREBASE.md`**

## ✅ Vérification

Une fois configuré, votre application utilisera automatiquement Firestore pour :
- ✅ Stocker les ressources (cours, TP, exercices, etc.)
- ✅ Stocker les demandes d'accès aux corrections
- ✅ Stocker les accès approuvés
- ✅ Stocker les fichiers dans Firebase Storage

## 📝 Collections Firestore créées automatiquement

L'application créera automatiquement ces collections :
- `resources` - Toutes les ressources pédagogiques
- `correction_access_requests` - Demandes d'accès aux corrections
- `correction_accesses` - Accès approuvés aux corrections

## 🔒 Sécurité en Production

⚠️ **Important** : Les règles de test mode permettent à tous les utilisateurs authentifiés de lire/écrire. Pour la production, vous devrez :

1. Restreindre l'accès en lecture pour les étudiants
2. Restreindre l'accès en écriture aux administrateurs uniquement
3. Vérifier les permissions avant chaque opération

## 🎉 C'est tout !

Votre application est maintenant configurée pour utiliser Firestore ! 🚀

Les données seront stockées dans le cloud et accessibles depuis n'importe où.

