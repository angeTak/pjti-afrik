import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';

const AdminResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAdmin();
  const navigate = useNavigate();

  // Supabase détecte le token présent dans l'URL du lien reçu par email
  // et ouvre une session de récupération temporaire.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    const { success: ok, error: updateError } = await updatePassword(password);
    setIsLoading(false);

    if (ok) {
      setSuccess(true);
      // On ferme la session de récupération : l'admin devra se reconnecter
      // avec son nouveau mot de passe.
      await supabase.auth.signOut();
      setTimeout(() => navigate('/admin/login'), 2500);
    } else {
      setError(updateError || 'Impossible de mettre à jour le mot de passe.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Nouveau mot de passe</h1>
          <p className="text-slate-500 mt-2">Choisissez un nouveau mot de passe pour votre compte admin.</p>
        </div>

        {checking ? (
          <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-sm font-medium">Vérification du lien...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4 p-6 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-center">
            <CheckCircle2 className="w-10 h-10 flex-shrink-0" />
            <p className="text-sm font-medium">
              Mot de passe mis à jour ! Redirection vers la page de connexion...
            </p>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center gap-4 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
            <AlertCircle className="w-10 h-10 flex-shrink-0" />
            <p className="text-sm font-medium">
              Lien invalide ou expiré. Veuillez redemander un email de réinitialisation.
            </p>
            <a
              href="/admin/forgot-password"
              className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Renvoyer un lien
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer le nouveau mot de passe'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminResetPassword;
