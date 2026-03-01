export const formatMoney = (amount: number) => 
  new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(amount);

export const escapeHTML = (str: string) => {
  if (!str) return '';
  return str.toString().replace(/[&<>"']/g, (m) => 
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!
  );
};