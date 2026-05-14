import React from 'react';
import { Mail, Phone, MapPin, Trash2, CheckCircle2, User, Clock, AlertCircle, Eye, GraduationCap, CreditCard, Laptop, Search, Calendar, Banknote, ArrowRight, Save, Filter, Plus, X, Upload, ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, Registration } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const AdminRegistrations = () => {
  const { registrations, updateRegistrationStatus, deleteRegistration, updateRegistrationPayment, settings, addRegistration, uploadImage } = useAdmin();
  const [selectedRegId, setSelectedRegId] = React.useState<string | null>(null);
  const currentReg = registrations.find(r => r.id === selectedRegId) || null;

  // Filtres
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchFilter, setSearchFilter] = React.useState<string>('');
  const [cityFilter, setCityFilter] = React.useState<string>('all');
  const [activeTab, setActiveTab] = React.useState<'pre' | 'official'>('official'); // Default to official as requested

  // Quick-add form
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const emptyForm = { parentName: '', phone: '', email: '', city: '', childName: '', ageGroup: '', schoolLevel: '', hasComputer: '', howFound: '', paymentMethod: '', paymentSchedule: '', amountPaid: 0, paymentMethodActual: '', installmentsPaid: 0 };
  const [addForm, setAddForm] = React.useState({ ...emptyForm });

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addRegistration({ ...addForm, isManual: true });
      toast.success(`${addForm.childName} a été ajouté(e) avec succès !`);
      setAddForm({ ...emptyForm });
      setShowAddForm(false);
    } catch {
      toast.error("Erreur lors de l'ajout du participant");
    } finally {
      setIsAdding(false);
    }
  };

  // Extraire les villes uniques pour le filtre
  const cities = Array.from(new Set(registrations.map(r => r.city))).sort();

  // Logique de filtrage
  const filteredRegistrations = registrations.filter(reg => {
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesCity = cityFilter === 'all' || reg.city === cityFilter;
    const searchLower = searchFilter.toLowerCase();
    const matchesSearch = searchFilter === '' || 
      reg.parentName.toLowerCase().includes(searchLower) || 
      reg.childName.toLowerCase().includes(searchLower) ||
      reg.phone.includes(searchFilter);
    
    const matchesTab = activeTab === 'official' ? reg.isManual === true : reg.isManual !== true;
    
    return matchesStatus && matchesCity && matchesSearch && matchesTab;
  });

  // État local pour le formulaire pour éviter les lags de saisie
  const [localAmount, setLocalAmount] = React.useState<number>(0);
  const [localMethod, setLocalMethod] = React.useState<string>('');
  const [localInstallments, setLocalInstallments] = React.useState<number>(0);

  // Synchroniser l'état local quand on change de sélection
  React.useEffect(() => {
    if (currentReg) {
      setLocalAmount(currentReg.amountPaid || 0);
      setLocalMethod(currentReg.paymentMethodActual || '');
      setLocalInstallments(currentReg.installmentsPaid || 0);
    }
  }, [selectedRegId, currentReg?.id]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [regToDelete, setRegToDelete] = React.useState<string | null>(null);

  const handleStatusChange = async (id: string, status: any) => {
    await updateRegistrationStatus(id, status);
    toast.success('Statut mis à jour');
  };

  const confirmDelete = async () => {
    if (regToDelete) {
      await deleteRegistration(regToDelete);
      toast.error('Inscription supprimée');
      setRegToDelete(null);
      if (selectedRegId === regToDelete) setSelectedRegId(null);
    }
  };

  const handleSavePayment = async () => {
    if (!currentReg) return;
    
    setIsSaving(true);
    console.log("Tentative de sauvegarde pour:", currentReg.id, { localAmount, localMethod, localInstallments });
    
    try {
      await updateRegistrationPayment(currentReg.id, {
        amountPaid: localAmount,
        paymentMethodActual: localMethod,
        installmentsPaid: localInstallments
      });
      toast.success('Paiement enregistré avec succès');
    } catch (error: any) {
      console.error("Crash handleSavePayment:", error);
      toast.error('Erreur critique : ' + (error.message || 'Inconnue'));
    } finally {
      setIsSaving(false);
    }
  };

  const [isUploading, setIsUploading] = React.useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentReg) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, 'registrations');
      if (url) {
        await updateRegistrationPayment(currentReg.id, { photo_url: url });
        toast.success('Photo mise à jour avec succès');
      } else {
        toast.error("Erreur lors de l'envoi de l'image");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
    }
  };

  if (currentReg) {
    const programPrice = parseInt(settings?.programPrice?.replace(/\s/g, '') || '50000');
    const balance = programPrice - localAmount;

    return (
      <AdminLayout>
        <div className="mb-8">
          <button 
            onClick={() => setSelectedRegId(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors mb-4"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Retour à la liste
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <User className="w-8 h-8 text-purple-600" />
                Détails de l'inscription
              </h1>
              <p className="text-slate-500">Inscrit le {currentReg.date}</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={currentReg.status}
                onChange={(e) => handleStatusChange(currentReg.id, e.target.value as any)}
                className={`px-4 py-2 rounded-xl font-bold border-none ring-2 transition-all ${
                  currentReg.status === 'new' ? 'bg-blue-50 text-blue-700 ring-blue-100' : 
                  currentReg.status === 'contacted' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
                  currentReg.status === 'registered' ? 'bg-green-50 text-green-700 ring-green-100' :
                  'bg-red-50 text-red-700 ring-red-100'
                }`}
              >
                <option value="new">Nouveau</option>
                <option value="contacted">Contacté</option>
                <option value="registered">Inscrit</option>
                <option value="cancelled">Annulé</option>
              </select>
              <button 
                onClick={() => setRegToDelete(currentReg.id)}
                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Parent Info */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  Informations du Parent
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nom complet</p>
                    <p className="font-bold text-slate-900 text-lg">{currentReg.parentName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                      <p className="font-bold text-slate-900">{currentReg.phone}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ville</p>
                      <p className="font-bold text-slate-900">{currentReg.city}</p>
                    </div>
                  </div>
                  {currentReg.email && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-slate-900">{currentReg.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Child Info */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  Informations de l'Enfant
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nom de l'enfant</p>
                    <p className="font-bold text-slate-900 text-lg">{currentReg.childName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Âge</p>
                      <p className="font-bold text-slate-900">{currentReg.ageGroup} ans</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Niveau</p>
                      <p className="font-bold text-slate-900">{currentReg.schoolLevel}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ordinateur</p>
                    <p className="font-bold text-slate-900">{currentReg.hasComputer || 'Non précisé'}</p>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Photo du participant (pour l'équipe)</p>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      {currentReg.photo_url ? (
                        <img 
                          src={currentReg.photo_url} 
                          alt={currentReg.childName} 
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-bold">Sans photo</span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-600 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:border-purple-400 hover:text-purple-600 cursor-pointer transition-all">
                        <Upload className="w-4 h-4" />
                        {currentReg.photo_url ? 'Changer la photo' : 'Ajouter une photo'}
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-2">Format JPG, PNG. Max 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                Intentions & Source
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modalité prévue</p>
                  <p className="font-bold text-slate-900">{currentReg.paymentSchedule || 'Non précisée'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyen prévu</p>
                  <p className="font-bold text-slate-900">{currentReg.paymentMethod || 'Non précisé'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source</p>
                  <p className="font-bold text-slate-900">{currentReg.howFound || 'Non précisée'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-purple-600/20 sticky top-8 text-white">
              <h3 className="text-xl font-black flex items-center gap-3 mb-8">
                <Banknote className="w-6 h-6" />
                Gestion Paiement
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Montant déjà encaissé (FCFA)</label>
                  <input 
                    type="number"
                    value={localAmount || ''}
                    onChange={(e) => setLocalAmount(e.target.value === '' ? 0 : parseInt(e.target.value))}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-white focus:bg-white/20 outline-none transition-all font-black text-2xl text-white placeholder:text-white/40"
                    placeholder="Entrez le montant..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Moyen de paiement réel</label>
                  <select 
                    value={localMethod}
                    onChange={(e) => setLocalMethod(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold outline-none focus:border-white"
                  >
                    <option value="" className="text-slate-900">Sélectionner...</option>
                    <option value="T-Money" className="text-slate-900">T-Money</option>
                    <option value="Moov Money" className="text-slate-900">Moov Money</option>
                    <option value="Espèces" className="text-slate-900">Espèces</option>
                    <option value="Virement" className="text-slate-900">Virement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Nombre de tranches</label>
                  <select 
                    value={localInstallments}
                    onChange={(e) => setLocalInstallments(parseInt(e.target.value) || 0)}
                    className="w-full px-5 py-3 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold outline-none focus:border-white"
                  >
                    <option value="0" className="text-slate-900">Aucune</option>
                    <option value="1" className="text-slate-900">1 tranche</option>
                    <option value="2" className="text-slate-900">2 tranches</option>
                    <option value="3" className="text-slate-900">3 tranches (Total)</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-white/10 mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-purple-200">Total à payer :</span>
                    <span className="text-lg font-black">{settings.programPrice} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-purple-200">Reste à payer :</span>
                    <span className={`text-2xl font-black ${
                      balance <= 0 ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {balance.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSavePayment}
                    disabled={isSaving}
                    className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Enregistrer le paiement
                      </>
                    )}
                  </button>

                  {balance <= 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Solde réglé</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestion des Talents</h1>
          <p className="text-slate-500">
            {activeTab === 'official' ? "Inscrits validés (saisie manuelle)" : "Pré-inscriptions (formulaire web)"}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
            showAddForm ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {showAddForm ? <><X className="w-4 h-4" /> Fermer</> : <><Plus className="w-4 h-4" /> Ajouter un participant (Inscrit)</>}
        </button>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-4 mb-8 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('official')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${
            activeTab === 'official' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Inscriptions Réelles ({registrations.filter(r => r.isManual === true).length})
          {activeTab === 'official' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('pre')}
          className={`pb-4 px-2 text-sm font-black transition-all relative ${
            activeTab === 'pre' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Pré-inscriptions ({registrations.filter(r => r.isManual !== true).length})
          {activeTab === 'pre' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />}
        </button>
      </div>

      {/* ── QUICK ADD FORM ── */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" /> Nouveau participant (saisie manuelle)
          </h2>
          <form onSubmit={handleAddParticipant}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nom de l'enfant *</label>
                <input type="text" required value={addForm.childName}
                  onChange={e => setAddForm({ ...addForm, childName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm"
                  placeholder="Prénom et Nom" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nom du parent *</label>
                <input type="text" required value={addForm.parentName}
                  onChange={e => setAddForm({ ...addForm, parentName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm"
                  placeholder="Prénom et Nom" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Téléphone *</label>
                <input type="tel" required value={addForm.phone}
                  onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm"
                  placeholder="+228 XX XX XX XX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Email</label>
                <input type="email" value={addForm.email}
                  onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm"
                  placeholder="email@exemple.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Ville *</label>
                <input type="text" required value={addForm.city}
                  onChange={e => setAddForm({ ...addForm, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm"
                  placeholder="Ex: Lomé" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Tranche d'âge *</label>
                <select required value={addForm.ageGroup}
                  onChange={e => setAddForm({ ...addForm, ageGroup: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm">
                  <option value="">Sélectionner...</option>
                  <option value="11-13">11-13 ans</option>
                  <option value="14-15">14-15 ans</option>
                  <option value="16-18">16-18 ans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Niveau scolaire *</label>
                <select required value={addForm.schoolLevel}
                  onChange={e => setAddForm({ ...addForm, schoolLevel: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm">
                  <option value="">Sélectionner...</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Ordinateur disponible ?</label>
                <select value={addForm.hasComputer}
                  onChange={e => setAddForm({ ...addForm, hasComputer: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 outline-none text-sm">
                  <option value="">Non précisé</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => { setShowAddForm(false); setAddForm({ ...emptyForm }); }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                Annuler
              </button>
              <button type="submit" disabled={isAdding}
                className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
                {isAdding ? <><Clock className="w-4 h-4 animate-spin" /> Ajout...</> : <><Plus className="w-4 h-4" /> Ajouter</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barre de Recherche et Filtres */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un nom..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-none transition-all text-sm font-bold shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <div className="p-1.5 text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold pr-4 py-1.5 cursor-pointer text-slate-700"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveaux</option>
            <option value="contacted">Contactés</option>
            <option value="registered">Inscrits</option>
            <option value="cancelled">Annulés</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <select 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold pr-4 py-1.5 cursor-pointer text-slate-700"
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Parent & Enfant</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Localisation</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    Aucune inscription ne correspond à vos filtres
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{reg.parentName}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> {reg.childName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-700 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {reg.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{reg.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block w-fit ${
                          reg.amountPaid >= parseInt(settings.programPrice.replace(/\s/g, ''))
                          ? 'bg-emerald-50 text-emerald-600'
                          : reg.amountPaid > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {reg.amountPaid.toLocaleString('fr-FR')} / {settings.programPrice}
                        </span>
                        {reg.paymentMethodActual && (
                          <span className="text-[9px] text-slate-400 italic ml-1">{reg.paymentMethodActual}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={reg.status}
                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-full border-none ring-1 transition-all uppercase tracking-wider ${
                          reg.status === 'new' ? 'bg-blue-50 text-blue-700 ring-blue-100' : 
                          reg.status === 'contacted' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
                          reg.status === 'registered' ? 'bg-green-50 text-green-700 ring-green-100' :
                          'bg-red-50 text-red-700 ring-red-100'
                        }`}
                      >
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacté</option>
                        <option value="registered">Inscrit</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!reg.isManual && (
                          <button 
                            onClick={async () => {
                              await updateRegistrationPayment(reg.id, { isManual: true } as any);
                              await updateRegistrationStatus(reg.id, 'registered');
                              toast.success('Participant validé comme inscrit !');
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 rounded-lg group"
                            title="Valider comme inscrit réel"
                          >
                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedRegId(reg.id)}
                          className="p-2 text-slate-400 hover:text-purple-600 transition-colors bg-slate-50 rounded-lg group"
                          title="Gérer le paiement et voir les détails"
                        >
                          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => setRegToDelete(reg.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmation Premium */}
      <ConfirmModal 
        isOpen={!!regToDelete}
        onClose={() => setRegToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'inscription ?"
        description="Cette action est irréversible. Toutes les données de cet inscrit seront définitivement effacées."
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default AdminRegistrations;
