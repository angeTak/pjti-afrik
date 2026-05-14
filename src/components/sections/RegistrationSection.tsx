import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, User, CreditCard, AlertCircle, Clock, Zap, ChevronLeft, ChevronRight, Home, Users, CreditCardIcon, FileCheck, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext';

const ageGroups = [
  { value: '7-10', label: '7 - 10 ans' },
  { value: '11-14', label: '11 - 14 ans' },
  { value: '15-18', label: '15 - 18 ans' }
];

const howFound = [
  'Réseaux sociaux',
  'Bouche à oreille',
  'Affiche / Flyer',
  'Recherche internet',
  'Autre'
];

interface FormData {
  parentName: string;
  phone: string;
  email: string;
  city: string;
  childName: string;
  childAge: string;
  schoolLevel: string;
  ageGroup: string;
  hasComputer: string;
  howFound: string;
  paymentMethod: string;
  paymentSchedule: string;
  numberOfInstallments: string;
  acceptParticipation: boolean;
  acceptContact: boolean;
}

const RegistrationSection = () => {
  const { addRegistration } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    phone: '',
    email: '',
    city: '',
    childName: '',
    childAge: '',
    schoolLevel: '',
    ageGroup: '',
    hasComputer: '',
    howFound: '',
    paymentMethod: '',
    paymentSchedule: '',
    numberOfInstallments: '',
    acceptParticipation: false,
    acceptContact: false
  });

  const steps = [
    { id: 0, title: 'Accueil', icon: Home, description: 'Bienvenue dans PJTI-AFRIK' },
    { id: 1, title: 'Parent', icon: Users, description: 'Informations du parent' },
    { id: 2, title: 'Enfant', icon: User, description: 'Informations de l\'enfant' },
    { id: 3, title: 'Modalités', icon: Clock, description: 'Modalités de paiement prévu' },
    { id: 4, title: 'Moyen', icon: CreditCardIcon, description: 'Méthode de paiement prévu' },
    { id: 5, title: 'Résumé', icon: FileCheck, description: 'Vérification finale' },
    { id: 6, title: 'Merci', icon: PartyPopper, description: 'Inscription confirmée' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const submitToGoogleSheet = async (data: FormData) => {
    // ⚠️ REMPLACEZ CETTE URL PAR CELLE DE VOTRE SCRIPT GOOGLE SHEETS
    const scriptUrl = 'https://script.google.com/macros/s/VOTRE_ID_DE_DEPLOIEMENT/exec';

    // Formatage du texte pour les paiements
    const paymentText = data.paymentSchedule === 'full' 
      ? 'Unique (50 000 FCFA)' 
      : `${data.numberOfInstallments} tranches`;

    // Création de l'objet de données exact que le script va recevoir
    const payload = {
      parentName: data.parentName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      childName: data.childName,
      ageGroup: data.ageGroup,
      schoolLevel: data.schoolLevel,
      hasComputer: data.hasComputer === 'yes' ? 'Oui' : data.hasComputer === 'no' ? 'Non' : '',
      howFound: data.howFound,
      paymentMethod: data.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Espèces',
      paymentSchedule: paymentText
    };

    // On utilise text/plain pour éviter les problèmes de CORS (preflight OPTIONS) avec Google Script
    await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.parentName || !formData.phone || !formData.city) {
      toast.error('Veuillez remplir tous les champs obligatoires du parent');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.childName || !formData.ageGroup || !formData.schoolLevel) {
      toast.error("Veuillez remplir tous les champs obligatoires de l'enfant");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.paymentSchedule) {
      toast.error('Veuillez choisir une modalité de paiement');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.paymentSchedule === 'installments' && !formData.numberOfInstallments) {
      toast.error('Veuillez choisir le nombre de tranches');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.paymentMethod) {
      toast.error('Veuillez choisir un moyen de paiement');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.acceptParticipation || !formData.acceptContact) {
      toast.error('Veuillez accepter les conditions pour continuer');
      setIsSubmitting(false);
      return;
    }
    
    // Génération et envoi
    try {
      // 1. Sauvegarde locale pour l'admin (toujours prioritaire)
      await addRegistration({
        parentName: formData.parentName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        childName: formData.childName,
        ageGroup: formData.ageGroup,
        schoolLevel: formData.schoolLevel,
        hasComputer: formData.hasComputer === 'yes' ? 'Oui' : formData.hasComputer === 'no' ? 'Non' : '',
        howFound: formData.howFound,
        paymentMethod: formData.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Espèces',
        paymentSchedule: formData.paymentSchedule === 'full' ? 'Unique (50 000 FCFA)' : `${formData.numberOfInstallments} tranches`
      });

      // 2. Envoi vers Google Sheets (optionnel/silencieux si erreur)
      try {
        await submitToGoogleSheet(formData);
      } catch (sheetError) {
        console.warn("Google Sheets non configuré ou inaccessible, mais l'inscription est sauvegardée localement.", sheetError);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setCurrentStep(6);
      toast.success('Inscription reçue avec succès !');
    } catch (error) {
      console.error("Erreur critique lors de l'inscription:", error);
      setIsSubmitting(false);
      toast.error('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  const nextStep = () => {
    // Validation par étape
    if (currentStep === 1) {
      if (!formData.parentName || !formData.phone || !formData.city) {
        toast.error('Veuillez remplir tous les champs obligatoires du parent');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.childName || !formData.ageGroup || !formData.schoolLevel) {
        toast.error("Veuillez remplir tous les champs obligatoires de l'enfant");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.paymentSchedule) {
        toast.error('Veuillez choisir une modalité de paiement');
        return;
      }
      if (formData.paymentSchedule === 'installments' && !formData.numberOfInstallments) {
        toast.error('Veuillez choisir le nombre de tranches');
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.paymentMethod) {
        toast.error('Veuillez choisir un moyen de paiement');
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      // Retour en haut de la section pour une meilleure UX
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    // On ne permet d'aller que vers une étape déjà complétée ou l'étape en cours
    if (step < currentStep) {
      setCurrentStep(step);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (step === currentStep) {
      // Déjà sur l'étape
    } else {
      // Tentative d'aller plus loin : on utilise nextStep pour valider
      // On ne permet pas de sauter plusieurs étapes d'un coup
      if (step === currentStep + 1) {
        nextStep();
      }
    }
  };

  // Étape 0: Accueil
  if (currentStep === 0) {
    return (
      <section ref={sectionRef} id="inscription" className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative container max-w-4xl">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index === currentStep 
                        ? 'bg-purple-600 text-white' 
                        : index < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-100 text-purple-700 mb-8 shadow-lg">
              <span className="text-2xl">Welcome</span>
              <span className="font-bold text-lg">PJTI-AFRIK</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue dans{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">PJTI-AFRIK</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Programme de Jeune Talent Informatique - AFRIK. 
              Inscrivez votre enfant pour une expérience numérique inoubliable.
            </p>

            {/* CTA Button */}
            <button
              onClick={nextStep}
              className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-2xl transform hover:scale-105"
            >
              Démarrer l'inscription
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Étape 6: Merci
  if (currentStep === 6) {
    return (
      <section ref={sectionRef} id="inscription" className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="relative container max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-100 text-green-700 mb-8 animate-fade-in-down">
            <PartyPopper className="w-5 h-5 animate-bounce" />
            <span className="font-bold">Pré-inscription réussie</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Merci pour votre{' '}
            <span className="text-green-600 animate-pulse">pré-inscription !</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
            Nous avons bien reçu votre demande d'inscription pour {formData.childName || 'votre enfant'}.
            Notre équipe vous contactera rapidement pour finaliser les modalités.
          </p>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto animate-scale-in animation-delay-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in">Récapitulatif</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex justify-between py-3 border-b border-gray-100 animate-slide-in-left animation-delay-600">
                <span className="text-gray-600">Parent:</span>
                <span className="font-semibold text-gray-900">{formData.parentName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 animate-slide-in-left animation-delay-700">
                <span className="text-gray-600">Enfant:</span>
                <span className="font-semibold text-gray-900">{formData.childName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 animate-slide-in-left animation-delay-800">
                <span className="text-gray-600">Montant à payer :</span>
                <span className="font-semibold text-gray-900">50 000 FCFA</span>
              </div>
              <div className="flex justify-between py-3 animate-slide-in-left animation-delay-900">
                <span className="text-gray-600">Référence:</span>
                <span className="font-semibold text-gray-900">PJTI-{Date.now()}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => {
                setCurrentStep(0);
                setFormData({
                  parentName: '',
                  phone: '',
                  email: '',
                  city: '',
                  childName: '',
                  childAge: '',
                  schoolLevel: '',
                  ageGroup: '',
                  hasComputer: '',
                  howFound: '',
                  paymentMethod: '',
                  paymentSchedule: '',
                  numberOfInstallments: '',
                  acceptParticipation: false,
                  acceptContact: false
                });
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 animate-fade-in-up animation-delay-1000"
            >
              Inscrire un autre enfant
              <Users className="w-5 h-5" />
            </button>
            
            <a
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold border-2 border-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105 animate-fade-in-up animation-delay-1100"
            >
              Retour à l'accueil
              <Home className="w-5 h-5" />
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in-down {
            animation: fade-in-down 0.6s ease-out;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }

          .animate-slide-in-left {
            animation: slide-in-left 0.5s ease-out;
          }

          .animation-delay-200 {
            animation-delay: 200ms;
          }

          .animation-delay-400 {
            animation-delay: 400ms;
          }

          .animation-delay-600 {
            animation-delay: 600ms;
          }

          .animation-delay-700 {
            animation-delay: 700ms;
          }

          .animation-delay-800 {
            animation-delay: 800ms;
          }

          .animation-delay-900 {
            animation-delay: 900ms;
          }

          .animation-delay-1000 {
            animation-delay: 1000ms;
          }

          .animation-delay-1100 {
            animation-delay: 1100ms;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="inscription" className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative container max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    index === currentStep 
                      ? 'bg-purple-600 text-white' 
                      : index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-100 text-purple-700 mb-4">
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
            <span className="font-bold">Étape {currentStep + 1}/{steps.length - 1}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {currentStep === 1 && (
            // Étape 1: Informations Parent
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="Votre nom complet"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="+228 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ville / Quartier *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="Votre ville ou quartier"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // Étape 2: Informations Enfant
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    placeholder="Nom de l'enfant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Groupe d'âge *
                  </label>
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                  >
                    <option value="">Sélectionner</option>
                    {ageGroups.map(group => (
                      <option key={group.value} value={group.value}>{group.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Niveau scolaire *
                  </label>
                  <select
                    name="schoolLevel"
                    value={formData.schoolLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
                  >
                    <option value="">Sélectionner</option>
                    <option value="4e">4e</option>
                    <option value="3e">3e</option>
                    <option value="2nde">2nde</option>
                    <option value="1ère">1ère</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avez-vous un ordinateur à la maison ?
                  </label>
                  <select
                    name="hasComputer"
                    value={formData.hasComputer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="yes">Oui</option>
                    <option value="no">Non</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment avez-vous connu le programme ?
                </label>
                <select
                  name="howFound"
                  value={formData.howFound}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">Sélectionner</option>
                  {howFound.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            // Étape 3: Modalités de paiement
            <div className="space-y-6">
              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="inline-block bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-3xl font-bold text-purple-900 mb-2">50 000 FCFA</div>
                  <div className="text-purple-700">Programme PJTI-AFRIK complet</div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Modalité de paiement *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all bg-gray-50">
                    <input
                      type="radio"
                      name="paymentSchedule"
                      value="full"
                      checked={formData.paymentSchedule === 'full'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="text-gray-900 font-semibold">Paiement unique</div>
                      <div className="text-gray-600 text-sm">50 000 FCFA en une seule fois</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all bg-gray-50">
                    <input
                      type="radio"
                      name="paymentSchedule"
                      value="installments"
                      checked={formData.paymentSchedule === 'installments'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="text-gray-900 font-semibold">Paiement en tranches</div>
                      <div className="text-gray-600 text-sm">Échelonnez votre paiement</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Installments Selection */}
              {formData.paymentSchedule === 'installments' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre de tranches *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all bg-gray-50">
                      <input
                        type="radio"
                        name="numberOfInstallments"
                        value="2"
                        checked={formData.numberOfInstallments === '2'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold">2 tranches</div>
                        <div className="text-gray-600 text-sm">25 000 FCFA × 2</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all bg-gray-50">
                      <input
                        type="radio"
                        name="numberOfInstallments"
                        value="3"
                        checked={formData.numberOfInstallments === '3'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold">3 tranches</div>
                        <div className="text-gray-600 text-sm">20 000 FCFA + 15 000 FCFA × 2</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Installment Details */}
              {formData.paymentSchedule === 'installments' && formData.numberOfInstallments && (
                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div className="text-sm font-bold text-yellow-800">Détail des échéances</div>
                  </div>
                  <div className="space-y-2">
                    {formData.numberOfInstallments === '2' && (
                      <>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-700 font-medium">1ère tranche</span>
                          <span className="text-yellow-700 font-bold">25 000 FCFA</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-700 font-medium">2ème tranche</span>
                          <span className="text-yellow-700 font-bold">25 000 FCFA</span>
                        </div>
                      </>
                    )}
                    {formData.numberOfInstallments === '3' && (
                      <>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-700 font-medium">1ère tranche</span>
                          <span className="text-yellow-700 font-bold">20 000 FCFA</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-700 font-medium">2ème tranche</span>
                          <span className="text-yellow-700 font-bold">15 000 FCFA</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-700 font-medium">3ème tranche</span>
                          <span className="text-yellow-700 font-bold">15 000 FCFA</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            // Étape 4: Moyen de paiement
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Choisissez votre moyen de paiement
                </h3>
                <p className="text-gray-600">
                  Sélectionnez la méthode qui vous convient le mieux
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Moyen de paiement *
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'mobile_money', label: 'Mobile Money', detail: 'T-Money, Moov Money, Flooz' },
                    { value: 'cash', label: 'Espèces', detail: 'Paiement à nos bureaux' }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 font-semibold">{method.label}</div>
                        <div className="text-gray-600 text-sm">{method.detail}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alert */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <strong className="text-red-900">Important :</strong> Aucun remboursement ne sera effectué en cas de désistement. 
                    Un engagement de paiement est requis pour toute inscription.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            // Étape 5: Résumé
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Vérifiez vos informations</h3>
              
              {/* Parent Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Informations du parent
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Nom:</span>
                    <p className="font-semibold text-gray-900">{formData.parentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Téléphone:</span>
                    <p className="font-semibold text-gray-900">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-semibold text-gray-900">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Ville:</span>
                    <p className="font-semibold text-gray-900">{formData.city}</p>
                  </div>
                </div>
              </div>

              {/* Child Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informations de l'enfant
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Nom:</span>
                    <p className="font-semibold text-gray-900">{formData.childName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Groupe d'âge:</span>
                    <p className="font-semibold text-gray-900">{formData.ageGroup}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Niveau scolaire:</span>
                    <p className="font-semibold text-gray-900">{formData.schoolLevel}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Ordinateur:</span>
                    <p className="font-semibold text-gray-900">{formData.hasComputer}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Modalités de paiement
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant, à payé:</span>
                    <span className="font-bold text-gray-900">50 000 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modalité:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.paymentSchedule === 'full' ? 'Paiement unique' : 'Paiement en tranches'}
                    </span>
                  </div>
                  {formData.paymentSchedule === 'installments' && formData.numberOfInstallments && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de tranches:</span>
                      <span className="font-semibold text-gray-900">{formData.numberOfInstallments} tranches</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moyen de paiement:</span>
                    <span className="font-semibold text-gray-900">
                      {formData.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                       formData.paymentMethod === 'card' ? 'Carte Bancaire' :
                       formData.paymentMethod === 'transfer' ? 'Virement Bancaire' : 'Espèces'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptParticipation"
                    checked={formData.acceptParticipation}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-purple-600"
                  />
                  <span className="text-gray-700">
                    J'accepte que mon enfant participe au programme vacances numérique *
                  </span>
                </label>

                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptContact"
                    checked={formData.acceptContact}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-purple-600"
                  />
                  <span className="text-gray-700">
                    J'accepte d'être contacté pour les informations du programme *
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>

            {currentStep === 5 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Confirmer l'inscription
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
