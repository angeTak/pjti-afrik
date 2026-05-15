import { useRef, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowRightCircle, Image as ImageIcon } from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';

const NewsCarouselSection = () => {
  const { news } = useAdmin();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const recentNews = news.slice(0, 6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [news]);

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScrollLeft - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="container max-w-4xl mx-auto text-center mb-12 lg:mb-16">
        <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
          Dernières <br />
          <span className="text-purple-600">Actualités</span>
        </h2>
        <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
          Suivez l'évolution du programme et restez informés des dernières nouvelles du pjti-Afrik.
        </p>
      </div>

      <div className="container relative px-4 sm:px-0">
        {recentNews.length === 0 ? (
          <div className="text-center py-20 px-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Bientôt du nouveau</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Restez connectés ! Les premières actualités du programme arrivent très bientôt.</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 sm:gap-8 snap-x snap-mandatory scrollbar-hide pb-12 px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recentNews.map((article, index) => (
              <div
                key={article.id}
                className={`reveal opacity-0 delay-${index * 100} w-[85vw] sm:w-[480px] shrink-0 snap-center group cursor-pointer`}
                onClick={() => { window.location.href = '/actualites'; }}
              >
                <div className="relative h-96 sm:h-[450px] rounded-[40px] overflow-hidden shadow-2xl mb-6 bg-slate-100 flex items-center justify-center group-hover:shadow-purple-200/50 transition-all duration-500">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-slate-300">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}

                  {/* Badge catégorie */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-2 rounded-full shadow-xl border border-white/20 uppercase tracking-[0.2em]">
                      {article.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Lire l'article <ArrowRightCircle className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="px-4">
                  {article.date && (
                    <div className="flex items-center gap-2 text-purple-600 text-xs font-black uppercase tracking-widest mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.1] group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container mt-4 flex justify-center reveal opacity-0 delay-300 px-4">
        <a
          href="/actualites"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all shadow-2xl shadow-slate-300 hover:-translate-y-1"
        >
          Voir tous les articles <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default NewsCarouselSection;
