import { useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormationSection from '@/components/sections/FormationSection';
import EmporteSection from '@/components/sections/EmporteSection';
import RecompensesSection from '@/components/sections/RecompensesSection';
import { ArrowRight } from 'lucide-react';
import SeparatorPattern from '@/components/ui/SeparatorPattern';

const FormationHero = () => (
  <div className="relative flex items-end justify-center overflow-hidden pt-28 pb-14 bg-slate-900">
    <div className="container relative z-10 text-center max-w-3xl mx-auto">

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
        Les formations du programme
      </h1>

      <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        Destiné aux élèves de la <strong className="text-white font-bold">4ème à la 1ère (11–18 ans)</strong>, le programme PJTI-AFRIK propose 5 semaines de formation pratique dans les domaines clés du numérique, suivies d'un challenge final institutionnel.
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-sm">
        {['5 modules', '4 sem. de formation', '1 sem. de challenge', '50 000 FCFA'].map((tag, i) => (
          <span key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 font-semibold">
            {tag}
          </span>
        ))}
      </div>
    </div>
    {/* Pattern separator */}
    <div className="absolute bottom-0 left-0 w-full z-10">
      <SeparatorPattern />
    </div>
  </div>
);

const Formation = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <FormationHero />
      <FormationSection />
      <EmporteSection />
      <RecompensesSection />

      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Inscrire votre enfant</h2>
          <p className="text-slate-600 text-base mb-8">
            Inscription unique de 50 000 FCFA, paiement possible en 1, 2 ou 3 tranches pour faciliter l'accès au programme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/inscription" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-sm">
              S'inscrire au programme <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/tarifs" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 transition-colors shadow-sm">
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>
      <SeparatorPattern />
    </main>
    <Footer />
  </div>
);

export default Formation;
