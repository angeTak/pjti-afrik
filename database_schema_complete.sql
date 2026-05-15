-- ============================================================
-- SCHÉMA COMPLET - PJTI-AFRIK
-- Dernière mise à jour : Mai 2025
-- ⚠️  ATTENTION : Ce script supprime et recrée toutes les tables
-- ============================================================


-- ============================================================
-- 1. SUPPRESSION PROPRE (Ordre respectant les dépendances)
-- ============================================================
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS partnership_requests;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS settings;


-- ============================================================
-- 2. TABLE DES PARAMÈTRES GLOBAUX
-- ============================================================
CREATE TABLE settings (
  id text PRIMARY KEY DEFAULT 'main',
  program_price text,
  participants_count text,
  partners_count text,
  duration_weeks text,
  age_range text,
  registration_deadline text,
  vote_start_date timestamp with time zone,
  vote_end_date timestamp with time zone
);

-- Initialisation des paramètres par défaut
INSERT INTO settings (id, program_price, participants_count, partners_count, duration_weeks, age_range, registration_deadline)
VALUES ('main', '50 000', '100', '8', '5', '11-18', '15 Juin 2025');


-- ============================================================
-- 3. TABLE DES INSCRIPTIONS
-- ============================================================
CREATE TABLE registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  parent_name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  child_name text NOT NULL,
  age_group text NOT NULL,
  school_level text NOT NULL,
  has_computer text,
  how_found text,
  payment_method text,
  payment_schedule text,
  status text DEFAULT 'new',        -- 'new', 'contacted', 'registered', 'cancelled'
  is_manual boolean DEFAULT false,
  photo_url text,
  amount_paid integer DEFAULT 0,
  payment_method_actual text,
  installments_paid integer DEFAULT 0
);


-- ============================================================
-- 4. TABLE DES ÉQUIPES (avec logo et catégorie)
-- ============================================================
CREATE TABLE teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  project_title text,
  description text,
  captain_id uuid REFERENCES registrations(id) ON DELETE SET NULL,
  member_ids uuid[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  total_points integer DEFAULT 0,
  vote_start_date timestamp with time zone,
  vote_end_date timestamp with time zone,
  logo_url text,                    -- URL du logo de l'équipe
  category text                     -- Catégorie du projet (ex: IA, Cybersécurité...)
);


-- ============================================================
-- 5. TABLE DES DEMANDES DE PARTENARIAT
-- ============================================================
CREATE TABLE partnership_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  organization_name text NOT NULL,
  sector text NOT NULL,
  email text NOT NULL,
  phone text,
  partnership_type text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new'         -- 'new', 'contacted', 'accepted', 'rejected'
);


-- ============================================================
-- 6. TABLE DES PARTENAIRES (affichage public)
-- ============================================================
CREATE TABLE partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  initials text,
  description text,
  category text,
  logo text,
  color text DEFAULT 'bg-slate-900',
  text_color text DEFAULT 'text-slate-900',
  badge_bg text DEFAULT 'bg-slate-50',
  border_color text DEFAULT 'border-slate-100'
);


-- ============================================================
-- 7. TABLE DES ACTUALITÉS (avec 2 images)
-- ============================================================
CREATE TABLE news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  date text,
  category text,
  image text,                       -- Image principale (en-tête)
  image2 text,                      -- 2e image optionnelle (affichée au milieu de l'article)
  excerpt text,
  paragraph text
);


-- ============================================================
-- 8. TABLE DE LA GALERIE
-- ============================================================
CREATE TABLE gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  url text NOT NULL
);


-- ============================================================
-- 9. ACTIVATION DU ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 10. POLITIQUES D'ACCÈS (ouverture totale)
-- ============================================================
CREATE POLICY "Enable all for registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for partners" ON partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for partnership_requests" ON partnership_requests FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- 11. POLITIQUES DE STOCKAGE (Bucket: pjti-storage)
-- Note: À appliquer dans l'interface Supabase > Storage > Policies
-- ============================================================
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'pjti-storage' );
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'pjti-storage' );
-- CREATE POLICY "Public Update/Delete" ON storage.objects FOR ALL USING ( bucket_id = 'pjti-storage' );


-- ============================================================
-- 12. MIGRATIONS — À exécuter sur une BASE EXISTANTE
--     (Ne pas exécuter si vous utilisez le schéma complet ci-dessus)
-- ============================================================

-- Ajout du logo et de la catégorie aux équipes
-- ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url text;
-- ALTER TABLE teams ADD COLUMN IF NOT EXISTS category text;

-- Ajout de la 2e image aux articles
-- ALTER TABLE news ADD COLUMN IF NOT EXISTS image2 text;

-- Ajout des dates de vote globales aux paramètres
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS vote_start_date timestamp with time zone;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS vote_end_date timestamp with time zone;
