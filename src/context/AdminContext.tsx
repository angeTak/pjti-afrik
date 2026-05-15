import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Registration {
  id: string;
  date: string;
  parentName: string;
  phone: string;
  email: string;
  city: string;
  childName: string;
  ageGroup: string;
  schoolLevel: string;
  hasComputer?: string;
  howFound?: string;
  paymentMethod?: string;
  paymentSchedule?: string;
  status: 'new' | 'contacted' | 'registered' | 'cancelled';
  amountPaid: number;
  paymentMethodActual?: string;
  installmentsPaid: number;
  photo_url?: string;
  isManual?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  image2?: string;
  excerpt: string;
  paragraph: string;
}

export interface PartnershipRequest {
  id: string;
  created_at: string;
  organization_name: string;
  sector: string;
  email: string;
  phone?: string;
  partnership_type: string;
  message: string;
  status: 'new' | 'contacted' | 'accepted' | 'rejected';
}

export interface SiteSettings {
  programPrice: string;
  participantsCount: string;
  partnersCount: string;
  durationWeeks: string;
  ageRange: string;
  registrationDeadline: string;
  voteStartDate?: string;
  voteEndDate?: string;
  id?: string | number;
}

export interface Partner {
  id: string;
  name: string;
  initials: string;
  description: string;
  category: string;
  logo?: string;
  color: string;
  textColor: string;
  badgeBg: string;
  borderColor: string;
}

export interface Team {
  id: string;
  created_at: string;
  name: string;
  project_title: string;
  description: string;
  captain_id: string | null;
  member_ids: string[];
  is_published: boolean;
  vote_start_date: string | null;
  vote_end_date: string | null;
  total_points: number;
  logo_url?: string;
  category?: string;
}

