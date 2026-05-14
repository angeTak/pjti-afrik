export const newsItems = [
  {
    id: 1,
    title: "Lancement officiel du programme PJTI-AFRIK 2025",
    date: "15 Mai 2025",
    category: "Événement",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    excerpt: "Ouverture des inscriptions pour la nouvelle édition.",
    paragraph: "Le Prix du Jeune Talent Informatique en AFRIK (PJTI-AFRIK) ouvre officiellement ses portes pour la nouvelle édition. Cette année, nous attendons de nombreux participants venant de toute la région pour se former aux métiers du numérique et relever les défis de demain. Le programme inclut des bootcamps intensifs et un challenge final."
  },
  {
    id: 2,
    title: "Nouveau partenariat avec des leaders de la Tech",
    date: "10 Mai 2025",
    category: "Partenariat",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    excerpt: "Des ressources exclusives et du mentorat de qualité pour nos élèves.",
    paragraph: "Nous sommes fiers d'annoncer nos nouveaux partenariats avec des acteurs majeurs de la technologie. Les participants auront désormais accès à des ressources exclusives, du mentorat de qualité et pourront valider des compétences reconnues internationalement, ouvrant ainsi les portes à de belles opportunités de carrière."
  },
  {
    id: 3,
    title: "Retour sur l'atelier d'initiation à la programmation",
    date: "5 Mai 2025",
    category: "Formation",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    excerpt: "Les élèves ont créé leurs premières applications avec succès !",
    paragraph: "Un succès retentissant pour notre premier atelier de l'année ! Les élèves ont pu créer leurs premières applications, découvrir les bases de l'algorithmique et comprendre les enjeux de la création numérique tout en s'amusant dans un cadre collaboratif avec l'aide de nos formateurs expérimentés."
  }
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
];

// Helper pour le carrousel qui mélange actualités et images de galerie
export const getCarouselItems = () => {
  const items = [];
  
  // On prend les 3 premières actualités
  newsItems.slice(0, 3).forEach((news, idx) => {
    items.push({
      id: `news-${news.id}`,
      type: 'news',
      title: news.title,
      date: news.date,
      category: news.category,
      image: news.image
    });
    
    // On intercale une image de la galerie si disponible
    if (galleryImages[idx]) {
      items.push({
        id: `gal-${idx}`,
        type: 'gallery',
        title: `Aperçu en images #${idx + 1}`,
        image: galleryImages[idx]
      });
    }
  });

  // S'il reste des images de la galerie, on les ajoute à la fin
  if (galleryImages.length > 3) {
    galleryImages.slice(3).forEach((img, idx) => {
      items.push({
        id: `gal-extra-${idx}`,
        type: 'gallery',
        title: `Souvenirs du programme #${idx + 4}`,
        image: img
      });
    });
  }

  return items;
};
