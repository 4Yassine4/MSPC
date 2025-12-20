# ⚙️ Vérifier les Variables d'Environnement sur Vercel

## 🔴 Problème : "Authentification disponible uniquement côté client"

Cette erreur apparaît quand **les variables d'environnement Firebase ne sont pas configurées** sur Vercel.

---

## ✅ Solution : Configurer les Variables dans Vercel

### Étape 1 : Aller dans les Settings Vercel

1. **Allez sur** https://vercel.com
2. **Connectez-vous**
3. **Ouvrez votre projet** (MSPC)
4. **Cliquez sur** "Settings" (en haut)
5. **Cliquez sur** "Environment Variables" (dans le menu de gauche)

### Étape 2 : Ajouter les 6 Variables Firebase

Vous devez ajouter **exactement ces 6 variables** avec les valeurs suivantes :

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyANfzbITfAw6p2B6RfqTSK6jzRWLu3SiOk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mspc-site.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mspc-site
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mspc-site.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=297863715548
NEXT_PUBLIC_FIREBASE_APP_ID=1:297863715548:web:e25cd46e7d2edbb65e3219
```

### Étape 3 : Pour Chaque Variable

1. **Cliquez sur** "Add New"
2. **Nom** : Copiez le nom exact (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. **Valeur** : Copiez la valeur correspondante
4. **Cochez** :
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. **Cliquez sur** "Save"

### Étape 4 : Répéter pour les 6 Variables

Faites cela pour **chaque variable** une par une.

---

## 🔄 Redéployer Après Configuration

Une fois toutes les variables ajoutées :

1. **Allez dans** l'onglet "Deployments"
2. **Cliquez sur** les 3 points (...) du dernier déploiement
3. **Cliquez sur** "Redeploy"
4. **Sélectionnez** "Use existing Build Cache" (optionnel)
5. **Cliquez sur** "Redeploy"

Attendez 2-3 minutes que le déploiement se termine.

---

## ✅ Vérification

Après le redéploiement :

1. **Ouvrez votre site** sur l'URL Vercel
2. **Allez sur** la page de login
3. **L'erreur ne devrait plus apparaître**
4. **Testez la connexion** avec vos identifiants

---

## 🐛 Si l'Erreur Persiste

### Vérification 1 : Console du Navigateur

1. **Ouvrez** les outils de développement (F12)
2. **Allez dans** l'onglet "Console"
3. **Cherchez** des erreurs ou warnings Firebase
4. Si vous voyez "Configuration Firebase manquante" → Les variables ne sont pas bien configurées

### Vérification 2 : Vérifier les Variables dans Vercel

1. **Settings** > **Environment Variables**
2. **Vérifiez** que les 6 variables sont bien là
3. **Vérifiez** que les valeurs sont correctes (sans espaces avant/après)
4. **Vérifiez** que Production, Preview, et Development sont cochés

### Vérification 3 : Logs de Build Vercel

1. **Deployments** > Cliquez sur le dernier déploiement
2. **Regardez** les logs de build
3. **Cherchez** des erreurs liées à Firebase ou aux variables d'environnement

---

## 📝 Notes Importantes

- ⚠️ Les variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client
- ⚠️ Les valeurs ne doivent **pas** avoir d'espaces avant ou après
- ⚠️ Après avoir ajouté/modifié des variables, vous **devez redéployer**
- ✅ Les variables sont sécurisées et ne sont pas visibles dans le code source

---

## 🎯 Checklist

- [ ] Les 6 variables Firebase sont dans Vercel
- [ ] Chaque variable a les 3 environnements cochés (Production, Preview, Development)
- [ ] Les valeurs sont correctes (copiées depuis votre `.env.local`)
- [ ] Le projet a été redéployé après avoir ajouté les variables
- [ ] Le site fonctionne sans l'erreur "Authentification disponible uniquement côté client"

