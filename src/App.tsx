import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './modules/Dashboard';
import StockManager from './modules/StockManager';
import ProductionTracker from './modules/ProductionTracker';
import SpudAI from './modules/SpudAI';
import ClientManager from './modules/ClientManager';
import CarrierManager from './modules/CarrierManager';
import TariffManager from './modules/TariffManager';
import MaintenanceManager from './modules/MaintenanceManager';
import QualityManager from './modules/QualityManager';
import BillingManager from './modules/BillingManager';
import ReceptionManager from './modules/ReceptionManager';
import SalesManager from './modules/SalesManager';
import ProductManager from './modules/ProductManager';
import OrderDocumentManager from './modules/OrderDocumentManager';
import StatsCenter from './modules/StatsCenter';
import AgendaShared from './modules/AgendaShared';
import BackupManager from './modules/BackupManager';
import PackagingTypesManager from './modules/PackagingTypesManager';
import VarietyManager from './modules/VarietyManager';
import CalibreManager from './modules/CalibreManager';
import LotManager from './modules/LotManager';
import SupplierManager from './modules/SupplierManager';
import AlertsManager from './modules/AlertsManager'; // Nouveau
import QrPlacementWizard from './modules/logistic/QrPlacementWizard';
import WashingLog from './modules/logistic/WashingLog';
import { Role, Fridge, Variety, Calibre, Tariff, Machine, MaintenanceTask, SparePart, QualityAnalysis, SampleItem, Invoice, Order, Lot, Palox, Reception, ProductionOrder, WashingRecord, Product, OrderTemplate, ScanInconsistency, LabelCounter } from './types';
import { initializeDB, saveToDB, SpudFlowDB } from './services/storageService';
import { Bell, Search, Settings as SettingsIcon, BrainCircuit, Menu, CalendarDays, ChevronDown, QrCode } from 'lucide-react';

