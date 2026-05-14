import { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Prochainement",
    role: "Parent",
    quote: "Les témoignages des parents et enfants seront affichés ici après notre première édition.",
    avatar: "👨‍👩‍👧"
  },
  {
    id: 2,
    name: "Prochainement",
    role: "Enfant participant",
    quote: "Les retours d'expérience des enfants seront partagés ici très bientôt.",
    avatar: "👧"
  },
  {
    id: 3,
    name: "Prochainement",
    role: "Partenaire",
    quote: "Les avis de nos partenaires et sponsors apparaîtront dans cette section.",
    avatar: "🏢"
  }
];

const TestimonialsSection = () => {
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
    <section ref={sectionRef} className="py-14 sm:py-20 lg:py-32 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="reveal opacity-0 section-badge mx-auto">
            <Quote className="w-4 h-4" />
            <span>Témoignages</span>
          </div>
          <h2 className="reveal opacity-0 delay-100 section-title">
            Ils nous font{' '}
            <span className="text-secondary">confiance</span>
          </h2>
          <p className="reveal opacity-0 delay-200 section-subtitle mx-auto">
            Découvrez bientôt les retours de nos participants et partenaires.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`reveal opacity-0 delay-${(index + 1) * 100} feature-card text-center`}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{testimonial.avatar}</div>
              <Quote className="w-8 h-8 text-primary/20 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground italic mb-5 sm:mb-6">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
