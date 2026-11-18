import React, { useState } from 'react';
import type { SaleItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Package,
  Edit2,
  Trash2,
  Copy,
  Search,
  Plus,
  User
} from 'lucide-react';

interface SaleItemsListProps {
  items: SaleItem[];
  onAddNew: () => void;
  onEdit: (item: SaleItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: SaleItem) => void;
}

export const SaleItemsList: React.FC<SaleItemsListProps> = ({
  items,
  onAddNew,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.productName.toLowerCase().includes(term) ||
      (item.clientName && item.clientName.toLowerCase().includes(term)) ||
      (item.notes && item.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden mb-6">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Repuestos y Artículos Vendidos
            </h2>
            <p className="text-xs text-slate-400">
              {items.length} {items.length === 1 ? 'registro' : 'registros'} en esta jornada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          {items.length > 0 && (
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar repuesto o cliente..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Add product button */}
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-950/40 transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Venta</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3 border border-slate-700/60">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No hay repuestos registrados en esta jornada
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Comienza registrando los productos que vendiste hoy para calcular tus comisiones y generar el reporte para tu jefe.
          </p>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Registrar Primer Repuesto</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">
          No se encontraron repuestos que coincidan con "{searchTerm}".
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Repuesto / Producto</th>
                  <th className="py-3 px-3 text-center">Cant.</th>
                  <th className="py-3 px-4 text-right">Precio Almacén</th>
                  <th className="py-3 px-4 text-right">Precio Venta</th>
                  <th className="py-3 px-4 text-right">Comisión c/u</th>
                  <th className="py-3 px-4 text-right">Total Comisión</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {item.productName}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        {item.clientName && (
                          <span className="flex items-center gap-1 text-slate-300">
                            <User className="w-3 h-3 text-slate-500" />
                            {item.clientName}
                          </span>
                        )}
                        {item.paymentStatus && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            item.paymentStatus === 'pagado'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : item.paymentStatus === 'contraentrega'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {item.paymentStatus}
                          </span>
                        )}
                        {item.notes && (
                          <span className="text-slate-500 italic">• {item.notes}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-800 font-black text-white text-xs">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300 font-mono font-medium">
                      {formatCurrency(item.costPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-mono font-medium">
                      {formatCurrency(item.salePrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      {formatCurrency(item.unitCommission)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-base text-red-400">
                      {formatCurrency(item.totalCommission)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onDuplicate(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Duplicar este producto"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Editar producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${item.productName}" de esta jornada?`)) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/60 transition"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-800/80">
            {filteredItems.map((item, idx) => (
              <div key={item.id} className="p-4 hover:bg-slate-800/20 transition">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight">
                        {item.productName}
                      </h4>
                      {item.clientName && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{item.clientName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-white font-black text-xs shrink-0">
                    x{item.quantity}
                  </span>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 mb-2.5 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Almacén</span>
                    <span className="text-xs font-bold text-slate-300 font-mono">
                      {formatCurrency(item.costPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Venta</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {formatCurrency(item.salePrice)}
                    </span>
                  </div>
                  <div className="bg-red-600/10 rounded-lg p-0.5 border border-red-500/20">
                    <span className="block text-[10px] text-red-300 uppercase font-bold">Comisión</span>
                    <span className="text-xs font-black text-red-400 font-mono">
                      {formatCurrency(item.totalCommission)}
                    </span>
                  </div>
                </div>

                {/* Bottom actions & metadata */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    {item.paymentStatus && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.paymentStatus === 'pagado'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.paymentStatus === 'contraentrega'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.paymentStatus}
                      </span>
                    )}
                    {item.notes && (
                      <span className="text-slate-500 text-[11px] truncate max-w-[130px]">
                        {item.notes}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicate(item)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${item.productName}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
