import React, { useState } from 'react';
import { Save, Settings, Hash, Banknote, Calendar, Users, Info, Vote } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, SiteSettings } from '@/context/AdminContext';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState<SiteSettings>(settings);

  // Synchroniser le formulaire quand les données sont chargées depuis Supabase
  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    toast.success('Paramètres enregistrés');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez les chiffres et informations clés du site</p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tarification */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              Tarification et Modalités
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix du programme (FCFA)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.programPrice}
                    onChange={(e) => setFormData({ ...formData, programPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                    placeholder="ex: 50 000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date limite d'inscription</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                    placeholder="ex: 15 Juin 2025"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques et Chiffres */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              Chiffres Clés
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de places</label>
                <input
                  type="text"
                  value={formData.participantsCount}
                  onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de partenaires</label>
                <input
                  type="text"
                  value={formData.partnersCount}
                  onChange={(e) => setFormData({ ...formData, partnersCount: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Durée (semaines)</label>
                <input
                  type="text"
                  value={formData.durationWeeks}
                  onChange={(e) => setFormData({ ...formData, durationWeeks: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tranche d'âge</label>
                <input
                  type="text"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Information box */}
          <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800 leading-relaxed">
              <p className="font-bold mb-1">Impact des changements</p>
              Les chiffres modifiés ici seront automatiquement mis à jour sur la page d'accueil, la page des tarifs et la page des partenaires pour garantir la cohérence des informations affichées aux utilisateurs.
            </div>
          </div>

          {/* Période de vote globale */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Période de vote globale
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Ces dates s'appliquent à <strong>toutes les équipes</strong>. Pendant cette période, la page <strong>Vote de projet</strong> affichera un bandeau "Vote en cours".
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date et heure de début des votes</label>
                <input
                  type="datetime-local"
                  value={formData.voteStartDate ? formData.voteStartDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, voteStartDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date et heure de fin des votes</label>
                <input
                  type="datetime-local"
                  value={formData.voteEndDate ? formData.voteEndDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, voteEndDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            {formData.voteStartDate && formData.voteEndDate && (
              <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-100 text-sm text-purple-800 font-medium">
                🗳 Votes planifiés du <strong>{new Date(formData.voteStartDate).toLocaleString('fr-FR')}</strong> au <strong>{new Date(formData.voteEndDate).toLocaleString('fr-FR')}</strong>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-10 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-3"
            >
              <Save className="w-5 h-5" /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
