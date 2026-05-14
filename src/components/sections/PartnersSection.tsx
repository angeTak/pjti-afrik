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
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Devenez <br />
            <span className="text-purple-600">partenaire</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Rejoignez-nous pour former la prochaine génération de créateurs numériques au Togo et soutenir l'innovation locale.
          </p>
        </div>

        {/* Partner logos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 sm:gap-24 items-center justify-center mb-10 sm:mb-24 px-4 sm:px-0">
          {partners.length > 0 ? (
            partners.slice(0, 4).map((partner) => (
              <div 
                key={partner.id}
                className={`reveal opacity-0 delay-${(partners.indexOf(partner) % 4 + 1) * 100} flex flex-col items-center justify-center group`}
              >
                <div className={`w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className={`w-full h-full rounded-[40px] ${partner.color || 'bg-slate-100'} flex items-center justify-center text-white font-black text-5xl shadow-xl`}>
                      {partner.initials}
                    </div>
                  )}
                </div>
                <span className="-mt-4 text-base sm:text-lg font-black text-slate-800 group-hover:text-purple-600 transition-colors uppercase tracking-widest">{partner.name}</span>
              </div>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`reveal opacity-0 delay-${i * 100} flex items-center justify-center opacity-30`}
              >
                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-slate-200 rounded-full animate-pulse" />
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="reveal opacity-0 delay-400 text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-5 sm:p-8 md:p-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              Soutenez l'éducation numérique au Togo
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
              En devenant partenaire, vous contribuez à offrir des opportunités 
              exceptionnelles aux enfants togolais et à réduire la fracture numérique.
            </p>
            <a 
              href="mailto:agcomelite@gmail.com" 
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