interface AdminContextType {
  registrations: Registration[];
  news: NewsItem[];
  gallery: string[];
  partners: Partner[];
  settings: SiteSettings;
  partnershipRequests: PartnershipRequest[];
  teams: Team[];
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addRegistration: (reg: Omit<Registration, 'id' | 'date' | 'status'>) => void;
  updateRegistrationStatus: (id: string, status: Registration['status']) => void;
  updateRegistrationPayment: (id: string, data: Partial<Pick<Registration, 'amountPaid' | 'paymentMethodActual' | 'installmentsPaid' | 'photo_url'>>) => void;
  deleteRegistration: (id: string) => void;
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  addGalleryImage: (url: string) => void;
  deleteGalleryImage: (url: string) => void;
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addPartnershipRequest: (req: Omit<PartnershipRequest, 'id' | 'created_at' | 'status'>) => void;
  updatePartnershipRequestStatus: (id: string, status: PartnershipRequest['status']) => void;
  deletePartnershipRequest: (id: string) => void;
  addTeam: (team: Omit<Team, 'id' | 'created_at' | 'total_points'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Omit<Team, 'id' | 'created_at'>>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addTeamPoints: (teamId: string, points: number) => Promise<void>;
  isLoading: boolean;
  uploadImage: (file: File, path: string) => Promise<string | null>;
}

const defaultSettings: SiteSettings = {
  programPrice: "50 000",
  participantsCount: "100",
  partnersCount: "8",
  durationWeeks: "5",
  ageRange: "11-18",
  registrationDeadline: "15 Juin 2025"
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis le cache localStorage immédiatement
  useEffect(() => {
    const cachedData = localStorage.getItem('pjti_data_cache');
    if (cachedData) {
      try {
        const { registrations, news, gallery, partners, settings, partnershipRequests, teams } = JSON.parse(cachedData);
        if (registrations) setRegistrations(registrations);
        if (news) setNews(news);
        if (gallery) setGallery(gallery);
        if (partners) setPartners(partners);
        if (settings) setSettings(settings);
        if (partnershipRequests) setPartnershipRequests(partnershipRequests);
        if (teams) setTeams(teams);
        setIsLoading(false); // On peut déjà arrêter le loading si on a du cache
        console.log("Données chargées depuis le cache local.");
      } catch (e) {
        console.error("Erreur cache:", e);
      }
    }
  }, []);

  // Charger les données depuis Supabase au montage
  useEffect(() => {
    const fetchData = async () => {
      // On ne met isLoading à true que si on n'a pas de cache, pour éviter le flash
      if (localStorage.getItem('pjti_data_cache') === null) {
        setIsLoading(true);
      }
      
      console.log("Début du chargement parallèle des données Supabase...");
      
      try {
        const [
          { data: regData, error: regError },
          { data: newsData, error: newsError },
          { data: galleryData, error: galleryError },
          { data: partnerData, error: partError },
          { data: settingsData, error: settError },
          { data: prData, error: prError },
          { data: teamsData, error: teamsError }
        ] = await Promise.all([
          supabase.from('registrations').select('*').order('created_at', { ascending: false }),
          supabase.from('news').select('*').order('created_at', { ascending: false }),
          supabase.from('gallery').select('*'),
          supabase.from('partners').select('*'),
          supabase.from('settings').select('*').single(),
          supabase.from('partnership_requests').select('*').order('created_at', { ascending: false }),
          supabase.from('teams').select('*').order('created_at', { ascending: false })
        ]);

        let finalRegs = registrations;
        let finalNews = news;
        let finalGallery = gallery;
        let finalPartners = partners;
        let finalSettings = settings;
        let finalPRs = partnershipRequests;
        let finalTeams = teams;

        if (regData) {
          finalRegs = regData.map(r => ({
            id: r.id,
            date: new Date(r.created_at).toLocaleDateString('fr-FR'),
            parentName: r.parent_name,
            phone: r.phone,
            email: r.email,
            city: r.city,
            childName: r.child_name,
            ageGroup: r.age_group,
            schoolLevel: r.school_level,
            hasComputer: r.has_computer,
            howFound: r.how_found,
            paymentMethod: r.payment_method,
            paymentSchedule: r.payment_schedule,
            status: r.status,
            amountPaid: r.amount_paid || 0,
            paymentMethodActual: r.payment_method_actual || '',
            installmentsPaid: r.installments_paid || 0,
            photo_url: r.photo_url || '',
            isManual: !!r.is_manual
          }));
          setRegistrations(finalRegs);
        }

        if (newsData) {
          finalNews = newsData;
          setNews(finalNews);
        }

        if (galleryData) {
          finalGallery = galleryData.map(img => img.url);
          setGallery(finalGallery);
        }

        if (partnerData) {
          finalPartners = partnerData.map(p => ({
            id: p.id,
            name: p.name,
            initials: p.initials,
            description: p.description,
            category: p.category,
            logo: p.logo,
            color: p.color,
            textColor: p.text_color,
            badgeBg: p.badge_bg,
            borderColor: p.border_color
          }));
          setPartners(finalPartners);
        }

        if (settingsData) {
          finalSettings = {
            id: settingsData.id,
            programPrice: settingsData.program_price,
            participantsCount: settingsData.participants_count,
            partnersCount: settingsData.partners_count,
            durationWeeks: settingsData.duration_weeks,
            ageRange: settingsData.age_range,
            registrationDeadline: settingsData.registration_deadline,
            voteStartDate: settingsData.vote_start_date || '',
            voteEndDate: settingsData.vote_end_date || '',
          };
          setSettings(finalSettings);
        }

        if (prData) {
          finalPRs = prData;
          setPartnershipRequests(finalPRs);
        }

        if (teamsData && !teamsError) {
          finalTeams = teamsData.map((t: any) => ({
            id: t.id,
            created_at: t.created_at,
            name: t.name,
            project_title: t.project_title || '',
            description: t.description || '',
            captain_id: t.captain_id || null,
            member_ids: t.member_ids || [],
            is_published: t.is_published || false,
            vote_start_date: t.vote_start_date || null,
            vote_end_date: t.vote_end_date || null,
            total_points: t.total_points || 0,
            logo_url: t.logo_url || '',
            category: t.category || 'Programmation',
          }));
          setTeams(finalTeams);
        }

        // Sauvegarder dans le cache pour la prochaine visite
        localStorage.setItem('pjti_data_cache', JSON.stringify({
          registrations: finalRegs,
          news: finalNews,
          gallery: finalGallery,
          partners: finalPartners,
          settings: finalSettings,
          partnershipRequests: finalPRs,
          teams: finalTeams
        }));

      } catch (error) {
        console.error("Erreur fatale Supabase:", error);
      } finally {
        setIsLoading(false);
        console.log("Fin du chargement parallèle.");
      }
    };

    fetchData();
  }, []);

  const login = (password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminPassword && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const addRegistration = async (reg: Omit<Registration, 'id' | 'date' | 'status'>) => {
    const dbReg = {
      parent_name: reg.parentName,
      phone: reg.phone,
      email: reg.email,
      city: reg.city,
      child_name: reg.childName,
      age_group: reg.ageGroup,
      school_level: reg.schoolLevel,
      has_computer: reg.hasComputer,
      how_found: reg.howFound,
      payment_method: reg.paymentMethod,
      payment_schedule: reg.paymentSchedule,
      status: reg.isManual ? 'registered' : 'new',
      is_manual: reg.isManual || false
    };
    
    let { data, error } = await supabase.from('registrations').insert([dbReg]).select().single();
    
    if (error) {
      console.error("Erreur insertion avec nouveaux champs, tentative de repli...", error);
      // Repli : insertion sans les nouveaux champs (au cas où les colonnes n'existent pas encore)
      const fallbackReg = {
        parent_name: reg.parentName,
        phone: reg.phone,
        email: reg.email,
        city: reg.city,
        child_name: reg.childName,
        age_group: reg.ageGroup,
        school_level: reg.schoolLevel,
        status: reg.isManual ? 'registered' : 'new',
        is_manual: !!reg.isManual
      };
      const retry = await supabase.from('registrations').insert([fallbackReg]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Erreur insertion Supabase:", error);
      return;
    }

    if (data) {
      const newReg: Registration = {
        id: data.id,
        date: new Date(data.created_at).toLocaleDateString('fr-FR'),
        parentName: data.parent_name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        childName: data.child_name,
        ageGroup: data.age_group,
        schoolLevel: data.school_level,
        hasComputer: data.has_computer,
        howFound: data.how_found,
        paymentMethod: data.payment_method,
        paymentSchedule: data.payment_schedule,
        status: data.status,
        amountPaid: data.amount_paid || 0,
        paymentMethodActual: data.payment_method_actual || '',
        installmentsPaid: data.installments_paid || 0,
        photo_url: data.photo_url || '',
        isManual: data.is_manual || false
      };
      setRegistrations(prev => [newReg, ...prev]);
    }
  };

  const updateRegistrationStatus = async (id: string, status: Registration['status']) => {
    const { error } = await supabase.from('registrations').update({ status }).eq('id', id);
    if (!error) {
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const updateRegistrationPayment = async (id: string, data: Partial<Pick<Registration, 'amountPaid' | 'paymentMethodActual' | 'installmentsPaid' | 'photo_url' | 'isManual'>>) => {
    const dbData: any = {};
    if (data.amountPaid !== undefined) dbData.amount_paid = data.amountPaid;
    if (data.paymentMethodActual !== undefined) dbData.payment_method_actual = data.paymentMethodActual;
    if (data.installmentsPaid !== undefined) dbData.installments_paid = data.installmentsPaid;
    if (data.photo_url !== undefined) dbData.photo_url = data.photo_url;
    if (data.isManual !== undefined) dbData.is_manual = !!data.isManual;
    
    const { error } = await supabase.from('registrations').update(dbData).eq('id', id);
    if (!error) {
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    } else {
      console.error("Erreur de mise à jour Supabase:", error);
      toast.error("Erreur lors de la sauvegarde : " + error.message);
      throw error;
    }
  };

  const deleteRegistration = async (id: string) => {
    const { error } = await supabase.from('registrations').delete().eq('id', id);
    if (!error) {
      setRegistrations(prev => prev.filter(r => r.id !== id));
    }
  };

  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    const { data, error } = await supabase.from('news').insert([item]).select().single();
    if (!error && data) {
      setNews(prev => [data, ...prev]);
    }
  };

  const updateNews = async (id: string, item: Partial<NewsItem>) => {
    const { error } = await supabase.from('news').update(item).eq('id', id);
    if (!error) {
      setNews(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));
    }
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) {
      setNews(prev => prev.filter(n => n.id !== id));
    }
  };

  const addGalleryImage = async (url: string) => {
    const { error } = await supabase.from('gallery').insert([{ url }]);
    if (!error) {
      setGallery(prev => [...prev, url]);
    }
  };

  const deleteGalleryImage = async (url: string) => {
    const { error } = await supabase.from('gallery').delete().eq('url', url);
    if (!error) {
      setGallery(prev => prev.filter(img => img !== url));
    }
  };

  const addPartner = async (partner: Omit<Partner, 'id'>) => {
    const dbPartner = {
      name: partner.name,
      initials: partner.initials,
      description: partner.description,
      category: partner.category,
      logo: partner.logo,
      color: partner.color,
      text_color: partner.textColor,
      badge_bg: partner.badgeBg,
      border_color: partner.borderColor
    };
    const { data, error } = await supabase.from('partners').insert([dbPartner]).select().single();
    if (!error && data) {
      setPartners(prev => [data, ...prev]);
    } else {
      console.error("Erreur insertion Partenaire:", error);
    }
  };

  const updatePartner = async (id: string, partner: Partial<Partner>) => {
    const dbPartner: any = {};
    if (partner.name) dbPartner.name = partner.name;
    if (partner.initials) dbPartner.initials = partner.initials;
    if (partner.description) dbPartner.description = partner.description;
    if (partner.category) dbPartner.category = partner.category;
    if (partner.logo !== undefined) dbPartner.logo = partner.logo;
    if (partner.color) dbPartner.color = partner.color;
    if (partner.textColor) dbPartner.text_color = partner.textColor;
    if (partner.badgeBg) dbPartner.badge_bg = partner.badgeBg;
    if (partner.borderColor) dbPartner.border_color = partner.borderColor;

    const { error } = await supabase.from('partners').update(dbPartner).eq('id', id);
    if (!error) {
      setPartners(prev => prev.map(p => p.id === id ? { ...p, ...partner } : p));
    }
  };

  const deletePartner = async (id: string) => {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (!error) {
      setPartners(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const dbSettings: any = {};
    if (newSettings.programPrice) dbSettings.program_price = newSettings.programPrice;
    if (newSettings.participantsCount) dbSettings.participants_count = newSettings.participantsCount;
    if (newSettings.partnersCount) dbSettings.partners_count = newSettings.partnersCount;
    if (newSettings.durationWeeks) dbSettings.duration_weeks = newSettings.durationWeeks;
    if (newSettings.ageRange) dbSettings.age_range = newSettings.ageRange;
    if (newSettings.registrationDeadline) dbSettings.registration_deadline = newSettings.registrationDeadline;
    if (newSettings.voteStartDate !== undefined) dbSettings.vote_start_date = newSettings.voteStartDate || null;
    if (newSettings.voteEndDate !== undefined) dbSettings.vote_end_date = newSettings.voteEndDate || null;

    const { error } = await supabase.from('settings').update(dbSettings).eq('id', settings.id || 'main');
    if (!error) {
      setSettings(prev => ({ ...prev, ...newSettings }));
    } else {
      console.error("Erreur MAJ Settings:", error);
    }
  };

  const addPartnershipRequest = async (req: Omit<PartnershipRequest, 'id' | 'created_at' | 'status'>) => {
    const { data, error } = await supabase.from('partnership_requests').insert([{
      ...req,
      status: 'new'
    }]).select().single();
    
    if (error) {
      console.error("Erreur insertion demande partenariat:", error);
      throw error;
    }
    if (data) {
      setPartnershipRequests(prev => [data, ...prev]);
    }
  };

  const updatePartnershipRequestStatus = async (id: string, status: PartnershipRequest['status']) => {
    const { error } = await supabase.from('partnership_requests').update({ status }).eq('id', id);
    if (!error) {
      setPartnershipRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } else {
      console.error("Erreur MAJ statut demande de partenariat:", error);
      throw error;
    }
  };

  const deletePartnershipRequest = async (id: string) => {
    const { error } = await supabase.from('partnership_requests').delete().eq('id', id);
    if (!error) {
      setPartnershipRequests(prev => prev.filter(r => r.id !== id));
    } else {
      console.error("Erreur suppression demande de partenariat:", error);
      throw error;
    }
  };

  const addTeam = async (team: Omit<Team, 'id' | 'created_at' | 'total_points'>) => {
    const dbTeam = {
      name: team.name,
      project_title: team.project_title,
      description: team.description,
      captain_id: team.captain_id,
      member_ids: team.member_ids,
      is_published: team.is_published,
      vote_start_date: team.vote_start_date,
      vote_end_date: team.vote_end_date,
      logo_url: team.logo_url,
      category: team.category,
    };
    const { data, error } = await supabase.from('teams').insert([dbTeam]).select().single();
    if (error) {
      console.error("Erreur insertion équipe:", error);
      throw error;
    }
    if (data) {
      const newTeam: Team = {
        id: data.id,
        created_at: data.created_at,
        name: data.name,
        project_title: data.project_title || '',
        description: data.description || '',
        captain_id: data.captain_id || null,
        member_ids: data.member_ids || [],
        is_published: data.is_published || false,
        vote_start_date: data.vote_start_date || null,
        vote_end_date: data.vote_end_date || null,
        total_points: data.total_points || 0,
        logo_url: data.logo_url || '',
        category: data.category || 'Tous',
      };
      setTeams(prev => [newTeam, ...prev]);
    }
  };

  const updateTeam = async (id: string, team: Partial<Omit<Team, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('teams').update(team).eq('id', id);
    if (error) {
      console.error("Erreur MAJ équipe:", error);
      throw error;
    }
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...team } : t));
  };

  const deleteTeam = async (id: string) => {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) {
      console.error("Erreur suppression équipe:", error);
      throw error;
    }
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const addTeamPoints = async (teamId: string, points: number) => {
    try {
      // 1. Fetch current points
      const { data: teamData, error: fetchError } = await supabase
        .from('teams')
        .select('total_points')
        .eq('id', teamId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // 2. Add points and update
      const newPoints = (teamData?.total_points || 0) + points;
      const { error: updateError } = await supabase
        .from('teams')
        .update({ total_points: newPoints })
        .eq('id', teamId);
        
      if (updateError) throw updateError;
      
      // 3. Update local state
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, total_points: newPoints } : t));
    } catch (e) {
      console.warn("MOCK FALLBACK: Supabase failed, updating local state only.", e);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, total_points: (t.total_points || 0) + points } : t));
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // On utilise le bucket 'pjti-storage' (assurez-vous qu'il est créé en public sur Supabase)
      const { error: uploadError } = await supabase.storage
        .from('pjti-storage')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erreur upload:", uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('pjti-storage')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Erreur fatale upload:", error);
      return null;
    }
  };

  return (
    <AdminContext.Provider value={{
      registrations, news, gallery, partners, settings, partnershipRequests, teams, isAuthenticated,
      login, logout, addRegistration, updateRegistrationStatus, updateRegistrationPayment, deleteRegistration,
      addNews, updateNews, deleteNews, addGalleryImage, deleteGalleryImage,
      addPartner, updatePartner, deletePartner, updateSettings,
      addPartnershipRequest,
      updatePartnershipRequestStatus,
      deletePartnershipRequest,
      addTeam,
      updateTeam,
      deleteTeam,
      addTeamPoints,
      isLoading,
      uploadImage
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
