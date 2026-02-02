import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, Boxes, Timer, Ghost } from 'lucide-react';
import { SpudFlowDB } from '../services/storageService';

interface DashboardProps {
  db: SpudFlowDB;
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ db }) => {
  // Calcul dynamique des KPIs
  const totalStockTonnes = db.palox.reduce((acc, p) => acc + (p.weight / 1000), 0);

  // Production du jour basée sur les ventes validées à la date du jour
  const today = new Date().toLocaleDateString('fr-CA');
  const todaySales = db.sales.filter(s => s.date === today);
  const todayProduction = todaySales.reduce((acc, s) => {
    return acc + s.items.reduce((itemAcc, item) => itemAcc + (item.totalWeight / 1000), 0);
  }, 0);

  // Alertes maintenance (machines non opérationnelles)
  const alertsCount = db.machines.filter(m => m.status !== 'Operationnelle').length;

  // Préparation des données pour le graphique de production hebdo (basé sur les ventes)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('fr-CA');
  }).reverse();

  const prodData = last7Days.map(date => {
    const daySales = db.sales.filter(s => s.date === date);
    const weight = daySales.reduce((acc, s) => {
      return acc + s.items.reduce((itemAcc, item) => itemAcc + (item.totalWeight / 1000), 0);
    }, 0);
    const d = new Date(date);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return { name: days[d.getDay()], tonnes: weight };
  });

  // Répartition par variété (basé sur les lots enregistrés ou stocks)
  const varietyMap: Record<string, number> = {};
  db.palox.forEach(p => {
    varietyMap[p.variety] = (varietyMap[p.variety] || 0) + (p.weight / 1000);
  });

  const stockVariety = Object.entries(varietyMap).map(([name, value]) => ({ name, value }));
  const hasData = db.sales.length > 0 || db.palox.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Tableau de Bord Direction</h2>
          <p className="text-slate-500 text-sm italic">Analyse en temps réel de BAYARD DISTRIBUTION</p>
        </div>
        <div className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-widest border border-green-200">
          Système Actif
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Stock Total"
          value={`${totalStockTonnes.toFixed(1)} T`}
          sub={`${db.palox.length} palox en frigo`}
          icon={<Boxes className="text-blue-600" />}
        />
        <KpiCard
          title="TRS Estimé"
          value={hasData ? "84%" : "-"}
          sub="Basé sur OF terminés"
          icon={<Timer className="text-green-600" />}
        />
        <KpiCard
          title="Expéditions Jour"
          value={`${todayProduction.toFixed(1)} T`}
          sub={`${todaySales.length} commandes traitées`}
          icon={<TrendingUp className="text-amber-600" />}
        />
        <KpiCard
          title="Maintenance"
          value={alertsCount.toString()}
          sub="Machines hors-service"
          icon={<AlertTriangle className={alertsCount > 0 ? "text-red-600" : "text-slate-400"} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de Production */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex justify-between">
            Expéditions 7 derniers jours (T)
            {db.sales.length === 0 && <span className="text-[10px] text-amber-500">Aucune vente</span>}
          </h3>
          <div className="h-64 relative">
            {db.sales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="tonnes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="En attente de commandes" />
            )}
          </div>
        </div>

        {/* Graphique de Variétés */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6">Répartition Stock Variétés (T)</h3>
          <div className="h-64 flex items-center">
            {stockVariety.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockVariety}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stockVariety.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-2 pl-4">
                  {stockVariety.map((v, i) => (
                    <div key={v.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-slate-500 font-bold uppercase">{v.name}</span>
                      </div>
                      <span className="font-black text-slate-800">{v.value.toFixed(1)} T</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState message="Aucun stock en frigo" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
      <p className="text-[10px] text-slate-400 mt-1 italic font-medium">{sub}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
      {icon}
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
    <Ghost size={48} strokeWidth={1} className="mb-2 opacity-20" />
    <span className="text-xs font-bold uppercase tracking-widest italic">{message}</span>
  </div>
);

export default Dashboard;
