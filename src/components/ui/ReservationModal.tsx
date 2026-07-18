import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFunnel } from '@/context/FunnelContext';
import { Formation } from '@/data/funnel';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation?: Formation | null;
  // 'reservation' pour une place de formation, 'contact' pour un simple contact
  intent?: 'reservation' | 'contact';
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, formation, intent = 'reservation' }) => {
  const { submitLead } = useFunnel();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      setForm({ name: '', email: '', phone: '', city: '', message: '' });
    }
  }, [isOpen, formation]);

  if (!isOpen) return null;

  const leadType: 'reservation' | 'contact' | 'coaching' | 'accompagnement' =
    intent === 'contact'
      ? 'contact'
      : formation?.type === 'coaching'
      ? 'coaching'
      : formation?.type === 'accompagnement'
      ? 'accompagnement'
      : 'reservation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError('Indiquez au moins votre nom et un moyen de contact (téléphone ou email).');
      return;
    }
    setIsLoading(true);
    const { success: ok, error: submitError } = await submitLead({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      message: form.message.trim(),
      formationId: formation?.id ?? null,
      formationTitle: formation?.title ?? (intent === 'contact' ? 'Prise de contact' : ''),
      leadType,
    });
    setIsLoading(false);
    if (ok) {
      setSuccess(true);
    } else {
      setError(submitError || "Une erreur est survenue. Réessayez ou contactez-nous directement.");
    }
  };

  const title = intent === 'contact'
    ? 'Laissez-nous vos coordonnées'
    : formation
    ? `Réserver : ${formation.title}`
    : 'Réserver ma place';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0e1424] border border-[#c9a24b]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#c9a24b]/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9 text-[#e8cd8a]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Demande envoyée !</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Merci <strong className="text-white">{form.name || ''}</strong>. Votre demande a bien été enregistrée.
              Nous vous recontacterons très rapidement pour confirmer{intent === 'contact' ? '' : ' votre place'}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3.5 bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] text-slate-900 font-black rounded-2xl hover:brightness-105 transition-all"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 pr-6">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{title}</h3>
              {formation && intent !== 'contact' && (
                <p className="text-[#e8cd8a] text-sm font-semibold mt-1">
                  {formation.duration} · {formation.price} {formation.currency}
                </p>
              )}
              <p className="text-slate-400 text-sm mt-2">
                Remplissez ce formulaire, on vous rappelle pour finaliser.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field icon={User} placeholder="Votre nom complet *" value={form.name}
                onChange={(v) => setForm({ ...form, name: v })} />
              <Field icon={Phone} type="tel" placeholder="Téléphone / WhatsApp" value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })} />
              <Field icon={Mail} type="email" placeholder="Email" value={form.email}
                onChange={(v) => setForm({ ...form, email: v })} />
              <Field icon={MapPin} placeholder="Pays" value={form.city}
                onChange={(v) => setForm({ ...form, city: v })} />

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Un message (optionnel)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0a0f1e] border-2 border-white/10 text-white placeholder-slate-500 focus:border-[#c9a24b] transition-colors h-24 resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-3.5 bg-red-500/10 text-red-300 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] text-slate-900 font-black rounded-2xl hover:brightness-105 transition-all shadow-lg shadow-[#c9a24b]/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  intent === 'contact' ? 'Envoyer mes coordonnées' : 'Confirmer ma réservation'
                )}
              </button>
              <p className="text-center text-xs text-slate-500">
                Vos informations restent confidentielles et ne sont utilisées que pour vous recontacter.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

interface FieldProps {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

const Field: React.FC<FieldProps> = ({ icon: Icon, placeholder, value, onChange, type = 'text' }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0a0f1e] border-2 border-white/10 text-white placeholder-slate-500 focus:border-[#c9a24b] transition-colors"
    />
  </div>
);

export default ReservationModal;
