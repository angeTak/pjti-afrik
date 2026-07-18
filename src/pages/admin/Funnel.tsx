import React, { useState, useEffect } from 'react';
import {
  Rocket, Save, Plus, Trash2, Edit3, Image as ImageIcon, X, Star,
  Users, Mail, Phone, MapPin, Calendar, ChevronDown, Loader2, LayoutList, FileText, Inbox,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { useFunnel } from '@/context/FunnelContext';
import { Formation, FunnelSettings, ProgramDay, formationTypeLabels } from '@/data/funnel';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Tab = 'content' | 'offers' | 'leads';

const emptyFormation: Omit<Formation, 'id'> = {
  type: 'formation',
  title: '',
  category: '',
  tagline: '',
  description: '',
  image: '',
  price: '',
  currency: 'FCFA',
  oldPrice: '',
  duration: '',
  format: '',
  seatsTotal: 0,
  seatsTaken: 0,
  highlights: [],
  audience: [],
  program: [],
  bonus: [],
  isPublished: true,
  isFeatured: false,
  orderIndex: 0,
};

const AdminFunnel = () => {
  const [tab, setTab] = useState<Tab>('content');
  const { leads } = useFunnel();
  const newLeads = leads.filter((l) => l.status === 'new').length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Rocket className="w-8 h-8 text-purple-600" /> Tunnel de vente
        </h1>
        <p className="text-slate-500">
          Configurez la page <a href="/angelo" target="_blank" rel="noreferrer" className="text-purple-600 font-bold hover:underline">/angelo</a>, vos formations et suivez les réservations
        </p>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-100 w-fit">
        <TabButton active={tab === 'content'} onClick={() => setTab('content')} icon={FileText} label="Contenu de la page" />
        <TabButton active={tab === 'offers'} onClick={() => setTab('offers')} icon={LayoutList} label="Formations & Offres" />
        <TabButton active={tab === 'leads'} onClick={() => setTab('leads')} icon={Inbox} label="Réservations" badge={newLeads} />
      </div>

      {tab === 'content' && <ContentTab />}
      {tab === 'offers' && <OffersTab />}
      {tab === 'leads' && <LeadsTab />}
    </AdminLayout>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label, badge }: any) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    <Icon className="w-4 h-4" /> {label}
    {badge > 0 && (
      <span className="ml-1 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

// ============================================================
// ONGLET 1 — CONTENU DE LA PAGE
// ============================================================
const ContentTab = () => {
  const { funnelSettings, updateFunnelSettings } = useFunnel();
  const { uploadImage } = useAdmin();
  const [data, setData] = useState<FunnelSettings>(funnelSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setData(funnelSettings); }, [funnelSettings]);

  const set = (patch: Partial<FunnelSettings>) => setData((d) => ({ ...d, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    const { success, error } = await updateFunnelSettings(data);
    setSaving(false);
    if (success) toast.success('Contenu enregistré');
    else toast.error(error?.includes('does not exist') || error?.includes('relation')
      ? 'Table manquante : exécutez funnel.sql dans Supabase'
      : 'Erreur : ' + error);
  };

  const handlePhotoUpload = async (file: File) => {
    const t = toast.loading('Upload de la photo...');
    const url = await uploadImage(file, 'funnel');
    toast.dismiss(t);
    if (url) { set({ photoUrl: url }); toast.success('Photo chargée'); }
    else toast.error("Erreur d'upload");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Card collapsible defaultOpen title="En-tête (Hero)" icon={Star}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nom de marque" value={data.brand} onChange={(v) => set({ brand: v })} placeholder="ANGELO" />
          <Input label="Texte du bouton principal" value={data.heroCta} onChange={(v) => set({ heroCta: v })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Titre principal" value={data.heroTitle} onChange={(v) => set({ heroTitle: v })} />
          <Input label="Partie du titre en doré" value={data.heroHighlight} onChange={(v) => set({ heroHighlight: v })} />
        </div>
        <TextArea label="Sous-titre / description" value={data.heroSubtitle} onChange={(v) => set({ heroSubtitle: v })} />

        <PairListEditor label="Chiffres clés (badges)" items={data.stats} onChange={(stats) => set({ stats })}
          keyA="value" keyB="label" placeholderA="+500" placeholderB="entrepreneurs formés" />
      </Card>

      <Card collapsible defaultOpen={false} title="Vidéo (affichée dans le hero)" icon={ImageIcon}>
        <Input label="Lien de la vidéo (YouTube, Vimeo, MP4...)" value={data.videoUrl} onChange={(v) => set({ videoUrl: v })}
          placeholder="https://youtube.com/watch?v=..." />
        <Input label="Vignette de la vidéo (URL image, optionnel)" value={data.videoThumbUrl} onChange={(v) => set({ videoThumbUrl: v })} />
      </Card>

      <Card collapsible defaultOpen={false} title="Section « Difficultés »" icon={X}>
        <Input label="Titre de la section" value={data.painTitle} onChange={(v) => set({ painTitle: v })} />
        <StringListEditor label="Liste des difficultés" items={data.pains} onChange={(pains) => set({ pains })}
          placeholder="ex: Vous manquez de temps..." />
      </Card>

      <Card collapsible defaultOpen={false} title="Section « Qui suis-je ? »" icon={Users}>
        <Input label="Titre de la section" value={data.aboutTitle} onChange={(v) => set({ aboutTitle: v })} placeholder="Qui suis-je ?" />
        <TextArea label="Présentation / bio (sautez une ligne pour un nouveau paragraphe)" value={data.aboutText} onChange={(v) => set({ aboutText: v })} />
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Votre photo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              {data.photoUrl
                ? <img src={data.photoUrl} alt="Angelo" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-slate-300"><Users className="w-8 h-8" /></div>}
            </div>
            <div className="flex-1 space-y-2">
              <input type="url" value={data.photoUrl} onChange={(e) => set({ photoUrl: e.target.value })}
                placeholder="URL de la photo ou /angelo.jpg"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
              <input type="file" accept="image/*" id="funnel-photo" className="hidden"
                onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
              <label htmlFor="funnel-photo"
                className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer text-sm">
                <ImageIcon className="w-4 h-4" /> Charger depuis le PC
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card collapsible defaultOpen={false} title="Offre & compte à rebours" icon={Rocket}>
        <Input label="Titre de la section offre" value={data.offerTitle} onChange={(v) => set({ offerTitle: v })} placeholder="Ce que je vous offre aujourd'hui" />
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Fin de l'offre (compte à rebours)</label>
          <input type="datetime-local" value={data.offerDeadline ? data.offerDeadline.slice(0, 16) : ''}
            onChange={(e) => set({ offerDeadline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
          <p className="text-xs text-slate-400 mt-1.5">Laissez vide pour masquer le compte à rebours.</p>
        </div>
      </Card>

      <Card collapsible defaultOpen={false} title="Section « Pour qui ? »" icon={Users}>
        <Input label="Titre de la section" value={data.audienceTitle} onChange={(v) => set({ audienceTitle: v })} />
        <PairListEditor label="Profils ciblés" items={data.audience} onChange={(audience) => set({ audience })}
          keyA="title" keyB="text" placeholderA="Entrepreneur" placeholderB="Description du profil..." textareaB />
      </Card>

      <Card collapsible defaultOpen={false} title="Section « Résultats »" icon={Star}>
        <Input label="Titre de la section" value={data.resultsTitle} onChange={(v) => set({ resultsTitle: v })} />
        <StringListEditor label="Liste des résultats" items={data.results} onChange={(results) => set({ results })}
          placeholder="ex: Créer des documents professionnels..." />
      </Card>

      <Card collapsible defaultOpen={false} title="Section « Avis / Témoignages »" icon={Star}>
        <Input label="Titre de la section" value={data.reviewsTitle} onChange={(v) => set({ reviewsTitle: v })} placeholder="Ce qu'ils en disent" />
        <ImageListEditor images={data.reviews} onChange={(reviews) => set({ reviews })} uploadImage={uploadImage} />
      </Card>

      <Card collapsible defaultOpen={false} title="Appel à l'action final" icon={Rocket}>
        <Input label="Titre" value={data.finalTitle} onChange={(v) => set({ finalTitle: v })} />
        <TextArea label="Sous-titre" value={data.finalSubtitle} onChange={(v) => set({ finalSubtitle: v })} />
        <Input label="Texte du bouton" value={data.finalCta} onChange={(v) => set({ finalCta: v })} />
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 flex items-center gap-3 disabled:opacity-60">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Enregistrer le contenu
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ONGLET 2 — FORMATIONS & OFFRES
// ============================================================
const OffersTab = () => {
  const { formations, addFormation, updateFormation, deleteFormation } = useFunnel();
  const { uploadImage } = useAdmin();
  const [editing, setEditing] = useState<Formation | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const startCreate = () => { setEditing({ ...emptyFormation, id: '', orderIndex: formations.length } as Formation); setCreating(true); };
  const startEdit = (f: Formation) => { setEditing(f); setCreating(false); };
  const cancel = () => { setEditing(null); setCreating(false); };

  const handleSave = async (f: Formation) => {
    if (creating) {
      const { id, ...rest } = f;
      const { success, error } = await addFormation(rest);
      if (success) { toast.success('Formation ajoutée'); cancel(); }
      else toast.error(error?.includes('relation') || error?.includes('does not exist')
        ? 'Table manquante : exécutez funnel.sql dans Supabase' : 'Erreur : ' + error);
    } else {
      const { success, error } = await updateFormation(f.id, f);
      if (success) { toast.success('Formation mise à jour'); cancel(); }
      else toast.error('Erreur : ' + error);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const { success } = await deleteFormation(toDelete);
    if (success) toast.error('Formation supprimée');
    setToDelete(null);
  };

  if (editing) {
    return <FormationEditor formation={editing} isNew={creating} onSave={handleSave} onCancel={cancel} uploadImage={uploadImage} />;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500 text-sm">{formations.length} offre(s)</p>
        <button onClick={startCreate}
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
          <Plus className="w-5 h-5" /> Nouvelle offre
        </button>
      </div>

      <div className="space-y-3">
        {formations.length === 0 && (
          <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200">
            <LayoutList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 italic">Aucune offre. Cliquez sur « Nouvelle offre ».</p>
          </div>
        )}
        {[...formations].sort((a, b) => a.orderIndex - b.orderIndex).map((f) => (
          <div key={f.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-purple-200 transition-all">
            <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {f.image ? <img src={f.image} alt={f.title} className="w-full h-full object-cover" /> : <Rocket className="w-6 h-6 text-slate-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{formationTypeLabels[f.type]}</span>
                {f.isFeatured && <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Populaire</span>}
                {!f.isPublished && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Masqué</span>}
              </div>
              <h3 className="font-bold text-slate-900 truncate mt-1">{f.title}</h3>
              <p className="text-xs text-slate-400">{f.price} {f.currency} · {f.duration}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(f)} className="p-2 text-slate-400 hover:text-amber-500 bg-slate-50 rounded-lg"><Edit3 className="w-5 h-5" /></button>
              <button onClick={() => setToDelete(f.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete}
        title="Supprimer cette offre ?" description="Cette formation sera retirée de la page /angelo." confirmText="Supprimer" cancelText="Conserver" variant="danger" />
    </div>
  );
};

const FormationEditor = ({ formation, isNew, onSave, onCancel, uploadImage }: any) => {
  const [f, setF] = useState<Formation>(formation);
  const set = (patch: Partial<Formation>) => setF((prev) => ({ ...prev, ...patch }));

  const handleImage = async (file: File) => {
    const t = toast.loading('Upload...');
    const url = await uploadImage(file, 'funnel');
    toast.dismiss(t);
    if (url) { set({ image: url }); toast.success('Image chargée'); } else toast.error("Erreur d'upload");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">{isNew ? 'Nouvelle offre' : 'Modifier l\'offre'}</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-sm font-bold"><X className="w-4 h-4" /> Fermer</button>
      </div>

      <Card title="Informations principales" icon={FileText}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Type d'offre</label>
            <select value={f.type} onChange={(e) => set({ type: e.target.value as Formation['type'] })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors">
              <option value="formation">Formation</option>
              <option value="coaching">Coaching</option>
              <option value="accompagnement">Accompagnement</option>
            </select>
          </div>
          <Input label="Catégorie" value={f.category} onChange={(v) => set({ category: v })} placeholder="Programme Entrepreneur" />
        </div>
        <Input label="Titre" value={f.title} onChange={(v) => set({ title: v })} placeholder="IA PRO BUSINESS" />
        <Input label="Accroche courte (tagline)" value={f.tagline} onChange={(v) => set({ tagline: v })} />
        <TextArea label="Description" value={f.description} onChange={(v) => set({ description: v })} />

        {/* Image */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Illustration</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
              {f.image ? <img src={f.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-7 h-7 text-slate-300" />}
            </div>
            <div className="flex-1 space-y-2">
              <input type="url" value={f.image} onChange={(e) => set({ image: e.target.value })} placeholder="URL de l'image"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
              <input type="file" accept="image/*" id="formation-img" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              <label htmlFor="formation-img" className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer text-sm">
                <ImageIcon className="w-4 h-4" /> Charger depuis le PC
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Tarif, durée & places" icon={Calendar}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Prix" value={f.price} onChange={(v) => set({ price: v })} placeholder="150 000" />
          <Input label="Devise" value={f.currency} onChange={(v) => set({ currency: v })} placeholder="FCFA" />
          <Input label="Ancien prix (barré)" value={f.oldPrice || ''} onChange={(v) => set({ oldPrice: v })} placeholder="250 000" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Durée" value={f.duration} onChange={(v) => set({ duration: v })} placeholder="3 jours intensifs" />
          <Input label="Format" value={f.format} onChange={(v) => set({ format: v })} placeholder="Présentiel & en ligne" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberInput label="Nombre total de places (0 = illimité)" value={f.seatsTotal} onChange={(v) => set({ seatsTotal: v })} />
          <NumberInput label="Places déjà réservées" value={f.seatsTaken} onChange={(v) => set({ seatsTaken: v })} />
        </div>
      </Card>

      <Card title="Points forts (affichés sur la carte)" icon={Star}>
        <StringListEditor label="" items={f.highlights} onChange={(highlights) => set({ highlights })} placeholder="ex: Certificat de participation" />
      </Card>

      <Card title="Programme détaillé (jours)" icon={Calendar}>
        <ProgramEditor program={f.program} onChange={(program) => set({ program })} />
      </Card>

      <Card title="Bonus inclus" icon={Star}>
        <StringListEditor label="" items={f.bonus} onChange={(bonus) => set({ bonus })} placeholder="ex: Support de formation complet" />
      </Card>

      <Card title="Affichage" icon={LayoutList}>
        <div className="flex flex-wrap gap-6">
          <Toggle label="Publiée (visible sur /angelo)" checked={f.isPublished} onChange={(v) => set({ isPublished: v })} />
          <Toggle label="Mise en avant (★ populaire)" checked={f.isFeatured} onChange={(v) => set({ isFeatured: v })} />
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700">Ordre</label>
            <input type="number" value={f.orderIndex} onChange={(e) => set({ orderIndex: Number(e.target.value) })}
              className="w-20 px-3 py-2 rounded-xl border-2 border-slate-100 focus:border-purple-500" />
          </div>
        </div>
      </Card>

      <div className="flex gap-3 sticky bottom-4">
        <button onClick={() => onSave(f)} disabled={!f.title.trim()}
          className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50">
          <Save className="w-5 h-5" /> {isNew ? 'Créer l\'offre' : 'Enregistrer'}
        </button>
        <button onClick={onCancel} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">Annuler</button>
      </div>
    </div>
  );
};

// ============================================================
// ONGLET 3 — RÉSERVATIONS & CONTACTS
// ============================================================
const statusConfig: Record<string, { label: string; cls: string }> = {
  new: { label: 'Nouveau', cls: 'bg-blue-50 text-blue-600' },
  contacted: { label: 'Contacté', cls: 'bg-amber-50 text-amber-600' },
  confirmed: { label: 'Confirmé', cls: 'bg-emerald-50 text-emerald-600' },
  cancelled: { label: 'Annulé', cls: 'bg-red-50 text-red-500' },
};

const LeadsTab = () => {
  const { leads, updateLeadStatus, deleteLead } = useFunnel();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label={`Tous (${leads.length})`} />
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <FilterChip key={key} active={filter === key} onClick={() => setFilter(key)}
            label={`${cfg.label} (${leads.filter((l) => l.status === key).length})`} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200">
          <Inbox className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 italic">Aucune réservation pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-black text-slate-900">{lead.name}</span>
                    <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{lead.leadType}</span>
                    {lead.formationTitle && <span className="text-xs text-slate-500">→ {lead.formationTitle}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                    {lead.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>}
                    {lead.city && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {lead.city}</span>}
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {lead.message && <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{lead.message}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-bold cursor-pointer border-0 ${statusConfig[lead.status]?.cls || 'bg-slate-50 text-slate-600'}`}>
                      {Object.entries(statusConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>
                  <button onClick={() => setToDelete(lead.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={!!toDelete} onClose={() => setToDelete(null)} onConfirm={() => { if (toDelete) deleteLead(toDelete); setToDelete(null); }}
        title="Supprimer ce contact ?" description="Cette réservation sera définitivement supprimée." confirmText="Supprimer" cancelText="Conserver" variant="danger" />
    </div>
  );
};

const FilterChip = ({ active, onClick, label }: any) => (
  <button onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-purple-600 text-white' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>
    {label}
  </button>
);

// ============================================================
// COMPOSANTS RÉUTILISABLES
// ============================================================
const Card = ({ title, icon: Icon, children, collapsible = false, defaultOpen = true }: any) => {
  const [open, setOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-600" /> {title}
        </h2>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o: boolean) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-600" /> {title}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-6 pt-1 space-y-4">{children}</div>}
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div>
    {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
  </div>
);

const NumberInput = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
    <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
  </div>
);

const TextArea = ({ label, value, onChange }: any) => (
  <div>
    {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
    <textarea value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors h-24 resize-y" />
  </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
  <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2">
    <span className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-purple-600' : 'bg-slate-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </span>
    <span className="text-sm font-bold text-slate-700">{label}</span>
  </button>
);

const StringListEditor = ({ label, items, onChange, placeholder }: any) => {
  const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_: any, j: number) => j !== i));
  const add = () => onChange([...items, '']);
  return (
    <div>
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <div className="space-y-2">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item} onChange={(e) => update(i, e.target.value)} placeholder={placeholder}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors" />
            <button type="button" onClick={() => remove(i)} className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700">
        <Plus className="w-4 h-4" /> Ajouter une ligne
      </button>
    </div>
  );
};

const PairListEditor = ({ label, items, onChange, keyA, keyB, placeholderA, placeholderB, textareaB }: any) => {
  const update = (i: number, key: string, v: string) => { const n = [...items]; n[i] = { ...n[i], [key]: v }; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_: any, j: number) => j !== i));
  const add = () => onChange([...items, { [keyA]: '', [keyB]: '' }]);
  return (
    <div>
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>}
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
            <div className="flex-1 space-y-2">
              <input value={item[keyA] || ''} onChange={(e) => update(i, keyA, e.target.value)} placeholder={placeholderA}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 transition-colors text-sm font-bold" />
              {textareaB ? (
                <textarea value={item[keyB] || ''} onChange={(e) => update(i, keyB, e.target.value)} placeholder={placeholderB}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 transition-colors text-sm h-16 resize-y" />
              ) : (
                <input value={item[keyB] || ''} onChange={(e) => update(i, keyB, e.target.value)} placeholder={placeholderB}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 transition-colors text-sm" />
              )}
            </div>
            <button type="button" onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700">
        <Plus className="w-4 h-4" /> Ajouter
      </button>
    </div>
  );
};

const ImageListEditor = ({ images, onChange, uploadImage }: any) => {
  const add = () => onChange([...images, '']);
  const update = (i: number, v: string) => { const n = [...images]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(images.filter((_: any, j: number) => j !== i));
  const handleUpload = async (file: File, i: number) => {
    const t = toast.loading('Upload de la capture...');
    const url = await uploadImage(file, 'reviews');
    toast.dismiss(t);
    if (url) { update(i, url); toast.success('Capture chargée'); } else toast.error("Erreur d'upload");
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">Captures d'écran des avis</label>
      {images.length === 0 && <p className="text-sm text-slate-400 italic mb-3">Aucune capture. Ajoutez vos captures d'écran d'avis clients ci-dessous.</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {images.map((img: string, i: number) => (
          <div key={i} className="border-2 border-slate-100 rounded-xl p-3 space-y-2">
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
              {img ? <img src={img} alt={`Avis ${i + 1}`} className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
            </div>
            <input type="url" value={img} onChange={(e) => update(i, e.target.value)} placeholder="URL de la capture"
              className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 transition-colors text-sm" />
            <div className="flex gap-2">
              <input type="file" accept="image/*" id={`review-upload-${i}`} className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], i)} />
              <label htmlFor={`review-upload-${i}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer text-xs">
                <ImageIcon className="w-4 h-4" /> Charger
              </label>
              <button type="button" onClick={() => remove(i)} className="px-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700">
        <Plus className="w-4 h-4" /> Ajouter une capture
      </button>
    </div>
  );
};

const ProgramEditor = ({ program, onChange }: { program: ProgramDay[]; onChange: (p: ProgramDay[]) => void }) => {
  const updateDay = (i: number, patch: Partial<ProgramDay>) => { const n = [...program]; n[i] = { ...n[i], ...patch }; onChange(n); };
  const removeDay = (i: number) => onChange(program.filter((_, j) => j !== i));
  const addDay = () => onChange([...program, { day: `Jour ${program.length + 1}`, title: '', items: [] }]);

  return (
    <div className="space-y-4">
      {program.map((day, i) => (
        <div key={i} className="border-2 border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <input value={day.day} onChange={(e) => updateDay(i, { day: e.target.value })} placeholder="Jour 1"
              className="w-28 px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 text-sm font-bold" />
            <input value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} placeholder="Titre du jour"
              className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-100 focus:border-purple-500 text-sm" />
            <button type="button" onClick={() => removeDay(i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
          <StringListEditor label="" items={day.items} onChange={(items: string[]) => updateDay(i, { items })} placeholder="Point du programme..." />
        </div>
      ))}
      <button type="button" onClick={addDay} className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700">
        <Plus className="w-4 h-4" /> Ajouter un jour
      </button>
    </div>
  );
};

export default AdminFunnel;
