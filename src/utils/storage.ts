import type { SalesSession, AppProfile, FrequentProduct } from '../types';
import { getTodayDateString, getDefaultSessionTitle } from './formatters';

const STORAGE_KEYS = {
  SESSIONS: 'dimax_sales_sessions_v1',
  PROFILE: 'dimax_seller_profile_v1',
  FREQUENT_PRODUCTS: 'dimax_frequent_products_v1'
};

export const INITIAL_FREQUENT_PRODUCTS: FrequentProduct[] = [
  { id: 'fp-1', name: 'Kit Arrastre Pulsar NS 200 Racing', category: 'Transmisión', defaultCostPrice: 75000, defaultSalePrice: 98000 },
  { id: 'fp-2', name: 'Cilindro Completo Boxer CT100', category: 'Motor', defaultCostPrice: 110000, defaultSalePrice: 145000 },
  { id: 'fp-3', name: 'Pastillas Freno Delanteras Cerámica', category: 'Frenos', defaultCostPrice: 15000, defaultSalePrice: 24000 },
  { id: 'fp-4', name: 'Bandas Freno Traseras Original', category: 'Frenos', defaultCostPrice: 16000, defaultSalePrice: 26000 },
  { id: 'fp-5', name: 'Batería Gel 12V 7Ah Libre Mantenimiento', category: 'Eléctrico', defaultCostPrice: 65000, defaultSalePrice: 88000 },
  { id: 'fp-6', name: 'Aceite 4T 20W50 Semisintético 1L', category: 'Lubricantes', defaultCostPrice: 24000, defaultSalePrice: 34000 },
  { id: 'fp-7', name: 'Cadena Reforzada 428H-132L Dorada', category: 'Transmisión', defaultCostPrice: 32000, defaultSalePrice: 48000 },
  { id: 'fp-8', name: 'Bujía NGK Resistencia Iridium', category: 'Eléctrico', defaultCostPrice: 18000, defaultSalePrice: 28000 },
  { id: 'fp-9', name: 'Carburador Completo NKD 125', category: 'Combustible', defaultCostPrice: 78000, defaultSalePrice: 110000 },
  { id: 'fp-10', name: 'Llanta Sellomatic 90/90-17 Delantera', category: 'Llantas', defaultCostPrice: 95000, defaultSalePrice: 128000 },
  { id: 'fp-11', name: 'Discos de Embrague Clutch Juego x5', category: 'Motor', defaultCostPrice: 30000, defaultSalePrice: 45000 },
  { id: 'fp-12', name: 'Guaya Clutch Reforzada', category: 'Guayas', defaultCostPrice: 8000, defaultSalePrice: 16000 }
];

export const INITIAL_PROFILE: AppProfile = {
  sellerName: 'Luis Angel Hernández',
  companyName: 'VENTAS VIRTUAL DIMAX',
  bossName: 'Jefe DIMAX',
  bossPhone: '',
  currencySymbol: 'COP',
  frequentProducts: INITIAL_FREQUENT_PRODUCTS
};

const getInitialSessions = (): SalesSession[] => {
  const today = getTodayDateString();
  return [
    {
      id: 'session-demo-1',
      title: getDefaultSessionTitle(today),
      date: today,
      status: 'pendiente',
      notes: 'Ventas virtuales realizadas por WhatsApp y Marketplace',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          productName: 'Kit Arrastre Pulsar NS 200 Racing',
          quantity: 1,
          costPrice: 75000,
          salePrice: 98000,
          unitCommission: 23000,
          totalCommission: 23000,
          totalCost: 75000,
          totalSale: 98000,
          clientName: 'Andrés Gómez (Rionegro)',
          notes: 'Envío intermunicipal',
          paymentStatus: 'pagado',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'item-2',
          productName: 'Pastillas Freno Delanteras Cerámica',
          quantity: 2,
          costPrice: 15000,
          salePrice: 24000,
          unitCommission: 9000,
          totalCommission: 18000,
          totalCost: 30000,
          totalSale: 48000,
          clientName: 'Taller MotoExpress',
          notes: '2 juegos para Apache',
          paymentStatus: 'pagado',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'item-3',
          productName: 'Batería Gel 12V 7Ah',
          quantity: 1,
          costPrice: 65000,
          salePrice: 88000,
          unitCommission: 23000,
          totalCommission: 23000,
          totalCost: 65000,
          totalSale: 88000,
          clientName: 'Felipe Mendoza',
          notes: 'Garantía 6 meses activada',
          paymentStatus: 'contraentrega',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ]
    }
  ];
};

export const loadSessionsFromStorage = (): SalesSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const initial = getInitialSessions();
      saveSessionsToStorage(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading sessions from storage', e);
    return getInitialSessions();
  }
};

export const saveSessionsToStorage = (sessions: SalesSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to storage', e);
  }
};

export const loadProfileFromStorage = (): AppProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveProfileToStorage(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROFILE,
      ...parsed,
      sellerName: parsed.sellerName || 'Luis Angel Hernández',
      companyName: parsed.companyName || 'VENTAS VIRTUAL DIMAX'
    };
  } catch (e) {
    console.error('Error loading profile from storage', e);
    return INITIAL_PROFILE;
  }
};

export const saveProfileToStorage = (profile: AppProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to storage', e);
  }
};
