
export type ProductionLine = 
  | 'MTL-01' | 'MTL-02' | 'MTL-03' | 'MTL-04'
  | 'MCO-01' | 'MCO-02' | 'MCO-03' | 'MCO-04'
  | 'MVIR-01' | 'MTP-01';

export interface ProductionPlan {
  id: string;
  customer: string;
  productType: string;
  city: string;
  orderReceiptDate: string; // ISO string
  negotiatedDeadlineDays: number;
  expectedDeliveryDate: string; // Calculated
  manufacturingTimeDays: number;
  productionLine: ProductionLine;
  productionEntryDeadline: string; // Calculated
  daysUntilProduction: number; // Calculated
  completionForecast: string; // Calculated
  createdAt: string; // ISO string
}

export interface FilterOptions {
  date?: string;
  customer?: string;
  productionLine?: string;
}
