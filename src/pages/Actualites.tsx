import { useEffect, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { Calendar, ArrowRight, Image as ImageIcon, Newspaper, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAdmin } from '@/context/AdminContext';

const ActualitesPage = () => {
  const { news: newsItems, gallery: galleryImages, isLoading } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'actualites' | 'galerie'>('actualites');

  const handleShare = async (title: string, text: string, url: string = window.location.href) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log('Erreur de partage:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papier !');
    }
  };

  useEffect(() => {
    document.title = "Actualités & Galerie - pjti-Afrik";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab, newsItems, galleryImages]);

  return (
    <div className="min-h-screen bg-white" ref={sectionRef}>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-slate-900">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          </div>

          <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Newspaper className="w-4 h-4 text-purple-400" />
              Actualités & Galerie
            </div>
            
            <h1 className="reveal opacity-0 delay-100 text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tight">
              Suivez l'aventure <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">pjti-Afrik</span>
            </h1>
            
            <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
              Découvrez nos derniers articles, les moments forts des formations et les projets inspirants de nos jeunes talents.
            </p>

            {/* Tab Switcher */}
            <div className="reveal opacity-0 delay-300 inline-flex p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-8">
              <button 
                onClick={() => setActiveTab('actualites')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'actualites' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-white/60 hover:text-white'}`}
              >
                <Newspaper className="w-4 h-4" />
                Derniers articles
              </button>
              <button 
                onClick={() => setActiveTab('galerie')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'galerie' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-white/60 hover:text-white'}`}
              >
                <ImageIcon className="w-4 h-4" />
                Visiter notre galerie
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full z-10">
            <SeparatorPattern />
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 lg:py-28 bg-slate-50 min-h-[50vh]">
          <div className="container max-w-6xl mx-auto">
            
            {/* ACTUALITÉS */}
            {activeTab === 'actualites' && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 h-96 animate-pulse" />
                    ))
                  ) : newsItems.length > 0 ? (
                    newsItems.map((item, index) => (
                      <article 
                        key={item.id}
                        className={`reveal opacity-0 delay-${(index % 3 + 1) * 100} bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col`}
                      >
                        {/* Image mise en valeur */}
                        <div className="relative h-64 sm:h-72 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-purple-600/90">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Contenu allégé */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">{item.date}</span>
                          </div>

                          <h2 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {item.title}
                          </h2>

                          {item.excerpt && expandedId !== item.id && (
                            <p className="text-slate-600 text-sm mb-5 line-clamp-1">
                              {item.excerpt}
                            </p>
                          )}

                          {expandedId === item.id && (
                            <div className="animate-fade-in mb-5">
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {item.paragraph}
                              </p>
                            </div>
                          )}

                          <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100/50 mt-2">
                            <button 
                              onClick={() => setExpandedId(expandedId === item.id ? null : Number(item.id))}
                              className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm hover:text-purple-800 transition-colors group/link mt-2"
                            >
                              {expandedId === item.id ? 'Réduire' : 'Lire en plus'}
                              <ArrowRight className={`w-4 h-4 transition-transform ${expandedId === item.id ? '-rotate-90' : 'group-hover/link:translate-x-1'}`} />
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                handleShare(item.title, item.excerpt || 'Découvrez cette actualité sur pjti-Afrik');
                              }}
                              className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors mt-2"
                              title="Partager cet article"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Newspaper className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun article pour le moment</h3>
                      <p className="text-slate-500">Revenez bientôt pour suivre nos actualités.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GALERIE */}
            {activeTab === 'galerie' && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {isLoading ? (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-white rounded-2xl border border-slate-200 animate-pulse" />
                    ))
                  ) : galleryImages.length > 0 ? (
                    galleryImages.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => setExpandedId(index)} // Using expandedId to store the index of the selected gallery image
                        className={`reveal opacity-0 delay-${(index % 3 + 1) * 100} group relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-500`}
                      >
                        <img 
                          src={image} 
                          alt={`Galerie image ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Galerie vide</h3>
                      <p className="text-slate-500">Aucune image n'a été ajoutée pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activeTab === 'galerie' && expandedId !== null && typeof expandedId === 'number' && galleryImages[expandedId] && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                onClick={() => setExpandedId(null)}
              >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors bg-white/10 rounded-full p-2 backdrop-blur-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  <img 
                    src={galleryImages[expandedId]} 
                    alt="Aperçu grand format" 
                    className="w-[95vw] h-[85vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-white/60 text-sm mt-4">Cliquez n'importe où pour fermer</p>
                </div>
              </div>
            )}

          </div>
        </section>

        <SeparatorPattern />
      </main>

      <Footer />
    </div>
  );
};

export default ActualitesPage;
