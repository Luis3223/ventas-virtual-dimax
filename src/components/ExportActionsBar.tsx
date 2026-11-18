import React, { useState } from 'react';
import type { SalesSession, AppProfile } from '../types';
import { generateSessionPDF } from '../utils/pdfGenerator';
import { sendSessionToWhatsApp, buildWhatsAppMessage } from '../utils/whatsappGenerator';
import { exportSessionToCSV } from '../utils/csvGenerator';
import {
  FileDown,
  MessageCircle,
  Copy,
  FileSpreadsheet,
  Printer,
  Check,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportActionsBarProps {
  session: SalesSession;
  profile: AppProfile;
}

export const ExportActionsBar: React.FC<ExportActionsBarProps> = ({ session, profile }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const hasItems = session.items.length > 0;

  const handleDownloadPDF = () => {
    if (!hasItems) {
      alert('Registra al menos un producto vendido para generar el reporte en PDF.');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      generateSessionPDF(session, profile);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
      alert('Hubo un error al generar el PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!hasItems) {
      alert('Registra al menos un producto vendido para enviar el reporte a tu jefe por WhatsApp.');
      return;
    }
    sendSessionToWhatsApp(session, profile);
  };

  const handleCopySummary = async () => {
    if (!hasItems) return;
    const text = buildWhatsAppMessage(session, profile);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('No se pudo copiar al portapapeles. Copia manualmente el texto.');
    }
  };

  const handleExportCSV = () => {
    if (!hasItems) {
      alert('No hay ventas registradas para exportar.');
      return;
    }
    exportSessionToCSV(session, profile);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-red-500" />
              Reportes y Envío a mi Jefe ({profile.bossName || 'Almacén DIMAX'})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Descarga el reporte oficial de comisiones o envíaselo directamente por WhatsApp para que te pague.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* 1. PDF Download (Primary) */}
          <button
            onClick={handleDownloadPDF}
            disabled={!hasItems || isGeneratingPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/50 transition active:scale-95"
            title="Descargar reporte formal en PDF"
          >
            <FileDown className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
          </button>

          {/* 2. WhatsApp (Direct to Boss) */}
          <button
            onClick={handleSendWhatsApp}
            disabled={!hasItems}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95"
            title="Enviar liquidación formateada directamente a WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>

          {/* 3. Copy Summary */}
          <button
            onClick={handleCopySummary}
            disabled={!hasItems}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white transition border border-slate-700"
            title="Copiar texto resumen al portapapeles"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* 4. Excel / CSV */}
          <button
            onClick={handleExportCSV}
            disabled={!hasItems}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white transition border border-slate-700"
            title="Exportar a Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          {/* 5. Print */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 hidden sm:block"
            title="Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copied && (
        <div className="mt-3 p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          ¡Resumen copiado con éxito! Ya puedes pegarlo en el chat de tu jefe.
        </div>
      )}
    </div>
  );
};
