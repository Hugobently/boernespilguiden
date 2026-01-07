// Helper types for JSON array fields in SQLite

export type AgeGroup = '0-3' | '3-6' | '7-10' | '11-15';

export type GameCategory =
  | 'læring'
  | 'eventyr'
  | 'puslespil'
  | 'kreativ'
  | 'action'
  | 'musik'
  | 'sport';

export type BoardGameCategory =
  | 'strategi'
  | 'samarbejde'
  | 'læring'
  | 'fest'
  | 'kort'
  | 'familie'
  | 'hukommelse';

export type Skill =
  | 'matematik'
  | 'læsning'
  | 'logik'
  | 'motorik'
  | 'sprog'
  | 'kreativitet'
  | 'samarbejde'
  | 'koncentration';

export type Theme =
  | 'dyr'
  | 'rummet'
  | 'prinsesser'
  | 'dinosaurer'
  | 'eventyr'
  | 'natur'
  | 'biler'
  | 'superhelte';

export type Platform = 'iOS' | 'Android' | 'PC' | 'Nintendo' | 'PlayStation' | 'Xbox' | 'Web';

export type PriceModel = 'gratis' | 'engangskøb' | 'abonnement' | 'freemium';

export type DataCollection = 'ingen' | 'minimal' | 'moderat' | 'omfattende';

export type TargetGender = 'alle' | 'drenge' | 'piger';

// Helper functions to parse JSON arrays from SQLite
export function parseJsonArray<T>(json: string): T[] {
  try {
    return JSON.parse(json) as T[];
  } catch {
    return [];
  }
}

export function stringifyArray<T>(arr: T[]): string {
  return JSON.stringify(arr);
}
