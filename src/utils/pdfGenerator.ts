import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SalesSession, AppProfile } from '../types';
import { formatCurrency, formatDateSpanish } from './formatters';
import { DIMAX_LOGO_BASE64 } from '../assets/logoBase64';

export const generateSessionPDF = (session: SalesSession, profile: AppProfile): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalCost = session.items.reduce((acc, item) => acc + item.totalCost, 0);
  const totalSale = session.items.reduce((acc, item) => acc + item.totalSale, 0);
  const totalCommission = session.items.reduce((acc, item) => acc + item.totalCommission, 0);
  const totalItemsCount = session.items.reduce((acc, item) => acc + item.quantity, 0);

  // Colors
  const darkBg: [number, number, number] = [15, 23, 42]; // slate-900
  const redPrimary: [number, number, number] = [220, 38, 38]; // red-600
  const goldAccent: [number, number, number] = [217, 119, 6]; // amber-600

  // 1. Top Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 48, 'F');

  // Gold & Red accent lines
  doc.setFillColor(...goldAccent);
  doc.rect(0, 48, 210, 2, 'F');
  doc.setFillColor(...redPrimary);
  doc.rect(0, 50, 210, 1.5, 'F');

  // Embed Official DIMAX Logo on white card
  try {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 7, 44, 34, 3, 3, 'F');
    doc.addImage(DIMAX_LOGO_BASE64, 'JPEG', 14, 9, 40, 30);
  } catch (e) {
    console.warn('Could not add image to PDF', e);
  }

  // Brand text on right of logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text(profile.companyName || 'VENTAS VIRTUAL DIMAX', 62, 19);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text('REPUESTOS PARA MOTOS • DESDE 2020', 62, 26);

  doc.setFontSize(8.5);
  doc.setTextColor(251, 191, 36); // amber-400
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE OFICIAL DE LIQUIDACIÓN DE COMISIONES', 62, 33);

  // Status Pill on top right
  const isPaid = session.status === 'liquidado';
  doc.setFillColor(isPaid ? 22 : 185, isPaid ? 101 : 28, isPaid ? 52 : 28);
  doc.roundedRect(150, 12, 48, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isPaid ? 'LIQUIDADO / PAGADO' : 'PENDIENTE DE PAGO', 174, 22, { align: 'center' });

  // 2. Metadata Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(12, 56, 186, 30, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.text('ASESOR COMERCIAL:', 18, 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...redPrimary);
  doc.text(profile.sellerName || 'Luis Angel Hernández', 62, 65);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('JORNADA / LOTE:', 18, 73);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(session.title, 62, 73);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('FECHA VENTAS:', 18, 81);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDateSpanish(session.date), 62, 81);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL ARTÍCULOS:', 130, 65);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalItemsCount} repuestos`, 168, 65);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('EMISIÓN REPORTE:', 130, 73);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleDateString('es-CO'), 168, 73);

  // 3. Table of Sold Products
  const tableData = session.items.map((item, index) => [
    index + 1,
    item.productName + (item.clientName ? `\n(Cliente: ${item.clientName})` : ''),
    item.quantity,
    formatCurrency(item.costPrice),
    formatCurrency(item.salePrice),
    formatCurrency(item.unitCommission),
    formatCurrency(item.totalCommission)
  ]);

  autoTable(doc, {
    startY: 92,
    head: [['#', 'Repuesto / Producto DIMAX', 'Cant.', 'Precio Almacén', 'Precio Venta', 'Comisión Unit.', 'Total Comisión']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [15, 23, 42],
      valign: 'middle'
    },
    headStyles: {
      fillColor: darkBg,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 64 },
      2: { halign: 'center', cellWidth: 14 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 24, fontStyle: 'bold', textColor: [30, 41, 59] },
      6: { halign: 'right', cellWidth: 24, fontStyle: 'bold', textColor: [185, 28, 28] }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Calculate table end Y
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 160;

  // 4. Financial Summary Cards
  const summaryBoxY = finalY;

  // Box Background
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(12, summaryBoxY, 186, 44, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(12, summaryBoxY, 186, 44, 3, 3, 'D');

  // Costo Almacén Total
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL A RENDIR AL ALMACÉN DIMAX:', 18, summaryBoxY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(totalCost), 115, summaryBoxY + 11);

  // Venta Cobrada al Cliente
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL VENTA COBRADA A CLIENTES:', 18, summaryBoxY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(totalSale), 115, summaryBoxY + 20);

  // Highlight Box for Total Commission
  doc.setFillColor(...redPrimary);
  doc.roundedRect(16, summaryBoxY + 26, 178, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('TOTAL COMISIÓN A PAGAR A LUIS ANGEL:', 22, summaryBoxY + 35);
  doc.setFontSize(13);
  doc.text(formatCurrency(totalCommission), 188, summaryBoxY + 35, { align: 'right' });

  // 5. Signature Section
  const signatureY = Math.min(summaryBoxY + 58, 250);

  // Asesor Signature line
  doc.setDrawColor(148, 163, 184);
  doc.line(24, signatureY, 88, signatureY);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(profile.sellerName || 'Luis Angel Hernández', 56, signatureY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Asesor Comercial Virtual', 56, signatureY + 9, { align: 'center' });

  // Jefe DIMAX Signature line
  doc.setDrawColor(148, 163, 184);
  doc.line(122, signatureY, 186, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(profile.bossName || 'Administración / Jefe DIMAX', 154, signatureY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Revisado y Aprobado para Pago', 154, signatureY + 9, { align: 'center' });

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `VENTAS VIRTUAL DIMAX • Generado automáticamente el ${new Date().toLocaleString('es-CO')} • Documento oficial de liquidación`,
    105,
    288,
    { align: 'center' }
  );

  // Save the PDF
  const sanitizedTitle = session.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`DIMAX_Liquidacion_${sanitizedTitle}.pdf`);
};
