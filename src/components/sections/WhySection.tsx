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

        {/* Features grid - Premium Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`reveal opacity-0 delay-${(index % 3 + 1) * 100} group relative p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
            >
              {/* Animated Background Accent */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${feature.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-black text-slate-900 mb-3 relative z-10 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed relative z-10 font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="reveal opacity-0 delay-300 mt-12 sm:mt-16 text-center">
          <a href="/formation" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
            Découvrir nos modules de formation <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
