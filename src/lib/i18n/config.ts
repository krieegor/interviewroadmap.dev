export type Locale = "pt" | "en";

export const locales: Locale[] = ["pt", "en"];

export const defaultLocale: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
