// ============================================================
// Données & types du Tunnel de vente "Angelo"
// Ces valeurs servent de contenu par défaut (mock) et sont
// éditables depuis l'admin (persistées dans Supabase).
// ============================================================

export type FormationType = 'formation' | 'coaching' | 'accompagnement';

export interface FunnelStat {
  value: string;
  label: string;
}

export interface AudienceItem {
  title: string;
  text: string;
}

export interface ProgramDay {
  day: string;
  title: string;
  items: string[];
}

export interface Formation {
  id: string;
  type: FormationType;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  oldPrice?: string;
  duration: string;
  format: string;
  seatsTotal: number;   // 0 = illimité
  seatsTaken: number;
  highlights: string[];
  audience: AudienceItem[];
  program: ProgramDay[];
  bonus: string[];
  isPublished: boolean;
  isFeatured: boolean;
  orderIndex: number;
}

export interface FunnelSettings {
  brand: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroCta: string;
  photoUrl: string;
  videoUrl: string;
  videoThumbUrl: string;
  stats: FunnelStat[];
  painTitle: string;
  pains: string[];
  aboutTitle: string;
  aboutText: string;
  offerTitle: string;
  offerDeadline: string; // date ISO pour le compte à rebours
  audienceTitle: string;
  audience: AudienceItem[];
  resultsTitle: string;
  results: string[];
  finalTitle: string;
  finalSubtitle: string;
  finalCta: string;
}

export interface FunnelLead {
  id: string;
  created_at: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  formationId?: string | null;
  formationTitle?: string;
  leadType: 'reservation' | 'contact' | 'coaching' | 'accompagnement';
  message?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
}

