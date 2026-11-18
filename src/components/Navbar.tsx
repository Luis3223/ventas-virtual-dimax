import React from 'react';
import type { AppProfile } from '../types';
import { Settings, Smartphone } from 'lucide-react';

interface NavbarProps {
  profile: AppProfile;
  onOpenSettings: () => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenSettings,
  onInstallPwa,
  canInstallPwa
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand with Official DIMAX Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center bg-white p-1 rounded-xl shadow-md border border-amber-500/30 overflow-hidden h-12 w-20 sm:w-24 shrink-0">
            <img
              src="/dimax-logo.jpg"
              alt="DIMAX Repuestos para Motos"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-wider text-white">
                {profile.companyName || 'VENTAS VIRTUAL DIMAX'}
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                DESDE 2020
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden xs:block">
              Almacén de Repuestos para Motos • Control de Ventas y Comisiones
            </p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Asesor Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 shadow-inner">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs shadow">
              LH
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-[11px] font-bold text-slate-200 leading-tight">
                {profile.sellerName || 'Luis Angel Hernández'}
              </span>
              <span className="block text-[9px] text-amber-400 font-semibold tracking-wide">
                Asesor Virtual
              </span>
            </div>
          </div>

          {/* Install PWA Button (if available) */}
          {canInstallPwa && onInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-950/40 animate-pulse"
              title="Instalar App en el Celular"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title="Ajustes y Catálogo de Repuestos"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
