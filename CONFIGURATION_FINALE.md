# 🎯 Configuration Finale - Version Production

## 📋 Instructions étape par étape

### ÉTAPE 1 : Exécuter le script SQL (3 minutes)

1. **Allez dans Supabase** : https://supabase.com/dashboard/project/qspwrlcwjywhtfidkolu
2. **Cliquez sur SQL Editor** (icône `</>` dans le menu de gauche)
3. **Cliquez sur "New query"**
4. **Ouvrez le fichier `SETUP_SQL_FINAL.sql`** dans votre projet
5. **Copiez TOUT le contenu**
6. **Collez dans l'éditeur SQL de Supabase**
7. **Cliquez sur RUN** (ou F5)

Vous devriez voir : "Success. No rows returned"

### ÉTAPE 2 : Vérifier les tables (1 minute)

1. Dans Supabase, **cliquez sur Table Editor** (icône de table dans le menu)
2. Vous devriez voir 3 tables :
   - ✅ `resources`
   - ✅ `correction_access_requests`
   - ✅ `correction_accesses`

### ÉTAPE 3 : Créer le bucket Storage (2 minutes)

1. **Cliquez sur Storage** (icône de dossier dans le menu)
2. **Cliquez sur "New bucket"**
3. **Nom** : `files` (exactement ce nom, sans espaces)
4. **IMPORTANT** : Cochez la case **"Public bucket"**
5. **Cliquez sur "Create bucket"**

### ÉTAPE 4 : Les politiques du bucket sont déjà créées ! ✅

Le script SQL `SETUP_SQL_FINAL.sql` crée automatiquement :
- ✅ Le bucket `files` (public)
- ✅ Les politiques pour lire, uploader et supprimer des fichiers

**Rien à faire ici !** Le script s'en occupe automatiquement.

### ÉTAPE 5 : Redémarrer le serveur

```bash
npm run dev
```

### ÉTAPE 6 : Tester

1. Allez sur http://localhost:3000/admin
2. Cliquez sur "Ajouter une ressource"
3. Remplissez le formulaire
4. Sélectionnez un fichier
5. Cliquez sur "Ajouter la ressource"

**Ça devrait fonctionner maintenant !** 🎉

---

## 🔍 Si ça ne fonctionne toujours pas

### Vérifier la console du navigateur

1. Ouvrez la console (F12)
2. Regardez les erreurs en rouge
3. Envoyez-moi les messages d'erreur

### Vérifier dans Supabase

1. **Table Editor** → `resources` : les ressources apparaissent-elles ?
2. **Storage** → `files` : les fichiers sont-ils uploadés ?
3. **SQL Editor** : exécutez `SELECT * FROM resources;` → Y a-t-il des données ?

---

## 📝 Checklist finale

- [ ] Fichier `.env.local` créé avec les bonnes clés
- [ ] Script SQL exécuté avec succès
- [ ] 3 tables visibles dans Table Editor
- [ ] Bucket `files` créé et PUBLIC
- [ ] Politiques du bucket configurées (ou SQL exécuté)
- [ ] Serveur redémarré
- [ ] Test d'ajout de ressource fonctionne

---

Une fois tout ça fait, votre application sera **100% fonctionnelle** avec Supabase ! 🚀

