import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/pt";
import { pt } from "./dictionaries/pt";
import { en } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
