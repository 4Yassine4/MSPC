-- ============================================
-- SCRIPT FINAL - VERSION PRODUCTION
-- Configuration complète avec RLS activé
-- ============================================

-- 1. Créer les tables
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
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

CREATE TABLE IF NOT EXISTS correction_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS correction_accesses (
  id BIGSERIAL PRIMARY KEY,
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_email)
);

-- 2. Créer les index pour les performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_resources_chapitre ON resources(chapitre);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON correction_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_student ON correction_access_requests(student_email);
CREATE INDEX IF NOT EXISTS idx_accesses_student ON correction_accesses(student_email);

-- 3. Activer Row Level Security
-- ============================================
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses ENABLE ROW LEVEL SECURITY;

-- 4. Supprimer toutes les politiques existantes (nettoyage)
-- ============================================
DROP POLICY IF EXISTS "Allow all operations on resources" ON resources;
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are insertable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are updatable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are deletable by everyone" ON resources;
DROP POLICY IF EXISTS "policy_resources_all" ON resources;

DROP POLICY IF EXISTS "Allow all operations on requests" ON correction_access_requests;
DROP POLICY IF EXISTS "Access requests are viewable by everyone" ON correction_access_requests;
DROP POLICY IF EXISTS "Anyone can create access requests" ON correction_access_requests;
DROP POLICY IF EXISTS "Anyone can update access requests" ON correction_access_requests;
DROP POLICY IF EXISTS "policy_requests_all" ON correction_access_requests;

DROP POLICY IF EXISTS "Allow all operations on accesses" ON correction_accesses;
DROP POLICY IF EXISTS "Accesses are viewable by everyone" ON correction_accesses;
DROP POLICY IF EXISTS "Anyone can create accesses" ON correction_accesses;
DROP POLICY IF EXISTS "policy_accesses_all" ON correction_accesses;

-- 5. Créer les politiques complètes pour TOUTES les opérations
-- ============================================

-- Pour resources : permettre SELECT, INSERT, UPDATE, DELETE à tout le monde
CREATE POLICY "policy_resources_select" ON resources
  FOR SELECT USING (true);

CREATE POLICY "policy_resources_insert" ON resources
  FOR INSERT WITH CHECK (true);

CREATE POLICY "policy_resources_update" ON resources
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "policy_resources_delete" ON resources
  FOR DELETE USING (true);

-- Pour correction_access_requests : permettre SELECT, INSERT, UPDATE à tout le monde
CREATE POLICY "policy_requests_select" ON correction_access_requests
  FOR SELECT USING (true);

CREATE POLICY "policy_requests_insert" ON correction_access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "policy_requests_update" ON correction_access_requests
  FOR UPDATE USING (true) WITH CHECK (true);

-- Pour correction_accesses : permettre SELECT, INSERT à tout le monde
CREATE POLICY "policy_accesses_select" ON correction_accesses
  FOR SELECT USING (true);

CREATE POLICY "policy_accesses_insert" ON correction_accesses
  FOR INSERT WITH CHECK (true);

-- 6. Créer le bucket Storage et ses politiques
-- ============================================
-- Créer le bucket 'files' s'il n'existe pas (ignore l'erreur si déjà existant)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('files', 'files', true, 52428800, NULL);
EXCEPTION
  WHEN unique_violation THEN
    -- Le bucket existe déjà, on met juste à jour pour qu'il soit public
    UPDATE storage.buckets SET public = true WHERE id = 'files';
END $$;

-- Supprimer les politiques existantes pour le bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "policy_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "policy_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "policy_storage_delete" ON storage.objects;

-- Politique pour la lecture (SELECT)
CREATE POLICY "policy_storage_select" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'files');

-- Politique pour l'upload (INSERT)
CREATE POLICY "policy_storage_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'files');

-- Politique pour la mise à jour (UPDATE)
CREATE POLICY "policy_storage_update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'files')
  WITH CHECK (bucket_id = 'files');

-- Politique pour la suppression (DELETE)
CREATE POLICY "policy_storage_delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'files');

-- ============================================
-- FIN DU SCRIPT
-- ============================================
-- ✅ TOUT EST CONFIGURÉ !
-- 
-- Vérifications :
-- 1. Table Editor → vous devriez voir 3 tables (resources, correction_access_requests, correction_accesses)
-- 2. Storage → vous devriez voir le bucket 'files' (Public)
-- 3. Testez l'ajout d'une ressource dans l'admin → ça devrait fonctionner !
-- ============================================

