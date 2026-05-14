import { useEffect, useRef, useState } from 'react';
import { Shield, Code, Palette, Brain, Globe, Check, ChevronDown, ChevronUp } from 'lucide-react';

const formations = [
  {
    id: 'programmation',
    title: 'Programmation',
    icon: Code,
    description: 'Les bases du développement web à travers des exercices pratiques et des défis progressifs.',
    skills: [
      'Logique & algorithmique',
      'Création de pages web (HTML/CSS)',
      'Bases de JavaScript & Python',
      'Création web',
    ],
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
  },
  {
    id: 'cybersecurite',
    title: 'Cybersécurité',
    icon: Shield,
    description: 'Les bonnes pratiques de sécurité numérique pour identifier les menaces et s\'en protéger.',
    skills: [
      'Les cybermenaces courantes',
      'Bonnes pratiques en ligne',
      'Protection des données',
      'Sécurité des appareils',
    ],
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
  },
  {
    id: 'design',
    title: 'Design Digital',
    icon: Palette,
    description: 'La création graphique et le design numérique pour concevoir des visuels percutants.',
    skills: [
      'Principes fondamentaux du design',
      'Couleurs, typographie',
      'Création de visuels pour le web',
      'Réalisation graphique',
    ],
    color: 'bg-pink-600',
    textColor: 'text-pink-600',
  },
  {
    id: 'ia',
    title: 'Intelligence Artificielle',
    icon: Brain,
    description: 'Les outils d\'IA et leurs applications concrètes — pour comprendre, utiliser et créer.',
    skills: [
      'Comprendre le fonctionnement de l\'IA',
      'Outils IA accessibles',
      'Génération de contenu assistée',
      'IA éthique & enjeux',
    ],
    color: 'bg-purple-800',
    textColor: 'text-purple-800',
  },
  {
    id: 'culture',
    title: 'Culture Numérique',
    icon: Globe,
    description: 'Les enjeux du numérique d\'aujourd\'hui : outils, télétravail, marketing digital.',
    skills: [
      'Outils numériques professionnels',
      'Base du marketing digital',
      'Télétravail & collaboration',
      'Réseaux sociaux pro',
    ],
    color: 'bg-slate-800',
    textColor: 'text-slate-800',
  },
];

const delays = ['', 'delay-100', 'delay-200'];

const ModuleCard = ({ f, i }: { f: any; i: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = f.icon;

  return (
    <div 
      className={`reveal opacity-0 ${delays[i % 3]} w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm rounded-3xl bg-white border border-slate-200 p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-purple-200 group`}
    >
      <div className={`w-16 h-16 rounded-full ${f.color} flex items-center justify-center mb-6 shadow-md flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">{f.title}</h3>
      <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
        {f.description}
      </p>
      
      {/* Expanded Content */}
      <div 
        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
        }`}
      >
        <div className="w-full flex flex-col items-center space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Au programme
          </h4>
          <div className="flex flex-col items-center gap-3 w-full">
            {f.skills.map((skill: string, j: number) => (
              <div key={j} className="flex items-center justify-center gap-2 w-full text-center group/skill hover:scale-105 transition-transform duration-200">
                <Check className={`w-4 h-4 ${f.textColor} flex-shrink-0 hidden sm:block transition-transform duration-300 group-hover/skill:scale-125`} />
                <span className="text-sm font-medium text-slate-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-auto flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
          isExpanded 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-sm'
        }`}
      >
        {isExpanded ? (
          <>Moins de détails <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>Plus de détails <ChevronDown className="w-4 h-4 animate-bounce" /></>
        )}
      </button>
    </div>
  );
};

const FormationSection = () => {
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
    <section ref={sectionRef} id="formations" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="reveal opacity-0 w-24 h-1.5 bg-purple-600 rounded-full mb-6 animate-pulse-slow"></div>
          <h2 className="reveal opacity-0 delay-100 text-3xl sm:text-5xl font-black text-slate-900 mb-6 text-center">
            Les 5 modules du programme
          </h2>
          <p className="reveal opacity-0 delay-200 text-slate-600 text-base sm:text-lg text-center max-w-2xl">
            Chaque module dure <strong className="text-slate-900 border-b-2 border-purple-200">1 semaine</strong>. Les participants explorent les 5 domaines en groupe, encadrés par des formateurs professionnels.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {formations.map((f, i) => (
            <ModuleCard key={f.id} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormationSection;
