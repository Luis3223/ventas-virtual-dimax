import React, { useState, useEffect } from 'react';
import type { SaleItem, FrequentProduct } from '../types';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';
import {
  X,
  Package,
  DollarSign,
  User,
  Plus,
  Minus,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SaleItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<SaleItem, 'id' | 'createdAt' | 'unitCommission' | 'totalCommission' | 'totalCost' | 'totalSale'> & { id?: string }) => void;
  initialItem?: SaleItem | null;
  frequentProducts: FrequentProduct[];
}

export const SaleItemModal: React.FC<SaleItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  frequentProducts
}) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [costPriceStr, setCostPriceStr] = useState('');
  const [salePriceStr, setSalePriceStr] = useState('');
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pagado' | 'contraentrega' | 'pendiente'>('pagado');

  useEffect(() => {
    if (initialItem) {
      setProductName(initialItem.productName);
      setQuantity(initialItem.quantity);
      setCostPriceStr(initialItem.costPrice ? initialItem.costPrice.toString() : '');
      setSalePriceStr(initialItem.salePrice ? initialItem.salePrice.toString() : '');
      setClientName(initialItem.clientName || '');
      setNotes(initialItem.notes || '');
      setPaymentStatus(initialItem.paymentStatus || 'pagado');
    } else {
      setProductName('');
      setQuantity(1);
      setCostPriceStr('');
      setSalePriceStr('');
      setClientName('');
      setNotes('');
      setPaymentStatus('pagado');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const costPrice = parseCurrencyInput(costPriceStr);
  const salePrice = parseCurrencyInput(salePriceStr);
  const unitCommission = salePrice - costPrice;
  const totalCommission = unitCommission * quantity;
  const totalCost = costPrice * quantity;
  const totalSale = salePrice * quantity;

  const handleSelectFrequent = (fp: FrequentProduct) => {
    setProductName(fp.name);
    setCostPriceStr(fp.defaultCostPrice.toString());
    setSalePriceStr(fp.defaultSalePrice.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || quantity <= 0) return;

    onSave({
      id: initialItem?.id,
      productName: productName.trim(),
      quantity,
      costPrice,
      salePrice,
      clientName: clientName.trim() || undefined,
      notes: notes.trim() || undefined,
      paymentStatus
    });

    if (!initialItem && totalCommission > 0) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {initialItem ? 'Editar Registro de Venta' : 'Registrar Venta de Repuesto'}
              </h3>
              <p className="text-xs text-slate-400">
                Almacén DIMAX • Vendedor: Luis Angel Hernández
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        {!initialItem && frequentProducts.length > 0 && (
          <div className="mb-4">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Sugerencias Rápidas de Repuestos:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {frequentProducts.slice(0, 6).map((fp) => (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => handleSelectFrequent(fp)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  {fp.name.split(' ')[0]} {fp.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del Producto */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nombre del Repuesto / Producto *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: Kit de arrastre Pulsar NS 200, Cilindro Boxer..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold text-sm"
            />
          </div>

          {/* Cantidad Stepper */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Cantidad Vendida
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-transparent font-black text-white text-base focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {quantity === 1 ? '1 unidad' : `${quantity} unidades`}
              </span>
            </div>
          </div>

          {/* Precios (Almacén vs Venta) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Precio Almacén */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Precio Almacén DIMAX *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  $
                </span>
                <input
                  type="text"
                  required
                  value={costPriceStr ? formatCurrency(costPrice).replace('$', '').trim() : ''}
                  onChange={(e) => setCostPriceStr(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <span className="block text-[10px] text-slate-500 mt-1">
                Costo base que pide el almacén
              </span>
            </div>

            {/* Precio Venta */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Precio de Venta al Cliente *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">
                  $
                </span>
                <input
                  type="text"
                  required
                  value={salePriceStr ? formatCurrency(salePrice).replace('$', '').trim() : ''}
                  onChange={(e) => setSalePriceStr(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-emerald-600/40 text-emerald-400 font-black text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="block text-[10px] text-emerald-500/80 mt-1">
                En cuánto se lo vendiste al cliente
              </span>
            </div>
          </div>

          {/* Live Commission Calculation Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            unitCommission > 0
              ? 'bg-gradient-to-br from-red-950/40 to-slate-900 border-red-500/40'
              : unitCommission < 0
              ? 'bg-rose-950/50 border-rose-600'
              : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Cálculo de Comisión en Vivo:
              </span>
              {unitCommission < 0 && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  ¡Precio menor al almacén!
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Comisión Unitaria
                </span>
                <span className={`text-base font-black ${unitCommission >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {formatCurrency(unitCommission)}
                </span>
              </div>

              <div className="bg-red-600/20 p-2.5 rounded-xl border border-red-500/30">
                <span className="text-[10px] uppercase font-bold text-red-200 block mb-0.5">
                  Comisión Total ({quantity} {quantity === 1 ? 'ud' : 'uds'})
                </span>
                <span className={`text-lg font-black ${totalCommission >= 0 ? 'text-white' : 'text-rose-400'}`}>
                  {formatCurrency(totalCommission)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Al almacén DIMAX: <strong className="text-slate-200">{formatCurrency(totalCost)}</strong></span>
              <span>Total al cliente: <strong className="text-emerald-400">{formatCurrency(totalSale)}</strong></span>
            </div>
          </div>

          {/* Cliente & Notas (Opcional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Cliente o Destino (Opcional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Andrés Gómez - WhatsApp"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Estado de Pago
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="pagado">✅ Pagado por cliente</option>
                <option value="contraentrega">📦 Pago Contraentrega</option>
                <option value="pendiente">⏳ Pendiente de cobro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nota o Detalle Adicional (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Incluye empaque de culata, garantía 6 meses..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-red-950/40 transition active:scale-95"
            >
              {initialItem ? 'Guardar Cambios' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
