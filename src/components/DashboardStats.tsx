import React from 'react';
import type { SalesSession } from '../types';
import { formatCurrency } from '../utils/formatters';
import { DollarSign, Store, TrendingUp, Package } from 'lucide-react';

interface DashboardStatsProps {
  session: SalesSession;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ session }) => {
  const totalCost = session.items.reduce((acc, item) => acc + item.totalCost, 0);
  const totalSale = session.items.reduce((acc, item) => acc + item.totalSale, 0);
  const totalCommission = session.items.reduce((acc, item) => acc + item.totalCommission, 0);
  const totalUnits = session.items.reduce((acc, item) => acc + item.quantity, 0);

  const profitMargin = totalSale > 0 ? ((totalCommission / totalSale) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Comisiones Asesor (HERO CARD) */}
      <div className="col-span-2 sm:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-700 to-red-900 p-4 sm:p-5 text-white shadow-xl shadow-red-950/40 border border-red-500/40">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-200">
            Mi Comisión a Cobrar
          </span>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <DollarSign className="w-5 h-5 text-amber-300" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          {formatCurrency(totalCommission)}
        </div>
        <p className="text-[11px] text-red-200 font-medium">
          A pagar a Luis Angel Hernández
        </p>
      </div>

      {/* 2. Total Almacén DIMAX */}
      <div className="rounded-2xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Liquidación Almacén
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <Store className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 mb-1">
          {formatCurrency(totalCost)}
        </div>
        <p className="text-[11px] text-slate-400">
          Costo base a entregar a DIMAX
        </p>
      </div>

      {/* 3. Venta Total Cobrada */}
      <div className="rounded-2xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Facturado
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-400 mb-1">
          {formatCurrency(totalSale)}
        </div>
        <p className="text-[11px] text-slate-400">
          Cobrado a los clientes
        </p>
      </div>

      {/* 4. Repuestos & Margen */}
      <div className="rounded-2xl bg-slate-900/80 p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Repuestos & Margen
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-100">
            {totalUnits}
          </span>
          <span className="text-xs text-slate-400">unidades</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {profitMargin}% margen
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {session.items.length} líneas de venta registradas
        </p>
      </div>
    </div>
  );
};
