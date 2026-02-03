import { CacheTags, CacheDurations } from '../cache';

describe('CacheTags', () => {
  it('should have correct static cache tags', () => {
    expect(CacheTags.ALL_GAMES).toBe('all-games');
    expect(CacheTags.ALL_BOARD_GAMES).toBe('all-board-games');
    expect(CacheTags.FEATURED).toBe('featured');
    expect(CacheTags.EDITOR_CHOICE).toBe('editor-choice');
    expect(CacheTags.SEARCH).toBe('search');
  });

  it('should generate game-specific tags', () => {
    expect(CacheTags.GAME('minecraft')).toBe('game-minecraft');
    expect(CacheTags.GAME('stardew-valley')).toBe('game-stardew-valley');
  });

  it('should generate board game-specific tags', () => {
    expect(CacheTags.BOARD_GAME('monopoly')).toBe('board-game-monopoly');
    expect(CacheTags.BOARD_GAME('ticket-to-ride')).toBe('board-game-ticket-to-ride');
  });

  it('should generate category-specific tags', () => {
    expect(CacheTags.CATEGORY('0-3')).toBe('category-0-3');
    expect(CacheTags.CATEGORY('7+')).toBe('category-7+');
  });
});

describe('CacheDurations', () => {
  it('should have correct duration values in seconds', () => {
    expect(CacheDurations.SHORT).toBe(60); // 1 minute
    expect(CacheDurations.MEDIUM).toBe(300); // 5 minutes
    expect(CacheDurations.LONG).toBe(3600); // 1 hour
    expect(CacheDurations.VERY_LONG).toBe(86400); // 24 hours
  });

  it('should have durations in ascending order', () => {
    expect(CacheDurations.SHORT).toBeLessThan(CacheDurations.MEDIUM);
    expect(CacheDurations.MEDIUM).toBeLessThan(CacheDurations.LONG);
    expect(CacheDurations.LONG).toBeLessThan(CacheDurations.VERY_LONG);
  });
});
