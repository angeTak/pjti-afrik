import React, { useState } from 'react';
import { X, Trophy, CreditCard, Loader2, ArrowDown } from 'lucide-react';
import { Team, useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';

interface VotePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

const PACKAGES = [
  { points: 2, price: 500 },
  { points: 5, price: 1000 },
  { points: 12, price: 2000 },
  { points: 30, price: 5000 },
  { points: 65, price: 10000 },
];

const VotePackagesModal: React.FC<VotePackagesModalProps> = ({ isOpen, onClose, team }) => {
  const { addTeamPoints } = useAdmin();
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const togglePackage = (idx: number) => {
    if (selectedPackages.includes(idx)) {
      setSelectedPackages(prev => prev.filter(i => i !== idx));
    } else if (selectedPackages.length < 2) {
      setSelectedPackages(prev => [...prev, idx]);
    } else {
      toast.error("Vous pouvez sélectionner jusqu'à 2 packs maximum.");
    }
  };

  const totalPrice = selectedPackages.reduce((sum, idx) => sum + PACKAGES[idx].price, 0);
  const totalPoints = selectedPackages.reduce((sum, idx) => sum + PACKAGES[idx].points, 0);

  const handleVote = async () => {
    if (selectedPackages.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulation of PayGate API payment flow
    setTimeout(async () => {
      try {
        await addTeamPoints(team.id, totalPoints);
        toast.success(`Succès ! Vous avez offert ${totalPoints} points à l'équipe ${team.name}.`);
        setIsProcessing(false);
        onClose();
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'attribution des points.");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={!isProcessing ? onClose : undefined} />
      <div className="relative bg-white w-full max-w-md rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-900">Soutenir l'équipe</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Équipe : <span className="text-purple-600">{team.name}</span></p>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-none shadow-sm hover:shadow transition-all disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-center text-slate-600 font-medium mb-6">
            Choisissez jusqu'à 2 packs de points pour propulser cette équipe !
          </p>

          <div className="space-y-3">
            {PACKAGES.map((pkg, idx) => {
              const isSelected = selectedPackages.includes(idx);
              return (
                <button
                  key={idx}
                  disabled={isProcessing}
                  onClick={() => togglePackage(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-none border-2 transition-all ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {isSelected ? <div className="w-5 h-5 flex items-center justify-center font-black">✓</div> : <Trophy className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-slate-900 text-lg">{pkg.points} Points</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pack {['Bronze', 'Argent', 'Or', 'Platine', 'Diamant'][idx]}</div>
                    </div>
                  </div>
                  <div className="font-black text-lg text-slate-800">
                    {pkg.price} FCFA
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPackages.length > 0 && (
            <div className="mt-6 p-4 bg-slate-900 text-white flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total à payer</div>
                <div className="text-lg font-black">{totalPrice} FCFA</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total points</div>
                <div className="text-lg font-black text-amber-400">+{totalPoints} pts</div>
              </div>
            </div>
          )}

          {selectedPackages.length > 0 && !isProcessing && (
            <div className="flex justify-center mt-6 -mb-4 animate-bounce duration-1000">
              <ArrowDown className="w-8 h-8 text-purple-600" />
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleVote}
              disabled={selectedPackages.length === 0 || isProcessing}
              className="w-full py-4 bg-purple-600 text-white rounded-none font-black text-lg shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirection vers PayGate...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Payer {totalPrice} FCFA
                </>
              )}
            </button>
            <p className="text-center text-xs font-medium text-slate-400 mt-3">
              Paiement sécurisé par PayGate (TMoney, Flooz, Visa)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotePackagesModal;
