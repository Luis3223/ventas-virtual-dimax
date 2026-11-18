export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '$ 0';
  return '$ ' + Math.round(amount).toLocaleString('es-CO');
};

export const parseCurrencyInput = (val: string): number => {
  const clean = val.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const getDayNameInSpanish = (dateStr: string): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return days[date.getDay()] || 'Día';
};

export const formatDateSpanish = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultSessionTitle = (dateStr = getTodayDateString()): string => {
  const dayName = getDayNameInSpanish(dateStr);
  const [, m, d] = dateStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthName = months[parseInt(m, 10) - 1] || '';
  return `Ventas ${dayName} (${parseInt(d, 10)} ${monthName})`;
};

