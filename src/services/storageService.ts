import {
  Entity, Tariff, Reception, Order, AgendaEvent,
  Palox, Fridge, Machine, ProductionOrder, PackagingMaterial, PackagingType, Lot, Variety, Calibre,
  MaintenanceTask, SparePart, QualityAnalysis, SampleItem, Invoice, WashingRecord, Product, OrderTemplate, ScanInconsistency, LabelCounter
} from '../types';
import * as InitialData from '../constants';

const DB_KEY = 'SPUDFLOW_DB_V2'; // Version upgradée pour les changements structurels

export interface SpudFlowDB {
  entities: Entity[];
  products: Product[];
  lots: Lot[];
  labelCounters: LabelCounter[]; // NOUVEAU
  packagingTypes: PackagingType[];
  varieties: Variety[];
  calibres: Calibre[];
  industrialCalibres: Calibre[];
  tariffs: Tariff[];
  receptions: Reception[];
  sales: Order[];
  orderTemplates: OrderTemplate[];
  invoices: Invoice[];
  agenda: AgendaEvent[];
  fridges: Fridge[];
  palox: Palox[];
  washingHistory: WashingRecord[];
  inconsistencies: ScanInconsistency[];
  machines: Machine[];
  maintenanceTasks: MaintenanceTask[];
  spareParts: SparePart[];
  qualityAnalyses: QualityAnalysis[];
  sampleLibrary: SampleItem[];
  productionOrders: ProductionOrder[];
  packaging: PackagingMaterial[];
  lastBackup: string | null;
}

const migrateToCampaign = (list: any[], campaignId: string) => {
  return list.map(item => ({
    ...item,
    campaignId: item.campaignId || campaignId
  }));
};

export const initializeDB = (): SpudFlowDB => {
  const saved = localStorage.getItem(DB_KEY);
  const targetCampaign = "2025-2026";

  if (saved) {
    const parsed: SpudFlowDB = JSON.parse(saved);
    // Migration simple si le champ code est manquant dans les produits existants
    if (parsed.products) {
        parsed.products = parsed.products.map(p => ({
            ...p,
            code: p.code || `P-${p.id.split('-')[1] || Date.now()}`
        }));
    } else {
        parsed.products = [];
    }
    // Init templates if missing
    if (!parsed.orderTemplates) parsed.orderTemplates = [];
    // Init inconsistencies if missing
    if (!parsed.inconsistencies) parsed.inconsistencies = [];
    // Init labelCounters if missing
    if (!parsed.labelCounters) parsed.labelCounters = [];

    return parsed;
  }

  const initialDB: SpudFlowDB = {
    entities: InitialData.INITIAL_ENTITIES,
    products: [
      { id: 'P01', code: 'PDT-LAV-4060', name: 'Pomme de terre Lavée', varietyId: '01', defaultCalibre: '40/60', defaultPackagingId: 'PT1', basePrice: 0.85 },
      { id: 'P02', code: 'GREN-PREM', name: 'Grenailles Premium', varietyId: '02', defaultCalibre: '20/35', defaultPackagingId: 'PT5', basePrice: 1.20 }
    ],
    lots: [],
    labelCounters: [], // INIT
    packagingTypes: InitialData.INITIAL_PACKAGING_TYPES,
    varieties: InitialData.INITIAL_VARIETIES,
    calibres: InitialData.INITIAL_CALIBRES,
    industrialCalibres: InitialData.INITIAL_INDUSTRIAL_CALIBRES,
    tariffs: InitialData.INITIAL_TARIFFS,
    receptions: InitialData.INITIAL_RECEPTIONS,
    sales: [],
    orderTemplates: [],
    invoices: [],
    agenda: InitialData.INITIAL_AGENDA,
    fridges: InitialData.INITIAL_FRIDGES,
    palox: InitialData.INITIAL_PALOX,
    washingHistory: [],
    inconsistencies: [],
    machines: InitialData.INITIAL_MACHINES,
    maintenanceTasks: [],
    spareParts: [],
    qualityAnalyses: [],
    sampleLibrary: [],
    productionOrders: InitialData.INITIAL_ORDERS,
    packaging: InitialData.INITIAL_PACKAGING,
    lastBackup: null
  };

  saveToDB(initialDB);
  return initialDB;
};

export const saveToDB = (db: SpudFlowDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const createBackup = (db: SpudFlowDB) => {
  const timestamp = new Date().toISOString();
  const dbWithBackupDate = { ...db, lastBackup: timestamp };
  saveToDB(dbWithBackupDate);

  const data = JSON.stringify(dbWithBackupDate, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tubersys-backup-${timestamp.split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const restoreFromBackup = (file: File): Promise<SpudFlowDB> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const db: SpudFlowDB = JSON.parse(e.target?.result as string);
        saveToDB(db);
        resolve(db);
      } catch (err) {
        reject(new Error('Format de fichier de sauvegarde invalide.'));
      }
    };
    reader.onerror = () => reject(new Error('Échec de la lecture du fichier de sauvegarde.'));
    reader.readAsText(file);
  });
};
