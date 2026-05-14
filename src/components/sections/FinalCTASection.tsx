import { useEffect, useRef } from 'react';
import { ArrowRight, Timer } from 'lucide-react';
import separatorPattern from '@/assets/separator-pattern.png';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { useAdmin } from '@/context/AdminContext';

const FinalCTASection = () => {
  const { settings } = useAdmin();
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
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden">
      {/* Solid background */}
      <div className="absolute inset-0 bg-[#a12CE7]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-200" />
      </div>

      <div className="container relative z-10 px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            Investissez dans <br />
            <span className="text-accent">l'avenir numérique</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto mb-10">
            Les places sont limitées pour cette première édition au Togo. Ne manquez pas cette opportunité unique pour vos enfants.
          </p>
        </div>

          <div className="reveal opacity-0 delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/partenaires" className="btn-hero-primary group">
              Réserver une place maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="reveal opacity-0 delay-400 text-white/60 text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-10 text-center mx-auto max-w-2xl">
            Programme PJTI-AFRIK – 50 000 FCFA | Certificat inclus | 04 prix à gagner | Trophée | et d'autres avantages
          </p>
        </div>

      {/* Pattern separator - toward footer */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <SeparatorPattern />
      </div>
    </section>
  );
};

export default FinalCTASection;
