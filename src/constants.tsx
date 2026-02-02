import {
  Palox, Fridge, Machine, ProductionOrder,
  PackagingMaterial, Entity, Reception, Order, AgendaEvent, Tariff, PackagingType, Variety, Calibre
} from './types';

export const INITIAL_PACKAGING_TYPES: PackagingType[] = [
  { id: 'PT1', name: 'Filet 2.5kg sur Palette Europe', hasTrays: false },
  { id: 'PT2', name: 'Girsac 1.5kg sur Palette Europe', hasTrays: false },
  { id: 'PT3', name: 'Vrac Palox (1200kg)', hasTrays: false },
  { id: 'PT4', name: 'Sac 10kg sur Palette', hasTrays: false },
  { id: 'PT5', name: 'Plateaux 5kg (Grenailles)', hasTrays: true },
];

const DEFAULT_COLORS = [
  "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899",
  "#06b6d4", "#f97316", "#84cc16", "#14b8a6", "#6366f1", "#d946ef"
];

export const INITIAL_VARIETIES: Variety[] = [
  "Agria", "Amandine", "Artemis", "Aztec Gold", "Babylon", "Blue Belle", "Bonnata KWS",
  "Bricata KWS", "Camelia", "Celtiane", "Cherie", "Cheyenne", "Corne de Gate",
  "Gourmandine", "Institut de Beauvais", "Juliette", "Laurette", "Lily Rose",
  "Miss Blush", "Petillante", "Prunelle", "Ratte", "Roseval", "Tendresse",
  "Valery", "Vitelotte", "Allians"
].map((v, i) => ({
  id: (i + 1).toString().padStart(2, '0'),
  name: v.toUpperCase(),
  color: DEFAULT_COLORS[i % DEFAULT_COLORS.length]
}));

export const INITIAL_CALIBRES: Calibre[] = [
  "20/110 g", "20/50 g Grenailles", "20/55", "20/80 g", "30/120 g", "35/55", "38/42",
  "40- Grenailles", "40/50", "40/60", "40/70", "50/75", "55+", "60+", "60/75", "75+",
  "Grenailles 28/40", "Hotelières 30/80 g", "Mitrailles 20/30 mm"
].map((c, i) => ({ id: `C${i+1}`, name: c }));

export const INITIAL_INDUSTRIAL_CALIBRES: Calibre[] = [
  "-28", "-35", "-38", "-40", "-42", "-50", "-55", "-60", "-65", "-75",
  "35+", "38+", "40+", "42+", "50+", "55+", "60+", "65+", "75+",
  "35/38", "35/40", "35/42", "35/50", "35/55", "38/40", "38/42", "38/50", "38/55", "40/50", "40/55",
  "50/55", "50/60", "50/75", "55/75", "75+"
].map((c, i) => ({ id: `IC${i+1}`, name: c }));

export const INITIAL_ENTITIES: Entity[] = [
  {
    id: 'TRA-01',
    name: 'LOGISTIQUE INTERNE',
    category: 'Transporteur',
    email: 'logistique@bayard.fr',
    phone: '03.22.xx.xx.xx',
    address: 'Laucourt'
  },
  {
    id: 'TRA-02',
    name: 'TRANSPORTS CHABOT',
    category: 'Transporteur',
    email: 'contact@chabot.fr',
    phone: '03.23.xx.xx.xx',
    address: 'Amiens'
  }
];

export const INITIAL_TARIFFS: Tariff[] = [];
export const INITIAL_RECEPTIONS: Reception[] = [];
export const INITIAL_SALES: Order[] = [];
export const INITIAL_AGENDA: AgendaEvent[] = [];

export const INITIAL_FRIDGES: Fridge[] = [
  { id: 'F3', name: 'Frigo 3', maxRows: 14, maxCols: 12, maxHeight: 6, currentTemp: 0.5, aisles: [] },
  { id: 'F4', name: 'Frigo 4', maxRows: 14, maxCols: 12, maxHeight: 6, currentTemp: 0.8, aisles: [] },
  { id: 'F5', name: 'Frigo 5', maxRows: 23, maxCols: 11, maxHeight: 6, currentTemp: 0.4, aisles: [] },
  { id: 'F6', name: 'Frigo 6', maxRows: 23, maxCols: 11, maxHeight: 6, currentTemp: 0.6, aisles: [] },
];

export const INITIAL_PALOX: Palox[] = [];

export const INITIAL_MACHINES: Machine[] = [
  { id: 'M1', name: 'Laveuse-Polisseuse', status: 'Operationnelle', lastMaintenance: '-', nextMaintenance: '-', criticite: 'Haute' },
  { id: 'M2', name: 'Calibreuse Optique', status: 'Operationnelle', lastMaintenance: '-', nextMaintenance: '-', criticite: 'Haute' },
  { id: 'M3', name: 'Ensacheuse', status: 'Operationnelle', lastMaintenance: '-', nextMaintenance: '-', criticite: 'Moyenne' },
];

export const INITIAL_ORDERS: ProductionOrder[] = [];
export const INITIAL_PACKAGING: PackagingMaterial[] = [];
