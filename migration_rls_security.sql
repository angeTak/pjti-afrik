-- ============================================================
-- MIGRATION SÉCURITÉ — Politiques RLS restrictives
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- Date : Mai 2026
-- Remplace les politiques "Enable all" ouvertes à tous.
-- ============================================================


-- ── REGISTRATIONS ─────────────────────────────────────────
-- Anonymes : INSERT uniquement (formulaire de pré-inscription public)
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for registrations" ON registrations;
CREATE POLICY "Anon can insert registrations" ON registrations
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access registrations" ON registrations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── SETTINGS ──────────────────────────────────────────────
-- Anonymes : lecture seule (affichage des paramètres publics)
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for settings" ON settings;
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access settings" ON settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── NEWS ──────────────────────────────────────────────────
-- Anonymes : lecture seule
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for news" ON news;
CREATE POLICY "Public can read news" ON news
  FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access news" ON news
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── PARTNERS ──────────────────────────────────────────────
-- Anonymes : lecture seule
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for partners" ON partners;
CREATE POLICY "Public can read partners" ON partners
  FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── EXPERTS ───────────────────────────────────────────────
-- Anonymes : lecture seule (experts publiés)
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for experts" ON experts;
CREATE POLICY "Public can read experts" ON experts
  FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access experts" ON experts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── GALLERY ───────────────────────────────────────────────
-- Anonymes : lecture seule
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for gallery" ON gallery;
CREATE POLICY "Public can read gallery" ON gallery
  FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access gallery" ON gallery
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── TEAMS ─────────────────────────────────────────────────
-- Anonymes : lecture seule des équipes publiées
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for teams" ON teams;
CREATE POLICY "Public can read published teams" ON teams
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Admin full access teams" ON teams
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── PARTNERSHIP_REQUESTS ───────────────────────────────────
-- Anonymes : INSERT uniquement (formulaire de demande de partenariat)
-- Admin authentifié : accès complet
DROP POLICY IF EXISTS "Enable all for partnership_requests" ON partnership_requests;
CREATE POLICY "Anon can insert partnership requests" ON partnership_requests
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin full access partnership_requests" ON partnership_requests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── PAGE_VIEWS ────────────────────────────────────────────
-- Anonymes : INSERT uniquement (tracking des visites)
-- Admin authentifié : lecture seule pour les analytics
DROP POLICY IF EXISTS "Enable all for page_views" ON page_views;
CREATE POLICY "Anon can insert page views" ON page_views
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can read page views" ON page_views
  FOR SELECT TO authenticated USING (true);
