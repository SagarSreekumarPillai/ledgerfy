// FILE: /lib/i18n.ts
/**
 * Internationalization configuration for Ledgerfy
 * Supports Hindi and regional languages for Indian CA firms
 */

export type SupportedLocale = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    }
  }
};

/**
 * Get locale configuration by code
 */
export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES.en;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): LocaleConfig[] {
  return Object.values(SUPPORTED_LOCALES);
}

/**
 * Format number according to locale
 */
export function formatNumber(
  value: number,
  locale: SupportedLocale = 'en',
  options?: Intl.NumberFormatOptions
): string {
  const config = getLocaleConfig(locale);
  
  if (locale === 'en') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      ...options
    }).format(value);
  }
  
  // For Indian languages, use English number formatting but local currency symbol
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    ...options
  }).format(value);
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: SupportedLocale = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options
    }).format(dateObj);
  }
  
  // For Indian languages, use English date formatting for now
  // TODO: Implement proper Indian language date formatting
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }).format(dateObj);
}

/**
 * Get localized month names
 */
export function getMonthNames(locale: SupportedLocale = 'en'): string[] {
  if (locale === 'en') {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }
  
  // TODO: Implement month names for Indian languages
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
}

/**
 * Get localized day names
 */
export function getDayNames(locale: SupportedLocale = 'en'): string[] {
  if (locale === 'en') {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }
  
  // TODO: Implement day names for Indian languages
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

/**
 * Get fiscal year start month (April for Indian financial year)
 */
export function getFiscalYearStart(): number {
  return 3; // April (0-indexed)
}

/**
 * Get current fiscal year
 */
export function getCurrentFiscalYear(): string {
  const now = new Date();
  const fiscalStart = getFiscalYearStart();
  
  if (now.getMonth() >= fiscalStart) {
    // Current year is fiscal year start
    return `${now.getFullYear()}-${(now.getFullYear() + 1).toString().slice(-2)}`;
  } else {
    // Previous year is fiscal year start
    return `${now.getFullYear() - 1}-${now.getFullYear().toString().slice(-2)}`;
  }
}

/**
 * Get fiscal year from date
 */
export function getFiscalYearFromDate(date: Date): string {
  const fiscalStart = getFiscalYearStart();
  
  if (date.getMonth() >= fiscalStart) {
    return `${date.getFullYear()}-${(date.getFullYear() + 1).toString().slice(-2)}`;
  } else {
    return `${date.getFullYear() - 1}-${date.getFullYear().toString().slice(-2)}`;
  }
}

/**
 * Get quarter from date
 */
export function getQuarterFromDate(date: Date): string {
  const month = date.getMonth();
  const fiscalStart = getFiscalYearStart();
  
  // Adjust month to fiscal year
  let adjustedMonth = month - fiscalStart;
  if (adjustedMonth < 0) adjustedMonth += 12;
  
  if (adjustedMonth < 3) return 'Q1';
  if (adjustedMonth < 6) return 'Q2';
  if (adjustedMonth < 9) return 'Q3';
  return 'Q4';
}

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: SupportedLocale = 'en';

/**
 * Fallback locale if translation is missing
 */
export const FALLBACK_LOCALE: SupportedLocale = 'en';
