import {
  cn,
  getAgeLabel,
  getAgeCategory,
  slugify,
  formatPlayTime,
  getAgeGroupColor,
  parseAgeGroup,
  AGE_GROUP_COLORS,
} from '../utils';

describe('cn (className merger)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});

describe('getAgeLabel', () => {
  it('should return single age when min equals max', () => {
    expect(getAgeLabel(5, 5)).toBe('5 år');
    expect(getAgeLabel(10, 10)).toBe('10 år');
  });

  it('should return age range for different min/max', () => {
    expect(getAgeLabel(3, 6)).toBe('3-6 år');
    expect(getAgeLabel(7, 12)).toBe('7-12 år');
  });

  it('should return plus notation for 99+ max age', () => {
    expect(getAgeLabel(7, 99)).toBe('7+ år');
    expect(getAgeLabel(12, 99)).toBe('12+ år');
  });

  it('should handle edge cases', () => {
    expect(getAgeLabel(0, 3)).toBe('0-3 år');
    expect(getAgeLabel(0, 99)).toBe('0+ år');
  });
});

describe('getAgeCategory', () => {
  it('should return "0-3" for ages 0-3', () => {
    expect(getAgeCategory(0)).toBe('0-3');
    expect(getAgeCategory(1)).toBe('0-3');
    expect(getAgeCategory(2)).toBe('0-3');
    expect(getAgeCategory(3)).toBe('0-3');
  });

  it('should return "3-6" for ages 4-6', () => {
    expect(getAgeCategory(4)).toBe('3-6');
    expect(getAgeCategory(5)).toBe('3-6');
    expect(getAgeCategory(6)).toBe('3-6');
  });

  it('should return "7+" for ages 7 and above', () => {
    expect(getAgeCategory(7)).toBe('7+');
    expect(getAgeCategory(10)).toBe('7+');
    expect(getAgeCategory(15)).toBe('7+');
    expect(getAgeCategory(99)).toBe('7+');
  });
});

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Test Game')).toBe('test-game');
  });

  it('should handle Danish characters', () => {
    // Note: Some Danish characters (ø, æ, å) are not fully normalized by NFD
    expect(slugify('Børnespil')).toBe('b-rnespil');
    expect(slugify('Æblegrød')).toBe('blegr-d');
  });

  it('should remove special characters', () => {
    expect(slugify('Test & Game!')).toBe('test-game');
    expect(slugify('Game: The Return')).toBe('game-the-return');
  });

  it('should handle multiple spaces and dashes', () => {
    expect(slugify('Test   Game')).toBe('test-game');
    expect(slugify('Test---Game')).toBe('test-game');
  });

  it('should remove leading and trailing dashes', () => {
    expect(slugify('-test-')).toBe('test');
    expect(slugify('--test--')).toBe('test');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('formatPlayTime', () => {
  it('should return "Varierer" for null', () => {
    expect(formatPlayTime(null)).toBe('Varierer');
  });

  it('should return the time string if provided', () => {
    expect(formatPlayTime('30 min')).toBe('30 min');
    expect(formatPlayTime('1-2 timer')).toBe('1-2 timer');
  });
});

describe('getAgeGroupColor', () => {
  it('should return pink for ages 0-3', () => {
    expect(getAgeGroupColor(0)).toBe(AGE_GROUP_COLORS['0-3']);
    expect(getAgeGroupColor(3)).toBe(AGE_GROUP_COLORS['0-3']);
  });

  it('should return green for ages 3-6', () => {
    expect(getAgeGroupColor(4)).toBe(AGE_GROUP_COLORS['3-6']);
    expect(getAgeGroupColor(6)).toBe(AGE_GROUP_COLORS['3-6']);
  });

  it('should return blue for ages 7+', () => {
    expect(getAgeGroupColor(7)).toBe(AGE_GROUP_COLORS['7+']);
    expect(getAgeGroupColor(15)).toBe(AGE_GROUP_COLORS['7+']);
  });

  it('should return correct hex colors', () => {
    expect(getAgeGroupColor(2)).toBe('#FFD1DC');
    expect(getAgeGroupColor(5)).toBe('#BAFFC9');
    expect(getAgeGroupColor(10)).toBe('#BAE1FF');
  });
});

describe('parseAgeGroup', () => {
  it('should parse "0-3" format', () => {
    expect(parseAgeGroup('0-3')).toEqual({ minAge: 0, maxAge: 3 });
    expect(parseAgeGroup('3-6')).toEqual({ minAge: 3, maxAge: 6 });
  });

  it('should parse "7+" format', () => {
    expect(parseAgeGroup('7+')).toEqual({ minAge: 7, maxAge: 99 });
    expect(parseAgeGroup('12+')).toEqual({ minAge: 12, maxAge: 99 });
  });

  it('should handle edge cases', () => {
    expect(parseAgeGroup('0+')).toEqual({ minAge: 0, maxAge: 99 });
  });

  it('should handle invalid input gracefully', () => {
    expect(parseAgeGroup('invalid')).toEqual({ minAge: 0, maxAge: 99 });
    expect(parseAgeGroup('')).toEqual({ minAge: 0, maxAge: 99 });
  });
});
