import { useEffect, useRef } from 'react';
import { GraduationCap, Award, Code, Briefcase, Heart, Star } from 'lucide-react';

const skillCategories = [
  {
    icon: Code,
    title: 'Compétences Techniques',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    items: [
      'Programmation & développement web', 
      'Cybersécurité & bonnes pratiques', 
      'Design digital & UI/UX', 
      'Outils d\'Intelligence artificielle', 
      'Culture & marketing digital'
    ],
  },
  {
    icon: Briefcase,
    title: 'Compétences Professionnelles',
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    items: [
      'Travail en équipe structuré', 
      'Gestion de projet basique', 
      'Communication technique', 
      'Présentation & Pitch', 
      'Veille technologique'
    ],
  },
  {
    icon: Heart,
    title: 'Compétences Personnelles',
    color: 'bg-pink-600',
    textColor: 'text-pink-600',
    items: [
      'Autonomie & initiative', 
      'Confiance en soi', 
      'Esprit critique', 
      'Créativité appliquée', 
      'Persévérance'
    ],
  },
];

const certifications = [
  {
    icon: GraduationCap,
    title: 'Certificat de participation',
    desc: 'Tous les participants reçoivent une attestation officielle de complétion du programme.',
  },
  {
    icon: Award,
    title: 'Certificat de compétences',
    desc: 'Validation des compétences techniques acquises durant la formation.',
  },
  {
    icon: Star,
    title: 'Certificat d\'excellence',
    desc: 'Distinction spéciale pour les participants ayant présenté des projets remarquables.',
  },
];

const delays = ['', 'delay-100', 'delay-200'];

const EmporteSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }); },
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="container relative z-10">

        <div className="mb-16 max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="reveal opacity-0 w-24 h-1.5 bg-pink-600 rounded-full mb-6 animate-pulse-slow"></div>
          <h2 className="reveal opacity-0 delay-100 text-3xl sm:text-5xl font-black text-slate-900 mb-6">
            Ce que votre enfant repart avec
          </h2>
          <p className="reveal opacity-0 delay-200 text-slate-600 text-lg sm:text-xl max-w-2xl">
            En 5 semaines, les élèves développent des compétences techniques et humaines, et repartent avec des certifications officielles.
          </p>
        </div>

        {/* Compétences */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-24">
          {skillCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div 
                key={i} 
                className={`reveal opacity-0 ${delays[i % 3]} w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] rounded-3xl border border-slate-200 bg-white p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group`}
              >
                <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center mb-6 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-8 group-hover:text-pink-600 transition-colors duration-300">{cat.title}</h3>
                <div className="flex flex-col items-center gap-5 w-full">
                  {cat.items.map((item, j) => (
                    <div key={j} className="flex flex-col items-center w-full group/item hover:scale-105 transition-transform duration-200">
                      <span className="text-sm sm:text-base font-medium text-slate-600 mb-2">{item}</span>
                      {j !== cat.items.length - 1 && (
                        <div className={`w-6 h-0.5 rounded-full ${cat.color} opacity-30 transition-all duration-300 group-hover/item:w-12 group-hover/item:opacity-100`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="reveal opacity-0 delay-300 bg-white rounded-[2.5rem] p-8 sm:p-14 border border-slate-200 shadow-xl flex flex-col items-center text-center max-w-6xl mx-auto relative overflow-hidden group/cert">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 transition-transform duration-1000 group-hover/cert:scale-150 group-hover/cert:bg-purple-100/50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-50 rounded-full blur-3xl -z-10 transition-transform duration-1000 group-hover/cert:scale-150 group-hover/cert:bg-pink-100/50"></div>

          <h3 className="font-black text-slate-900 text-3xl mb-12 relative z-10">Les Certifications Officielles</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 relative z-10">
            {certifications.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <div key={i} className="flex flex-col items-center max-w-[280px] group/card cursor-default">
                  <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-purple-100 flex items-center justify-center mb-6 shadow-sm transition-all duration-500 group-hover/card:scale-125 group-hover/card:bg-purple-50 group-hover/card:border-purple-300 group-hover/card:shadow-purple-200/50">
                    <Icon className="w-10 h-10 text-purple-600 transition-transform duration-500 group-hover/card:-translate-y-1" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl mb-3 transition-colors duration-300 group-hover/card:text-purple-700">{cert.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{cert.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default EmporteSection;