// ------------------------------------------------------------
// Contenu par défaut de la page /angelo
// ------------------------------------------------------------
export const defaultFunnelSettings: FunnelSettings = {
  brand: 'ANGELO',
  heroEyebrow: "Arrêtez de subir. Prenez une longueur d'avance.",
  heroTitle: 'Développez votre entreprise',
  heroHighlight: "grâce à l'Intelligence Artificielle",
  heroSubtitle:
    "En seulement 3 jours, apprenez à utiliser les meilleurs outils d'IA pour automatiser vos tâches, produire davantage en moins de temps et faire de l'Intelligence Artificielle votre meilleur collaborateur.",
  heroCta: 'Je réserve ma place maintenant',
  photoUrl: '/angelo.jpg',
  videoUrl: '',
  videoThumbUrl: '',
  stats: [
    { value: '+500', label: 'entrepreneurs formés' },
    { value: '3 jours', label: 'pour tout maîtriser' },
    { value: '5x', label: 'plus productif' },
  ],
  painTitle: 'Vous rencontrez souvent ces difficultés ?',
  pains: [
    'Vous manquez de temps pour gérer toutes vos activités.',
    'Vous passez des heures à rédiger des documents ou des emails.',
    'Vous ne savez jamais quoi publier sur vos réseaux sociaux.',
    "Vous manquez d'idées pour développer votre entreprise.",
    'Vous effectuez des tâches répétitives qui vous font perdre un temps précieux.',
    "Vous entendez parler de ChatGPT et de l'IA, mais vous ne savez pas comment les utiliser efficacement.",
    "Vous avez peur de prendre du retard face à des concurrents qui utilisent déjà l'IA.",
  ],
  aboutTitle: 'Qui suis-je ?',
  aboutText:
    "Je suis Angelo, formateur et consultant en Intelligence Artificielle appliquée au business. J'accompagne les entrepreneurs, freelances et entreprises à intégrer l'IA dans leur quotidien pour gagner du temps, produire davantage et développer leur activité.\n\nAprès avoir formé des centaines de professionnels, ma mission est simple : rendre l'Intelligence Artificielle accessible et concrètement rentable pour votre entreprise.",
  offerTitle: 'Ce que je vous offre aujourd\'hui',
  offerDeadline: '2026-12-31T23:59:00',
  audienceTitle: 'Pour qui est cette formation ?',
  audience: [
    {
      title: "Entrepreneur ou Chef d'entreprise",
      text: "Vous dirigez une entreprise et souhaitez gagner du temps, améliorer votre organisation et développer votre activité.",
    },
    {
      title: 'Porteur de projet ou Futur entrepreneur',
      text: "Vous avez une idée d'entreprise et souhaitez construire un projet solide plus rapidement grâce à l'IA.",
    },
    {
      title: 'Freelance ou Indépendant',
      text: 'Développeur, graphiste, consultant, photographe, rédacteur, designer… Produisez plus, livrez plus vite et augmentez votre rentabilité.',
    },
    {
      title: 'Commerçant',
      text: 'Attirez plus de clients, créez des publicités efficaces et améliorez votre communication.',
    },
    {
      title: 'Formateur ou Coach',
      text: 'Préparez vos supports de formation, exercices, présentations et contenus pédagogiques en un temps record.',
    },
    {
      title: 'Community Manager / Marketing',
      text: 'Créez des publications, des campagnes publicitaires, des calendriers éditoriaux et des visuels professionnels grâce à l\'IA.',
    },
    {
      title: 'E-commerçant',
      text: 'Rédigez vos fiches produits, automatisez votre communication et améliorez votre expérience client.',
    },
    {
      title: 'Prestataire de services',
      text: 'Bâtiment, beauté, restauration, événementiel, immobilier, santé, transport… utilisez l\'IA pour travailler plus efficacement.',
    },
  ],
  resultsTitle: 'Ce que vous serez capable de faire après seulement 3 jours',
  results: [
    "Utiliser ChatGPT et les meilleurs outils d'Intelligence Artificielle avec efficacité.",
    'Créer des documents professionnels en quelques minutes.',
    "Élaborer un Business Plan et une stratégie commerciale assistés par l'IA.",
    'Rédiger des devis, propositions commerciales et emails professionnels rapidement.',
    'Produire des publications, des publicités et des contenus marketing de qualité.',
    'Générer des visuels professionnels pour votre communication.',
    "Créer un site web pour vos services assisté par l'IA.",
    'Trouver de nouvelles idées pour développer votre entreprise.',
    'Automatiser certaines tâches répétitives.',
    'Gagner plusieurs heures de travail chaque semaine.',
    "Intégrer l'IA dans votre activité quotidienne comme un véritable assistant personnel.",
  ],
  finalTitle: 'Prêt à faire partie des entrepreneurs qui tirent profit de l\'IA ?',
  finalSubtitle:
    "La question n'est plus « Faut-il utiliser l'IA ? » mais « Êtes-vous prêt à en tirer profit ? ». Réservez votre place et prenez une longueur d'avance sur vos concurrents.",
  finalCta: 'Oui, je réserve ma place',
};

