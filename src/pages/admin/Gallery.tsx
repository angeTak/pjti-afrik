import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Trash2, Link as LinkIcon, ExternalLink, Upload } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

const AdminGallery = () => {
  const { gallery, addGalleryImage, deleteGalleryImage, uploadImage } = useAdmin();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;
    
    if (gallery.includes(newImageUrl)) {
      toast.error('Cette image est déjà dans la galerie');
      return;
    }

    await addGalleryImage(newImageUrl);
    setNewImageUrl('');
    toast.success('Image ajoutée à la galerie');
  };

  const confirmDelete = async () => {
    if (imageToDelete) {
      await deleteGalleryImage(imageToDelete);
      toast.error('Image retirée');
      setImageToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Galerie</h1>
        <p className="text-slate-500">Gérez les photos affichées dans la galerie et le carrousel</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-600" />
          Ajouter une photo
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: URL */}
          <form onSubmit={handleAdd} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Option 1 : Via une URL
            </h3>
            <div className="flex gap-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                placeholder="https://..."
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
              >
                Ajouter
              </button>
            </div>
          </form>

          {/* Option 2: Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Option 2 : Depuis mon PC
            </h3>
            <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const loadingToast = toast.loading(`Upload de ${files.length} image(s)...`);
                  let successCount = 0;
                  
                  for (let i = 0; i < files.length; i++) {
                    const url = await uploadImage(files[i], 'gallery');
                    if (url) {
                      await addGalleryImage(url);
                      successCount++;
                    }
                  }
                  
                  toast.dismiss(loadingToast);
                  if (successCount > 0) {
                    toast.success(`${successCount} image(s) ajoutée(s) avec succès`);
                  } else {
                    toast.error('Erreur lors de l\'upload');
                  }
                }
              }}
              className="hidden" 
              id="gallery-upload"
            />
            <label 
              htmlFor="gallery-upload"
              className="flex items-center justify-center gap-3 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer h-[52px]"
            >
              <Plus className="w-5 h-5" />
              Choisir une photo sur mon PC
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((url, idx) => (
          <div key={idx} className="group relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img 
              src={url} 
              alt={`Gallery ${idx}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/90 text-slate-700 rounded-lg hover:bg-white hover:text-purple-600 transition-colors shadow-sm"
                  title="Ouvrir l'image"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setImageToDelete(url)}
                  className="p-2 bg-white/90 text-slate-700 rounded-lg hover:bg-white hover:text-red-600 transition-colors shadow-sm"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {gallery.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">La galerie est vide</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={confirmDelete}
        title="Retirer cette image ?"
        description="Cette photo ne sera plus affichée dans le carrousel de la page d'accueil ni dans la galerie publique."
        confirmText="Retirer l'image"
        cancelText="Annuler"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default AdminGallery;
