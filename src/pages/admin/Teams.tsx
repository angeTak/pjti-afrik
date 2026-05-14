import React, { useState } from 'react';
import { Plus, Users2, Trash2, Edit3, Crown, Eye, EyeOff, ChevronDown, X, Search, Upload, Camera, Trophy } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, Team } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';

const EMPTY_TEAM: Omit<Team, 'id' | 'created_at'> = {
  name: '', project_title: '', description: '', captain_id: null, member_ids: [],
  is_published: false, vote_start_date: null, vote_end_date: null,
};

const AdminTeams = () => {
  const { registrations, teams, addTeam, updateTeam, deleteTeam, uploadImage, updateRegistrationPayment } = useAdmin();
  const officialRegistrations = registrations.filter(r => r.isManual === true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Team, 'id' | 'created_at'>>({ ...EMPTY_TEAM });
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'manage' | 'ranking'>('manage');

  const handlePhotoUpload = async (id: string, file: File) => {
    if (!file) return;
    setIsUploading(id);
    try {
      const url = await uploadImage(file, 'registrations');
      if (url) {
        await updateRegistrationPayment(id, { photo_url: url });
        toast.success('Photo mise à jour');
      } else {
        toast.error("Erreur d'envoi");
      }
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsUploading(null);
    }
  };

  const toDatetimeLocal = (s: string | null) => s ? s.slice(0, 16) : '';

  const handleMemberToggle = (id: string) => {
    setForm(prev => ({
      ...prev,
      member_ids: prev.member_ids.includes(id)
        ? prev.member_ids.filter(m => m !== id)
        : [...prev.member_ids, id],
      captain_id: prev.captain_id === id && prev.member_ids.includes(id) ? null : prev.captain_id,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing && editingId) {
        await updateTeam(editingId, form);
        toast.success('Équipe mise à jour');
      } else {
        await addTeam(form);
        toast.success('Équipe créée !');
      }
      resetForm();
    } catch { toast.error("Erreur lors de l'enregistrement"); }
    finally { setIsSaving(false); }
  };

  const resetForm = () => { 
    setForm({ ...EMPTY_TEAM }); 
    setIsEditing(false); 
    setEditingId(null); 
    setShowForm(false);
  };

  const handleEdit = (t: Team) => {
    setForm({ name: t.name, project_title: t.project_title, description: t.description, captain_id: t.captain_id,
      member_ids: t.member_ids, is_published: t.is_published,
      vote_start_date: t.vote_start_date, vote_end_date: t.vote_end_date });
    setIsEditing(true); setEditingId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePublish = async (t: Team) => {
    try { await updateTeam(t.id, { is_published: !t.is_published });
      toast.success(t.is_published ? 'Équipe dépubliée' : 'Équipe publiée !');
    } catch { toast.error('Erreur'); }
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;
    try { await deleteTeam(teamToDelete); toast.success('Équipe supprimée'); }
    catch { toast.error('Erreur'); }
    finally { setTeamToDelete(null); }
  };
  
  const handleToggleAllPublish = async (publish: boolean) => {
    try {
      setIsSaving(true);
      await Promise.all(teams.map(t => updateTeam(t.id, { is_published: publish })));
      toast.success(publish ? 'Toutes les équipes ont été publiées !' : 'Toutes les équipes ont été dépubliées.');
    } catch {
      toast.error('Erreur lors de la mise à jour globale');
    }
  };

  const exportTeamsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Liste des Équipes - Futur Talents Togo', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    
    const tableData = teams.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((t, i) => [
      (i + 1).toString(),
      t.name,
      t.project_title,
      t.member_ids.length.toString(),
      (t.total_points || 0).toString()
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['N°', 'Nom de l\'équipe', 'Titre du Projet', 'Membres', 'Points']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] } // Purple-600
    });

    doc.save('liste_equipes_ftt.pdf');
    toast.success('PDF des équipes téléchargé');
  };

  const exportRankingPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Classement Officiel - Futur Talents Togo', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    
    const sortedTeams = [...teams].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
    const tableData = sortedTeams.map((t, i) => [
      (i + 1).toString(),
      t.name,
      t.project_title,
      (t.total_points || 0).toString()
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Rang', 'Équipe', 'Projet', 'Points Accumulés']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] }, // Amber-600
      styles: { fontSize: 10 }
    });

    doc.save('classement_final_ftt.pdf');
    toast.success('PDF du classement téléchargé');
  };

  const getName = (id: string) => officialRegistrations.find(r => r.id === id)?.childName ?? '—';

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Gestion des Équipes</h1>
            <p className="text-slate-500 mt-1">Créez des équipes et gérez le classement de la compétition</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleToggleAllPublish(false)}
              className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border-2 border-slate-100 hover:border-slate-200 rounded-xl transition-all flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" /> Tout dépublier
            </button>
            <button
              onClick={() => handleToggleAllPublish(true)}
              className="px-4 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Publier tout
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-100 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvelle équipe
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit mt-8">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'manage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Liste des Équipes
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'ranking' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🏆 Classement
          </button>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={activeTab === 'manage' ? exportTeamsPDF : exportRankingPDF}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-slate-100"
          >
            <Download className="w-4 h-4" />
            Télécharger PDF ({activeTab === 'manage' ? 'Liste' : 'Classement'})
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-purple-100 relative">
            <button onClick={resetForm} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              {isEditing ? "Modifier l'équipe" : 'Créer une nouvelle équipe'}
            </h2>

            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom de l'équipe *</label>
                  <input type="text" value={form.name} required
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none transition-colors"
                    placeholder="Ex: Team Alpha" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Titre du Projet *</label>
                  <input type="text" value={form.project_title} required
                    onChange={e => setForm({ ...form, project_title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none transition-colors"
                    placeholder="Ex: Système de Tri Intelligent" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description / Sujet du projet *</label>
                  <textarea value={form.description} required
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none transition-colors h-32 resize-none"
                    placeholder="Décrivez le projet de cette équipe..." />
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Membres de l'équipe</label>
                  <button type="button" onClick={() => setDropdownOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-slate-100 hover:border-purple-400 focus:border-purple-500 transition-colors bg-white text-sm font-bold text-slate-700 shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Users2 className="w-4 h-4 text-slate-400" />
                      {form.member_ids.length === 0 ? 'Ajouter des membres...' : `${form.member_ids.length} membres sélectionnés`}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-purple-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-3 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                            placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-purple-400 outline-none" />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                        {officialRegistrations.filter(p => p.childName.toLowerCase().includes(memberSearch.toLowerCase())).map(p => {
                          const selected = form.member_ids.includes(p.id);
                          return (
                            <div key={p.id} onClick={() => handleMemberToggle(p.id)}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selected ? 'bg-purple-50' : 'hover:bg-slate-50'}`}>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selected ? 'bg-purple-600 border-purple-600' : 'border-slate-300'}`}>
                                {selected && <X className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm font-bold text-slate-800">{p.childName}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button type="button" onClick={() => setDropdownOpen(false)} className="text-xs font-black text-purple-600 uppercase tracking-wider">Terminer</button>
                      </div>
                    </div>
                  )}
                </div>

                {form.member_ids.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Membres Sélectionnés</p>
                    <div className="flex flex-wrap gap-2">
                      {form.member_ids.map(id => {
                        const p = officialRegistrations.find(r => r.id === id);
                        if (!p) return null;
                        const isCap = form.captain_id === id;
                        return (
                          <div key={id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${isCap ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-700'}`}>
                            <button type="button" onClick={() => setForm(prev => ({ ...prev, captain_id: isCap ? null : id }))} className="relative">
                              {p.photo_url ? <img src={p.photo_url} className="w-5 h-5 rounded-full object-cover" /> : <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">{p.childName[0]}</div>}
                              {isCap && <Crown className="absolute -top-1.5 -right-1.5 w-3 h-3 text-amber-500 fill-amber-500" />}
                            </button>
                            <span className="max-w-[100px] truncate">{p.childName}</span>
                            
                            <div className="flex items-center gap-1.5 ml-1 border-l border-slate-200 pl-2">
                              <label className="cursor-pointer hover:scale-110 transition-transform">
                                {isUploading === id ? (
                                  <div className="animate-spin h-3 w-3 border-2 border-purple-600 border-t-transparent rounded-full" />
                                ) : (
                                  <Camera className="w-3.5 h-3.5 text-slate-400 hover:text-purple-600" />
                                )}
                                <input type="file" className="hidden" accept="image/*" disabled={!!isUploading}
                                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(id, e.target.files[0])} />
                              </label>
                              <button type="button" onClick={() => handleMemberToggle(id)} className="text-slate-300 hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50">
                    {isSaving ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer l\'équipe'}
                  </button>
                  <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'manage' ? (
        <div className="space-y-6">
          {teams.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-[40px] border-4 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="w-10 h-10 text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Aucune équipe</h2>
              <p className="text-slate-400 max-w-sm mx-auto">Commencez par créer votre première équipe pour lancer la compétition.</p>
              <button onClick={() => setShowForm(true)} className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-2xl font-black shadow-lg shadow-purple-100 hover:scale-105 transition-transform">
                Créer une équipe
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {teams.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((team, idx) => {
                const captain = team.captain_id ? officialRegistrations.find(r => r.id === team.captain_id) : null;
                const memberCount = team.member_ids.length;
                return (
                  <div key={team.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all group flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-lg font-black text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleTogglePublish(team)} className={`p-2 rounded-xl transition-colors ${team.is_published ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50 hover:bg-green-50 hover:text-green-600'}`}>
                          {team.is_published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button onClick={() => handleEdit(team)} className="p-2 text-slate-400 bg-slate-50 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTeamToDelete(team.id)} className="p-2 text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">{team.name}</h3>
                          {team.is_published && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                        </div>
                        <p className="text-sm font-bold text-purple-500 uppercase tracking-wider">{team.project_title}</p>
                      </div>
                      
                      <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed italic">"{team.description}"</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <Users2 className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-700">{memberCount} Talents</span>
                        </div>
                        <div className="px-4 py-1.5 bg-amber-50 rounded-xl flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-black text-amber-700">{team.total_points || 0} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Tableau de Classement</h2>
              <p className="text-slate-500 text-sm">Classement en temps réel basé sur les votes du public</p>
            </div>
            <div className="bg-purple-600 text-white px-6 py-2 rounded-2xl font-black text-sm shadow-lg shadow-purple-100">
              {teams.length} Équipes
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">N°</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Équipe</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Projet</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Points</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Rang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teams.sort((a, b) => (b.total_points || 0) - (a.total_points || 0)).map((team, idx) => {
                  const originalIndex = teams.slice().sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).findIndex(t => t.id === team.id);
                  return (
                    <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-400">{(originalIndex + 1).toString().padStart(2, '0')}</td>
                      <td className="px-8 py-5">
                        <div className="font-black text-slate-900 group-hover:text-purple-600 transition-colors">{team.name}</div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-600">{team.project_title}</td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl font-black text-sm">
                          {team.total_points || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          {idx === 0 ? <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm"><Trophy className="w-4 h-4" /></div> : 
                           idx === 1 ? <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">2</div> :
                           idx === 2 ? <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xs">3</div> :
                           <div className="text-slate-300 font-bold text-xs">{idx + 1}</div>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <ConfirmModal isOpen={!!teamToDelete} onClose={() => setTeamToDelete(null)} onConfirm={confirmDelete}
        title="Supprimer cette équipe ?" description="Cette action est irréversible."
        confirmText="Supprimer" cancelText="Annuler" variant="danger" />
    </AdminLayout>
  );
};

export default AdminTeams;
