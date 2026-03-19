import { describe, it, expect } from 'vitest';
import { formatDuration, formatTimeAgo } from '../formatDuration';

describe('formatDuration', () => {
  it('formats seconds into hours and minutes', () => {
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(7200)).toBe('2h 0m');
    expect(formatDuration(5400)).toBe('1h 30m');
  });

  it('formats minutes-only durations', () => {
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(300)).toBe('5m');
    expect(formatDuration(2700)).toBe('45m');
  });

  it('returns empty string for 0', () => {
    expect(formatDuration(0)).toBe('');
  });

  it('returns empty string for negative numbers', () => {
    expect(formatDuration(-10)).toBe('');
    expect(formatDuration(-3600)).toBe('');
  });

  it('returns empty string for NaN/undefined-like input', () => {
    expect(formatDuration(NaN)).toBe('');
  });

  it('handles large numbers', () => {
    // 100 hours
    expect(formatDuration(360000)).toBe('100h 0m');
  });

  it('handles sub-minute durations (rounds down to 0m)', () => {
    expect(formatDuration(30)).toBe('0m');
    expect(formatDuration(59)).toBe('0m');
  });
});

describe('formatTimeAgo', () => {
  it('returns "Just now" for very recent timestamps', () => {
    const now = new Date().toISOString();
    expect(formatTimeAgo(now)).toBe('Just now');
  });

  it('returns minutes ago for < 1 hour', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatTimeAgo(fiveMinAgo)).toBe('5m ago');
  });

  it('returns hours ago for < 24 hours', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(formatTimeAgo(threeHoursAgo)).toBe('3h ago');
  });

  it('returns days ago for < 7 days', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(formatTimeAgo(twoDaysAgo)).toBe('2d ago');
  });
});
