/**
 * date formatter utility
 * @param date the date string iso
 * @returns a formatted string Data (ex: 9 fevrier 2026)
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);

  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 *
 * @param name string
 * @returns 2 letter of the candidatuers name ex: Zakaria Seggar (ZS | ZA)
 */
export const avatarFallbackName = (name: string): string => {
  if (!name) return '';

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return `${words[0]?.[0]}${words[1]?.[0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
};

/**
 * @returns a DZD Simply Currency formatter
 */

export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0.00 DA';

  const fomatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
  });
  return fomatter.format(amount);
};

/**
 * Returns the color associated with a candidature status
 * @param status string
 * @returns hex color code
 */
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status?.toLowerCase().trim();
  switch (normalizedStatus) {
    case 'en attente':
      return '#94a3b8';
    case 'entretien rh':
      return '#3b82f6';
    case 'entretien technique':
      return '#f59e0b';
    case 'accepté':
      return '#10b981';
    case 'refusé':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};
