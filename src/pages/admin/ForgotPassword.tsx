import React, { useState } from 'react';
import { Mail, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { success, error: resetError } = await sendPasswordReset(email);
    setIsLoading(false);

    if (success) {
      setSent(true);
    } else {
      setError(resetError || "Impossible d'envoyer l'email. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Mot de passe oublié</h1>
          <p className="text-slate-500 mt-2">
            Entrez votre email : nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 p-6 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-center">
            <CheckCircle2 className="w-10 h-10 flex-shrink-0" />
            <p className="text-sm font-medium">
              Si un compte existe pour <strong>{email}</strong>, un email de réinitialisation vient d'être envoyé.
              Pensez à vérifier vos spams.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 transition-colors"
                  placeholder="votre@email.com"
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
                  Envoi...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