const CAMPAIGNS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole] = useState<Role>(Role.DEVELOPPEUR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState("2025-2026");
  const [isQrWizardOpen, setIsQrWizardOpen] = useState(false);

  const [db, setDb] = useState<SpudFlowDB>(initializeDB());

  useEffect(() => {
    saveToDB(db);
  }, [db]);

  const filteredDb = useMemo(() => {
    return {
      ...db,
      lots: db.lots.filter(l => l.campaignId === activeCampaign),
      sales: db.sales.filter(s => s.campaignId === activeCampaign),
      invoices: db.invoices.filter(i => i.campaignId === activeCampaign),
      receptions: db.receptions.filter(r => r.campaignId === activeCampaign),
      palox: db.palox.filter(p => p.campaignId === activeCampaign),
      washingHistory: db.washingHistory.filter(w => w.campaignId === activeCampaign),
      inconsistencies: db.inconsistencies ? db.inconsistencies.filter(inc => inc.campaignId === activeCampaign) : [],
      qualityAnalyses: db.qualityAnalyses.filter(q => q.campaignId === activeCampaign),
      sampleLibrary: db.sampleLibrary.filter(s => s.campaignId === activeCampaign),
      productionOrders: db.productionOrders.filter(p => p.campaignId === activeCampaign),
    };
  }, [db, activeCampaign]);

  const syncWithGlobal = <T extends { id: string, campaignId?: string }>(
    globalList: T[],
    updatedCampaignList: T[]
  ) => {
    const otherCampaigns = globalList.filter(item => item.campaignId !== activeCampaign);
    const stampedList = updatedCampaignList.map(item => ({...item, campaignId: activeCampaign}));
    return [...otherCampaigns, ...stampedList];
  };

  const updateEntities = (entities: any) => setDb(prev => ({...prev, entities}));
  const updateProducts = (products: Product[]) => setDb(prev => ({...prev, products}));
  const updateLots = (lots: Lot[]) => setDb(prev => ({...prev, lots: syncWithGlobal(prev.lots, lots)}));
  const updateLabelCounters = (counters: LabelCounter[]) => setDb(prev => ({...prev, labelCounters: counters})); // NOUVEAU
  const updateSales = (sales: Order[]) => setDb(prev => ({...prev, sales: syncWithGlobal(prev.sales, sales)}));
  const updateReceptions = (receptions: Reception[]) => setDb(prev => ({...prev, receptions: syncWithGlobal(prev.receptions, receptions)}));
  const updateOrderTemplates = (orderTemplates: OrderTemplate[]) => setDb(prev => ({...prev, orderTemplates}));
  const updateTariffs = (tariffs: Tariff[]) => setDb(prev => ({...prev, tariffs}));
  const updatePackagingTypes = (packagingTypes: any) => setDb(prev => ({...prev, packagingTypes}));
  const updateVarieties = (varieties: Variety[]) => setDb(prev => ({...prev, varieties}));
  const updateCalibres = (calibres: Calibre[]) => setDb(prev => ({...prev, calibres}));
  const updateIndustrialCalibres = (industrialCalibres: Calibre[]) => setDb(prev => ({...prev, industrialCalibres}));
  const updatePalox = (palox: Palox[]) => setDb(prev => ({...prev, palox: syncWithGlobal(prev.palox, palox)}));
  const updateWashingHistory = (washingHistory: WashingRecord[]) => setDb(prev => ({...prev, washingHistory: syncWithGlobal(prev.washingHistory, washingHistory)}));
  const updateInconsistencies = (inconsistencies: ScanInconsistency[]) => setDb(prev => ({...prev, inconsistencies: syncWithGlobal(prev.inconsistencies || [], inconsistencies)}));
  const updateFridges = (fridges: Fridge[]) => setDb(prev => ({...prev, fridges}));
  const updateMachines = (machines: Machine[]) => setDb(prev => ({...prev, machines}));
  const updateTasks = (maintenanceTasks: MaintenanceTask[]) => setDb(prev => ({...prev, maintenanceTasks}));
  const updateParts = (spareParts: SparePart[]) => setDb(prev => ({...prev, spareParts}));
  const updateAnalyses = (qualityAnalyses: QualityAnalysis[]) => setDb(prev => ({...prev, qualityAnalyses: syncWithGlobal(prev.qualityAnalyses, qualityAnalyses)}));
  const updateSamples = (sampleLibrary: SampleItem[]) => setDb(prev => ({...prev, sampleLibrary: syncWithGlobal(prev.sampleLibrary, sampleLibrary)}));
  const updateInvoices = (invoices: Invoice[]) => setDb(prev => ({...prev, invoices: syncWithGlobal(prev.invoices, invoices)}));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard db={filteredDb} />;
      case 'stocks': return (
        <StockManager
          palox={filteredDb.palox}
          fridges={filteredDb.fridges}
          lots={filteredDb.lots}
          calibres={filteredDb.industrialCalibres}
          varieties={filteredDb.varieties}
          activeCampaign={activeCampaign}
          onUpdatePalox={updatePalox}
          onUpdateFridges={updateFridges}
        />
      );
      case 'production': return <ProductionTracker />;
      case 'washing_log': return (
        <WashingLog
          history={filteredDb.washingHistory}
          inconsistencies={filteredDb.inconsistencies}
        />
      );
      case 'alerts': return <AlertsManager inconsistencies={filteredDb.inconsistencies} />; // NOUVEAU
      case 'suppliers': return <SupplierManager entities={filteredDb.entities} onUpdateEntities={updateEntities} />;
      case 'clients': return <ClientManager entities={filteredDb.entities} onUpdateEntities={updateEntities} />;
      case 'carriers': return <CarrierManager entities={filteredDb.entities} onUpdateEntities={updateEntities} />;
      case 'products': return (
        <ProductManager
          products={filteredDb.products}
          varieties={filteredDb.varieties}
          packagingTypes={filteredDb.packagingTypes}
          calibres={filteredDb.calibres}
          onUpdate={updateProducts}
        />
      );
      case 'tariffs': return <TariffManager entities={filteredDb.entities} tariffs={filteredDb.tariffs} onUpdateTariffs={updateTariffs} />;
      case 'maintenance': return (
        <MaintenanceManager
          db={filteredDb}
          onUpdateMachines={updateMachines}
          onUpdateTasks={updateTasks}
          onUpdateParts={updateParts}
        />
      );
      case 'quality': return (
        <QualityManager
          db={filteredDb}
          activeCampaign={activeCampaign}
          onUpdateAnalyses={updateAnalyses}
          onUpdateSamples={updateSamples}
        />
      );
      case 'billing': return (
        <BillingManager
          db={filteredDb}
          activeCampaign={activeCampaign}
          onUpdateInvoices={updateInvoices}
          onUpdateSales={updateSales}
        />
      );
      case 'reception': return (
        <ReceptionManager
          receptions={filteredDb.receptions}
          suppliers={filteredDb.entities.filter(e => e.category === 'Fournisseur')}
          carriers={filteredDb.entities.filter(e => e.category === 'Transporteur')}
          varieties={filteredDb.varieties}
          lots={filteredDb.lots}
          calibres={filteredDb.industrialCalibres}
          activeCampaign={activeCampaign}
          onUpdateReceptions={updateReceptions}
        />
      );
      case 'lots': return (
        <LotManager
            entities={filteredDb.entities}
            lots={filteredDb.lots}
            varieties={filteredDb.varieties}
            activeCampaign={activeCampaign}
            onUpdateLots={updateLots}
            labelCounters={db.labelCounters} // Passage des compteurs
            onUpdateLabelCounters={updateLabelCounters} // Mise à jour compteurs
            onAddInconsistency={(inc) => updateInconsistencies([...filteredDb.inconsistencies, inc])} // Pour les alertes d'impression
        />
      );
      case 'sales': return (
        <SalesManager
          sales={filteredDb.sales}
          invoices={filteredDb.invoices}
          templates={filteredDb.orderTemplates || []}
          entities={filteredDb.entities}
          products={filteredDb.products}
          packagingTypes={filteredDb.packagingTypes}
          lots={filteredDb.lots}
          calibres={filteredDb.calibres}
          activeCampaign={activeCampaign}
          onUpdateSales={updateSales}
          onUpdateTemplates={updateOrderTemplates}
        />
      );
      case 'packaging_ref': return <PackagingTypesManager packagingTypes={filteredDb.packagingTypes} onUpdate={updatePackagingTypes} />;
      case 'stats': return <StatsCenter db={filteredDb} />;
      case 'ai': return <SpudAI db={filteredDb} />;
      case 'backup': return <BackupManager db={db} onRestore={(restoredDb) => setDb(restoredDb)} />;
      default: return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-40">
          <SettingsIcon size={64} className="animate-spin-slow" />
          <h3 className="text-xl font-bold mt-4">Module en cours de développement</h3>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-slate-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        alertCount={filteredDb.inconsistencies.length} // Affichage badge
      />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 shadow-xl group cursor-pointer relative">
               <CalendarDays size={18} className="text-amber-500" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">Campagne Active</span>
                  <select
                    value={activeCampaign}
                    onChange={(e) => setActiveCampaign(e.target.value)}
                    className="bg-transparent border-none outline-none font-black text-sm pr-6 appearance-none cursor-pointer"
                  >
                    {CAMPAIGNS.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                  </select>
               </div>
               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-amber-500 transition-colors pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 ml-4">
            <button
                onClick={() => setActiveTab('alerts')}
                className="relative p-2 bg-white text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
            >
                <Bell size={24} />
                {filteredDb.inconsistencies.length > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-800 leading-none">BAYARD DISTRIBUTION</p>
                <p className="text-[10px] text-amber-500 uppercase font-black tracking-tighter mt-1">Assistant TuberSys Actif</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-center text-white font-black text-xs">
                JV
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>

        <button
          onClick={() => setIsQrWizardOpen(true)}
          className="fixed bottom-8 left-8 lg:left-72 w-16 h-16 bg-slate-900 text-amber-500 rounded-full shadow-2xl shadow-slate-900/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-b-4 border-slate-950"
        >
          <QrCode size={32} />
        </button>

        {isQrWizardOpen && (
          <QrPlacementWizard
            fridges={filteredDb.fridges}
            palox={filteredDb.palox}
            washingHistory={filteredDb.washingHistory}
            inconsistencies={filteredDb.inconsistencies}
            activeCampaign={activeCampaign}
            onClose={() => setIsQrWizardOpen(false)}
            onUpdatePalox={updatePalox}
            onUpdateWashingHistory={updateWashingHistory}
            onUpdateInconsistencies={updateInconsistencies}
          />
        )}

        <button
          onClick={() => setActiveTab('ai')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-amber-500 text-slate-900 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-b-4 border-amber-600"
        >
          <BrainCircuit size={32} />
        </button>
      </main>
    </div>
  );
};

export default App;
