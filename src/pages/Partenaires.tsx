import { useEffect, useRef } from 'react';
import { Handshake, Globe, Building2, GraduationCap, Cpu, ArrowRight, Mail, CheckCircle2, Users, TrendingUp, Award } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { useAdmin } from '@/context/AdminContext';
import PartnerRequestModal from '@/components/ui/PartnerRequestModal';

const categories = [
  { label: 'Tous', value: 'all' },
  { label: 'Institutionnel', value: 'Institutionnel' },
  { label: 'Technologie', value: 'Technologie' },
  { label: 'Éducation', value: 'Éducation' },
  { label: 'Humanitaire', value: 'Humanitaire' },
];


const benefits = [
  {
    icon: Users,
    title: 'Visibilité auprès des jeunes talents',
    description: "Accédez à une communauté de 100+ jeunes motivés et leurs familles, futurs acteurs du numérique en AFRIK.",
  },
  {
    icon: TrendingUp,
    title: 'Impact social mesurable',
    description: "Contribuez directement à la réduction de la fracture numérique en AFRIK et valorisez votre RSE.",
  },
  {
    icon: Award,
    title: 'Reconnaissance institutionnelle',
    description: "Votre logo sur tous nos supports de communication officiels : site web, affiches, certificats et événements.",
  },
  {
    icon: Globe,
    title: 'Réseau panafricain',
    description: "Rejoignez un écosystème d'acteurs engagés pour le développement du digital en AFRIK de l'Ouest.",
  },
];

const PartenairesPage = () => {
  const { settings, partners: managedPartners, isLoading } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fallback to initial partners if managed list is empty (optional)
  const displayPartners = managedPartners;

  useEffect(() => {
    document.title = "Partenaires - pjti-Afrik";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [managedPartners]);

  return (
    <div className="min-h-screen bg-white" ref={sectionRef}>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-28 pb-20 bg-slate-900">
          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-blue-700/20 blur-3xl" />
          </div>

          <div className="container relative z-10 text-center max-w-4xl mx-auto">
            <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Handshake className="w-4 h-4 text-purple-400" />
              Nos partenaires & écosystème
            </div>

            <h1 className="reveal opacity-0 delay-100 text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Ensemble pour{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                l'excellence numérique
              </span>{' '}
              africaine
            </h1>

            <p className="reveal opacity-0 delay-200 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Le pjti-Afrik est soutenu par un réseau d'organisations engagées — institutions publiques,
              entreprises technologiques et acteurs de l'éducation — qui partagent notre vision d'un avenir
              numérique inclusif pour les jeunes togolais.
            </p>

            {/* Stats bar */}
            <div className="reveal opacity-0 delay-300 mt-12 grid grid-cols-3 divide-x divide-white/10 max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {[
                { value: `${settings.partnersCount}+`, label: 'Partenaires actifs' },
                { value: '5', label: 'Modules de formation' },
                { value: '100%', label: 'Engagement local' },
              ].map((s, i) => (
                <div key={i} className="text-center px-4">
                  <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <SeparatorPattern />
          </div>
        </section>

        {/* ── PARTNERS GRID ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="reveal opacity-0 text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
                Ils nous font confiance
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Des organisations de référence à l'échelle nationale et internationale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20">
              {isLoading ? (
                // Skeleton loading
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] bg-slate-100 animate-pulse mb-6" />
                    <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))
              ) : displayPartners.length > 0 ? (
                displayPartners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className={`reveal opacity-0 delay-${(index % 4 + 1) * 100} group flex flex-col items-center text-center transition-all duration-300`}
                  >
                    {/* Logo container */}
                    <div className={`w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-0 group-hover:scale-110 transition-transform duration-500`}>
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className={`w-full h-full rounded-[40px] ${partner.color || 'bg-slate-900'} flex items-center justify-center text-white font-black text-4xl shadow-lg`}>
                          {partner.initials}
                        </div>
                      )}
                    </div>

                    <h3 className="-mt-6 text-base sm:text-lg font-black text-slate-800 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">Aucun partenaire trouvé.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200">
          <div className="container max-w-5xl mx-auto">
            <div className="reveal opacity-0 text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-4">
                <Building2 className="w-4 h-4" />
                Devenir partenaire
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
                Pourquoi rejoindre notre écosystème ?
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Un partenariat pjti-Afrik c'est bien plus qu'un logo sur un site.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className={`reveal opacity-0 delay-${(i % 2 + 1) * 100} flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 mb-1">{b.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA PARTENARIAT ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container max-w-3xl mx-auto">
            <div className="reveal opacity-0 relative overflow-hidden rounded-3xl bg-slate-900 p-10 sm:p-14 text-center">
              {/* Glow decor */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-700/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-semibold mb-6">
                  <Handshake className="w-4 h-4 text-purple-400" />
                  Rejoindre le réseau
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Intéressé par un partenariat ?
                </h2>
                <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                  Que vous soyez une entreprise, une institution ou une ONG, nous sommes ouverts
                  à toute collaboration visant à développer le numérique pour les jeunes africains.
                </p>

                {/* Checklist */}
                <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left">
                  {[
                    'Visibilité sur nos supports officiels',
                    'Accès aux événements pjti-Afrik',
                    'Rapport d\'impact annuel',
                    'Co-branding sur les certificats',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <PartnerRequestModal>
                  <button
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <Mail className="w-5 h-5" />
                    Nous écrire pour un partenariat
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </PartnerRequestModal>
              </div>
            </div>
          </div>
        </section>

        <SeparatorPattern />
      </main>

      <Footer />
    </div>
  );
};

export default PartenairesPage;
