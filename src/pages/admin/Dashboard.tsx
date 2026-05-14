import { Users, Newspaper, Image as ImageIcon, TrendingUp, Clock, Settings, Banknote, CreditCard } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAdmin } from '@/context/AdminContext';

const DashboardCard = ({ title, value, icon: Icon, color, detail, isCurrency }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl sm:text-3xl font-black text-slate-900">
          {isCurrency ? value.toLocaleString('fr-FR') : value}
          {isCurrency && <span className="text-sm ml-1 text-slate-400">FCFA</span>}
        </p>
      </div>
    </div>
    <p className="text-xs font-medium text-slate-400">{detail}</p>
  </div>
);

const AdminDashboard = () => {
  const { registrations, news, gallery, settings } = useAdmin();

  const programPrice = parseInt(settings.programPrice?.replace(/\s/g, '') || '50000');
  const totalPaid = registrations.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
  const potentialRevenue = registrations.filter(r => r.status !== 'cancelled').length * programPrice;
  const remainingToCollect = Math.max(0, potentialRevenue - totalPaid);

  const stats = [
    { 
      title: 'Inscriptions', 
      value: registrations.length, 
      icon: Users, 
      color: 'bg-blue-600',
      detail: `${registrations.filter(r => r.status === 'new').length} nouvelles ce mois` 
    },
    { 
      title: 'Total Encaissé', 
      value: totalPaid, 
      icon: Banknote, 
      color: 'bg-emerald-600',
      isCurrency: true,
      detail: 'Paiements validés' 
    },
    { 
      title: 'Actualités', 
      value: news.length, 
      icon: Newspaper, 
      color: 'bg-purple-600',
      detail: 'Articles publiés' 
    },
    { 
      title: 'Galerie', 
      value: gallery.length, 
      icon: ImageIcon, 
      color: 'bg-pink-600',
      detail: 'Photos en ligne' 
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Aperçu global de l'activité du programme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <DashboardCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Inscriptions récentes
            </h2>
            <a href="/admin/registrations" className="text-sm font-bold text-purple-600 hover:underline">Voir tout</a>
          </div>

          <div className="space-y-4">
            {registrations.length === 0 ? (
              <p className="text-center py-8 text-slate-400 font-medium">Aucune inscription pour le moment</p>
            ) : (
              registrations.slice(0, 5).map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                      {reg.parentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{reg.parentName}</p>
                      <p className="text-xs text-slate-500">{reg.childName} • {reg.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    reg.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                    reg.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {reg.status === 'new' ? 'Nouveau' : reg.status === 'contacted' ? 'Contacté' : 'Inscrit'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats/Links */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-600/20">
            <h3 className="text-lg font-bold mb-2">Objectif Cohorte 2025</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black">{registrations.length}</span>
              <span className="text-purple-200">/ 100 participants</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-6">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((registrations.length / 100) * 100, 100)}%` }} 
              />
            </div>
            <p className="text-sm text-purple-100 leading-relaxed">
              Continuez vos efforts de communication pour atteindre l'objectif avant le 15 Juin.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Actions rapides</h3>
            <div className="grid gap-3">
              <a href="/admin/news" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
                <Newspaper className="w-4 h-4" /> Publier une actualité
              </a>
              <a href="/admin/gallery" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
                <ImageIcon className="w-4 h-4" /> Ajouter des photos
              </a>
              <a href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
                <Settings className="w-4 h-4" /> Modifier les tarifs
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
