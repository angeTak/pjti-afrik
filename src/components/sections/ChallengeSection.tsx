import { useEffect, useRef } from 'react';
import { Award, BookOpen, FileBadge, TrendingUp, CheckCircle2 } from 'lucide-react';

const rewards = [
  {
    icon: Award,
    title: "Prix pour les 3 meilleurs",
    description: "Récompenses spéciales pour les projets les plus innovants",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    title: "Opportunités futures",
    description: "Accompagnement et visibilité pour les meilleurs talents",
    color: "text-secondary"
  },
  {
    icon: BookOpen,
    title: "Fournitures scolaires",
    description: "Kit complet offert à tous les participants",
    color: "text-primary"
  },
  {
    icon: FileBadge,
    title: "Certificats officiels",
    description: "Attestation de participation et de compétences",
    color: "text-accent"
  }
];

const ChallengeSection = () => {
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
    <section ref={sectionRef} className="relative py-0 overflow-hidden bg-white">
      {/* Header OUTSIDE the purple background */}
      <div className="container px-6 md:px-4 pt-16 lg:pt-24 pb-12 lg:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Le challenge final
          </h2>
        </div>
      </div>

      <div className="relative py-16 lg:py-24">
        {/* Solid background - Platform Color */}
        <div className="absolute inset-0 bg-[#5f1a87]" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-200" />
        </div>

        <div className="container relative z-10 px-6 md:px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content - Timeline style */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-white/90 leading-relaxed font-medium">
                  À la fin du programme, les jeunes participent à un challenge basé sur 
                  des projets concrets devant un jury de professionnels.
                </p>

              <div className="reveal opacity-0 delay-300 space-y-6">
                {[
                  "Projets réels présentés devant un jury",
                  "Encourager la créativité et l'innovation",
                  "Travail d'équipe et présentation orale"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-white" />
                    </div>
                    <span className="text-white/80 font-bold tracking-wide group-hover:text-white transition-colors">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right content - Rewards Premium Cards */}
          <div className="reveal opacity-0 delay-400 relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-[40px] blur-2xl animate-pulse-slow" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-[40px] p-8 sm:p-10 border border-white/10 shadow-2xl">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-10 flex items-center gap-4 tracking-tighter">
                <span className="p-3 bg-accent rounded-2xl shadow-lg shadow-accent/20 text-white font-black">🏆</span>
                Récompenses
              </h3>

              <div className="grid gap-6">
                {rewards.map((reward, index) => (
                  <div 
                    key={index}
                    className="group flex items-center gap-5 p-5 rounded-3xl bg-white border border-white/20 hover:border-accent hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500"
                  >
                    <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${reward.color} group-hover:scale-110 transition-transform duration-500`}>
                      <reward.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg tracking-tight mb-1 group-hover:text-purple-600 transition-colors">{reward.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{reward.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default ChallengeSection;
