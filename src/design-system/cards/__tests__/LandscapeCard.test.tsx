import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandscapeCard, type LandscapeCardProps } from '../LandscapeCard';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultProps: LandscapeCardProps = {
  title: 'Breaking Bad',
  imageUrl: 'https://example.com/breaking-bad.jpg',
  subtitle: 'S05E16 — Felina',
  onClick: vi.fn(),
};

function renderCard(overrides?: Partial<LandscapeCardProps>) {
  return render(<LandscapeCard {...defaultProps} {...overrides} />);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('LandscapeCard — rendering', () => {
  it('renders thumbnail image', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/breaking-bad.jpg');
  });

  it('renders title', () => {
    renderCard();
    expect(screen.getByText('Breaking Bad')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    renderCard({ subtitle: 'S05E16 — Felina' });
    expect(screen.getByText('S05E16 — Felina')).toBeTruthy();
  });
});

describe('LandscapeCard — progress bar', () => {
  it('renders progress bar with correct width percentage', () => {
    renderCard({ progress: 45 });
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeTruthy();
    expect(progressbar.getAttribute('aria-valuenow')).toBe('45');
  });

  it('does NOT render progress bar when no progress', () => {
    renderCard({ progress: undefined });
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('does NOT render progress bar when progress is 0', () => {
    renderCard({ progress: 0 });
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});

describe('LandscapeCard — duration text', () => {
  it('renders duration text when provided', () => {
    renderCard({ duration: '1h 2m' } as any);
    expect(screen.getByText('1h 2m')).toBeTruthy();
  });
});

describe('LandscapeCard — image fallback', () => {
  it('shows gradient fallback on image error', () => {
    const { container } = renderCard();
    const img = screen.getByRole('img');
    fireEvent.error(img);

    // After error, should show gradient fallback
    const fallback = container.querySelector('[aria-hidden="true"]');
    expect(fallback).not.toBeNull();
  });
});

describe('LandscapeCard — aspect ratio', () => {
  it('has correct 16:9 aspect ratio (aspect-video class)', () => {
    const { container } = renderCard();
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('aspect-video');
  });
});

describe('LandscapeCard — accessibility', () => {
  it('has ARIA label with title', () => {
    renderCard();
    const card = screen.getByLabelText(/Breaking Bad/);
    expect(card).toBeTruthy();
  });

  it('includes subtitle in ARIA label when provided', () => {
    renderCard({ subtitle: 'S05E16 — Felina' });
    const card = screen.getByLabelText(/Breaking Bad/);
    const label = card.getAttribute('aria-label');
    expect(label).toContain('S05E16');
  });
});
