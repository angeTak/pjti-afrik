import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code, Laptop, Users } from 'lucide-react';

const ageGroups = [
  {
    id: '7-10',
    ageRange: '7 – 10 ans',
    title: 'Découverte Numérique',
    emoji: '👶',
    description: 'Découverte de l\'ordinateur, logique numérique, jeux éducatifs, Scratch, créativité et mini-projets.',
    skills: [
      'Utilisation de l\'ordinateur',
      'Logique et pensée computationnelle',
      'Introduction à Scratch',
      'Jeux éducatifs interactifs',
      'Mini-projets créatifs'
    ],
    cardClass: 'age-card-7',
    accentColor: 'bg-accent',
    textColor: 'text-accent'
  },
  {
    id: '11-14',
    ageRange: '11 – 14 ans',
    title: 'Initiation au Développement',
    emoji: '👦',
    description: 'Initiation au développement web, HTML & CSS, découverte de l\'IA, création de mini-sites et travail en équipe.',
    skills: [
      'HTML & CSS fondamentaux',
      'Création de sites web simples',
      'Introduction à l\'IA',
      'Travail collaboratif',
      'Projets en équipe'
    ],
    cardClass: 'age-card-11',
    accentColor: 'bg-secondary',
    textColor: 'text-secondary'
  },
  {
    id: '15-18',
    ageRange: '15 – 18 ans',
    title: 'Formations Spécialisées',
    emoji: '👨‍💻',
    description: 'Formations avancées dans les domaines clés du numérique : cybersécurité, programmation, webdesign et intelligence artificielle.',
    skills: [
      'Cybersécurité',
      'Programmation avancée',
      'Webdesign professionnel',
      'Intelligence artificielle',
      'Projets réels',
      'Certifications'
    ],
    cardClass: 'age-card-15',
    accentColor: 'bg-primary',
    textColor: 'text-primary'
  }
];

const StructureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="reveal opacity-0 section-badge mx-auto">
            <BookOpen className="w-4 h-4" />
            <span>Structure de la formation</span>
          </div>
          <h2 className="reveal opacity-0 delay-100 section-title">
            Un programme{' '}
            <span className="text-primary">adapté à chaque âge</span>
          </h2>
          <p className="reveal opacity-0 delay-200 section-subtitle mx-auto">
            Trois niveaux de formation conçus pour accompagner chaque enfant 
            selon son âge et son niveau de compétences.
          </p>
        </div>

        {/* Age group cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {ageGroups.map((group, index) => (
            <div
              key={group.id}
              className={`reveal opacity-0 delay-${(index + 1) * 100} ${group.cardClass}`}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{group.emoji}</span>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${group.accentColor} text-white mb-1`}>
                    {group.ageRange}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{group.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-4">{group.description}</p>

              {/* Toggle button */}
              <button
                onClick={() => toggleCard(group.id)}
                className={`flex items-center gap-2 ${group.textColor} font-semibold hover:opacity-80 transition-opacity`}
              >
                {expandedCard === group.id ? (
                  <>
                    Masquer les détails
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Voir les détails
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Expanded content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCard === group.id ? 'max-h-96 mt-4' : 'max-h-0'
                }`}
              >
                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-semibold text-foreground mb-3">Compétences acquises :</h4>
                  <ul className="space-y-2">
                    {group.skills.map((skill, skillIndex) => (
                      <li key={skillIndex} className="flex items-center gap-2 text-muted-foreground">
                        <span className={`w-2 h-2 rounded-full ${group.accentColor}`} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StructureSection;
