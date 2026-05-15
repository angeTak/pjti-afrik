import { useEffect, useRef } from 'react';
import { ArrowRight, Handshake } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const PartnersSection = () => {
  const { partners } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);

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
  }, [partners]);

  return (
    <section ref={sectionRef} className="pb-16 lg:pb-24 pt-0 lg:pt-0 bg-white overflow-hidden">
      <div className="container px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Devenez <br />
            <span className="text-purple-600">partenaire</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Rejoignez-nous pour former la prochaine génération de créateurs numériques en Afrique et soutenir l'innovation africaine.
          </p>
        </div>

        {/* Partner logos Carousel */}
        {partners.length > 0 ? (
          <div className="relative mb-10 sm:mb-24 overflow-hidden py-10 reveal opacity-0 delay-200">
            <div className="flex gap-12 sm:gap-24 animate-marquee items-center w-max">
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div 
                  key={`${partner.id}-${index}`}
                  className="flex flex-col items-center justify-center flex-shrink-0 w-[120px] sm:w-[180px] group"
                >
                  <div className="w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain transition-transform duration-500" />
                    ) : (
                      <div className={`w-full h-full rounded-[32px] sm:rounded-[48px] ${partner.color || 'bg-slate-100'} flex items-center justify-center text-white font-black text-2xl sm:text-4xl shadow-lg shadow-slate-200/50`}>
                        {partner.initials}
                      </div>
                    )}
                  </div>
                  <span className="mt-4 text-[10px] sm:text-xs font-black text-slate-400 group-hover:text-purple-600 transition-colors uppercase tracking-widest text-center">{partner.name}</span>
                </div>
              ))}
            </div>
            
            {/* Fade effect on sides for a premium look */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10" />
            
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
              .animate-marquee {
                animation: marquee 40s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}} />
          </div>
        ) : null}

        {/* CTA */}
        <div className="reveal opacity-0 delay-400 text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-5 sm:p-8 md:p-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              Soutenez l'éducation numérique dans votre pays
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
              En devenant partenaire, vous contribuez à offrir des opportunités exceptionnelles aux enfants d'Afrique et à réduire la fracture numérique.
            </p>
            <a 
              href="/partenaires" 
              className="btn-hero-primary inline-flex"
            >
              Devenir partenaire
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
