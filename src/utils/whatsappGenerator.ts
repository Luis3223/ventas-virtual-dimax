import type { SalesSession, AppProfile } from '../types';
import { formatCurrency, formatDateSpanish } from './formatters';

export const buildWhatsAppMessage = (session: SalesSession, profile: AppProfile): string => {
  const totalCost = session.items.reduce((acc, item) => acc + item.totalCost, 0);
  const totalSale = session.items.reduce((acc, item) => acc + item.totalSale, 0);
  const totalCommission = session.items.reduce((acc, item) => acc + item.totalCommission, 0);
  const totalCount = session.items.reduce((acc, item) => acc + item.quantity, 0);

  let msg = `🏍️ *${profile.companyName || 'VENTAS VIRTUAL DIMAX'}*\n`;
  msg += `📋 *REPORTE DE VENTAS Y COMISIONES*\n`;
  msg += `─────────────────────────\n`;
  msg += `👤 *Asesor Comercial:* ${profile.sellerName || 'Luis Angel Hernández'}\n`;
  msg += `📅 *Jornada:* ${session.title}\n`;
  msg += `🗓️ *Fecha:* ${formatDateSpanish(session.date)}\n`;
  msg += `📌 *Estado:* ${session.status === 'liquidado' ? '✅ Liquidado / Pagado' : '⏳ Pendiente de Liquidación'}\n`;
  msg += `─────────────────────────\n`;
  msg += `📦 *DETALLE DE REPUESTOS VENDIDOS (${totalCount}):*\n\n`;

  session.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.productName}* (x${item.quantity})\n`;
    if (item.clientName) {
      msg += `   👤 Cliente: ${item.clientName}\n`;
    }
    msg += `   • Almacén: ${formatCurrency(item.costPrice)} c/u\n`;
    msg += `   • Venta: ${formatCurrency(item.salePrice)} c/u\n`;
    msg += `   • 💰 Comisión: *${formatCurrency(item.totalCommission)}*`;
    if (item.quantity > 1) {
      msg += ` (${formatCurrency(item.unitCommission)} c/u)`;
    }
    msg += `\n\n`;
  });

  msg += `─────────────────────────\n`;
  msg += `📊 *RESUMEN DE LIQUIDACIÓN:*\n`;
  msg += `🏢 Total a rendir al Almacén DIMAX: *${formatCurrency(totalCost)}*\n`;
  msg += `💵 Total Venta a clientes: *${formatCurrency(totalSale)}*\n`;
  msg += `─────────────────────────\n`;
  msg += `⭐ *TOTAL COMISIONES A PAGAR A LUIS ANGEL:* \n👉 *${formatCurrency(totalCommission)}*\n`;
  msg += `─────────────────────────\n`;
  msg += `_Generado desde la App Ventas Virtual DIMAX_ 📱`;

  return msg;
};

export const sendSessionToWhatsApp = (session: SalesSession, profile: AppProfile): void => {
  const message = buildWhatsAppMessage(session, profile);
  const encodedText = encodeURIComponent(message);
  
  let cleanPhone = profile.bossPhone ? profile.bossPhone.replace(/[^0-9]/g, '') : '';
  
  let url = '';
  if (cleanPhone) {
    // Add Colombia country code 57 if 10 digits starting with 3
    if (cleanPhone.length === 10 && cleanPhone.startsWith('3')) {
      cleanPhone = '57' + cleanPhone;
    }
    url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  } else {
    url = `https://api.whatsapp.com/send?text=${encodedText}`;
  }

  window.open(url, '_blank');
};
