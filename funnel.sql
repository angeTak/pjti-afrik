-- ============================================================
-- TUNNEL DE VENTE "ANGELO" - PJTI-AFRIK
-- Tables : funnel_settings, formations, funnel_leads
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. CONFIGURATION GLOBALE DE LA PAGE TUNNEL (1 seule ligne)
--    Les blocs riches (listes) sont stockés en JSONB.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS funnel_settings (
  id text PRIMARY KEY DEFAULT 'main',
  brand text,                       -- ex: "ANGELO"
  hero_eyebrow text,                -- petite ligne au-dessus du titre
  hero_title text,                  -- gros titre du hero
  hero_highlight text,              -- partie du titre mise en or
  hero_subtitle text,               -- paragraphe descriptif
  hero_cta text,                    -- texte du bouton principal
  photo_url text,                   -- photo d'Angelo (hero)
  video_url text,                   -- lien vidéo (YouTube/Vimeo/MP4)
  video_thumb_url text,             -- vignette de la vidéo
  stats jsonb DEFAULT '[]'::jsonb,          -- badges flottants [{value,label}]
  pain_title text,
  pains jsonb DEFAULT '[]'::jsonb,          -- liste des difficultés (strings)
  audience_title text,
  audience jsonb DEFAULT '[]'::jsonb,       -- [{title, text}]
  results_title text,
  results jsonb DEFAULT '[]'::jsonb,        -- liste des résultats (strings)
  final_title text,
  final_subtitle text,
  final_cta text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

INSERT INTO funnel_settings (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 2. FORMATIONS / OFFRES (formation, coaching, accompagnement)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS formations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  type text DEFAULT 'formation',    -- 'formation' | 'coaching' | 'accompagnement'
  title text NOT NULL,
  category text,                    -- ex: "Programme Entrepreneur"
  tagline text,                     -- accroche courte
  description text,                 -- paragraphe de présentation
  image text,                       -- illustration
  price text,                       -- ex: "150 000"
  currency text DEFAULT 'FCFA',
  old_price text,                   -- prix barré (optionnel)
  duration text,                    -- ex: "3 jours intensifs"
  format text,                      -- ex: "Présentiel & en ligne"
  seats_total integer DEFAULT 0,    -- nb de places (0 = illimité)
  seats_taken integer DEFAULT 0,    -- places déjà réservées
  highlights jsonb DEFAULT '[]'::jsonb,   -- points forts (strings)
  audience jsonb DEFAULT '[]'::jsonb,     -- [{title, text}]
  program jsonb DEFAULT '[]'::jsonb,      -- [{day, title, items:[]}]
  bonus jsonb DEFAULT '[]'::jsonb,        -- bonus inclus (strings)
  is_published boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0
);

-- ------------------------------------------------------------
-- 3. LEADS : réservations de place + contacts collectés
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS funnel_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  city text,
  formation_id uuid REFERENCES formations(id) ON DELETE SET NULL,
  formation_title text,             -- copie du titre (au cas où la formation est supprimée)
  lead_type text DEFAULT 'reservation',  -- 'reservation' | 'contact' | 'coaching' | 'accompagnement'
  message text,
  status text DEFAULT 'new'         -- 'new' | 'contacted' | 'confirmed' | 'cancelled'
);

-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
--    Lecture publique (contenu), écriture réservée aux admins.
--    Les leads : insertion publique, lecture réservée aux admins.
-- ------------------------------------------------------------
ALTER TABLE funnel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_leads ENABLE ROW LEVEL SECURITY;

-- funnel_settings : lecture pour tous, écriture pour les connectés
DROP POLICY IF EXISTS "funnel_settings_read" ON funnel_settings;
CREATE POLICY "funnel_settings_read" ON funnel_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "funnel_settings_write" ON funnel_settings;
CREATE POLICY "funnel_settings_write" ON funnel_settings FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- formations : lecture pour tous, écriture pour les connectés
DROP POLICY IF EXISTS "formations_read" ON formations;
CREATE POLICY "formations_read" ON formations FOR SELECT USING (true);
DROP POLICY IF EXISTS "formations_write" ON formations;
CREATE POLICY "formations_write" ON formations FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- funnel_leads : n'importe quel visiteur peut réserver (INSERT),
-- mais seuls les admins connectés peuvent lire / modifier / supprimer.
DROP POLICY IF EXISTS "funnel_leads_insert" ON funnel_leads;
CREATE POLICY "funnel_leads_insert" ON funnel_leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "funnel_leads_read" ON funnel_leads;
CREATE POLICY "funnel_leads_read" ON funnel_leads FOR SELECT
  USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "funnel_leads_update" ON funnel_leads;
CREATE POLICY "funnel_leads_update" ON funnel_leads FOR UPDATE
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "funnel_leads_delete" ON funnel_leads;
CREATE POLICY "funnel_leads_delete" ON funnel_leads FOR DELETE
  USING (auth.role() = 'authenticated');
