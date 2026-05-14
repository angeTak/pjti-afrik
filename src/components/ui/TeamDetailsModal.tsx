import React from 'react';
import { X, Crown, Users2, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { Team, Registration, useAdmin } from '@/context/AdminContext';

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onVoteClick: () => void;
  voteActive: boolean;
  gradient: string;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ isOpen, onClose, team, onVoteClick, voteActive, gradient }) => {
  const { registrations } = useAdmin();
  
  if (!isOpen) return null;

  const captain = team.captain_id ? registrations.find(r => r.id === team.captain_id) : null;
  const members = team.member_ids.map(id => registrations.find(r => r.id === id)).filter(Boolean) as Registration[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className={`relative bg-gradient-to-br ${gradient} p-8 text-white flex-shrink-0`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-3xl font-black shadow-inner">
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          
          <h2 className="text-3xl font-black leading-tight mb-2">{team.name}</h2>
          <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Users2 className="w-4 h-4" /> {members.length} membres</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Le Projet</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{team.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Captain */}
            {captain && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Capitaine</h3>
                <div className="flex items-center gap-4">
                  {captain.photo_url ? (
                    <img src={captain.photo_url} alt={captain.childName} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black shadow-sm`}>
                      {captain.childName.slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      {captain.childName}
                      <Crown className="w-4 h-4 text-amber-500" />
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{captain.city}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Members */}
            {members.length > 0 && (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Membres</h3>
                <div className="space-y-3">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.childName} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                          {m.childName.slice(0,2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-700">{m.childName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex-shrink-0">
          {voteActive ? (
            <button
              onClick={() => {
                onClose();
                onVoteClick();
              }}
              className={`w-full py-4 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg bg-gradient-to-r ${gradient}`}
            >
              <Trophy className="w-6 h-6" />
              Soutenir cette équipe (Voter)
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-full py-4 rounded-2xl font-bold text-slate-400 bg-slate-100 flex items-center justify-center gap-2 text-sm text-center px-4 border border-slate-200">
              <Calendar className="w-5 h-5" />
              Les votes ne sont pas ouverts actuellement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
