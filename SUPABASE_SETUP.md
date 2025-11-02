# Configuration Supabase

## Étape 1 : Créer un compte Supabase

1. Allez sur https://supabase.com
2. Créez un compte gratuit
3. Créez un nouveau projet

## Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans Settings > API
2. Copiez :
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Étape 3 : Configurer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

## Étape 4 : Créer les tables dans Supabase

Allez dans SQL Editor dans votre dashboard Supabase et exécutez :

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
```

## Étape 5 : Créer le bucket de stockage

1. Allez dans Storage dans votre dashboard Supabase
2. Créez un nouveau bucket nommé `files`
3. Activez "Public bucket" pour que les fichiers soient accessibles

## Étape 6 : Configurer les politiques RLS (Row Level Security)

Dans SQL Editor, exécutez :

```sql
-- Activer RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les ressources
CREATE POLICY "Resources are viewable by everyone"
  ON resources FOR SELECT
  USING (true);

-- Politique : Seuls les admins peuvent modifier les ressources
-- (Vous devrez créer une table users ou utiliser Supabase Auth)
CREATE POLICY "Resources are insertable by authenticated users"
  ON resources FOR INSERT
  WITH CHECK (true); -- À modifier selon votre système d'auth

CREATE POLICY "Resources are updatable by authenticated users"
  ON resources FOR UPDATE
  USING (true); -- À modifier selon votre système d'auth

CREATE POLICY "Resources are deletable by authenticated users"
  ON resources FOR DELETE
  USING (true); -- À modifier selon votre système d'auth

-- Politique pour les demandes d'accès
CREATE POLICY "Access requests are viewable by everyone"
  ON correction_access_requests FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create access requests"
  ON correction_access_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update access requests"
  ON correction_access_requests FOR UPDATE
  USING (true); -- À modifier selon votre système d'auth

-- Politique pour les accès
CREATE POLICY "Accesses are viewable by everyone"
  ON correction_accesses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create accesses"
  ON correction_accesses FOR INSERT
  WITH CHECK (true);
```

## Notes importantes

- Pour un système de production, configurez correctement l'authentification avec Supabase Auth
- Les politiques RLS ci-dessus sont permissives pour la démo, sécurisez-les pour la production
- Le stockage de fichiers utilise le bucket `files`, assurez-vous qu'il existe

