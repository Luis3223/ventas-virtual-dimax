export interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  costPrice: number; // Precio que lo da el almacén DIMAX
  salePrice: number; // Precio en cuánto lo vendió Luis Angel
  unitCommission: number; // salePrice - costPrice
  totalCommission: number; // (salePrice - costPrice) * quantity
  totalCost: number; // costPrice * quantity (Total a entregar al almacén)
  totalSale: number; // salePrice * quantity (Total cobrado al cliente)
  clientName?: string; // Nombre del cliente o destino (opcional)
  notes?: string; // Nota adicional o factura
  paymentStatus?: 'pagado' | 'contraentrega' | 'pendiente';
  createdAt: string;
}

export interface SalesSession {
  id: string;
  title: string; // Ej: "Ventas Martes", "Ventas Miércoles", "Corte 18 Nov"
  date: string; // YYYY-MM-DD
  status: 'pendiente' | 'liquidado'; // Pendiente de pago vs Pagado por el jefe
  items: SaleItem[];
  notes?: string;
  liquidatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FrequentProduct {
  id: string;
  name: string;
  category: string;
  defaultCostPrice: number;
  defaultSalePrice: number;
}

export interface AppProfile {
  sellerName: string; // "Luis Angel Hernández"
  companyName: string; // "VENTAS VIRTUAL DIMAX"
  bossName: string;
  bossPhone: string;
  currencySymbol: string;
  frequentProducts: FrequentProduct[];
}

