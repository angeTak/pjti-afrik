import { useEffect, useRef } from 'react';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto mb-16 lg:mb-28 text-center lg:text-left">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
            {/* Main Text Content */}
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-10">
                <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                  Un investissement <br />
                  <span className="text-purple-600">dans l'avenir de votre enfant</span>
                </h2>
                
                <p className="reveal opacity-0 delay-200 text-xl sm:text-2xl text-slate-700 leading-tight font-black">
                  Le numérique transforme déjà l’avenir… <br />
                  <span className="text-purple-600">et les leaders de demain sont ceux qui commencent aujourd’hui.</span>
                </p>
              </div>

              <div className="reveal opacity-0 delay-300 space-y-6">
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  Avec <span className="font-bold text-slate-900 border-b-4 border-purple-200">pjti-Afrik</span>, offrez à votre enfant bien plus qu’une simple formation : une expérience unique pour développer ses talents, sa créativité et sa confiance dans les métiers du futur.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                  {['Programmation', 'Intelligence Artificielle', 'Cybersécurité', 'Graphisme'].map((skill) => (
                    <span key={skill} className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider border border-purple-100 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-slate-500 text-sm sm:text-base italic font-medium">
                  Pendant 5 semaines intensives, il apprendra à créer, innover et relever de vrais défis technologiques.
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { title: "Pratique & Stimulant", desc: "Un programme accessible basé sur des projets réels." },
                { title: "Reconnaissance", desc: "Des challenges et des récompenses pour les meilleurs talents." },
                { title: "Compétences d'Avenir", desc: "Des acquis précieux qui feront toute la différence." }
              ].map((item, i) => (
                <div key={i} className={`reveal opacity-0 delay-${(i+5)*100} p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 flex items-start gap-4 hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group`}>
                   <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                   </div>
                   <div className="text-left">
                     <h4 className="font-black text-slate-900 text-base">{item.title}</h4>
                     <p className="text-slate-500 text-sm font-medium leading-snug">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Banner */}
          <div className="reveal opacity-0 delay-800 mt-16 p-8 sm:p-12 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse delay-700" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <p className="text-xl sm:text-2xl font-black mb-6 tracking-tight">
                Ne laissez pas passer cette opportunité exceptionnelle.
              </p>
              <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed mb-10">
                <span className="text-purple-400 font-black uppercase tracking-[0.2em] text-sm block mb-2">Les places sont limitées</span> 
                Inscrivez votre enfant dès aujourd’hui et préparez-le à devenir l’un des <span className="text-white font-bold">jeunes talents numériques de l’Afrique.</span>
              </p>

              <a 
                href="/inscription" 
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-purple-600 text-white font-black text-lg hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20 hover:scale-105 active:scale-95"
              >
                S'inscrire maintenant
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default PricingSection;
