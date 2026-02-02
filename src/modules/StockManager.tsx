import React, { useState, useMemo } from 'react';
import { Fridge, Palox, Lot, PaloxStatus, Calibre, Variety, TreatmentRecord } from '../types';
import { Thermometer, Layers, SprayCan, FileDown, Settings2, Eraser, Boxes } from 'lucide-react';
import TreatmentModal from './stock/TreatmentModal';
import ExportModal from './stock/ExportModal';
import FridgeMap from './stock/FridgeMap';
import PaloxDetail from './stock/PaloxDetail';
import TreatmentStats from './stock/TreatmentStats';

interface StockManagerProps {
  palox: Palox[];
  fridges: Fridge[];
  lots: Lot[];
  calibres: Calibre[];
  varieties: Variety[];
  activeCampaign: string;
  onUpdatePalox: (palox: Palox[]) => void;
  onUpdateFridges?: (fridges: Fridge[]) => void;
}

interface ExportRow {
  variety: string;
  calibre: string;
  lotId: string;
  count: number;
  totalWeight: number;
  color: string;
  fridgeCounts: Record<string, number>;
}

const StockManager: React.FC<StockManagerProps> = ({ palox, fridges, lots, calibres, varieties, activeCampaign, onUpdatePalox, onUpdateFridges }) => {
  const [selectedFridge, setSelectedFridge] = useState<Fridge>(fridges[0]);
  const [selectedSlot, setSelectedSlot] = useState<{ row: number; col: number } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [fridgesToExport, setFridgesToExport] = useState<string[]>(fridges.map(f => f.id));

  const fridgePalox = palox.filter(p => p.fridgeId === selectedFridge.id);
  const aisleSet = useMemo(() => new Set(selectedFridge.aisles || []), [selectedFridge]);

  const maxStorageCells = (selectedFridge.maxRows * selectedFridge.maxCols) - aisleSet.size;
  const realCapacity = maxStorageCells * selectedFridge.maxHeight;

  const getVarietyColor = (varietyName: string) => {
    const v = varieties.find(v => v.name.toUpperCase() === varietyName.toUpperCase());
    return v?.color || '#cbd5e1';
  };

  const handleSlotClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (isEditMode) {
      if (!onUpdateFridges) return;
      let newAisles = [...(selectedFridge.aisles || [])];
      if (newAisles.includes(key)) {
        newAisles = newAisles.filter(k => k !== key);
      } else {
        if (fridgePalox.some(p => p.row === row && p.col === col)) {
          alert("Action impossible : des palox sont stockés à cet emplacement.");
          return;
        }
        newAisles.push(key);
      }
      const updatedFridge = { ...selectedFridge, aisles: newAisles };
      setSelectedFridge(updatedFridge);
      onUpdateFridges(fridges.map(f => f.id === updatedFridge.id ? updatedFridge : f));
      return;
    }
    if (aisleSet.has(key)) return;
    setSelectedSlot({ row, col });
  };

  const handleClearFridge = () => {
    if (window.confirm(`Voulez-vous vider entièrement le ${selectedFridge.name} ?`)) {
      onUpdatePalox(palox.filter(p => p.fridgeId !== selectedFridge.id));
      setSelectedSlot(null);
    }
  };

  const handleDeletePalox = (id: string) => {
    onUpdatePalox(palox.filter(p => p.id !== id));
  };

  const handleSaveStock = (newPaloxList: Palox[]) => {
    onUpdatePalox([...palox, ...newPaloxList]);
    setSelectedSlot(null);
  };

  const handleApplyTreatment = (date: string, product: 'Menthe' | 'Dormir' | 'Autre', dosage: number) => {
    const newRecord: TreatmentRecord = {
      date: date,
      product: product,
      dosage: dosage,
      fridgeName: selectedFridge.name
    };

    const updatedPaloxList = palox.map(p => {
        if (p.fridgeId === selectedFridge.id) {
            return {
                ...p,
                treatmentDate: date,
                treatmentType: product,
                treatmentHistory: [...(p.treatmentHistory || []), newRecord]
            };
        }
        return p;
    });

    onUpdatePalox(updatedPaloxList);
    setShowTreatmentModal(false);
    alert("Traitement appliqué avec succès.");
  };

  const generateExportData = (): ExportRow[] => {
    const filtered = palox.filter(p => fridgesToExport.includes(p.fridgeId));
    const grouped = filtered.reduce((acc, p) => {
      const key = `${p.variety}-${p.calibre}-${p.lotId}`;
      if (!acc[key]) {
        acc[key] = {
          variety: p.variety,
          calibre: p.calibre,
          lotId: p.lotId,
          count: 0,
          totalWeight: 0,
          color: getVarietyColor(p.variety),
          fridgeCounts: {} as Record<string, number>
        };
      }
      acc[key].count += 1;
      acc[key].totalWeight += p.weight;
      const fName = p.fridgeId.toUpperCase();
      acc[key].fridgeCounts[fName] = (acc[key].fridgeCounts[fName] || 0) + 1;
      return acc;
    }, {} as Record<string, ExportRow>);

    return (Object.values(grouped) as ExportRow[]).sort((a, b) => a.variety.localeCompare(b.variety));
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
      setShowExportModal(false);
    }, 100);
  };

  const toggleFridgeToExport = (id: string) => {
    setFridgesToExport(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const exportData = generateExportData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CSS PRINT INLINE */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-stock-report, #printable-stock-report * {
            visibility: visible !important;
          }
          #printable-stock-report {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          @page { size: portrait; margin: 1cm; }
        }
      `}</style>

      {/* RENDER FOR PRINT */}
      <div id="printable-stock-report" className="hidden">
        <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Inventaire Stocks Frigos</h1>
            <p className="text-slate-500 font-bold mt-1 text-sm italic">Bayard Distribution - Rapport Logistique</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Généré le</p>
            <p className="text-sm font-black text-slate-900">{new Date().toLocaleString()}</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900 text-[9px] font-black uppercase text-slate-600">
              <th className="p-3 text-left">Variété</th>
              <th className="p-3 text-left">Calibre</th>
              <th className="p-3 text-left">N° Lot</th>
              <th className="p-3 text-left">Répartition Frigos</th>
              <th className="p-3 text-center">Total Palox</th>
              <th className="p-3 text-right">Poids Net (kg)</th>
              <th className="p-3 text-right">Tonnage (T)</th>
            </tr>
          </thead>
          <tbody>
            {exportData.map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: `${row.color}30` }} className="border-b border-slate-200">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: row.color }} />
                    <span className="font-black text-slate-900 uppercase text-xs">{row.variety}</span>
                  </div>
                </td>
                <td className="p-3 font-bold text-slate-700 text-xs">{row.calibre}</td>
                <td className="p-3 font-mono font-bold text-slate-600 text-[10px]">{row.lotId}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(row.fridgeCounts).sort().map(([fid, count]) => (
                      <div key={fid} className="flex items-center bg-slate-900 rounded px-1.5 py-0.5 shadow-sm">
                        <span className="text-[8px] font-black text-amber-500 mr-1.5">{fid}</span>
                        <span className="text-[9px] font-black text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center font-black text-slate-900 text-sm">{row.count}</td>
                <td className="p-3 text-right font-bold text-slate-700 text-xs">{row.totalWeight.toLocaleString()}</td>
                <td className="p-3 text-right font-black text-slate-900 text-sm">{(row.totalWeight / 1000).toFixed(2)} T</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 text-white font-black">
              <td colSpan={4} className="p-4 text-xs uppercase tracking-widest text-amber-500 text-right">Total Général</td>
              <td className="p-4 text-center text-lg">{exportData.reduce((acc, r) => acc + r.count, 0)}</td>
              <td colSpan={2} className="p-4 text-right text-lg">{(exportData.reduce((acc, r) => acc + r.totalWeight, 0) / 1000).toFixed(2)} T</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Stockage Frigos</h2>
          <p className="text-slate-500 font-medium italic">Planification 2D & Logistique Travées</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowTreatmentModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
          >
            <SprayCan size={18} /> Traitement Frigo
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <FileDown size={18} /> Export Inventaire
          </button>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-sm ${
              isEditMode ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-xl' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings2 size={18} /> {isEditMode ? "Valider Configuration" : "Configurer Couloirs"}
          </button>

          <button
            onClick={handleClearFridge}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <Eraser size={18} /> Vider Frigo
          </button>

          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            {fridges.map(f => (
              <button
                key={f.id}
                onClick={() => { setSelectedFridge(f); setSelectedSlot(null); }}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest ${
                  selectedFridge.id === f.id ? 'bg-white shadow-md text-slate-900 scale-105' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Modales */}
      <TreatmentModal
        isOpen={showTreatmentModal}
        onClose={() => setShowTreatmentModal(false)}
        onApply={handleApplyTreatment}
        fridgeName={selectedFridge.name}
        paloxCount={fridgePalox.length}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        fridges={fridges}
        selectedFridges={fridgesToExport}
        onToggleFridge={toggleFridgeToExport}
        onPrint={handlePrint}
      />

      {/* Main View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        <div className="lg:col-span-3 space-y-6">

          {/* Nouveau Widget de Statistiques Traitements (Tous frigos confondus) */}
          <TreatmentStats palox={palox} />

          <div className="bg-white p-8 rounded-[48px] shadow-2xl border border-slate-100 flex flex-col">
            <div className="flex flex-wrap items-center justify-between mb-8 gap-6 px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl text-sm font-black border border-blue-100 shadow-sm">
                  <Thermometer size={20} className="animate-pulse" />
                  {selectedFridge.currentTemp.toFixed(1)}°C
                </div>
                <div className="flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-[24px] text-sm font-black shadow-2xl ring-8 ring-slate-50">
                  <Boxes size={22} className="text-amber-500" />
                  {fridgePalox.length} / {realCapacity} PALOX
                </div>
              </div>
            </div>

            <FridgeMap
              selectedFridge={selectedFridge}
              fridgePalox={fridgePalox}
              varieties={varieties}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
              isEditMode={isEditMode}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-6 h-[800px]">
          {selectedSlot && !isEditMode ? (
            <PaloxDetail
              selectedSlot={selectedSlot}
              fridgePalox={fridgePalox}
              varieties={varieties}
              calibres={calibres}
              lots={lots}
              activeCampaign={activeCampaign}
              fridgeId={selectedFridge.id}
              maxHeight={selectedFridge.maxHeight}
              onClose={() => setSelectedSlot(null)}
              onDeletePalox={handleDeletePalox}
              onSaveStock={handleSaveStock}
            />
          ) : (
            <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
              <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] transform -rotate-6">
                <Layers size={48} className="text-slate-900" />
              </div>
              <div>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-6">Logistique Travées</h3>
                <p className="text-slate-400 text-base font-medium leading-relaxed">
                  Plan interactif haute définition. Chaque palox est désormais identifié par son numéro unique pour une traçabilité parfaite FIFO.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManager;
