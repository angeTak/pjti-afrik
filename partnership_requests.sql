-- Exécutez ceci dans l'éditeur SQL de votre Dashboard Supabase

CREATE TABLE public.partnership_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    organization_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    partnership_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'::text NOT NULL
);

-- Autoriser l'insertion pour tout le monde (anonyme)
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anonymous users" ON public.partnership_requests
    FOR INSERT WITH CHECK (true);

-- Si vous avez des politiques de sélection/mise à jour, ajoutez-les pour l'admin
-- Par exemple, une politique simple pour tout autoriser en attendant un RLS strict:
CREATE POLICY "Enable all for public" ON public.partnership_requests
    FOR ALL USING (true);
