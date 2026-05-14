import { useEffect, useRef } from 'react';
import { CreditCard, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const PricingSection = () => {
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
  }, [settings]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-slate-50/50 overflow-hidden">
      <div className="container px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Un investissement <br />
            <span className="text-purple-600">dans l'avenir</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Un tarif unique et accessible pour une formation technologique complète et de haute qualité.
          </p>
        </div>

        {/* Simplified Pricing Banner */}
        <div className="max-w-3xl mx-auto">
          <div className="reveal opacity-0 delay-300 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 text-center">
            
            <div className="mb-6 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tarif unique</span>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-5xl sm:text-6xl font-black text-slate-900">{settings.programPrice}</span>
                <span className="text-xl font-bold text-slate-500">FCFA</span>
              </div>
              <p className="text-slate-600 mt-4 max-w-md mx-auto">
                Accès complet aux 5 semaines de programme (formation, challenge et remise des prix).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a 
                href="/tarifs" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Voir les détails et modalités <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
