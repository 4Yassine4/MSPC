# 🚀 Guide de démarrage rapide

## 📋 Vue d'ensemble

Vous avez deux options :
- **Option A : Utiliser localStorage (sans configuration)** - Fonctionne immédiatement, données locales
- **Option B : Utiliser Supabase (recommandé)** - Données persistantes, stockage de fichiers réel

---

## 🎯 Option A : Mode localStorage (Démo - Déjà fonctionnel !)

✅ **C'est déjà configuré et fonctionnel !**

1. Lancez simplement le serveur :
```bash
npm run dev
```

2. Accédez à http://localhost:3000

**Avantages :**
- ✅ Fonctionne immédiatement
- ✅ Pas de configuration nécessaire
- ✅ Parfait pour tester

**Inconvénients :**
- ⚠️ Les données sont dans le navigateur uniquement
- ⚠️ Les fichiers ne sont pas réellement stockés
- ⚠️ Les données peuvent être perdues si le navigateur est nettoyé

---

## 🔧 Option B : Configurer Supabase (Production)

### Étape 1 : Créer un compte Supabase (5 minutes)

1. **Aller sur** https://supabase.com
2. **Cliquer sur** "Start your project" ou "Sign up"
3. **Créer un compte** (gratuit avec GitHub/Google/Email)
4. **Créer un nouveau projet** :
   - Nom du projet : `mspc-site` (ou ce que vous voulez)
   - Base de données : choisir un mot de passe fort
   - Région : choisissez la plus proche (Europe par exemple)
   - Cliquez sur "Create new project"
   - ⏳ Attendez 2-3 minutes que le projet soit créé

### Étape 2 : Récupérer les clés API (2 minutes)

1. Dans votre projet Supabase, cliquez sur **⚙️ Settings** (en bas à gauche)
2. Cliquez sur **API** dans le menu
3. Vous verrez deux informations importantes :
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon public** key (une longue chaîne de caractères)

### Étape 3 : Créer le fichier .env.local (1 minute)

1. À la racine de votre projet (`mspc-site`), créez un fichier nommé `.env.local`
2. Copiez-collez ce contenu (remplacez par vos vraies valeurs) :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

**Exemple réel :**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODU2NzgyMCwiZXhwIjoxOTU0MTQzODIwfQ.exemple123456789
```

3. **Sauvegardez** le fichier

### Étape 4 : Créer les tables dans Supabase (3 minutes)

1. Dans votre dashboard Supabase, cliquez sur **SQL Editor** (icône de code dans le menu de gauche)
2. Cliquez sur **New query**
3. Copiez-collez ce code SQL :

```sql
-- Table des ressources
CREATE TABLE resources (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  correction_name TEXT,
  correction_url TEXT,
  chapitre TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TP', 'Synthèse', 'Exercice', 'Ressource', 'Correction')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Table des demandes d'accès aux corrections
CREATE TABLE correction_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des accès aux corrections
CREATE TABLE correction_accesses (
  id BIGSERIAL PRIMARY KEY,
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_email)
);

-- Index pour améliorer les performances
CREATE INDEX idx_resources_chapitre ON resources(chapitre);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_access_requests_status ON correction_access_requests(status);
CREATE INDEX idx_access_requests_student ON correction_access_requests(student_email);
CREATE INDEX idx_accesses_student ON correction_accesses(student_email);

-- Activer RLS (Row Level Security)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (permissives pour la démo)
CREATE POLICY "Resources are viewable by everyone"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Resources are insertable by everyone"
  ON resources FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Resources are updatable by everyone"
  ON resources FOR UPDATE
  USING (true);

CREATE POLICY "Resources are deletable by everyone"
  ON resources FOR DELETE
  USING (true);

CREATE POLICY "Access requests are viewable by everyone"
  ON correction_access_requests FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create access requests"
  ON correction_access_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update access requests"
  ON correction_access_requests FOR UPDATE
  USING (true);

CREATE POLICY "Accesses are viewable by everyone"
  ON correction_accesses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create accesses"
  ON correction_accesses FOR INSERT
  WITH CHECK (true);
```

4. Cliquez sur **RUN** (ou F5)
5. Vous devriez voir "Success. No rows returned"

### Étape 5 : Créer le bucket de stockage (2 minutes)

1. Dans votre dashboard Supabase, cliquez sur **Storage** (icône de dossier dans le menu)
2. Cliquez sur **New bucket**
3. Nom : `files`
4. Cochez **Public bucket** (important !)
5. Cliquez sur **Create bucket**

### Étape 6 : Redémarrer le serveur (1 minute)

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Redémarrez :
```bash
npm run dev
```

3. Accédez à http://localhost:3000

---

## ✅ Vérification que ça fonctionne

1. **Connectez-vous en admin** : `/login` → `prof@example.com` / `password`
2. **Ajoutez une ressource** : Allez dans l'admin, ajoutez un TP avec un fichier
3. **Vérifiez dans Supabase** :
   - Table Editor → `resources` : vous devriez voir votre ressource
   - Storage → `files` : vous devriez voir votre fichier uploadé

---

## 🐛 Problèmes fréquents

### "Les données ne se sauvegardent pas"
- ✅ Vérifiez que `.env.local` existe et contient les bonnes valeurs
- ✅ Redémarrez le serveur après avoir créé `.env.local`
- ✅ Vérifiez la console du navigateur (F12) pour les erreurs

### "Erreur lors de l'upload de fichier"
- ✅ Vérifiez que le bucket `files` existe dans Supabase Storage
- ✅ Vérifiez que le bucket est **Public**
- ✅ Vérifiez que les politiques RLS sont configurées

### "Les tables n'existent pas"
- ✅ Vérifiez dans SQL Editor que le SQL a bien été exécuté
- ✅ Allez dans Table Editor pour voir si les tables existent
- ✅ Si erreur, vérifiez que vous avez bien copié tout le SQL

### "Je veux revenir à localStorage"
- ✅ Supprimez ou renommez le fichier `.env.local`
- ✅ Redémarrez le serveur
- ✅ L'application utilisera automatiquement localStorage

---

## 📞 Besoin d'aide ?

- Consultez `SUPABASE_SETUP.md` pour plus de détails
- Vérifiez les erreurs dans la console du navigateur (F12)
- Vérifiez les logs du serveur dans le terminal

---

## 🎉 C'est tout !

Une fois configuré, votre application fonctionnera avec Supabase :
- ✅ Données persistantes dans la base de données
- ✅ Fichiers stockés dans Supabase Storage
- ✅ Synchronisation automatique
- ✅ Fonctionne même après déconnexion

