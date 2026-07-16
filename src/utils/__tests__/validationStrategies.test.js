import { describe, it, expect } from 'vitest';
import { validate, PLATFORM_CONFIG } from '../validationStrategies';

describe('validationStrategies (Strategy Pattern)', () => {
  it('rejects empty content for every platform', () => {
    Object.keys(PLATFORM_CONFIG).forEach((platform) => {
      const result = validate(platform, '');
      expect(result.valid).toBe(false);
    });
  });

  it('accepts content within the Twitter limit', () => {
    const result = validate('twitter', 'A short, valid tweet.');
    expect(result.valid).toBe(true);
  });

  it('rejects content over the Twitter 280-character limit', () => {
    const result = validate('twitter', 'a'.repeat(281));
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/exceeds twitter limit/i);
  });

  it('accepts LinkedIn content up to 3000 characters', () => {
    const result = validate('linkedin', 'b'.repeat(3000));
    expect(result.valid).toBe(true);
  });

  it('rejects LinkedIn content over 3000 characters', () => {
    const result = validate('linkedin', 'b'.repeat(3001));
    expect(result.valid).toBe(false);
  });

  it('rejects Instagram captions with more than 30 hashtags', () => {
    const manyHashtags = Array.from({ length: 31 }, (_, i) => `#tag${i}`).join(' ');
    const result = validate('instagram', manyHashtags);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/30 hashtags/i);
  });

  it('falls back gracefully for an unregistered platform', () => {
    const result = validate('tiktok', 'hello world');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/no validation strategy/i);
  });
});
