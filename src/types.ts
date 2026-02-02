export enum Role {
  DIRECTION = 'Direction',
  MAINTENANCE = 'Maintenance',
  PRODUCTION = 'Production',
  QUALITE = 'Qualité',
  LOGISTIQUE = 'Logistique',
  DEVELOPPEUR = 'DÉVELOPPEUR'
}

export enum PaloxStatus {
  DISPONIBLE = 'Disponible',
  RESERVE = 'Réservé',
  EN_COURS = 'En cours',
  BLOQUE = 'Bloqué',
  DETRUIT = 'Détruit'
}

export interface Entity {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string; // Siège social ou adresse par défaut
  billingAddress?: string; // Adresse de facturation spécifique
  deliveryAddress?: string; // Adresse de livraison spécifique
  category: 'Fournisseur' | 'Client' | 'Transporteur';
  defaultCarrierId?: string;
  siret?: string;
  tvaIntra?: string;
}

export interface Product {
  id: string;
  code: string; // Nouveau champ Code Produit (Max 15 chars)
  name: string;
  varietyId: string;
  defaultCalibre: string;
  defaultPackagingId: string;
  basePrice: number;
}

export interface Variety {
  id: string;
  name: string;
  color?: string;
}

export interface Calibre {
  id: string;
  name: string;
}

export interface Lot {
  id: string;
  campaignId: string;
  supplierId: string;
  department: string;
  varietyId: string;
  plotNumber: string;
  varietyName: string;
  plotName: string;
  surface?: number; // Surface en Hectares
  isIrrigated?: boolean; // Statut irrigation
  dateCreated: string;
}

export interface LabelCounter {
  lotId: string;
  calibre: string;
  lastIndex: number; // Le dernier numéro imprimé (ex: 25)
}

export interface PackagingType {
  id: string;
  name: string;
  hasTrays: boolean;
}

export interface Order {
  id: string;
  campaignId: string;
  clientId: string;
  carrierId: string;
  date: string;
  docType: 'BC' | 'BL' | 'TRAVAUX'; // Ajout de TRAVAUX
  status: 'Draft' | 'Validated' | 'Shipped' | 'Delivered' | 'Returned' | 'Invoiced';
  clientRef?: string; // Référence Client
  items: Array<{
    productId: string;
    productName: string;
    packagingId: string;
    lotNumber: string;
    calibre: string;
    nbPallets: number;
    nbTrays?: number;
    nbColis: number;
    qtyPerColis: number;
    unitWeight: number;
    totalWeight: number;
    price: number;
  }>;
  deliveryDays: string[];
  isSample: boolean;
  observations?: string;
  total: number;
}

// Extension pour les modèles
export interface OrderTemplate extends Order {
  templateName: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalHT: number;
}

export interface Invoice {
  id: string;
  campaignId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientId: string;
  orderIds: string[];
  items: InvoiceItem[];
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  status: 'Brouillon' | 'Validée' | 'Payée' | 'Annulée';
  paymentMethod?: 'Virement' | 'Chèque' | 'LCR';
}

export interface Tariff {
  id: string;
  entityId: string;
  productName: string;
  pricePerTon: number;
  validFrom: string;
  validTo: string;
}

export interface Reception {
  id: string;
  campaignId: string;
  supplierId: string;
  variety: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  lotNumber: string;
  date: string;
  // NOUVEAUX CHAMPS
  calibre?: string;
  packagingMode?: 'Vrac' | 'Palox';
  paloxCount?: number;

  analysisResults?: {
    defects: number;
    sugarLevel: number;
    specificGravity: number;
  };
}

export interface AgendaEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'Production' | 'Maintenance' | 'Livraison' | 'Réunion';
  userId: string;
}

// Interface pour l'historique des traitements
export interface TreatmentRecord {
  date: string;
  product: 'Dormir' | 'Menthe' | 'Autre';
  dosage: number; // ml/tonne
  fridgeName: string; // Nom du frigo au moment du traitement
}

