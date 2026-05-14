import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users2, Calendar, Trophy, Clock, Search, Filter, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SeparatorPattern from '@/components/ui/SeparatorPattern';
import { useAdmin } from '@/context/AdminContext';

const Projets = () => {
  const { teams, registrations, isLoading, settings } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['Tous', 'Programmation', 'Cybersécurité', 'Design', 'Intelligence Artificielle'];
  const [selectedFilter, setSelectedFilter] = useState('Tous');

  const publishedTeams = useMemo(() => teams.filter(t => t.is_published), [teams]);

  const filteredTeams = useMemo(() => {
    return publishedTeams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (team.project_title?.toLowerCase().includes(searchQuery.toLowerCase()));
      // Mock filter for now as teams don't have categories yet
      // Filter by category (if team has one)
      const matchesFilter = selectedFilter === 'Tous' || team.category === selectedFilter; 
      return matchesSearch && matchesFilter;
    });
  }, [publishedTeams, searchQuery, selectedFilter]);

  // Global vote status from settings
  const now = new Date();
  const voteStart = settings.voteStartDate ? new Date(settings.voteStartDate) : null;
  const voteEnd = settings.voteEndDate ? new Date(settings.voteEndDate) : null;
  const voteActive = voteStart && voteEnd && now >= voteStart && now <= voteEnd;
  const votePlanned = voteStart && voteEnd && now < voteStart;

  useEffect(() => {
    document.title = 'Vote de projet - pjti-Afrik';
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredTeams]);

  const getParticipant = (id: string) => registrations.find(r => r.id === id);

  const teamColors = [
    'from-purple-600 to-blue-600',
    'from-blue-600 to-cyan-500',
    'from-emerald-600 to-teal-500',
    'from-rose-600 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-violet-600 to-purple-500',
  ];

  return (
    <div className="min-h-screen bg-slate-50/30" ref={sectionRef}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .animate-bounce-x {
          animation: bounce-x 0.8s ease-in-out infinite;
        }
      `}} />
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative pt-24 pb-28 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="reveal opacity-0 text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
              Explorez les <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Innovations
              </span>
            </h1>
            
            <p className="reveal opacity-0 delay-100 text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 px-4">
              Découvrez les projets technologiques portés par nos jeunes talents du pjti-Afrik 1ère édition au Togo
            </p>

            {/* Stats Bar */}
            <div className="reveal opacity-0 delay-300 inline-flex items-center gap-4 md:gap-8 px-6 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">{publishedTeams.length}</div>
                <div className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Équipes</div>
              </div>
              <div className="w-px h-8 md:h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">
                  {publishedTeams.reduce((acc, t) => acc + t.member_ids.length, 0)}
                </div>
                <div className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Talents</div>
              </div>
              {voteActive && (
                <>
                  <div className="w-px h-8 md:h-10 bg-white/10" />
                  <div className="text-center animate-pulse">
                    <div className="text-2xl md:text-3xl font-black text-emerald-400">Actif</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full z-10">
            <SeparatorPattern />
          </div>
        </section>

        {/* ── PROJECTS LISTING ── */}
        <section className="relative py-10 lg:py-32 -mt-16 md:-mt-24 z-20">
          <div className="container max-w-7xl mx-auto px-4">
            
            {/* Search and Filters Bar */}
            <div className="reveal opacity-0 delay-400 flex flex-col md:flex-row items-center gap-4 mb-10 md:mb-16 p-3 md:p-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl md:rounded-[32px] shadow-2xl shadow-slate-200/50">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-slate-100/50 border-none rounded-xl md:rounded-2xl text-sm md:text-base text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto px-2 md:px-0">
                {categories.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black whitespace-nowrap transition-all flex-1 md:flex-none text-center ${
                      selectedFilter === filter 
                        ? 'bg-slate-900 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="h-[400px] bg-white rounded-[32px] border border-slate-100 animate-pulse p-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-6" />
                    <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2 mb-10" />
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-50 rounded-full" />
                      <div className="h-3 bg-slate-50 rounded-full w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <LayoutGrid className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Aucun projet trouvé</h2>
                <p className="text-slate-400">Essayez de modifier votre recherche ou vos filtres.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map((team, idx) => {
                  const captain = team.captain_id ? getParticipant(team.captain_id) : null;
                  const gradient = teamColors[idx % teamColors.length];

                  return (
                    <div 
                      key={team.id} 
                      onClick={() => navigate(`/projets/${team.id}`)}
                      className={`reveal opacity-0 group flex flex-col bg-white rounded-lg border-2 border-purple-600 hover:border-purple-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden p-8`}
                      style={{ transitionDelay: `${(idx % 8) * 100}ms` }}
                    >
                      {/* Team Number / Action */}
                      <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="text-4xl font-black bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                          #{(team.name.replace(/[^0-9]/g, '') || (idx + 1).toString()).padStart(2, '0')}
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projets/${team.id}`);
                          }}
                          className="flex items-center gap-1.5 bg-transparent text-slate-900 font-medium text-base sm:text-lg uppercase tracking-[0.1em] hover:text-purple-600 transition-all animate-bounce-x"
                        >
                          Voter ce Projet
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center">
                        <div className="inline-block px-6 py-3 bg-purple-50 text-purple-600 font-black text-sm sm:text-base uppercase tracking-[0.15em] mb-6 rounded-xl">
                          Équipe : <span className="border-b-2 border-purple-300 ml-1 pb-0.5">{team.name}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Projet</span>
                          <h2 className="text-xl font-black text-slate-900 leading-tight group-hover:text-purple-600 transition-colors">
                            {team.project_title || 'Projet sans titre'}
                          </h2>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 px-2">
                          {team.description}
                        </p>
                      </div>

                      {/* Footer Info: Photos + Names */}
                      <div className="pt-6 border-t border-slate-100">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {team.member_ids.map(id => {
                            const p = getParticipant(id);
                            if (!p) return null;
                            return (
                              <div key={id} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                  {p.photo ? (
                                    <img src={p.photo} alt={p.childName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400 bg-slate-50">
                                      {p.childName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
                                  {p.childName.split(' ')[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <SeparatorPattern />
      </main>
      <Footer />
    </div>
  );
};

export default Projets;
