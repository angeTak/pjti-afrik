import { useEffect } from 'react';
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  Clock,
  CreditCard,
  Smartphone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { useAdmin } from '@/context/AdminContext';



const paymentMethods = [
  {
    name: 'Mobile Money',
    detail: 'T-Money, Moov Money, Flooz',
    icon: Smartphone,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    name: 'Espèces',
    detail: 'À nos bureaux (sur rendez-vous)',
    icon: Banknote,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
];

const TarifsHero = () => (
  <div className="relative flex items-end justify-center overflow-hidden pt-28 pb-14 bg-slate-900">
    <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 text-slate-200 text-sm mb-5 font-medium">
        Tarifs et modalités
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
        Un Tarif Unique <br className="hidden sm:block" />
        <span className="text-purple-400">Pour Tout Le Programme</span>
      </h1>

      <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        Investissez dans l'avenir de votre enfant avec notre programme complet de 5 semaines. Nous proposons des facilités de paiement pour rendre la formation accessible à tous.
      </p>
    </div>
    {/* Pattern separator */}
    <div className="absolute bottom-0 left-0 w-full z-10">
      <SeparatorPattern />
    </div>
  </div>
);

const Tarifs = () => {
  const { settings } = useAdmin();
  useEffect(() => {
    document.title = "Tarifs - PJTI-AFRIK";
  }, []);

  const priceStr = settings.programPrice || "50 000";
  const price = parseInt(priceStr.replace(/\s/g, '')) || 50000;

  const dynamicInstallments = [
    { 
      label: 'En 1 fois', 
      amount: `${price.toLocaleString('fr-FR')} FCFA`, 
      detail: 'Paiement unique au début' 
    },
    { 
      label: 'En 2 fois', 
      amount: `${Math.round(price / 2).toLocaleString('fr-FR')} FCFA`, 
      detail: 'Par tranche (50%)' 
    },
    { 
      label: 'En 3 fois', 
      amount: `${Math.round(price * 0.4).toLocaleString('fr-FR')} + ${Math.round(price * 0.3).toLocaleString('fr-FR')} × 2`, 
      detail: 'Tranches de 40% puis 30%' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main>
        <TarifsHero />

        <section className="py-20 -mt-8">
          <div className="container max-w-5xl mx-auto px-4">
            
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Pricing Card */}
              <div className="lg:col-span-5 relative z-20">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="inline-flex items-center gap-2 text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full text-sm mb-6">
                    <ShieldCheck className="w-4 h-4" /> Programme Complet
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Frais d'inscription uniques</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-slate-900">{settings.programPrice}</span>
                      <span className="text-xl font-bold text-slate-500">FCFA</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      `Formation complète (${settings.durationWeeks} semaines)`,
                      'Participation au Challenge (1 semaine)',
                      'Présentation et événement final',
                      'Certificat de participation',
                      'Outils et matériels inclus'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/inscription" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                    S'inscrire maintenant <ArrowRight className="w-5 h-5" />
                  </a>
                  <p className="text-center text-sm text-slate-500 mt-4">Places limitées pour la prochaine cohorte.</p>
                </div>
              </div>

              {/* Installments and Payment Methods */}
              <div className="lg:col-span-7 space-y-8 mt-8 lg:mt-12">
                
                {/* Échéancier */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Facilités de paiement</h3>
                      <p className="text-slate-500 font-medium">Jusqu'à 3 tranches, sans frais supplémentaires.</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {dynamicInstallments.map((row, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                        <span className="font-bold text-slate-900 text-lg mb-1 sm:mb-0">{row.label}</span>
                        <div className="text-left sm:text-right">
                          <span className="font-black text-purple-600 block">{row.amount}</span>
                          <span className="text-sm text-slate-500 font-medium">{row.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moyens de paiement */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Moyens de paiement</h3>
                      <p className="text-slate-500 font-medium">Des solutions adaptées à vos habitudes.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {paymentMethods.map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${m.bgColor}`}>
                            <Icon className={`w-6 h-6 ${m.color}`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{m.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{m.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Une question sur les tarifs ?</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions concernant les modalités d'inscription et de paiement.
            </p>
            <a href="mailto:agcomelite@gmail.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-sm">
              <Mail className="w-5 h-5" /> Nous contacter
            </a>
          </div>
        </section>
        <SeparatorPattern />
      </main>

      <Footer />
    </div>
  );
};

export default Tarifs;
