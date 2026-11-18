import type { SalesSession, AppProfile } from '../types';

export const exportSessionToCSV = (session: SalesSession, profile: AppProfile): void => {
  const headers = [
    'Numero',
    'Jornada',
    'Fecha',
    'Vendedor',
    'Repuesto_Producto',
    'Cliente',
    'Cantidad',
    'Precio_Almacen_Unitario',
    'Precio_Venta_Unitario',
    'Comision_Unitaria',
    'Total_Costo_Almacen',
    'Total_Venta',
    'Total_Comision_Ganada',
    'Estado_Pago',
    'Notas'
  ];

  const rows = session.items.map((item, idx) => [
    idx + 1,
    `"${session.title.replace(/"/g, '""')}"`,
    session.date,
    `"${profile.sellerName.replace(/"/g, '""')}"`,
    `"${item.productName.replace(/"/g, '""')}"`,
    `"${(item.clientName || '').replace(/"/g, '""')}"`,
    item.quantity,
    item.costPrice,
    item.salePrice,
    item.unitCommission,
    item.totalCost,
    item.totalSale,
    item.totalCommission,
    `"${item.paymentStatus || 'pagado'}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  // CSV content with UTF-8 BOM so Excel opens it with accents correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedTitle = session.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `DIMAX_Ventas_${sanitizedTitle}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
