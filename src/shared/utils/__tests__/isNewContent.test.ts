import { describe, it, expect, vi, afterEach } from 'vitest';
import { isNewContent } from '../isNewContent';

describe('isNewContent', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for content added within the default 7 days', () => {
    // 2 days ago in unix seconds
    const twoDaysAgo = String(Math.floor((Date.now() - 2 * 86400000) / 1000));
    expect(isNewContent(twoDaysAgo)).toBe(true);
  });

  it('returns false for content older than 7 days', () => {
    // 10 days ago in unix seconds
    const tenDaysAgo = String(Math.floor((Date.now() - 10 * 86400000) / 1000));
    expect(isNewContent(tenDaysAgo)).toBe(false);
  });

  it('returns false for undefined input', () => {
    expect(isNewContent(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isNewContent('')).toBe(false);
  });

  it('returns false for non-numeric string', () => {
    expect(isNewContent('not-a-number')).toBe(false);
  });

  it('returns false for zero timestamp', () => {
    expect(isNewContent('0')).toBe(false);
  });

  it('returns false for negative timestamp', () => {
    expect(isNewContent('-100')).toBe(false);
  });

  it('respects custom days parameter', () => {
    // 3 days ago
    const threeDaysAgo = String(Math.floor((Date.now() - 3 * 86400000) / 1000));

    // Within 5-day window -> true
    expect(isNewContent(threeDaysAgo, 5)).toBe(true);

    // Outside 2-day window -> false
    expect(isNewContent(threeDaysAgo, 2)).toBe(false);
  });

  it('returns true for very recent content (just now)', () => {
    const now = String(Math.floor(Date.now() / 1000));
    expect(isNewContent(now)).toBe(true);
  });
});
