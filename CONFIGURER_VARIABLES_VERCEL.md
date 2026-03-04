# ⚙️ Configurer les Variables d'Environnement sur Vercel

## 🔴 Problème : "Configuration Firebase manquante"

Les erreurs dans la console indiquent que **les variables d'environnement Firebase ne sont pas configurées sur Vercel**.

---

## ✅ Solution : Ajouter les Variables dans Vercel

### Étape 1 : Aller dans Vercel

1. **Allez sur** https://vercel.com
2. **Connectez-vous**
3. **Ouvrez votre projet** (MSPC)

### Étape 2 : Ouvrir les Settings

1. **Cliquez sur** "Settings" (en haut de la page)
2. **Cliquez sur** "Environment Variables" (dans le menu de gauche)

### Étape 3 : Ajouter les 6 Variables Firebase

Vous devez ajouter **exactement ces 6 variables** une par une :

#### Variable 1 : API Key
- **Nom** : `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Valeur** : `AIzaSyANfzbITfAw6p2B6RfqTSK6jzRWLu3SiOk`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 : Auth Domain
- **Nom** : `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Valeur** : `mspc-site.firebaseapp.com`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 3 : Project ID
- **Nom** : `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Valeur** : `mspc-site`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 4 : Storage Bucket
- **Nom** : `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Valeur** : `mspc-site.firebasestorage.app`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 5 : Messaging Sender ID
- **Nom** : `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Valeur** : `297863715548`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 6 : App ID
- **Nom** : `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Valeur** : `1:297863715548:web:e25cd46e7d2edbb65e3219`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development

### Étape 4 : Pour Chaque Variable

1. **Cliquez sur** "Add New"
2. **Copiez-collez** le nom exact (avec `NEXT_PUBLIC_` au début)
3. **Copiez-collez** la valeur correspondante
4. **Cochez** les 3 environnements (Production, Preview, Development)
5. **Cliquez sur** "Save"
6. **Répétez** pour les 5 autres variables

---

## 🔄 Redéployer Après Configuration

**IMPORTANT** : Après avoir ajouté toutes les variables, vous **DEVEZ redéployer** :

1. **Allez dans** l'onglet "Deployments"
2. **Cliquez sur** les 3 points (...) du dernier déploiement
3. **Cliquez sur** "Redeploy"
4. **Attendez** 2-3 minutes que le déploiement se termine

---

## ✅ Vérification

Après le redéploiement :

1. **Ouvrez votre site** sur l'URL Vercel
2. **Ouvrez la console** du navigateur (F12)
3. **Les warnings Firebase ne devraient plus apparaître**
4. **Testez la connexion** - ça devrait fonctionner maintenant !

---

## 🐛 Si ça ne fonctionne toujours pas

### Vérification 1 : Variables bien ajoutées
- Allez dans Settings > Environment Variables
- Vérifiez que les 6 variables sont bien là
- Vérifiez que les noms sont **exactement** corrects (avec `NEXT_PUBLIC_`)

### Vérification 2 : Valeurs correctes
- Vérifiez que les valeurs sont correctes (pas d'espaces avant/après)
- Comparez avec votre fichier `.env.local` local

### Vérification 3 : Redéploiement
- Assurez-vous d'avoir redéployé après avoir ajouté les variables
- Les variables ne sont pas prises en compte tant que vous n'avez pas redéployé

---

## 📝 Notes Importantes

- ⚠️ Les variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client
- ⚠️ Les valeurs ne doivent **pas** avoir d'espaces avant ou après
- ⚠️ Vous devez redéployer après avoir ajouté/modifié des variables
- ✅ Les variables sont sécurisées et ne sont pas visibles dans le code source

---

## 🎯 Checklist

- [ ] Les 6 variables Firebase sont dans Vercel > Settings > Environment Variables
- [ ] Chaque variable a les 3 environnements cochés (Production, Preview, Development)
- [ ] Les noms des variables sont exacts (avec `NEXT_PUBLIC_`)
- [ ] Les valeurs sont correctes (copiées depuis votre `.env.local`)
- [ ] Le projet a été redéployé après avoir ajouté les variables
- [ ] Les warnings Firebase ont disparu de la console
- [ ] La connexion fonctionne

