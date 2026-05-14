import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Crown, Users2, Trophy, ChevronRight, Clock, MapPin, Zap, Share2 } from 'lucide-react';
import { useAdmin, Registration } from '@/context/AdminContext';
import Header from '@/components/layout/Header';
import logoUrl from '@/assets/logo.png';
import Footer from '@/components/layout/Footer';
import VotePackagesModal from '@/components/ui/VotePackagesModal';
import { toast } from 'sonner';

const teamColors = [
  'from-purple-600 to-blue-600',
  'from-blue-600 to-cyan-500',
  'from-emerald-600 to-teal-500',
  'from-rose-600 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-violet-600 to-purple-500',
];

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teams, registrations, settings } = useAdmin();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'project' | 'team'>('team');

  const team = teams.find(t => t.id === id);
  const teamIndex = teams.findIndex(t => t.id === id);
  const gradient = teamColors[teamIndex >= 0 ? (teamIndex % teamColors.length) : 0];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (team) {
      document.title = `${team.name} - pjti-Afrik`;
    }
  }, [team]);

  if (!team) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Trophy className="w-16 h-16 text-slate-200 mb-6" />
          <h1 className="text-2xl font-black text-slate-800 mb-2">Projet introuvable</h1>
          <button onClick={() => navigate('/projets')} className="mt-4 text-purple-600 font-bold hover:underline">
            Retour aux projets
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const captain = team.captain_id ? registrations.find(r => r.id === team.captain_id) : null;
  const members = team.member_ids.map(mid => registrations.find(r => r.id === mid)).filter(Boolean) as Registration[];

  const now = new Date();
  const voteStart = settings.voteStartDate ? new Date(settings.voteStartDate) : null;
  const voteEnd = settings.voteEndDate ? new Date(settings.voteEndDate) : null;
  const voteActive = voteStart && voteEnd && now >= voteStart && now <= voteEnd;
  const votePlanned = voteStart && voteEnd && now < voteStart;

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `Découvrez le projet de l'équipe ${team.name} sur pjti-Afrik : ${team.project_title || team.name}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Lien copié !');
        return;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* ── BREADCRUMBS & ACTIONS ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link to="/projets" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
              Retour à la liste
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" /> Partager
              </button>

              {shareMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShareMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Zap className="w-4 h-4 fill-white" /></div>
                      <span className="text-xs font-bold">WhatsApp</span>
                    </button>
                    <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">f</div>
                      <span className="text-xs font-bold">Facebook</span>
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white font-black text-[10px]">in</div>
                      <span className="text-xs font-bold">LinkedIn</span>
                    </button>
                    <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors border-t border-slate-50 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600"><Share2 className="w-4 h-4" /></div>
                      <span className="text-xs font-bold">TikTok / Copier</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT: CONTENT ── */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Compact Centered Header Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden text-center">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradient}`} />
                
                <div className="flex flex-col items-center gap-4">
                  {/* Logo and Team Number */}
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <img 
                      src={team.logo_url || logoUrl} 
                      alt="Logo" 
                      className="w-16 h-16 md:w-24 md:h-24 object-contain" 
                    />
                    <div className={`text-5xl md:text-6xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent tracking-tighter`}>
                      E-{(team.name.replace(/[^0-9]/g, '') || (teamIndex + 1).toString()).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Équipe {team.name}</span>
                      {voteActive && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Vote Ouvert
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight max-w-xl mx-auto">
                      {team.project_title || "Projet d'Innovation"}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Unified Content Section */}
              <div className="space-y-8">
                
                {/* Team Members Gallery (First) */}
                <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <div className="w-8 h-px bg-purple-200"></div> L'Équipe en action ({members.length})
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {/* Captain */}
                    {captain && (
                      <div className="group relative bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                        <div className="aspect-[4/5] relative overflow-hidden">
                          {captain.photo_url ? (
                            <img src={captain.photo_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-4xl font-black`}>{captain.childName[0]}</div>
                          )}
                        </div>
                        <div className="p-4 text-center">
                          <p className="text-sm font-black text-slate-900 truncate">{captain.childName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{captain.city}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Members */}
                    {members.filter(m => m.id !== team.captain_id).map(m => (
                      <div key={m.id} className="group relative bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                        <div className="aspect-[4/5] relative overflow-hidden">
                          {m.photo_url ? (
                            <img src={m.photo_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200 text-4xl font-black">{m.childName[0]}</div>
                          )}
                        </div>
                        <div className="p-4 text-center">
                          <p className="text-sm font-black text-slate-800 truncate">{m.childName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Description (Second) */}
                <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-8 h-px bg-purple-200"></div> Détails du Projet
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                    {team.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: ACTION CARD ── */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full blur-[60px] opacity-20`} />
                
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 border border-white/20">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  <h3 className="text-xl font-black mb-2">Vote du Public</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-8 px-4">
                    Propulsez l'équipe <strong>{team.name}</strong> vers la victoire !
                  </p>

                  {voteActive ? (
                    <button
                      onClick={() => setVoteModalOpen(true)}
                      className={`w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-900/40 bg-gradient-to-r ${gradient}`}
                    >
                      Voter ce projet
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : votePlanned ? (
                    <div className="w-full py-4 rounded-2xl font-black text-slate-400 bg-white/5 border border-white/10 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" /> Ouverture Prochaine
                    </div>
                  ) : (
                    <div className="w-full py-4 rounded-2xl font-black text-slate-500 bg-white/5 border border-white/10 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" /> Votes clôturés
                    </div>
                  )}
                  
                  <div className="mt-8 flex items-center justify-center gap-4 text-slate-500">
                    <div className="flex flex-col items-center">
                      <Zap className="w-4 h-4 text-purple-400 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Instantané</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col items-center">
                      <MapPin className="w-4 h-4 text-blue-400 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Sécurisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      <VotePackagesModal
        isOpen={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        team={team}
      />
    </div>
  );
};

export default ProjectDetails;
