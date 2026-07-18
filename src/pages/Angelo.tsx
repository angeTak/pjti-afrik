import React, { useState, useRef, useEffect } from 'react';
import {
  Check, X, ArrowDown, Play, Sparkles, Clock, MapPin, Users, Star, ChevronRight, Award,
} from 'lucide-react';
import { useFunnel } from '@/context/FunnelContext';
import { Formation, formationTypeLabels } from '@/data/funnel';
import ReservationModal from '@/components/ui/ReservationModal';

// ---------- Utilitaires ----------
const getYoutubeEmbed = (url: string) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : null;
};

// ---------- Photo avec repli élégant ----------
const Photo: React.FC<{ url: string; alt: string }> = ({ url, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a2035] to-[#0a0f1e]">
        <div className="text-center px-6">
          <Users className="w-16 h-16 text-[#c9a24b]/40 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Ajoutez votre photo<br />depuis l'admin</p>
        </div>
      </div>
    );
  }
  return <img src={url} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-cover object-top" />;
};

// ---------- Bouton doré ----------
const GoldButton: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] text-slate-900 font-black rounded-xl hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#c9a24b]/25 uppercase tracking-wide text-sm ${className}`}
  >
    {children}
  </button>
);

const Angelo = () => {
  const { funnelSettings: s, formations } = useFunnel();
  const [modalFormation, setModalFormation] = useState<Formation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIntent, setModalIntent] = useState<'reservation' | 'contact'>('reservation');
  const offersRef = useRef<HTMLDivElement>(null);

  const published = formations.filter((f) => f.isPublished).sort((a, b) => a.orderIndex - b.orderIndex);
  const featured = published.find((f) => f.isFeatured) || published[0];

  const openReservation = (formation: Formation | null, intent: 'reservation' | 'contact' = 'reservation') => {
    setModalFormation(formation);
    setModalIntent(intent);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c17] text-white font-sans overflow-x-hidden">
      {/* ===================== 1. HERO : TITRE + VIDÉO ===================== */}
      <section className="relative">
        <div className="absolute top-0 right-0 w-[60%] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,75,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 pb-12 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center relative">
          {/* Colonne texte */}
          <div className="order-2 lg:order-1 pt-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-2xl font-black tracking-tight text-white">{s.brand}</span>
              <span className="h-5 w-px bg-[#c9a24b]/50" />
              <span className="text-[#e8cd8a] text-xs font-bold uppercase tracking-widest">IA & Business</span>
            </div>

            <p className="text-slate-300 font-semibold mb-4">{s.heroEyebrow}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-black leading-[1.12] mb-5">
              {s.heroTitle}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8cd8a] to-[#c9a24b]">
                {s.heroHighlight}
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">{s.heroSubtitle}</p>

            <GoldButton onClick={() => openReservation(featured || null)}>
              {s.heroCta} <ChevronRight className="w-4 h-4" />
            </GoldButton>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
              {s.stats.map((stat, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#e8cd8a]">{stat.value}</span>
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne vidéo */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.15),transparent_70%)]" />
            <div className="relative">
              <VideoBlock videoUrl={s.videoUrl} thumb={s.videoThumbUrl} photo={s.photoUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2. DOULEURS ===================== */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <div className="bg-[#0e1424] border border-white/10 rounded-3xl p-7 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center">{s.painTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {s.pains.map((pain, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[#e8cd8a] font-bold">
              Si vous vous reconnaissez dans au moins une de ces situations, ce programme est fait pour vous.
            </p>
          </div>
        </div>
      </section>

      {/* Flèche */}
      <div className="flex justify-center py-2">
        <div className="w-10 h-10 rounded-full border border-[#c9a24b]/40 flex items-center justify-center animate-bounce">
          <ArrowDown className="w-5 h-5 text-[#e8cd8a]" />
        </div>
      </div>

      {/* ===================== 3. QUI SUIS-JE : PHOTO + PRÉSENTATION ===================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Photo */}
          <div className="relative order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.18),transparent_70%)]" />
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-[#0e1424] shadow-2xl">
                <Photo url={s.photoUrl} alt={s.brand} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c17] via-transparent to-transparent" />
              </div>

              {/* Badges flottants */}
              {s.stats[0] && (
                <div className="absolute -left-3 top-10 bg-[#0e1424]/90 backdrop-blur border border-[#c9a24b]/30 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#e8cd8a]" />
                    <div>
                      <p className="text-lg font-black text-white leading-none">{s.stats[0].value}</p>
                      <p className="text-[10px] text-slate-400">{s.stats[0].label}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute -right-2 bottom-16 bg-[#0e1424]/90 backdrop-blur border border-[#c9a24b]/30 rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#e8cd8a]" />
                  <div>
                    <p className="text-sm font-black text-white leading-none">Certifiant</p>
                    <p className="text-[10px] text-slate-400">à la fin du programme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Présentation */}
          <div className="order-2">
            <span className="text-[#e8cd8a] text-xs font-bold uppercase tracking-widest">À propos</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-5">{s.aboutTitle}</h2>
            <div className="space-y-4">
              {s.aboutText.split('\n').filter((p) => p.trim()).map((para, i) => (
                <p key={i} className="text-slate-300 text-base leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="mt-8">
              <GoldButton onClick={() => offersRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                Découvrir mon offre <ChevronRight className="w-4 h-4" />
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 4. CE QUE JE VOUS OFFRE + COMPTE À REBOURS ===================== */}
      <section ref={offersRef} className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="text-center mb-10">
          <span className="text-[#e8cd8a] text-xs font-bold uppercase tracking-widest">Offre spéciale</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">{s.offerTitle}</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Formations, coaching individuel ou accompagnement complet : choisissez la formule adaptée à vos objectifs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {published.map((f) => (
            <OfferCard key={f.id} formation={f} onReserve={() => openReservation(f)} />
          ))}
        </div>

        {/* Compte à rebours */}
        <Countdown deadline={s.offerDeadline} />

        <div className="text-center mt-8">
          <GoldButton onClick={() => openReservation(featured || null)}>
            Je profite de l'offre maintenant <ChevronRight className="w-4 h-4" />
          </GoldButton>
        </div>
      </section>

      {/* ===================== 5. POUR QUI ===================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-3">{s.audienceTitle}</h2>
        <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto text-sm">
          Ce programme s'adresse à tous ceux qui veulent travailler plus efficacement grâce à l'IA.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {s.audience.map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-[#c9a24b]/40 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#c9a24b]/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#e8cd8a]" />
                </span>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 6. RÉSULTATS ===================== */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-gradient-to-b from-[#12182b] to-[#0e1424] border border-[#c9a24b]/20 rounded-3xl p-7 sm:p-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Star className="w-5 h-5 text-[#e8cd8a]" />
            <h2 className="text-2xl sm:text-3xl font-black text-center">{s.resultsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {s.results.map((res, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#c9a24b]/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#e8cd8a]" />
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{res}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 7. PROGRAMME (formation phare) ===================== */}
      {featured && featured.program.length > 0 && (
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <div className="text-center mb-10">
            <span className="text-[#e8cd8a] text-xs font-bold uppercase tracking-widest">Au programme</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">{featured.title}</h2>
            <p className="text-slate-400 text-sm mt-2">{featured.tagline}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {featured.program.map((day, i) => (
              <div key={i} className="bg-[#0e1424] border border-white/10 rounded-2xl p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a24b]/15 mb-4">
                  <span className="text-[#e8cd8a] text-xs font-black uppercase">{day.day}</span>
                </div>
                <h3 className="font-bold text-white mb-4 leading-snug">{day.title}</h3>
                <ul className="space-y-2.5">
                  {day.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#e8cd8a] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-xs leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {featured.bonus.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-[#c9a24b]/10 to-transparent border border-[#c9a24b]/20 rounded-2xl p-6 sm:p-8">
              <h3 className="font-black text-white text-lg mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e8cd8a]" /> Bonus inclus
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {featured.bonus.map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#c9a24b]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#e8cd8a]" />
                    </span>
                    <span className="text-slate-200 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <GoldButton onClick={() => openReservation(featured)}>
              Je réserve ma place <ChevronRight className="w-4 h-4" />
            </GoldButton>
          </div>
        </section>
      )}

      {/* ===================== 8. CTA FINAL ===================== */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.1),transparent_65%)]" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">{s.finalTitle}</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">{s.finalSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <GoldButton onClick={() => openReservation(featured || null)}>{s.finalCta}</GoldButton>
            <button
              onClick={() => openReservation(null, 'contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors text-sm"
            >
              Être recontacté
            </button>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black text-white">{s.brand}</span>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} {s.brand}. Tous droits réservés.</p>
          <a href="/" className="text-slate-400 text-xs font-medium hover:text-[#e8cd8a] transition-colors">Retour au site principal</a>
        </div>
      </footer>

      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formation={modalFormation}
        intent={modalIntent}
      />
    </div>
  );
};

// ---------- Compte à rebours ----------
const Countdown: React.FC<{ deadline: string }> = ({ deadline }) => {
  const target = deadline ? new Date(deadline).getTime() : 0;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (!deadline || isNaN(target)) return null;

  const diff = Math.max(0, target - now);
  const expired = target - now <= 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const units = [
    { value: days, label: 'Jours' },
    { value: hours, label: 'Heures' },
    { value: mins, label: 'Minutes' },
    { value: secs, label: 'Secondes' },
  ];

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 text-[#e8cd8a]">
        <Clock className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-sm">
          {expired ? 'Offre terminée' : "L'offre se termine dans"}
        </span>
      </div>
      <div className="flex gap-3 sm:gap-4">
        {units.map((u, i) => (
          <div key={i} className="w-16 sm:w-20 bg-[#0e1424] border border-[#c9a24b]/30 rounded-2xl py-3 sm:py-4 text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {String(u.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Carte d'offre ----------
const OfferCard: React.FC<{ formation: Formation; onReserve: () => void }> = ({ formation: f, onReserve }) => {
  const seatsLeft = f.seatsTotal > 0 ? Math.max(0, f.seatsTotal - f.seatsTaken) : null;
  const fillPct = f.seatsTotal > 0 ? Math.min(100, Math.round((f.seatsTaken / f.seatsTotal) * 100)) : 0;

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-6 border transition-all ${
        f.isFeatured
          ? 'bg-gradient-to-b from-[#171d33] to-[#0e1424] border-[#c9a24b]/50 shadow-xl shadow-[#c9a24b]/10'
          : 'bg-[#0e1424] border-white/10 hover:border-white/20'
      }`}
    >
      {f.isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] text-slate-900 text-[11px] font-black uppercase tracking-wide shadow-lg">
          ★ Le plus populaire
        </span>
      )}

      <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#e8cd8a] mb-4">
        {formationTypeLabels[f.type]}
      </span>

      <h3 className="text-xl font-black text-white leading-tight">{f.title}</h3>
      <p className="text-slate-400 text-xs mt-1 mb-4">{f.category}</p>
      <p className="text-slate-300 text-sm leading-relaxed mb-5 flex-1">{f.tagline}</p>

      <div className="space-y-2 mb-5 text-xs text-slate-400">
        {f.duration && (
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#c9a24b]" /> {f.duration}</div>
        )}
        {f.format && (
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#c9a24b]" /> {f.format}</div>
        )}
      </div>

      {f.highlights.length > 0 && (
        <ul className="space-y-2 mb-5">
          {f.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#e8cd8a] mt-0.5 flex-shrink-0" />
              <span className="text-slate-300 text-xs leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <div className="flex items-end gap-2 mb-1">
          {f.oldPrice && <span className="text-slate-500 line-through text-sm">{f.oldPrice}</span>}
          <span className="text-2xl font-black text-white">{f.price}</span>
          <span className="text-[#e8cd8a] text-sm font-bold mb-0.5">{f.currency}</span>
        </div>

        {seatsLeft !== null && (
          <div className="mb-4 mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>{seatsLeft > 0 ? `${seatsLeft} place${seatsLeft > 1 ? 's' : ''} restante${seatsLeft > 1 ? 's' : ''}` : 'Complet'}</span>
              <span>{f.seatsTaken}/{f.seatsTotal}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#e8cd8a] to-[#c9a24b]" style={{ width: `${fillPct}%` }} />
            </div>
          </div>
        )}

        <button
          onClick={onReserve}
          disabled={seatsLeft === 0}
          className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${
            seatsLeft === 0
              ? 'bg-white/5 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] text-slate-900 hover:brightness-105 shadow-lg shadow-[#c9a24b]/20'
          }`}
        >
          {seatsLeft === 0 ? 'Complet' : 'Réserver ma place'}
        </button>
      </div>
    </div>
  );
};

// ---------- Bloc vidéo ----------
const VideoBlock: React.FC<{ videoUrl: string; thumb: string; photo: string }> = ({ videoUrl, thumb, photo }) => {
  const [playing, setPlaying] = useState(false);
  const embed = getYoutubeEmbed(videoUrl);
  const cover = thumb || photo;

  if (playing && embed) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#c9a24b]/30 shadow-2xl">
        <iframe src={embed} title="Vidéo" className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
      </div>
    );
  }

  const handleClick = () => {
    if (embed) setPlaying(true);
    else if (videoUrl) window.open(videoUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-[#c9a24b]/30 shadow-2xl bg-[#0e1424]"
    >
      {cover ? (
        <img src={cover} alt="Vidéo" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1a2035] to-[#0a0f1e]" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-gradient-to-b from-[#e8cd8a] to-[#c9a24b] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
        </span>
        <span className="mt-4 text-white font-black text-lg tracking-wide">ASSISTER À LA VIDÉO</span>
        {!videoUrl && <span className="mt-1 text-slate-400 text-xs">(Ajoutez le lien de la vidéo depuis l'admin)</span>}
      </div>
    </button>
  );
};

export default Angelo;
