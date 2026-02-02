import React from 'react';
import {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  BrainCircuit,
  UserCircle,
  Users,
  Inbox,
  ShoppingBag,
  BarChart3,
  Calendar,
  Database,
  Box,
  Tags,
  Contact2,
  FileText,
  X,
  Coins,
  Receipt,
  Waves,
  Tag,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
  alertCount?: number; // Prop pour afficher le badge
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, isOpen, onClose, alertCount = 0 }) => {
  const sections = [
    {
      title: 'Pilotage',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stats', label: 'Statistiques', icon: BarChart3 },
        { id: 'alerts', label: 'Alertes & Anomalies', icon: AlertTriangle, badge: alertCount }, // Nouvel Item
      ]
    },
    {
      title: 'Référentiels',
      items: [
        { id: 'products', label: 'Catalogue Produits', icon: Tag },
        { id: 'packaging_ref', label: 'Cond. Formats', icon: Box },
        { id: 'suppliers', label: 'Fournisseurs', icon: Contact2 },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'carriers', label: 'Transporteurs', icon: Truck },
      ]
    },
    {
      title: 'Opérations PDT',
      items: [
        { id: 'reception', label: 'Réceptions', icon: Inbox },
        { id: 'lots', label: 'Gestion des Lots', icon: Tags },
        { id: 'stocks', label: 'Stocks & Frigos', icon: Warehouse },
        { id: 'washing_log', label: 'Suivi Laveuses', icon: Waves },
      ]
    },
    {
      title: 'Commerce',
      items: [
        { id: 'sales', label: 'Ventes (BC/BL)', icon: ShoppingBag },
        { id: 'tariffs', label: 'Grilles Tarifaires', icon: Coins },
        { id: 'billing', label: 'Facturation', icon: Receipt },
      ]
    },
    {
      title: 'Technique & Qualité',
      items: [
        { id: 'maintenance', label: 'GMAO / Tech', icon: Wrench },
        { id: 'quality', label: 'Qualité & Analyse', icon: ShieldCheck },
        { id: 'ai', label: 'Assistant TuberSys', icon: BrainCircuit },
        { id: 'backup', label: 'Sauvegarde / DB', icon: Database },
      ]
    }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden" onClick={onClose} />}
      <div className={`w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-[60] overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-xl text-slate-900 shadow-inner">TS</div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">TuberSys</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Julien Vauchelle</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-[10px] uppercase font-black text-slate-500 mb-2 px-4 tracking-tighter">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${activeTab === item.id ? 'bg-amber-500 text-slate-900 font-bold shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                        <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        <span>{item.label}</span>
                    </div>
                    {/* Badge rouge si alertes */}
                    {item.badge && item.badge > 0 ? (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
