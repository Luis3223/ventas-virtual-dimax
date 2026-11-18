import React, { useState } from 'react';
import type { SalesSession } from '../types';
import { formatDateSpanish, getDefaultSessionTitle, getTodayDateString } from '../utils/formatters';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  ChevronDown,
  Trash2,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionSelectorProps {
  sessions: SalesSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: (title: string, date: string, notes?: string) => void;
  onToggleStatus: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSessionInfo: (sessionId: string, title: string, date: string, notes?: string) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onToggleStatus,
  onDeleteSession,
  onUpdateSessionInfo
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(getTodayDateString());
  const [newNotes, setNewNotes] = useState('');

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleOpenNewModal = () => {
    const today = getTodayDateString();
    setNewTitle(getDefaultSessionTitle(today));
    setNewDate(today);
    setNewNotes('');
    setShowNewModal(true);
  };

  const handleSaveNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateSession(newTitle.trim(), newDate, newNotes.trim());
    setShowNewModal(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleOpenEditModal = () => {
    if (!activeSession) return;
    setNewTitle(activeSession.title);
    setNewDate(activeSession.date);
    setNewNotes(activeSession.notes || '');
    setShowEditModal(true);
  };

  const handleSaveEditSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !newTitle.trim()) return;
    onUpdateSessionInfo(activeSession.id, newTitle.trim(), newDate, newNotes.trim());
    setShowEditModal(false);
  };

  const handleToggleActiveStatus = () => {
    if (!activeSession) return;
    const isNowLiquidated = activeSession.status !== 'liquidado';
    onToggleStatus(activeSession.id);
    if (isNowLiquidated) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Selector Dropdown & Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-500" />
              Jornada de Ventas Activa:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Custom styled select */}
            <div className="relative inline-block w-full sm:w-auto min-w-[240px]">
              <select
                value={activeSessionId}
                onChange={(e) => onSelectSession(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 pr-10 text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.items.length} ventas) - {s.status === 'liquidado' ? '✅ Liquidado' : '⏳ Pendiente'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Edit Title */}
            <button
              onClick={handleOpenEditModal}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Editar título o fecha de la jornada"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Status Button */}
            {activeSession && (
              <button
                onClick={handleToggleActiveStatus}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                  activeSession.status === 'liquidado'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                    : 'bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/60'
                }`}
                title="Hacer clic para cambiar estado"
              >
                {activeSession.status === 'liquidado' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Liquidado / Pagado</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pendiente de Pago</span>
                  </>
                )}
              </button>
            )}

            {/* Delete Session (if more than 1) */}
            {sessions.length > 1 && activeSession && (
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar "${activeSession.title}" y todos sus registros?`)) {
                    onDeleteSession(activeSession.id);
                  }
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition border border-slate-700 hover:border-red-800"
                title="Eliminar esta jornada"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {activeSession && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span>📅 {formatDateSpanish(activeSession.date)}</span>
              {activeSession.notes && (
                <span className="text-slate-500 italic">• {activeSession.notes}</span>
              )}
            </div>
          )}
        </div>

        {/* Right: + Nueva Jornada Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-red-950/40 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Jornada (Ej: Ventas Martes)</span>
          </button>
        </div>
      </div>

      {/* Modal: Nueva Jornada */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Crear Nueva Jornada de Ventas
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crea un nuevo lote para registrar las ventas de un día o período (ej. Ventas Martes, Ventas Miércoles).
            </p>

            <form onSubmit={handleSaveNewSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nombre de la Jornada
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Ventas Martes, Ventas Miércoles..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Fecha de las Ventas
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setNewTitle(getDefaultSessionTitle(e.target.value));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Notas u Observaciones (Opcional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej: Ventas virtuales por WhatsApp y envíos a taller"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-md shadow-red-950/40 transition"
                >
                  Crear Jornada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Jornada */}
      {showEditModal && activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-red-500" />
              Editar Información de la Jornada
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Modifica el nombre o fecha de esta jornada de ventas.
            </p>

            <form onSubmit={handleSaveEditSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nombre de la Jornada
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Notas u Observaciones
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-md shadow-red-950/40 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
