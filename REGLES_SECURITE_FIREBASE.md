# 🔒 Règles de Sécurité Firebase

Ce guide contient les règles de sécurité recommandées pour Firestore et Storage.

## 📋 Règles Firestore

### Pour le Développement (Test Mode)

⚠️ **ATTENTION** : Ces règles permettent à tous les utilisateurs authentifiés de lire/écrire. À utiliser uniquement en développement.

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

### Pour la Production (Recommandé)

Ces règles sont plus sécurisées et restreignent l'accès selon les besoins :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Collection des ressources
    match /resources/{resourceId} {
      // Tout le monde peut lire les ressources (étudiants et profs)
      allow read: if request.auth != null;
      
      // Seuls les utilisateurs authentifiés peuvent créer/modifier/supprimer
      // (Dans votre cas, seuls les profs sont authentifiés)
      allow create, update, delete: if request.auth != null;
    }
    
    // Collection des demandes d'accès aux corrections
    match /correction_access_requests/{requestId} {
      // Les étudiants peuvent créer leurs propres demandes
      allow create: if request.auth != null;
      
      // Les étudiants peuvent lire leurs propres demandes
      allow read: if request.auth != null && 
        (resource.data.studentEmail == request.auth.token.email);
      
      // Seuls les admins peuvent mettre à jour (approuver/rejeter)
      allow update: if request.auth != null;
      
      // Personne ne peut supprimer (ou seulement les admins)
      allow delete: if false;
    }
    
    // Collection des accès aux corrections
    match /correction_accesses/{accessId} {
      // Les étudiants peuvent lire leurs propres accès
      allow read: if request.auth != null && 
        (resource.data.studentEmail == request.auth.token.email);
      
      // Seuls les admins peuvent créer (lors de l'approbation)
      allow create: if request.auth != null;
      
      // Personne ne peut modifier ou supprimer
      allow update, delete: if false;
    }
  }
}
```

### Règles Ultra-Sécurisées (Optionnel)

Si vous voulez restreindre encore plus l'accès :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper pour vérifier si c'est un admin
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email.matches('.*@(mspc|admin|prof).*');
    }
    
    // Collection des ressources
    match /resources/{resourceId} {
      // Lecture pour tous les utilisateurs authentifiés
      allow read: if request.auth != null;
      
      // Écriture uniquement pour les admins
      allow create, update, delete: if isAdmin();
    }
    
    // Collection des demandes d'accès
    match /correction_access_requests/{requestId} {
      // Les étudiants peuvent créer leurs demandes
      allow create: if request.auth != null;
      
      // Les étudiants peuvent lire leurs propres demandes
      allow read: if request.auth != null && 
        (resource.data.studentEmail == request.auth.token.email);
      
      // Seuls les admins peuvent approuver/rejeter
      allow update: if isAdmin();
      
      allow delete: if false;
    }
    
    // Collection des accès
    match /correction_accesses/{accessId} {
      // Les étudiants peuvent lire leurs propres accès
      allow read: if request.auth != null && 
        (resource.data.studentEmail == request.auth.token.email);
      
      // Seuls les admins peuvent créer
      allow create: if isAdmin();
      
      allow update, delete: if false;
    }
  }
}
```

---

## 📦 Règles Storage (Firebase Storage)

### Pour le Développement (Test Mode)

⚠️ **ATTENTION** : Ces règles permettent à tous les utilisateurs authentifiés de lire/écrire. À utiliser uniquement en développement.

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

### Pour la Production (Recommandé)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Dossier des ressources (fichiers principaux)
    match /resources/{fileName} {
      // Tout le monde peut lire (étudiants et profs)
      allow read: if request.auth != null;
      
      // Seuls les utilisateurs authentifiés peuvent uploader
      // (Dans votre cas, seuls les profs sont authentifiés)
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024  // Limite 10MB
        && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/.*');
    }
    
    // Dossier des corrections
    match /corrections/{fileName} {
      // Seuls les utilisateurs authentifiés peuvent lire
      // (Les étudiants doivent avoir un accès approuvé - vérifié côté app)
      allow read: if request.auth != null;
      
      // Seuls les utilisateurs authentifiés peuvent uploader
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024  // Limite 10MB
        && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/.*');
    }
    
    // Bloquer tout le reste
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Règles Ultra-Sécurisées (Optionnel)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Fonction helper pour vérifier si c'est un admin
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email.matches('.*@(mspc|admin|prof).*');
    }
    
    // Dossier des ressources
    match /resources/{fileName} {
      // Lecture pour tous les utilisateurs authentifiés
      allow read: if request.auth != null;
      
      // Upload uniquement pour les admins
      allow write: if isAdmin() 
        && request.resource.size < 10 * 1024 * 1024  // Limite 10MB
        && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/.*');
    }
    
    // Dossier des corrections
    match /corrections/{fileName} {
      // Lecture pour tous les utilisateurs authentifiés
      // (La vérification d'accès se fait côté application)
      allow read: if request.auth != null;
      
      // Upload uniquement pour les admins
      allow write: if isAdmin() 
        && request.resource.size < 10 * 1024 * 1024  // Limite 10MB
        && request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/.*');
    }
    
    // Bloquer tout le reste
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🚀 Comment Appliquer les Règles

### Pour Firestore :

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet `mspc-site`
3. Dans le menu de gauche, cliquez sur **Firestore Database**
4. Allez dans l'onglet **Rules**
5. Copiez-collez les règles que vous voulez utiliser
6. Cliquez sur **Publish**

### Pour Storage :

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet `mspc-site`
3. Dans le menu de gauche, cliquez sur **Storage**
4. Allez dans l'onglet **Rules**
5. Copiez-collez les règles que vous voulez utiliser
6. Cliquez sur **Publish**

---

## ⚠️ Recommandations Importantes

1. **En développement** : Utilisez les règles "Test Mode" pour tester rapidement
2. **En production** : Utilisez les règles "Production" pour sécuriser votre application
3. **Testez toujours** : Après avoir changé les règles, testez que tout fonctionne
4. **Limites de taille** : Les règles Storage limitent les fichiers à 10MB (vous pouvez ajuster)
5. **Types de fichiers** : Les règles limitent aux PDF, DOC, DOCX, TXT (vous pouvez ajouter d'autres types)

---

## 🔍 Vérification des Règles

Après avoir publié les règles, vous pouvez les tester dans la console Firebase :
- Firestore : Onglet **Rules** > **Rules Playground**
- Storage : Onglet **Rules** > **Rules Playground**

---

## 📝 Notes

- Les règles Firestore vérifient `request.auth != null` pour s'assurer que l'utilisateur est connecté
- Les règles Storage vérifient aussi la taille et le type de fichier
- Les étudiants ne sont pas authentifiés dans votre système actuel, donc seuls les profs peuvent accéder
- Si vous voulez permettre aux étudiants de se connecter, vous devrez adapter les règles

