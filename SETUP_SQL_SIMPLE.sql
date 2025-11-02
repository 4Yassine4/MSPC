-- ============================================
-- SCRIPT SIMPLIFIÉ - DÉSACTIVE RLS
-- Pour mspc-site - Version simple sans sécurité stricte
-- ============================================

-- 1. Créer les tables
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

-- 2. Créer les index
CREATE INDEX IF NOT EXISTS idx_resources_chapitre ON resources(chapitre);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON correction_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_student ON correction_access_requests(student_email);
CREATE INDEX IF NOT EXISTS idx_accesses_student ON correction_accesses(student_email);

-- 3. DÉSACTIVER RLS pour permettre l'accès libre (pour la démo)
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE correction_access_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE correction_accesses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- FIN - Les tables sont maintenant accessibles
-- ============================================