// ------------------------------------------------------------
// Offres par défaut (formation phare + coaching + accompagnement)
// ------------------------------------------------------------
export const defaultFormations: Formation[] = [
  {
    id: 'ia-pro-business',
    type: 'formation',
    title: 'IA PRO BUSINESS',
    category: 'Programme Entrepreneur',
    tagline: "Travaillez jusqu'à 5 fois plus vite grâce à l'Intelligence Artificielle.",
    description:
      "En seulement 3 jours, apprenez à utiliser les meilleurs outils d'IA pour développer votre entreprise, automatiser vos tâches et produire davantage en moins de temps. Ne laissez pas vos concurrents prendre de l'avance : faites de l'Intelligence Artificielle votre meilleur collaborateur et concentrez-vous sur ce qui compte vraiment — la croissance de votre entreprise.",
    image: '',
    price: '150 000',
    currency: 'FCFA',
    oldPrice: '250 000',
    duration: '3 jours intensifs',
    format: 'Formation pratique — présentiel & en ligne',
    seatsTotal: 20,
    seatsTaken: 13,
    highlights: [
      'Formation 100% pratique basée sur des cas réels',
      'Exercices et ateliers tout au long des 3 jours',
      'Certificat de participation remis à la fin',
      'Accès à un groupe privé d\'accompagnement',
    ],
    audience: [],
    program: [
      {
        day: 'Jour 1',
        title: "Découvrir et maîtriser l'Intelligence Artificielle",
        items: [
          "Comprendre les fondamentaux de l'IA",
          'Découvrir ChatGPT et les meilleurs outils IA',
          "Maîtriser l'art du Prompt Engineering",
          'Apprendre à obtenir des réponses précises et pertinentes',
          'Créer vos premiers assistants IA adaptés à votre activité',
        ],
      },
      {
        day: 'Jour 2',
        title: "Développer son entreprise avec l'IA",
        items: [
          'Construire un Business Model et un Business Plan',
          'Réaliser une étude de marché',
          'Définir une stratégie commerciale',
          'Rédiger des propositions commerciales convaincantes',
          'Créer une stratégie de communication performante',
          "Développer votre marketing grâce à l'IA",
        ],
      },
      {
        day: 'Jour 3',
        title: 'Produire plus en moins de temps',
        items: [
          'Créer des contenus professionnels',
          "Générer des images et visuels avec l'IA",
          'Concevoir des présentations professionnelles',
          "Organiser votre travail avec l'IA",
          "Découvrir les bases de l'automatisation",
          'Construire votre plan d\'action IA personnalisé',
        ],
      },
    ],
    bonus: [
      'Support de formation complet',
      'Bibliothèque de prompts professionnels',
      'Sélection des meilleurs outils IA',
      'Modèles de documents prêts à l\'emploi',
      'Certificat de fin de formation',
      'Accès à un groupe privé d\'accompagnement',
    ],
    isPublished: true,
    isFeatured: true,
    orderIndex: 0,
  },
  {
    id: 'coaching-ia-1-1',
    type: 'coaching',
    title: 'Coaching IA Business — 1:1',
    category: 'Accompagnement individuel',
    tagline: "Un accompagnement personnalisé pour intégrer l'IA à VOTRE activité.",
    description:
      "Des séances individuelles avec Angelo pour appliquer l'Intelligence Artificielle à votre métier précis : vos outils, vos processus, vos objectifs. On construit ensemble votre système IA sur-mesure, étape par étape.",
    image: '',
    price: '75 000',
    currency: 'FCFA',
    duration: '4 séances de 1h',
    format: 'Visioconférence ou présentiel',
    seatsTotal: 8,
    seatsTaken: 3,
    highlights: [
      'Diagnostic personnalisé de votre activité',
      'Plan d\'action IA sur-mesure',
      'Suivi individuel entre les séances',
      'Sélection d\'outils adaptés à votre métier',
    ],
    audience: [],
    program: [],
    bonus: ['Templates personnalisés', 'Support WhatsApp prioritaire'],
    isPublished: true,
    isFeatured: false,
    orderIndex: 1,
  },
  {
    id: 'accompagnement-90j',
    type: 'accompagnement',
    title: 'Accompagnement Croissance — 90 jours',
    category: 'Programme premium',
    tagline: "3 mois pour transformer votre entreprise avec l'IA, à nos côtés.",
    description:
      "Un accompagnement complet sur 90 jours pour déployer l'IA dans toute votre entreprise : automatisation, marketing, contenu, organisation. Sessions collectives, suivi individuel et mise en œuvre concrète pour des résultats mesurables.",
    image: '',
    price: '350 000',
    currency: 'FCFA',
    duration: '90 jours',
    format: 'Suivi hybride + communauté privée',
    seatsTotal: 12,
    seatsTaken: 5,
    highlights: [
      'Audit complet de votre entreprise',
      'Déploiement de systèmes IA opérationnels',
      'Sessions de groupe hebdomadaires',
      'Suivi individuel mensuel',
    ],
    audience: [],
    program: [],
    bonus: ['Accès à vie à la communauté', 'Toutes les formations incluses'],
    isPublished: true,
    isFeatured: false,
    orderIndex: 2,
  },
];

export const formationTypeLabels: Record<FormationType, string> = {
  formation: 'Formation',
  coaching: 'Coaching',
  accompagnement: 'Accompagnement',
};
