import React from 'react';
import { INITIAL_ORDERS, INITIAL_MACHINES } from '../constants';
import { Play, Square, Pause, Settings, Info } from 'lucide-react';

const ProductionTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Suivi de Production</h2>
          <p className="text-gray-500">Ordres de fabrication et TRS en temps réel</p>
        </div>
        <button className="px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 shadow-md">
          Nouvel OF
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {INITIAL_ORDERS.map(order => {
            const machine = INITIAL_MACHINES.find(m => m.id === order.machineId);
            const progress = (order.producedQuantity / order.targetQuantity) * 100;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">{order.id}</span>
                        <h3 className="font-bold text-lg">{order.productName}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Machine: {machine?.name} | Variété: {order.variety}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'En cours' ? (
                        <>
                          <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><Pause size={20} /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Square size={20} /></button>
                        </>
                      ) : (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 font-bold">
                          <Play size={16} fill="white" /> Démarrer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progression</span>
                      <span>{order.producedQuantity} / {order.targetQuantity} kg ({progress.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
                  <div className="flex gap-6">
                    <div className="text-xs">
                      <span className="text-gray-400 block uppercase">Qualité</span>
                      <span className="font-bold text-green-600">99.2%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400 block uppercase">Performance</span>
                      <span className="font-bold text-amber-600">88.5%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400 block uppercase">Disponibilité</span>
                      <span className="font-bold text-blue-600">92.0%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block uppercase font-bold">TRS Estimé</span>
                    <span className="text-xl font-black text-slate-800">80.9%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Settings size={20} className="text-gray-400" /> État des Lignes
            </h3>
            <div className="space-y-4">
              {INITIAL_MACHINES.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${m.status === 'Operationnelle' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-medium text-sm">{m.name}</span>
                  </div>
                  <button className="text-gray-400 hover:text-amber-500 transition-colors">
                    <Info size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
            <h3 className="font-bold text-amber-500 mb-2">Smart Yield Insight</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Le rendement sur le lot <strong>LOT-2024001</strong> est de 92%. C'est 4% au dessus de la moyenne pour la variété Agata. Félicitez l'équipe de tri du poste A.
            </p>
            <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">
              VOIR LE RAPPORT COMPLET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionTracker;
