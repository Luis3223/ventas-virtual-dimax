import React, { useState, useEffect } from 'react';
import type { SalesSession, SaleItem, AppProfile } from './types';
import {
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadProfileFromStorage,
  saveProfileToStorage
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { SessionSelector } from './components/SessionSelector';
import { SaleItemsList } from './components/SaleItemsList';
import { SaleItemModal } from './components/SaleItemModal';
import { ExportActionsBar } from './components/ExportActionsBar';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { Plus, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<SalesSession[]>(() => loadSessionsFromStorage());
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const loaded = loadSessionsFromStorage();
    return loaded.length > 0 ? loaded[0].id : '';
  });
  const [profile, setProfile] = useState<AppProfile>(() => loadProfileFromStorage());

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaleItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Sync to storage
  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  useEffect(() => {
    saveProfileToStorage(profile);
  }, [profile]);

  // Active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Handlers for Session
  const handleCreateSession = (title: string, date: string, notes?: string) => {
    const newSession: SalesSession = {
      id: 'session-' + Date.now(),
      title,
      date,
      status: 'pendiente',
      notes,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleToggleStatus = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const nextStatus = s.status === 'liquidado' ? 'pendiente' : 'liquidado';
          return {
            ...s,
            status: nextStatus,
            liquidatedAt: nextStatus === 'liquidado' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      })
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId && remaining.length > 0) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleUpdateSessionInfo = (sessionId: string, title: string, date: string, notes?: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, title, date, notes, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  // Handlers for Items
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: SaleItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<SaleItem, 'id' | 'createdAt' | 'unitCommission' | 'totalCommission' | 'totalCost' | 'totalSale'> & { id?: string }) => {
    const unitCommission = itemData.salePrice - itemData.costPrice;
    const totalCommission = unitCommission * itemData.quantity;
    const totalCost = itemData.costPrice * itemData.quantity;
    const totalSale = itemData.salePrice * itemData.quantity;

    if (itemData.id) {
      // Edit existing
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              items: session.items.map((it) =>
                it.id === itemData.id
                  ? {
                      ...it,
                      ...itemData,
                      unitCommission,
                      totalCommission,
                      totalCost,
                      totalSale
                    }
                  : it
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return session;
        })
      );
    } else {
      // Add new
      const newItem: SaleItem = {
        ...itemData,
        id: 'item-' + Date.now(),
        unitCommission,
        totalCommission,
        totalCost,
        totalSale,
        createdAt: new Date().toISOString()
      };

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              items: [newItem, ...session.items],
              updatedAt: new Date().toISOString()
            };
          }
          return session;
        })
      );
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            items: session.items.filter((it) => it.id !== itemId),
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    );
  };

  const handleDuplicateItem = (item: SaleItem) => {
    const duplicate: SaleItem = {
      ...item,
      id: 'item-' + Date.now(),
      createdAt: new Date().toISOString(),
      clientName: item.clientName ? `${item.clientName} (Copia)` : undefined
    };

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            items: [duplicate, ...session.items],
            updatedAt: new Date().toISOString()
          };
        }
        return session;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        profile={profile}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={canInstallPwa}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-gradient-to-r from-slate-900 to-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[11px] font-extrabold border border-red-500/30">
                SISTEMA VIRTUAL
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Almacén DIMAX
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Control de Ventas y Liquidación de Comisiones
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Bienvenido, <strong className="text-slate-200">{profile.sellerName}</strong>. Registra tus ventas, calcula tu ganancia y genera reportes para tu jefe.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-950/50 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Venta</span>
            </button>
          </div>
        </div>

        {/* 1. Selector de Jornada (Ventas Martes, etc.) */}
        <SessionSelector
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onCreateSession={handleCreateSession}
          onToggleStatus={handleToggleStatus}
          onDeleteSession={handleDeleteSession}
          onUpdateSessionInfo={handleUpdateSessionInfo}
        />

        {/* 2. Estadísticas Financieras en Vivo */}
        {activeSession && <DashboardStats session={activeSession} />}

        {/* 3. Barra de Acciones de Reporte y Envío a Jefe */}
        {activeSession && <ExportActionsBar session={activeSession} profile={profile} />}

        {/* 4. Lista de Repuestos y Productos Vendidos */}
        {activeSession && (
          <SaleItemsList
            items={activeSession.items}
            onAddNew={handleOpenAddModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteItem}
            onDuplicate={handleDuplicateItem}
          />
        )}
      </main>

      {/* Floating Action Button for mobile */}
      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={handleOpenAddModal}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow-2xl shadow-red-900/60 border border-red-400/40 active:scale-90 transition"
          title="Agregar Venta"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Modals */}
      <SaleItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        frequentProducts={profile.frequentProducts}
      />

      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        allSessions={sessions}
        onRestoreSessions={setSessions}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {profile.companyName} • Asesor Virtual: <strong>{profile.sellerName}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            PWA con Almacenamiento Local Seguro y Soporte Offline
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
