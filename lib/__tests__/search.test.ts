import { parseSearchQuery } from '../search';

describe('parseSearchQuery', () => {
  describe('Empty/Invalid queries', () => {
    it('should return empty result for empty string', () => {
      const result = parseSearchQuery('');
      expect(result.minAge).toBeNull();
      expect(result.maxAge).toBeNull();
      expect(result.categories).toEqual([]);
      expect(result.searchTerms).toEqual([]);
    });

    it('should handle whitespace-only queries', () => {
      const result = parseSearchQuery('   ');
      expect(result.searchTerms).toEqual([]);
    });
  });

  describe('Age parsing', () => {
    it('should parse age ranges like "3-6 år"', () => {
      const result = parseSearchQuery('spil til 3-6 år');
      expect(result.minAge).toBe(3);
      expect(result.maxAge).toBe(6);
      expect(result.ageGroup).toBe('3-6');
    });

    it('should parse single ages like "5 år"', () => {
      const result = parseSearchQuery('spil til 5 år');
      expect(result.minAge).toBe(5);
      expect(result.maxAge).toBe(5);
    });

    it('should parse "årig" suffix', () => {
      const result = parseSearchQuery('spil til 7-årig');
      expect(result.minAge).toBe(7);
      expect(result.maxAge).toBe(7);
    });
  });

  describe('Gender parsing', () => {
    it('should parse "dreng" keywords', () => {
      const result = parseSearchQuery('spil til dreng');
      expect(result.targetGender).toBe('drenge');
    });

    it('should parse "pige" keywords', () => {
      const result = parseSearchQuery('spil til pige');
      expect(result.targetGender).toBe('piger');
    });
  });

  describe('Category parsing', () => {
    it('should recognize "puslespil" category', () => {
      const result = parseSearchQuery('puslespil');
      expect(result.categories).toContain('puslespil');
    });

    it('should recognize "eventyr" category', () => {
      const result = parseSearchQuery('eventyr spil');
      expect(result.categories).toContain('eventyr');
    });

    it('should recognize multiple categories', () => {
      const result = parseSearchQuery('eventyr puslespil');
      expect(result.categories).toContain('eventyr');
      expect(result.categories).toContain('puslespil');
    });
  });

  describe('Skills parsing', () => {
    it('should recognize "matematik" skill', () => {
      const result = parseSearchQuery('matematik');
      expect(result.skills).toContain('matematik');
    });
  });

  describe('Price parsing', () => {
    it('should recognize exact "gratis" keyword', () => {
      const result = parseSearchQuery('gratis');
      expect(result.priceModel).toBe('free');
    });

    it('should recognize "helt gratis"', () => {
      const result = parseSearchQuery('helt gratis spil');
      expect(result.priceModel).toBe('free');
    });

    it('should recognize "uden køb" keywords', () => {
      const result = parseSearchQuery('uden køb');
      expect(result.hasInAppPurchases).toBe(false);
    });
  });

  describe('Offline capability', () => {
    it('should recognize "offline" keyword', () => {
      const result = parseSearchQuery('offline spil');
      expect(result.isOfflineCapable).toBe(true);
    });

    it('should recognize "uden internet" keywords', () => {
      const result = parseSearchQuery('uden internet');
      expect(result.isOfflineCapable).toBe(true);
    });
  });

  describe('Complex queries', () => {
    it('should parse query with age and gender', () => {
      const result = parseSearchQuery('puslespil til 5 årig dreng');
      expect(result.minAge).toBe(5);
      expect(result.targetGender).toBe('drenge');
      expect(result.categories).toContain('puslespil');
    });

    it('should parse query with age range and category', () => {
      const result = parseSearchQuery('eventyr spil til 3-6 år');
      expect(result.minAge).toBe(3);
      expect(result.maxAge).toBe(6);
      expect(result.categories).toContain('eventyr');
    });

    it('should preserve original query', () => {
      const query = 'Test Query 123';
      const result = parseSearchQuery(query);
      expect(result.originalQuery).toBe(query);
    });
  });

  describe('Search terms extraction', () => {
    it('should extract remaining terms after parsing filters', () => {
      const result = parseSearchQuery('minecraft spil til 7 år');
      // "minecraft" should remain as a search term after age is extracted
      expect(result.searchTerms.length).toBeGreaterThan(0);
    });
  });
});
