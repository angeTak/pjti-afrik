-- 1. Suppression propre (Ordre respectant les dépendances)
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS partnership_requests;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS settings;

-- 2. Table des paramètres (AVEC DATES DE VOTE)
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

-- 3. Initialisation des paramètres
INSERT INTO settings (id, program_price, participants_count, partners_count, duration_weeks, age_range, registration_deadline)
VALUES ('main', '50 000', '100', '8', '5', '11-18', '15 Juin 2025');

-- 4. Table des inscriptions (AVEC PHOTOS ET STATUT MANUEL)
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
  status text DEFAULT 'new',
  is_manual boolean DEFAULT false, 
  photo_url text,                  
  amount_paid integer DEFAULT 0,
  payment_method_actual text,
  installments_paid integer DEFAULT 0
);

-- 5. Table des équipes (AVEC TITRE DE PROJET, LOGO ET CATÉGORIE)
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
  logo_url text,
  category text
);

-- 6. Table des demandes de partenariat (CORRIGÉE POUR LE CODE)
CREATE TABLE partnership_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  organization_name text NOT NULL,
  sector text NOT NULL,
  email text NOT NULL,
  phone text,
  partnership_type text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' -- 'new', 'contacted', 'accepted', 'rejected'
);

-- 7. Table des partenaires (Affichage public)
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

-- 8. Table des actualités
CREATE TABLE news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  date text,
  category text,
  image text,
  excerpt text,
  paragraph text
);

-- 9. Table Galerie
CREATE TABLE gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  url text NOT NULL
);

-- 10. Activation RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;

-- 11. Politiques d'accès (Ouverture totale pour cette configuration)
CREATE POLICY "Enable all for registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for partners" ON partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for partnership_requests" ON partnership_requests FOR ALL USING (true) WITH CHECK (true);

-- 12. Politiques pour le stockage (Bucket pjti-storage)
-- Note: Ces politiques doivent être appliquées sur la table storage.objects de Supabase
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'pjti-storage' );
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'pjti-storage' );
-- CREATE POLICY "Public Update/Delete" ON storage.objects FOR ALL USING ( bucket_id = 'pjti-storage' );
