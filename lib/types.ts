// Game type constants (SQLite doesn't support enums)
export const GameType = {
  DIGITAL: 'DIGITAL',
  BOARD: 'BOARD',
} as const;

export type GameType = (typeof GameType)[keyof typeof GameType];
