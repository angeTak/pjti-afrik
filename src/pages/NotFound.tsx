import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Wrench, MessageCircle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Page non trouvée ou erreur détectée sur :",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Animated Icon */}
        <div className="mb-10 relative">
          <div className="w-24 h-24 bg-purple-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-purple-200 animate-bounce">
            <Wrench className="w-12 h-12 text-white" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-600/20 rounded-[32px] animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 leading-tight">
          Nous sommes en <br />
          <span className="text-purple-600">maintenance</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
          Nous mettons à jour notre plateforme pour vous offrir une meilleure expérience. 
          Revenez dans quelques instants !
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://wa.me/22891244036" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-200 hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6" />
            Nous écrire sur WhatsApp
          </a>
          
          <a 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </a>
        </div>

        <p className="mt-12 text-slate-400 text-sm font-medium">
          Besoin d'aide urgente ? Appelez-nous au <span className="text-slate-600">+228 91 24 40 36</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
