-- Exécutez ceci dans l'éditeur SQL de votre Dashboard Supabase

CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    captain_id TEXT,
    member_ids TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    vote_start_date TIMESTAMP WITH TIME ZONE,
    vote_end_date TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for public" ON public.teams FOR ALL USING (true);
