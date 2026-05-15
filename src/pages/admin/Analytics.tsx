import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Globe, 
  Monitor, 
  Smartphone,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/lib/supabase';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-5 sm:p-6 rounded-[32px] shadow-sm border border-slate-100 hover:border-purple-200 transition-all group">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-[11px] sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
    <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: [],
    viewsByDay: [],
    devices: { mobile: 0, desktop: 0 }
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: views, error } = await supabase
          .from('page_views')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!views) return;

        // Process data
        const totalViews = views.length || 0;
        const uniqueVisitors = views.length > 0 ? new Set(views.map(v => v.session_id)).size : 0;
        
        // Top pages
        const pagesMap: any = {};
        views.forEach(v => {
          if (v && v.path) {
            pagesMap[v.path] = (pagesMap[v.path] || 0) + 1;
          }
        });
        const topPages = Object.entries(pagesMap)
          .map(([path, count]) => ({ path, count }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);

        // Device stats
        let desktop = 0;
        let mobile = 0;
        views.forEach(v => {
          if (v && v.user_agent) {
            if (/mobile|android|iphone/i.test(v.user_agent)) mobile++;
            else desktop++;
          } else {
            desktop++;
          }
        });

        // Views by day (last 7 days)
        const daysMap: any = {};
        for(let i=0; i<7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          daysMap[d.toISOString().split('T')[0]] = 0;
        }
        views.forEach(v => {
          if (v && v.created_at) {
            const day = v.created_at.split('T')[0];
            if (daysMap[day] !== undefined) daysMap[day]++;
          }
        });
        const viewsByDay = Object.entries(daysMap)
          .map(([date, count]) => ({ date, count }))
          .reverse();

        setStats({
          totalViews,
          uniqueVisitors,
          topPages,
          viewsByDay,
          devices: { mobile, desktop }
        });
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-white rounded-3xl w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
          </div>
          <div className="h-96 bg-white rounded-3xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Analytiques</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Fréquentation du site</p>
        </div>
        <div className="flex items-center self-start sm:self-auto gap-2 px-3 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          7 Derniers jours
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <StatCard title="Vues" value={stats.totalViews} icon={BarChart3} color="bg-purple-600" trend={12} />
        <StatCard title="Uniques" value={stats.uniqueVisitors} icon={Users} color="bg-blue-600" trend={8} />
        <StatCard title="Engagement" value="64%" icon={MousePointer2} color="bg-emerald-600" trend={-3} />
        <StatCard title="Moyen" value="4m 12s" icon={TrendingUp} color="bg-orange-600" trend={15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Trafic hebdomadaire
            </h2>
            <div className="h-48 sm:h-64 flex items-end gap-1.5 sm:gap-4 px-1">
              {stats.viewsByDay.map((day: any, idx: number) => {
                const max = Math.max(...stats.viewsByDay.map((d: any) => d.count), 1);
                const height = (day.count / max) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 sm:gap-3 group">
                    <div className="relative w-full">
                      <div 
                        className="w-full bg-slate-50 group-hover:bg-purple-50 rounded-lg sm:rounded-2xl transition-all duration-500 overflow-hidden flex items-end"
                        style={{ height: '160px' }}
                      >
                        <div 
                          className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-lg sm:rounded-2xl transition-all duration-1000 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] sm:text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {day.count} vues
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device and Browser info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" /> Appareils
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="flex items-center gap-2 text-slate-500"><Monitor className="w-4 h-4" /> Desktop</span>
                    <span>{Math.round((stats.devices.desktop / (stats.totalViews || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-slate-900 h-full rounded-full" style={{ width: `${(stats.devices.desktop / (stats.totalViews || 1)) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="flex items-center gap-2 text-slate-500"><Smartphone className="w-4 h-4" /> Mobile</span>
                    <span>{Math.round((stats.devices.mobile / (stats.totalViews || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(stats.devices.mobile / (stats.totalViews || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
              <h3 className="font-bold mb-3 sm:mb-4">Google Analytics 4</h3>
              <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-6">
                Le tag Google Analytics est actif. Pour des rapports détaillés, consultez votre dashboard externe.
              </p>
              <a 
                href="https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/a395007771p537940072/reports/intelligenthome?params=_u..nav%3Dmaui" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-sm transition-all"
              >
                Ouvrir GA4 <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Top Pages & Sidebar stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
              Pages populaires
              <BarChart3 className="w-4 h-4 text-slate-300" />
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {stats.topPages.map((page: any, idx: number) => (
                <div key={idx} className="group p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest truncate max-w-[120px]">
                      {page.path === '/' ? 'Accueil' : page.path.split('/')[1]}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{page.count} vues</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{page.path}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between text-sm sm:text-base">
              Vitesse de charge
              <span className="text-emerald-500 font-black text-lg">1.2s</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Score LCP</span>
                <span className="text-emerald-500 uppercase">Excellent</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[92%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
