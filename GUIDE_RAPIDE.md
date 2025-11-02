# ⚡ Guide Rapide - Configuration Finale

## ✅ 3 ÉTAPES SIMPLES

### 1️⃣ Exécuter le script SQL (2 minutes)

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Ouvrez le fichier **`SETUP_SQL_FINAL.sql`** dans votre projet
3. **Copiez tout le contenu**
4. **Collez dans SQL Editor**
5. Cliquez sur **RUN** ou appuyez sur **F5**
6. Vous devriez voir : **"Success. No rows returned"**

✅ **Vérification** : Allez dans **Table Editor** → Vous devriez voir 3 tables :
- `resources`
- `correction_access_requests`
- `correction_accesses`

### 2️⃣ Vérifier le fichier .env.local (1 minute)

Ouvrez `.env.local` et vérifiez qu'il contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

✅ Si le fichier n'existe pas ou est incorrect, créez-le et remplissez-le.

### 3️⃣ Redémarrer le serveur

```bash
npm run dev
```

---

## 🎯 Test Final

1. Allez sur http://localhost:3000/admin
2. Cliquez sur "Ajouter une ressource"
3. Remplissez le formulaire :
   - Chapitre : (choisissez un)
   - Type : TP
   - Titre : Test
   - Description : Test
   - Choisissez un fichier PDF
4. Cliquez sur "Ajouter la ressource"

✅ **Si ça fonctionne** : Vous verrez un message de succès !

❌ **Si ça ne fonctionne pas** : Ouvrez la console (F12) et envoyez-moi les erreurs en rouge.

---

## 🔧 Solutions aux problèmes courants

### Erreur "new row violates row-level security policy"
→ Le script SQL n'a pas été exécuté correctement. Réexécutez `SETUP_SQL_FINAL.sql`.

### Erreur "relation does not exist"
→ Les tables n'existent pas. Exécutez `SETUP_SQL_FINAL.sql`.

### Erreur "bucket not found"
→ Le bucket n'existe pas. Le script SQL devrait le créer automatiquement. Si ça ne marche pas, créez-le manuellement :
1. Storage → New bucket
2. Nom : `files`
3. Cocher "Public bucket"
4. Create

### Erreur "storage policy violation"
→ Les politiques du bucket ne sont pas configurées. Réexécutez `SETUP_SQL_FINAL.sql` (il les configure automatiquement).

---

## 📝 Checklist finale

- [ ] Script SQL exécuté avec succès
- [ ] 3 tables visibles dans Table Editor
- [ ] Bucket `files` visible dans Storage
- [ ] Fichier `.env.local` correctement configuré
- [ ] Serveur redémarré
- [ ] Test d'ajout de ressource fonctionne

**Une fois tout coché, votre application est 100% fonctionnelle ! 🚀**

