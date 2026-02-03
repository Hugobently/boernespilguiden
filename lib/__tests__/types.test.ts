import { parseJsonArray } from '../types';

describe('parseJsonArray', () => {
  it('should parse valid JSON array of strings', () => {
    const result = parseJsonArray<string>('["apple", "banana", "cherry"]');
    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should parse valid JSON array of numbers', () => {
    const result = parseJsonArray<number>('[1, 2, 3, 4, 5]');
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should parse empty JSON array', () => {
    const result = parseJsonArray<string>('[]');
    expect(result).toEqual([]);
  });

  it('should return empty array for invalid JSON', () => {
    const result = parseJsonArray<string>('invalid json');
    expect(result).toEqual([]);
  });

  it('should return empty array for non-array JSON', () => {
    const result = parseJsonArray<string>('{"key": "value"}');
    expect(result).toEqual([]);
  });

  it('should return empty array for null', () => {
    const result = parseJsonArray<string>('null');
    expect(result).toEqual([]);
  });

  it('should return empty array for undefined string', () => {
    const result = parseJsonArray<string>('undefined');
    expect(result).toEqual([]);
  });

  it('should handle JSON array with objects', () => {
    const result = parseJsonArray<{ id: number; name: string }>(
      '[{"id": 1, "name": "test"}]'
    );
    expect(result).toEqual([{ id: 1, name: 'test' }]);
  });

  it('should handle mixed type arrays', () => {
    const result = parseJsonArray<string | number>('["text", 123, "more"]');
    expect(result).toEqual(['text', 123, 'more']);
  });
});
