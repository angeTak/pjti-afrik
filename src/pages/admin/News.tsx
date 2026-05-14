import React, { useState } from 'react';
import { Plus, Newspaper, Trash2, Edit3, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin, NewsItem } from '@/context/AdminContext';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

const AdminNews = () => {
  const { news, addNews, updateNews, deleteNews } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsItem>>({
    title: '',
    date: new Date().toLocaleDateString('fr-FR'),
    category: 'Événement',
    image: '',
    excerpt: '',
    paragraph: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentArticle.id) {
      await updateNews(currentArticle.id, currentArticle);
      toast.success('Article mis à jour');
    } else {
      await addNews(currentArticle as any);
      toast.success('Article publié');
    }
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentArticle({
      title: '',
      date: new Date().toLocaleDateString('fr-FR'),
      category: 'Événement',
      image: '',
      excerpt: '',
      paragraph: ''
    });
  };

  const handleEdit = (article: NewsItem) => {
    setCurrentArticle(article);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (newsToDelete) {
      await deleteNews(newsToDelete);
      toast.error('Article supprimé');
      setNewsToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Actualités</h1>
          <p className="text-slate-500">Gérez les articles et annonces du programme</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              {isEditing ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-purple-600" />}
              {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Titre</label>
                <input
                  type="text"
                  value={currentArticle.title}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  placeholder="Litre de l'article"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Date</label>
                  <input
                    type="text"
                    value={currentArticle.date}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                    placeholder="ex: 20 Mai 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Catégorie</label>
                  <select
                    value={currentArticle.category}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  >
                    <option value="Événement">Événement</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Formation">Formation</option>
                    <option value="Succès">Succès</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Image de l'article</label>
                <div className="flex flex-col gap-3">
                  <input
                    type="url"
                    value={currentArticle.image}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                    placeholder="URL de l'image (ex: https://...)"
                  />
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const loadingToast = toast.loading('Upload de l\'image...');
                          const url = await uploadImage(file, 'news');
                          toast.dismiss(loadingToast);
                          if (url) {
                            setCurrentArticle({ ...currentArticle, image: url });
                            toast.success('Image chargée avec succès');
                          } else {
                            toast.error('Erreur lors de l\'upload');
                          }
                        }
                      }}
                      className="hidden" 
                      id="news-image-upload"
                    />
                    <label 
                      htmlFor="news-image-upload"
                      className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Charger depuis le PC
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Résumé court</label>
                <textarea
                  value={currentArticle.excerpt}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors h-20 resize-none"
                  placeholder="Une brève description..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Contenu complet</label>
                <textarea
                  value={currentArticle.paragraph}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, paragraph: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-purple-500 transition-colors h-40 resize-none"
                  placeholder="Le texte détaillé de l'article..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {isEditing ? 'Mettre à jour' : 'Publier'}
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

        {/* Article List */}
        <div className="lg:col-span-2 space-y-4">
          {news.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 border-dashed">
              <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium italic">Aucun article publié</p>
            </div>
          ) : (
            news.map((article) => (
              <div key={article.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:border-purple-200 transition-all group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {article.image ? (
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-wider">{article.category}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{article.excerpt}</p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => handleEdit(article)}
                      className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setNewsToDelete(article.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!newsToDelete}
        onClose={() => setNewsToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer cet article ?"
        description="Cette actualité sera définitivement retirée du site. Vous ne pourrez pas l'annuler."
        confirmText="Supprimer l'article"
        cancelText="Conserver"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default AdminNews;
