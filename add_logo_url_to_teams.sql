-- SQL pour ajouter la colonne logo_url à la table teams
-- Copiez et collez ceci dans l'éditeur SQL de votre Dashboard Supabase

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS category TEXT;
