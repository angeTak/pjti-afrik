import React, { useState } from 'react';
import { Plus, Handshake, Trash2, Edit3, Type, Info, Upload, X } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, Partner } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

const AdminPartners = () => {
  const { partners, addPartner, updatePartner, deletePartner } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner>>({
    name: '',
    initials: '',
    description: '',
    category: 'Technologie',
    logo: '',
    color: 'bg-slate-900',
    textColor: 'text-slate-900',
    badgeBg: 'bg-slate-50',
    borderColor: 'border-slate-100'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentPartner.id) {
      await updatePartner(currentPartner.id, currentPartner);
      toast.success('Partenaire mis à jour');
    } else {
      await addPartner(currentPartner as any);
      toast.success('Partenaire ajouté');
    }
    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image est trop lourde (max 2Mo)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPartner({ ...currentPartner, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPartner({
      name: '',
      initials: '',
      description: '',
      category: 'Technologie',
      logo: '',
      color: 'bg-slate-900',
      textColor: 'text-slate-900',
      badgeBg: 'bg-slate-50',
      borderColor: 'border-slate-100'
    });
  };

  const handleEdit = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (partnerToDelete) {
      await deletePartner(partnerToDelete);
      toast.error('Partenaire supprimé');
      setPartnerToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Partenaires</h1>
          <p className="text-slate-500">Gérez les organisations partenaires du programme</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              {isEditing ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-purple-600" />}
              {isEditing ? "Modifier le partenaire" : "Nouveau partenaire"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={currentPartner.name}
                  onChange={(e) => setCurrentPartner({ ...currentPartner, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  placeholder="ex: Google for Education"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Initiales</label>
                  <input
                    type="text"
                    value={currentPartner.initials}
                    onChange={(e) => setCurrentPartner({ ...currentPartner, initials: e.target.value.toUpperCase().slice(0, 2) })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                    placeholder="ex: GE"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Catégorie</label>
                  <select
                    value={currentPartner.category}
                    onChange={(e) => setCurrentPartner({ ...currentPartner, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  >
                    <option value="Technologie">Technologie</option>
                    <option value="Institutionnel">Institutionnel</option>
                    <option value="Humanitaire">Humanitaire</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Logo du partenaire</label>
                <div className="flex items-center gap-4">
                  {currentPartner.logo ? (
                    <div className="relative w-16 h-16 rounded-xl border-2 border-slate-100 overflow-hidden bg-slate-50">
                      <img src={currentPartner.logo} alt="Logo preview" className="w-full h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setCurrentPartner({ ...currentPartner, logo: '' })}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-purple-500" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                  <div className="flex-1 text-[10px] text-slate-400 leading-tight">
                    Format PNG, JPG ou SVG. <br /> Taille max : 2Mo.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={currentPartner.description}
                  onChange={(e) => setCurrentPartner({ ...currentPartner, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors h-24 resize-none"
                  placeholder="Description du partenariat..."
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Partner List */}
        <div className="lg:col-span-2 space-y-4">
          <PartnerList 
            partners={partners} 
            onEdit={handleEdit} 
            onDelete={setPartnerToDelete} 
          />
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!partnerToDelete}
        onClose={() => setPartnerToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer ce partenaire ?"
        description="Cette organisation ne sera plus affichée sur le site. Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </AdminLayout>
  );
};

// Composant mémorisé pour éviter les re-renders inutiles lors de la saisie
const PartnerList = React.memo(({ partners, onEdit, onDelete }: any) => {
  if (partners.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 border-dashed">
        <Handshake className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-medium italic">Aucun partenaire enregistré</p>
      </div>
    );
  }

  return (
    <>
      {partners.map((partner: any) => (
        <div key={partner.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:border-purple-200 transition-all group">
          <div className={`w-full sm:w-16 h-24 sm:h-16 rounded-2xl ${partner.color || 'bg-slate-900'} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg overflow-hidden`}>
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain bg-white p-2" />
            ) : (
              partner.initials
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">{partner.category}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{partner.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-2">{partner.description}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => onEdit(partner)}
                className="p-2 text-slate-400 hover:text-amber-500 transition-colors bg-slate-50 rounded-lg"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onDelete(partner.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

export default AdminPartners;
