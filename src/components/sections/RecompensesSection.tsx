import { useEffect, useRef } from 'react';
import { Lightbulb, Target, Zap, Star, Tv, Crown, Gift, BookOpen, Award, Users } from 'lucide-react';

const judgingCriteria = [
  { icon: Lightbulb, label: 'Innovation',          color: 'text-pink-600',  borderColor: 'border-pink-200', bg: 'bg-pink-50' },
  { icon: Target,    label: 'Utilité',              color: 'text-blue-600',   borderColor: 'border-blue-200', bg: 'bg-blue-50' },
  { icon: Zap,       label: 'Qualité Technique',    color: 'text-purple-600', borderColor: 'border-purple-200', bg: 'bg-purple-50' },
  { icon: Star,      label: 'Créativité',           color: 'text-pink-600',   borderColor: 'border-pink-200', bg: 'bg-pink-50' },
  { icon: Tv,        label: 'Présentation',         color: 'text-blue-600',   borderColor: 'border-blue-200', bg: 'bg-blue-50' },
];

const podium = [
  {
    rank: 2, medal: '🥈', name: '2ème place',
    rewards: ['Certificat de finaliste', 'Prix financier & matériel', 'Opportunités futures'],
    textColor: 'text-purple-700', borderColor: 'border-purple-200',
    podiumBg: 'bg-purple-50', podiumH: 'h-24 md:h-32', order: 'order-1',
  },
  {
    rank: 1, medal: '🥇', name: '1ère place',
    rewards: ['Trophée pjti-Afrik', 'Certificat d\'excellence', 'Prix financier & matériel', 'Opportunités futures'],
    textColor: 'text-pink-600', borderColor: 'border-pink-200',
    podiumBg: 'bg-pink-50', podiumH: 'h-40 md:h-48', order: 'order-2',
    isFirst: true,
  },
  {
    rank: 3, medal: '🥉', name: '3ème place',
    rewards: ['Certificat de mérite', 'Prix financier & matériel', 'Opportunités futures'],
    textColor: 'text-blue-600', borderColor: 'border-blue-200',
    podiumBg: 'bg-blue-50', podiumH: 'h-16 md:h-24', order: 'order-3',
  },
];

const allGet = [
  { icon: BookOpen, label: 'Certificat de participation' },
  { icon: Award,    label: 'Portfolio de projets' },
  { icon: Target,   label: 'Attestation de compétences' },
  { icon: Users,    label: 'Accès au réseau alumni PJTI' },
];

const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];

const RecompensesSection = () => {
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white border-t border-slate-200 overflow-hidden">
      <div className="container relative z-10">

        <div className="mb-20 max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="reveal opacity-0 w-24 h-1.5 bg-blue-600 rounded-full mb-6 animate-pulse-slow"></div>
          <h2 className="reveal opacity-0 delay-100 text-3xl sm:text-5xl font-black text-slate-900 mb-6">
            Le challenge final & les récompenses
          </h2>
          <p className="reveal opacity-0 delay-200 text-slate-600 text-lg sm:text-xl max-w-2xl">
            Après 4 semaines de formation, chaque participant développe un projet et le présente devant un jury lors de la 5ème semaine.
          </p>
        </div>

        {/* Critères d'évaluation */}
        <div className="reveal opacity-0 delay-200 mb-28 flex flex-col items-center text-center">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Critères d'évaluation du jury</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {judgingCriteria.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className={`flex flex-col items-center justify-center gap-3 px-8 py-5 rounded-2xl border ${c.borderColor} ${c.bg} transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-default group`}>
                  <Icon className={`w-8 h-8 ${c.color} transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12`} />
                  <span className="text-base font-bold text-slate-800 text-center">{c.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Podium */}
        <div className="reveal opacity-0 delay-300 mb-32 flex flex-col items-center w-full relative">
          {/* Subtle background glow for podium */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-full blur-3xl -z-10 opacity-70"></div>

          <div className="flex items-end justify-center gap-4 sm:gap-8 w-full max-w-6xl relative z-10">
            {podium.map((p) => (
              <div key={p.rank} className={`${p.order} flex flex-col items-center flex-1 group/podium`}>
                
                {/* Podium Card */}
                <div className={`w-full rounded-3xl border ${p.borderColor} bg-white/80 backdrop-blur-sm p-4 sm:p-8 flex flex-col items-center text-center mb-0 relative z-10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:bg-white`}>
                  {p.isFirst && <Crown className="w-14 h-14 text-pink-500 mb-6 animate-float" />}
                  <div className="text-5xl sm:text-6xl mb-4 transition-transform duration-500 group-hover/podium:scale-125 group-hover/podium:rotate-12">{p.medal}</div>
                  <div className={`font-black ${p.textColor} text-xl sm:text-2xl mb-8 uppercase tracking-widest`}>{p.name}</div>
                  
                  <div className="flex flex-col items-center gap-4 hidden sm:flex w-full">
                    {p.rewards.map((r, i) => (
                      <div key={i} className="flex flex-col items-center text-center group/reward hover:scale-110 transition-transform">
                        <span className="text-sm font-bold text-slate-600 px-2 leading-tight">{r}</span>
                        {i !== p.rewards.length - 1 && (
                          <div className={`w-4 h-0.5 rounded-full bg-slate-200 mt-4 transition-all duration-300 group-hover/reward:w-10 group-hover/reward:bg-${p.textColor.split('-')[1]}-300`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Podium Step */}
                <div className={`w-[95%] sm:w-full ${p.podiumH} ${p.podiumBg} rounded-t-2xl -mt-6 pt-10 flex items-start justify-center border-x border-t ${p.borderColor} shadow-inner transition-all duration-500 group-hover/podium:brightness-105`}>
                  <span className={`font-black text-4xl sm:text-5xl opacity-40 ${p.textColor}`}>{p.rank}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Base */}
          <div className="h-6 bg-slate-100 rounded-b-3xl w-full max-w-6xl border-x border-b border-slate-200 shadow-md relative z-10" />
        </div>

        {/* Pour Tous */}
        <div className="reveal opacity-0 delay-400 flex flex-col items-center text-center">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">Tous les participants reçoivent</h3>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {allGet.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`w-[calc(50%-0.75rem)] sm:w-auto flex flex-col items-center gap-5 p-6 sm:px-10 py-8 rounded-3xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white group`}>
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-125 group-hover:border-blue-200 group-hover:bg-blue-50">
                    <Icon className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-base font-black text-slate-800 text-center max-w-[150px]">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RecompensesSection;
