import { useEffect, useRef } from 'react';
import { GraduationCap, Info, MapPin, Phone, Compass, Globe, Briefcase, BookOpen, ArrowRight } from 'lucide-react';

const AboutSection = () => {
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
    <section ref={sectionRef} id="programme" className="py-16 lg:py-24 bg-white border-t border-slate-200 overflow-hidden">

      <div className="container px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Une initiative éducative <br />
            <span className="text-purple-600">innovante</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Notre programme est dédié à la formation des jeunes aux compétences Informatique et intelligence artificielle.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Left content */}
          <div className="space-y-6 sm:space-y-8 lg:sticky lg:top-32">
            <p className="reveal opacity-0 delay-300 text-base sm:text-lg text-slate-600 leading-relaxed">
              Nous croyons que <strong className="text-slate-900 font-bold">l'avenir se construit aujourd'hui</strong>. 
              À travers une pédagogie pratique orientée projet, nous initions les jeunes aux compétences du moment et futures.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="reveal opacity-0 delay-400 flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Formation certifiante en programmation, IA, cybersécurité et graphisme.
                </p>
              </div>
              <div className="reveal opacity-0 delay-500 flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Accompagnement par des mentors professionnels du secteur.
                </p>
              </div>
            </div>

            <div className="reveal opacity-0 delay-600 pt-4">
              <a href="/programme" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-slate-200">
                Tout savoir sur le programme <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right content - Vision cards */}
          <div className="grid gap-4 sm:gap-6">
            <div className="reveal opacity-0 relative p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 transition-all duration-500 hover:-translate-y-2 group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-500">
                  <Compass className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">Notre Vision</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                    Éducation numérique accessible et inclusive pour les talents en Afrique.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal opacity-0 delay-100 relative p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 transition-all duration-500 hover:-translate-y-2 group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-500">
                  <BookOpen className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">Approche</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                    Apprentissage par la pratique avec des projets concrets.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal opacity-0 delay-200 relative p-6 sm:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 transition-all duration-500 hover:-translate-y-2 group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600 transition-colors duration-500">
                  <Globe className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-pink-600 transition-colors">Impact</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                    Préparer la jeunesse africaine aux métiers technologiques de demain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
