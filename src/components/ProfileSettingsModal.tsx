import React, { useState } from 'react';
import type { AppProfile, FrequentProduct, SalesSession } from '../types';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';
import {
  X,
  User,
  Store,
  Phone,
  Settings,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AppProfile;
  onSaveProfile: (profile: AppProfile) => void;
  allSessions: SalesSession[];
  onRestoreSessions: (sessions: SalesSession[]) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  allSessions,
  onRestoreSessions
}) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'catalogo' | 'respaldo'>('perfil');

  // Form states
  const [sellerName, setSellerName] = useState(profile.sellerName);
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [bossName, setBossName] = useState(profile.bossName);
  const [bossPhone, setBossPhone] = useState(profile.bossPhone);

  // Catalog states
  const [frequentProducts, setFrequentProducts] = useState<FrequentProduct[]>(profile.frequentProducts || []);
  const [newProdName, setNewProdName] = useState('');
  const [newCostPrice, setNewCostPrice] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('');

  // Notification state
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppProfile = {
      ...profile,
      sellerName: sellerName.trim() || 'Luis Angel Hernández',
      companyName: companyName.trim() || 'VENTAS VIRTUAL DIMAX',
      bossName: bossName.trim(),
      bossPhone: bossPhone.trim(),
      frequentProducts
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddFrequentProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: FrequentProduct = {
      id: 'fp-' + Date.now(),
      name: newProdName.trim(),
      category: 'Repuestos',
      defaultCostPrice: parseCurrencyInput(newCostPrice),
      defaultSalePrice: parseCurrencyInput(newSalePrice)
    };

    const updatedList = [newProd, ...frequentProducts];
    setFrequentProducts(updatedList);
    onSaveProfile({
      ...profile,
      frequentProducts: updatedList
    });

    setNewProdName('');
    setNewCostPrice('');
    setNewSalePrice('');
  };

  const handleDeleteFrequent = (id: string) => {
    const updatedList = frequentProducts.filter((f) => f.id !== id);
    setFrequentProducts(updatedList);
    onSaveProfile({
      ...profile,
      frequentProducts: updatedList
    });
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: {
        ...profile,
        sellerName,
        companyName,
        bossName,
        bossPhone,
        frequentProducts
      },
      sessions: allSessions
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DIMAX_Copia_Seguridad_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.sessions && Array.isArray(data.sessions)) {
          onRestoreSessions(data.sessions);
          if (data.profile) {
            onSaveProfile(data.profile);
            setSellerName(data.profile.sellerName || 'Luis Angel Hernández');
            setCompanyName(data.profile.companyName || 'VENTAS VIRTUAL DIMAX');
            setBossName(data.profile.bossName || '');
            setBossPhone(data.profile.bossPhone || '');
            setFrequentProducts(data.profile.frequentProducts || []);
          }
          alert('¡Copia de seguridad restaurada exitosamente!');
        } else {
          alert('El archivo no tiene el formato correcto de DIMAX.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-150 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Settings className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Ajustes y Configuración
              </h3>
              <p className="text-xs text-slate-400">
                VENTAS VIRTUAL DIMAX • Vendedor: Luis Angel Hernández
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

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'perfil'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Datos & WhatsApp
          </button>
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'catalogo'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Catálogo Repuestos ({frequentProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('respaldo')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'respaldo'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Copia de Seguridad
          </button>
        </div>

        {/* Tab 1: Perfil & WhatsApp */}
        {activeTab === 'perfil' && (
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nombre del Asesor / Vendedor
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="Luis Angel Hernández"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Este nombre saldrá en todos los reportes PDF y mensajes oficiales.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nombre del Negocio / Almacén
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="VENTAS VIRTUAL DIMAX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre de tu Jefe / Encargado
                </label>
                <input
                  type="text"
                  value={bossName}
                  onChange={(e) => setBossName(e.target.value)}
                  placeholder="Ej: Jefe DIMAX"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  WhatsApp de tu Jefe (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bossPhone}
                    onChange={(e) => setBossPhone(e.target.value)}
                    placeholder="Ej: 3001234567"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Para abrir el chat de WhatsApp de tu jefe directamente al hacer 1 clic.
                </span>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ¡Datos actualizados con éxito!
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition"
              >
                Guardar Ajustes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Catálogo de Repuestos Frecuentes */}
        {activeTab === 'catalogo' && (
          <div>
            <form onSubmit={handleAddFrequentProduct} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4 space-y-3">
              <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                + Agregar Nuevo Repuesto al Catálogo Rápido
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Nombre del repuesto (ej: Kit Arrastre FZ)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={newCostPrice ? formatCurrency(parseCurrencyInput(newCostPrice)).replace('$', '').trim() : ''}
                    onChange={(e) => setNewCostPrice(e.target.value)}
                    placeholder="Precio Almacén ($)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={newSalePrice ? formatCurrency(parseCurrencyInput(newSalePrice)).replace('$', '').trim() : ''}
                    onChange={(e) => setNewSalePrice(e.target.value)}
                    placeholder="Precio Venta ($)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {frequentProducts.map((fp) => (
                <div
                  key={fp.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{fp.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Almacén: <strong className="text-slate-300">{formatCurrency(fp.defaultCostPrice)}</strong> • Venta: <strong className="text-emerald-400">{formatCurrency(fp.defaultSalePrice)}</strong> • Ganancia: <strong className="text-amber-400">{formatCurrency(fp.defaultSalePrice - fp.defaultCostPrice)}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFrequent(fp.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Respaldo & Backup */}
        {activeTab === 'respaldo' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Descargar Copia de Seguridad
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Guarda un archivo con todas tus jornadas, ventas y catálogo en tu celular o computadora.
              </p>
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Copia (.json)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                Restaurar Copia de Seguridad
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Carga un archivo de respaldo previo para restaurar todas tus ventas.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer transition">
                <Upload className="w-4 h-4" />
                <span>Seleccionar Archivo</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