export interface Palox {
  id: string;
  campaignId: string;
  variety: string;
  calibre: string;
  weight: number;
  lotId: string;
  labelIndex: number;
  fridgeId: string;
  row: number;
  col: number;
  stackLevel: number;
  status: PaloxStatus;
  entryDate: string;
  treatmentDate?: string; // Dernier traitement (pour compatibilité)
  treatmentType?: string; // Dernier traitement (pour compatibilité)
  treatmentHistory?: TreatmentRecord[]; // Historique complet
}

export interface WashingRecord {
  id: string;
  paloxId: string;
  lotId: string;
  variety: string;
  calibre: string;
  labelIndex: number;
  washerName: 'Laveuse 1' | 'Laveuse 2';
  timestamp: string;
  campaignId: string;
}

// NOUVELLE INTERFACE POUR LES ANOMALIES
export interface ScanInconsistency {
  id: string;
  campaignId: string;
  timestamp: string;
  type: 'LAVAGE_DUPLICATE' | 'ETIQUETTE_REPRINT' | 'STOCK_INCOHERENCE'; // Typage
  paloxLabelIndex: number; // Ou range start pour reprint
  paloxLabelEndIndex?: number; // Pour reprint
  lotId: string;
  variety: string;
  scannedAt: string;
  originalWashingDate?: string;
  originalWasherName?: string; // NOUVEAU : Nom de la laveuse d'origine
  conflictRange?: string; // NOUVEAU : Plage d'étiquettes existantes
  actionTaken: 'Annulé' | 'Réintégré Stock' | 'Relavé' | 'Réimpression Forcée';
  details?: string;
  user?: string;
}

export interface Fridge {
  id: string;
  name: string;
  maxRows: number;
  maxCols: number;
  maxHeight: number;
  currentTemp: number;
  aisles?: string[];
}

export interface Machine {
  id: string;
  name: string;
  status: 'Operationnelle' | 'En Panne' | 'Maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
  criticite: 'Haute' | 'Moyenne' | 'Basse';
  image?: string;
  technicalSpecs?: string;
}

export interface MaintenanceTask {
  id: string;
  machineId: string;
  title: string;
  description: string;
  type: 'Preventive' | 'Curative';
  status: 'Planifie' | 'En cours' | 'Termine';
  priority: 'Critique' | 'Normale' | 'Faible';
  dueDate: string;
  completedDate?: string;
  technician?: string;
}

export interface SparePart {
  id: string;
  name: string;
  reference: string;
  stock: number;
  minThreshold: number;
  location: string;
  unit: string;
  machineIds: string[];
}

export interface QualityAnalysis {
  id: string;
  campaignId: string;
  lotId: string;
  date: string;
  technician: string;
  sugarLevel: number;
  dryMatter: number;
  defects: {
    scab: number;
    bruising: number;
    green: number;
    rot: number;
  };
  sampleWeight: number;
  status: 'Conforme' | 'A surveiller' | 'Non Conforme';
  observations?: string;
}

export interface SamplePoint {
  scheduledDate: string;
  completedDate?: string;
  rating: 'Excellent' | 'Bon' | 'Moyen' | 'Médiocre' | 'Critique' | 'N/A';
  observations: string;
  hasGermination: boolean;
}

export interface SampleItem {
  id: string;
  campaignId: string;
  lotId: string;
  clientId?: string;
  clientName?: string;
  varietyName: string;
  packagingName: string;
  creationDate: string;
  j0: SamplePoint;
  j7: SamplePoint;
  j14: SamplePoint;
  status: 'En cours' | 'Archivé';
}

export interface ProductionOrder {
  id: string;
  campaignId: string;
  productName: string;
  targetQuantity: number;
  producedQuantity: number;
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Suspendu';
  machineId: string;
  startDate: string;
  variety: string;
}

export interface PackagingMaterial {
  id: string;
  name: string;
  type: 'Sac' | 'Carton' | 'Film' | 'Palette';
  currentStock: number;
  minThreshold: number;
  unit: string;
}
