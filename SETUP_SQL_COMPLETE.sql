-- ============================================
-- SCRIPT COMPLET DE CONFIGURATION SUPABASE
-- Pour mspc-site
-- ============================================
-- Copiez-collez TOUT ce script dans SQL Editor de Supabase
-- et cliquez sur RUN
-- ============================================

-- 1. Créer les tables
-- ============================================

-- Table des ressources
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

-- Table des demandes d'accès aux corrections
CREATE TABLE IF NOT EXISTS correction_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des accès aux corrections
CREATE TABLE IF NOT EXISTS correction_accesses (
  id BIGSERIAL PRIMARY KEY,
  exercise_id BIGINT NOT NULL,
  student_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exercise_id, student_email)
);

-- 2. Créer les index pour améliorer les performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_resources_chapitre ON resources(chapitre);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON correction_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_student ON correction_access_requests(student_email);
CREATE INDEX IF NOT EXISTS idx_accesses_student ON correction_accesses(student_email);

-- 3. Activer Row Level Security (RLS)
-- ============================================
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques de sécurité (RLS)
-- ============================================

-- DÉSACTIVER RLS temporairement pour permettre toutes les opérations
-- (Pour la production, réactivez RLS avec des politiques appropriées)

-- Désactiver RLS pour permettre l'accès sans authentification
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses DISABLE ROW LEVEL SECURITY;

-- OU si vous voulez garder RLS activé, créez ces politiques :

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are insertable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are updatable by everyone" ON resources;
DROP POLICY IF EXISTS "Resources are deletable by everyone" ON resources;

DROP POLICY IF EXISTS "Access requests are viewable by everyone" ON correction_access_requests;
DROP POLICY IF EXISTS "Anyone can create access requests" ON correction_access_requests;
DROP POLICY IF EXISTS "Anyone can update access requests" ON correction_access_requests;

DROP POLICY IF EXISTS "Accesses are viewable by everyone" ON correction_accesses;
DROP POLICY IF EXISTS "Anyone can create accesses" ON correction_accesses;

-- Si vous préférez garder RLS activé (recommentez la ligne ALTER TABLE DISABLE ci-dessus)
-- et décommentez ces politiques :
/*
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
*/

-- ============================================
-- FIN DU SCRIPT
-- ============================================
-- Vérification :
-- 1. Allez dans Table Editor pour voir les 3 tables créées
-- 2. Allez dans Storage pour créer le bucket 'files'
-- ============================================

