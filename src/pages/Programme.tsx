import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookOpen, Trophy, Users, Award, ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import SeparatorPattern from '@/components/ui/SeparatorPattern';

const ProgrammeHero = () => (
  <div className="relative flex items-end justify-center overflow-hidden pt-28 pb-14 bg-slate-900">
    <div className="container relative z-10 text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-slate-200 text-sm mb-5 font-medium">
        Déroulement du programme
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
        1 Mois et 1 Semaine <br className="hidden sm:block" />
        <span className="text-purple-400">Pour Innover</span>
      </h1>

      <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        Découvrez les étapes clés du programme pjti-Afrik. De l'apprentissage intensif au couronnement des meilleurs projets lors de la remise des prix.
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <span className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" /> 5 Semaines au total
        </span>
        <span className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4" /> 3 Phases clés
        </span>
      </div>
    </div>
    {/* Pattern separator */}
    <div className="absolute bottom-0 left-0 w-full z-10">
      <SeparatorPattern />
    </div>
  </div>
);

const timelineSteps = [
  {
    phase: "Phase 1",
    title: "Formation Pratique",
    duration: "3 Semaines",
    icon: BookOpen,
    color: "bg-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    description: "Les élèves acquièrent des compétences pratiques à travers 5 modules informatique. Ils découvrent la programmation, l'intelligence artificielle, la cybersécurité, le design graphisme et le marketing digital.",
    details: [
      "Apprentissage par la pratique (Projets concrets)",
      "Encadrement par des mentors experts",
      "Évaluation continue des acquis"
    ]
  },
  {
    phase: "Phase 2",
    title: "Le Challenge",
    duration: "1 Semaine",
    icon: Trophy,
    color: "bg-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    description: "Les participants sont regroupés en équipes pour résoudre un problème local à l'aide des technologies apprises. C'est l'occasion de mettre en pratique leurs nouvelles compétences.",
    details: [
      "Travail d'équipe et collaboration",
      "Développement de solutions innovantes",
      "Préparation des livrables du projet"
    ]
  },
  {
    phase: "Phase 3",
    title: "Présentation et Vote",
    duration: "1 Semaine",
    icon: Users,
    color: "bg-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    description: "Les équipes présentent leurs solutions devant un jury et le public. Les projets sont évalués sur leur pertinence, leur innovation et la qualité de la présentation.",
    details: [
      "Pitch devant un jury d'experts",
      "Vote du public et des partenaires",
      "Défense du projet (Questions/Réponses)"
    ]
  },
  {
    phase: "Clôture",
    title: "Remise des Prix",
    duration: "Événement final",
    icon: Award,
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    description: "La grande cérémonie de clôture célèbre les efforts de tous les participants et récompense les meilleures équipes avec des prix exceptionnels et des opportunités d'accompagnement.",
    details: [
      "Cérémonie officielle de remise de trophées",
      "Networking avec les partenaires",
      "Exposition des projets réalisés"
    ]
  }
];

const TimelineSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Le Parcours du Participant</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Un programme structuré pour transformer la curiosité en compétences réelles, étape par étape.
          </p>
        </div>

        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform md:-translate-x-1/2"></div>

          <div className="space-y-12 relative z-10">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8`}>
                  
                  {/* Moitié vide pour l'alignement desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                  
                  {/* Icône centrale */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full border-4 border-white ${step.color} flex items-center justify-center shadow-lg z-10`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    <div className={`
                      p-6 sm:p-8 rounded-2xl border bg-white
                      ${isEven ? 'md:mr-10 md:text-right' : 'md:ml-10 text-left'}
                      ${step.borderColor} shadow-sm hover:shadow-md transition-shadow
                    `}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 ${step.bgColor} ${step.textColor}`}>
                        {step.phase} • {step.duration}
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <ul className={`space-y-2 flex flex-col ${isEven ? 'md:items-end' : 'items-start'}`}>
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                            {!isEven && <div className={`w-1.5 h-1.5 rounded-full ${step.color}`} />}
                            {detail}
                            {isEven && <div className={`w-1.5 h-1.5 rounded-full ${step.color} md:block hidden`} />}
                            {isEven && <div className={`w-1.5 h-1.5 rounded-full ${step.color} md:hidden block`} />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Programme = () => {
  useEffect(() => {
    document.title = "Programme - pjti-Afrik";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main>
        <ProgrammeHero />
        <TimelineSection />

        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container text-center max-w-xl mx-auto px-4">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Prêt à rejoindre l'aventure ?</h2>
            <p className="text-slate-600 text-base mb-8">
              Inscrivez votre enfant pour ce programme de 5 semaines et donnez-lui les clés pour façonner son avenir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/inscription" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-sm">
                S'inscrire au programme <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/formation" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 transition-colors shadow-sm">
                Voir le détail des formations
              </a>
            </div>
          </div>
        </section>
        <SeparatorPattern />
      </main>
      <Footer />
    </div>
  );
};

export default Programme;
