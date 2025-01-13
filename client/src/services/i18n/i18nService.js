// client/src/services/i18n/i18nService.js
class I18nService {
  constructor() {
    this.translations = new Map();
    this.currentLocale = "en";
    this.fallbackLocale = "en";
  }

  async loadTranslations(locale) {
    try {
      const response = await fetch(`/api/translations/${locale}`);
      const translations = await response.json();
      this.translations.set(locale, translations);
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
    }
  }

  async setLocale(locale) {
    if (!this.translations.has(locale)) {
      await this.loadTranslations(locale);
    }
    this.currentLocale = locale;
    document.documentElement.setAttribute("lang", locale);
  }

  t(key, params = {}) {
    const translation =
      this.translations.get(this.currentLocale)?.[key] ||
      this.translations.get(this.fallbackLocale)?.[key] ||
      key;

    return translation.replace(/\{(\w+)\}/g, (_, param) => params[param] || "");
  }

  formatNumber(number, options = {}) {
    return new Intl.NumberFormat(this.currentLocale, options).format(number);
  }

  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
  }
}

export const i18n = new I18nService();
