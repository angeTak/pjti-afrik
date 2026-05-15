import { useEffect, useRef } from 'react';
import { 
  Laptop, 
  TrendingUp, 
  Briefcase, 
  UserCheck, 
  Cpu,
  Award,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Laptop,
    title: "Apprentissage ludique",
    description: "Des méthodes pratiques et adaptées pour apprendre en créant.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Compétences du futur",
    description: "Programmation, IA, outils numériques : les compétences essentielles de demain.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    icon: Briefcase,
    title: "Projets concrets",
    description: "Création de sites web, solutions cyber et projets IA réels.",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    icon: Cpu,
    title: "Création et Logique",
    description: "Développement de la pensée logique et de la créativité numérique.",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    icon: UserCheck,
    title: "Encadrement professionnel",
    description: "Des formateurs expérimentés et passionnés par la transmission.",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    icon: Award,
    title: "Certificat officiel",
    description: "Un certificat de participation valorisant les acquis de chaque jeune.",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600"
  },
];

const WhySection = () => {
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
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container px-6 md:px-4">
        {/* Header without badge */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Développez votre <br />
            <span className="text-blue-600">potentiel numérique</span>
          </h2>
          <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Notre approche permet aux jeunes de se développer sous plusieurs angles à travers des compétences concrètes et innovantes.
          </p>
        </div>

        {/* Illustration */}
        <div className="reveal opacity-0 delay-300 w-full max-w-4xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-blue-100/50 border border-slate-100">
          <img
            src="/digital-potential.png"
            alt="Jeunes talents développant leurs compétences numériques"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* ── Stats Strip ── */}
        <div className="reveal opacity-0 delay-300 grid grid-cols-3 gap-4 mb-16">
          {[
            { value: '5', unit: 'semaines', label: 'de formation intensive' },
            { value: '5', unit: 'modules', label: 'programmation · IA · cyber · design · challenge' },
            { value: '100%', unit: 'pratique', label: 'apprentissage par projet réel' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 group hover:bg-purple-600 transition-colors duration-300">
              <span className="text-3xl sm:text-4xl font-black text-white leading-none">{stat.value}</span>
              <span className="text-xs sm:text-sm font-black text-purple-400 group-hover:text-white uppercase tracking-widest mt-1 transition-colors">{stat.unit}</span>
              <span className="hidden sm:block text-[10px] text-slate-500 group-hover:text-white/70 mt-2 leading-tight transition-colors">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── Featured card + Side cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Hero Feature Card */}
          <div className="reveal opacity-0 delay-100 lg:col-span-2 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 sm:p-10 group hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-purple-900/20">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-colors duration-700" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-600/10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Laptop className="w-7 h-7 text-purple-400" />
                </div>
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Méthode phare</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
                Apprendre en <span className="text-purple-400">créant</span> de vraies solutions
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">
                Nos apprenants ne font pas que suivre des cours — ils construisent des sites web, développent des algorithmes d'IA et conçoivent des projets présentés devant un jury professionnel.
              </p>
              <a href="/formation" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all duration-300 hover:gap-4">
                Voir le programme <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Side card — Encadrement */}
          <div className="reveal opacity-0 delay-200 group relative p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-orange-100 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <UserCheck className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">Encadrement professionnel</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Des formateurs expérimentés et passionnés par la transmission du savoir-faire numérique.</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Mentors · Experts · Jury</span>
            </div>
          </div>
        </div>

        {/* ── Bottom 4-cards row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, title: 'Compétences du futur', desc: 'Programmation, IA, outils numériques essentiels.', bg: 'bg-blue-100', color: 'text-blue-600', hoverColor: 'group-hover:text-blue-600', num: '01' },
            { icon: Briefcase, title: 'Projets concrets', desc: 'Sites web, solutions cyber et projets IA réels.', bg: 'bg-green-100', color: 'text-green-600', hoverColor: 'group-hover:text-green-600', num: '02' },
            { icon: Cpu, title: 'Création & Logique', desc: 'Pensée algorithmique et créativité numérique.', bg: 'bg-pink-100', color: 'text-pink-600', hoverColor: 'group-hover:text-pink-600', num: '03' },
            { icon: Award, title: 'Certificat officiel', desc: 'Un certificat valorisant chaque compétence acquise.', bg: 'bg-cyan-100', color: 'text-cyan-600', hoverColor: 'group-hover:text-cyan-600', num: '04' },
          ].map((item, i) => (
            <div
              key={i}
              className={`reveal opacity-0 delay-${(i + 1) * 100} group relative p-6 rounded-[24px] bg-white border border-slate-100 shadow-lg shadow-slate-100/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 overflow-hidden`}
            >
              <span className="absolute top-4 right-5 text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors leading-none select-none">{item.num}</span>
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className={`text-base font-black text-slate-900 mb-2 relative z-10 ${item.hoverColor} transition-colors`}>{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed relative z-10 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal opacity-0 delay-300 mt-14 text-center">
          <a href="/formation" className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-purple-600/30 hover:gap-5">
            Découvrir nos modules de formation <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
