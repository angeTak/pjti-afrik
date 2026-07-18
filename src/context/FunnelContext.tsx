import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import {
  Formation,
  FunnelSettings,
  FunnelLead,
  defaultFunnelSettings,
  defaultFormations,
} from '@/data/funnel';

interface FunnelContextType {
  funnelSettings: FunnelSettings;
  formations: Formation[];
  leads: FunnelLead[];
  isFunnelLoading: boolean;
  updateFunnelSettings: (settings: Partial<FunnelSettings>) => Promise<{ success: boolean; error?: string }>;
  addFormation: (formation: Omit<Formation, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateFormation: (id: string, formation: Partial<Formation>) => Promise<{ success: boolean; error?: string }>;
  deleteFormation: (id: string) => Promise<{ success: boolean; error?: string }>;
  submitLead: (lead: Omit<FunnelLead, 'id' | 'created_at' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateLeadStatus: (id: string, status: FunnelLead['status']) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  refreshLeads: () => Promise<void>;
}

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

// ---------- Mapping Supabase <-> App ----------
const mapFormation = (f: any): Formation => ({
  id: f.id,
  type: f.type || 'formation',
  title: f.title || '',
  category: f.category || '',
  tagline: f.tagline || '',
  description: f.description || '',
  image: f.image || '',
  price: f.price || '',
  currency: f.currency || 'FCFA',
  oldPrice: f.old_price || '',
  duration: f.duration || '',
  format: f.format || '',
  seatsTotal: f.seats_total ?? 0,
  seatsTaken: f.seats_taken ?? 0,
  highlights: f.highlights || [],
  audience: f.audience || [],
  program: f.program || [],
  bonus: f.bonus || [],
  isPublished: f.is_published !== false,
  isFeatured: !!f.is_featured,
  orderIndex: f.order_index ?? 0,
});

const toDbFormation = (f: Partial<Formation>) => {
  const db: any = {};
  if (f.type !== undefined) db.type = f.type;
  if (f.title !== undefined) db.title = f.title;
  if (f.category !== undefined) db.category = f.category;
  if (f.tagline !== undefined) db.tagline = f.tagline;
  if (f.description !== undefined) db.description = f.description;
  if (f.image !== undefined) db.image = f.image;
  if (f.price !== undefined) db.price = f.price;
  if (f.currency !== undefined) db.currency = f.currency;
  if (f.oldPrice !== undefined) db.old_price = f.oldPrice || null;
  if (f.duration !== undefined) db.duration = f.duration;
  if (f.format !== undefined) db.format = f.format;
  if (f.seatsTotal !== undefined) db.seats_total = f.seatsTotal;
  if (f.seatsTaken !== undefined) db.seats_taken = f.seatsTaken;
  if (f.highlights !== undefined) db.highlights = f.highlights;
  if (f.audience !== undefined) db.audience = f.audience;
  if (f.program !== undefined) db.program = f.program;
  if (f.bonus !== undefined) db.bonus = f.bonus;
  if (f.isPublished !== undefined) db.is_published = f.isPublished;
  if (f.isFeatured !== undefined) db.is_featured = f.isFeatured;
  if (f.orderIndex !== undefined) db.order_index = f.orderIndex;
  return db;
};

const mapSettings = (s: any): FunnelSettings => ({
  brand: s.brand ?? defaultFunnelSettings.brand,
  heroEyebrow: s.hero_eyebrow ?? defaultFunnelSettings.heroEyebrow,
  heroTitle: s.hero_title ?? defaultFunnelSettings.heroTitle,
  heroHighlight: s.hero_highlight ?? defaultFunnelSettings.heroHighlight,
  heroSubtitle: s.hero_subtitle ?? defaultFunnelSettings.heroSubtitle,
  heroCta: s.hero_cta ?? defaultFunnelSettings.heroCta,
  photoUrl: s.photo_url ?? defaultFunnelSettings.photoUrl,
  videoUrl: s.video_url ?? defaultFunnelSettings.videoUrl,
  videoThumbUrl: s.video_thumb_url ?? defaultFunnelSettings.videoThumbUrl,
  stats: (s.stats && s.stats.length) ? s.stats : defaultFunnelSettings.stats,
  painTitle: s.pain_title ?? defaultFunnelSettings.painTitle,
  pains: (s.pains && s.pains.length) ? s.pains : defaultFunnelSettings.pains,
  aboutTitle: s.about_title ?? defaultFunnelSettings.aboutTitle,
  aboutText: s.about_text ?? defaultFunnelSettings.aboutText,
  offerTitle: s.offer_title ?? defaultFunnelSettings.offerTitle,
  offerDeadline: s.offer_deadline ?? defaultFunnelSettings.offerDeadline,
  audienceTitle: s.audience_title ?? defaultFunnelSettings.audienceTitle,
  audience: (s.audience && s.audience.length) ? s.audience : defaultFunnelSettings.audience,
  resultsTitle: s.results_title ?? defaultFunnelSettings.resultsTitle,
  results: (s.results && s.results.length) ? s.results : defaultFunnelSettings.results,
  finalTitle: s.final_title ?? defaultFunnelSettings.finalTitle,
  finalSubtitle: s.final_subtitle ?? defaultFunnelSettings.finalSubtitle,
  finalCta: s.final_cta ?? defaultFunnelSettings.finalCta,
});

const toDbSettings = (s: FunnelSettings) => ({
  id: 'main',
  brand: s.brand,
  hero_eyebrow: s.heroEyebrow,
  hero_title: s.heroTitle,
  hero_highlight: s.heroHighlight,
  hero_subtitle: s.heroSubtitle,
  hero_cta: s.heroCta,
  photo_url: s.photoUrl,
  video_url: s.videoUrl,
  video_thumb_url: s.videoThumbUrl,
  stats: s.stats,
  pain_title: s.painTitle,
  pains: s.pains,
  about_title: s.aboutTitle,
  about_text: s.aboutText,
  offer_title: s.offerTitle,
  offer_deadline: s.offerDeadline || null,
  audience_title: s.audienceTitle,
  audience: s.audience,
  results_title: s.resultsTitle,
  results: s.results,
  final_title: s.finalTitle,
  final_subtitle: s.finalSubtitle,
  final_cta: s.finalCta,
  updated_at: new Date().toISOString(),
});

export const FunnelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAdmin();

  const [funnelSettings, setFunnelSettings] = useState<FunnelSettings>(defaultFunnelSettings);
  const [formations, setFormations] = useState<Formation[]>(defaultFormations);
  const [leads, setLeads] = useState<FunnelLead[]>([]);
  const [isFunnelLoading, setIsFunnelLoading] = useState(true);

  // Chargement du contenu public (settings + formations)
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: settingsData }, { data: formationsData, error: fErr }] = await Promise.all([
          supabase.from('funnel_settings').select('*').eq('id', 'main').maybeSingle(),
          supabase.from('formations').select('*').order('order_index', { ascending: true }),
        ]);

        if (settingsData) setFunnelSettings(mapSettings(settingsData));
        if (formationsData && !fErr && formationsData.length > 0) {
          setFormations(formationsData.map(mapFormation));
        }
      } catch (e) {
        // Tables non encore créées : on garde les données mock par défaut.
        console.warn('Tunnel : contenu Supabase indisponible, utilisation des données par défaut.', e);
      } finally {
        setIsFunnelLoading(false);
      }
    };
    load();
  }, []);

  // Chargement des leads (réservé aux admins connectés)
  const refreshLeads = useCallback(async () => {
    if (!isAuthenticated) {
      setLeads([]);
      return;
    }
    const { data, error } = await supabase
      .from('funnel_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setLeads(
        data.map((l: any) => ({
          id: l.id,
          created_at: l.created_at,
          name: l.name || '',
          email: l.email || '',
          phone: l.phone || '',
          city: l.city || '',
          formationId: l.formation_id || null,
          formationTitle: l.formation_title || '',
          leadType: l.lead_type || 'reservation',
          message: l.message || '',
          status: l.status || 'new',
        }))
      );
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading) refreshLeads();
  }, [isAuthLoading, refreshLeads]);

  const updateFunnelSettings = async (partial: Partial<FunnelSettings>) => {
    const merged = { ...funnelSettings, ...partial };
    setFunnelSettings(merged); // optimiste
    const { error } = await supabase.from('funnel_settings').upsert(toDbSettings(merged), { onConflict: 'id' });
    if (error) {
      console.error('Erreur MAJ funnel_settings:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const addFormation = async (formation: Omit<Formation, 'id'>) => {
    const { data, error } = await supabase.from('formations').insert([toDbFormation(formation)]).select().single();
    if (error) {
      console.error('Erreur ajout formation:', error);
      return { success: false, error: error.message };
    }
    if (data) setFormations((prev) => [...prev, mapFormation(data)].sort((a, b) => a.orderIndex - b.orderIndex));
    return { success: true };
  };

  const updateFormation = async (id: string, formation: Partial<Formation>) => {
    const { error } = await supabase.from('formations').update(toDbFormation(formation)).eq('id', id);
    if (error) {
      console.error('Erreur MAJ formation:', error);
      return { success: false, error: error.message };
    }
    setFormations((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...formation } : f)).sort((a, b) => a.orderIndex - b.orderIndex)
    );
    return { success: true };
  };

  const deleteFormation = async (id: string) => {
    const { error } = await supabase.from('formations').delete().eq('id', id);
    if (error) {
      console.error('Erreur suppression formation:', error);
      return { success: false, error: error.message };
    }
    setFormations((prev) => prev.filter((f) => f.id !== id));
    return { success: true };
  };

  const submitLead = async (lead: Omit<FunnelLead, 'id' | 'created_at' | 'status'>) => {
    const dbLead = {
      name: lead.name,
      email: lead.email || null,
      phone: lead.phone || null,
      city: lead.city || null,
      formation_id: lead.formationId || null,
      formation_title: lead.formationTitle || null,
      lead_type: lead.leadType || 'reservation',
      message: lead.message || null,
      status: 'new',
    };
    const { data, error } = await supabase.from('funnel_leads').insert([dbLead]).select().single();
    if (error) {
      console.error('Erreur enregistrement lead:', error);
      return { success: false, error: error.message };
    }

    // Incrémente le compteur de places réservées de la formation concernée (best-effort)
    if (lead.formationId) {
      const target = formations.find((f) => f.id === lead.formationId);
      if (target) {
        const newTaken = (target.seatsTaken || 0) + 1;
        supabase.from('formations').update({ seats_taken: newTaken }).eq('id', lead.formationId).then(() => {});
        setFormations((prev) => prev.map((f) => (f.id === lead.formationId ? { ...f, seatsTaken: newTaken } : f)));
      }
    }

    if (data && isAuthenticated) {
      setLeads((prev) => [
        {
          id: data.id,
          created_at: data.created_at,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || '',
          formationId: data.formation_id || null,
          formationTitle: data.formation_title || '',
          leadType: data.lead_type || 'reservation',
          message: data.message || '',
          status: data.status || 'new',
        },
        ...prev,
      ]);
    }
    return { success: true };
  };

  const updateLeadStatus = async (id: string, status: FunnelLead['status']) => {
    const { error } = await supabase.from('funnel_leads').update({ status }).eq('id', id);
    if (!error) setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('funnel_leads').delete().eq('id', id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <FunnelContext.Provider
      value={{
        funnelSettings,
        formations,
        leads,
        isFunnelLoading,
        updateFunnelSettings,
        addFormation,
        updateFormation,
        deleteFormation,
        submitLead,
        updateLeadStatus,
        deleteLead,
        refreshLeads,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const ctx = useContext(FunnelContext);
  if (ctx === undefined) throw new Error('useFunnel must be used within a FunnelProvider');
  return ctx;
};
