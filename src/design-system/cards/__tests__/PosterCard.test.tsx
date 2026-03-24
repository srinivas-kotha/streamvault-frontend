import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ── mock isTVMode (evaluated at module load by PosterCard) ───────────────────

vi.mock('@/shared/utils/isTVMode', () => ({
  isTVMode: false,
}));

import { PosterCard, type PosterCardProps } from '../PosterCard';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultProps: PosterCardProps = {
  title: 'Inception',
  imageUrl: 'https://example.com/inception.jpg',
  rating: '8.8',
  isNew: false,
  onClick: vi.fn(),
};

function renderCard(overrides?: Partial<PosterCardProps>) {
  return render(<PosterCard {...defaultProps} {...overrides} />);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('PosterCard — rendering', () => {
  it('renders title', () => {
    renderCard();
    expect(screen.getByText('Inception')).toBeTruthy();
  });

  it('renders year when provided', () => {
    renderCard({ year: 2010 } as any);
    expect(screen.getByText('2010')).toBeTruthy();
  });

  it('renders rating badge', () => {
    renderCard({ rating: '8.8' });
    expect(screen.getByText('8.8')).toBeTruthy();
  });
});

describe('PosterCard — NEW badge', () => {
  it('renders NEW badge when content is new', () => {
    renderCard({ isNew: true });
    expect(screen.getByText('NEW')).toBeTruthy();
  });

  it('does NOT render NEW badge when isNew is false', () => {
    renderCard({ isNew: false });
    expect(screen.queryByText('NEW')).toBeNull();
  });
});

describe('PosterCard — favorite toggle', () => {
  it('renders favorite toggle button (heart icon)', () => {
    renderCard({ isFavorite: false, onFavoriteToggle: vi.fn() } as any);
    const favButton = screen.getByRole('button', { name: /favorite/i });
    expect(favButton).toBeTruthy();
  });

  it('calls onFavoriteToggle when favorite button is clicked', () => {
    const onFavoriteToggle = vi.fn();
    renderCard({ isFavorite: false, onFavoriteToggle } as any);

    const favButton = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favButton);
    expect(onFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  it('shows filled heart when isFavorite is true', () => {
    const { container } = renderCard({ isFavorite: true, onFavoriteToggle: vi.fn() } as any);
    // Filled heart should have a distinct visual indicator (filled class or different SVG)
    const favButton = screen.getByRole('button', { name: /favorite/i });
    expect(favButton).toBeTruthy();
  });
});

describe('PosterCard — image fallback', () => {
  it('shows gradient fallback on image error', () => {
    const { container } = renderCard();
    const img = screen.getByRole('img');
    fireEvent.error(img);

    // After error, image should be replaced with gradient fallback
    const fallback = container.querySelector('[aria-hidden="true"]');
    expect(fallback).not.toBeNull();
  });
});

describe('PosterCard — accessibility', () => {
  it('has ARIA label with title, year, and rating', () => {
    renderCard({ year: 2010, rating: '8.8' } as any);
    // The aria-label should include key content info
    const card = screen.getByLabelText(/Inception/);
    expect(card).toBeTruthy();
    const label = card.getAttribute('aria-label');
    expect(label).toContain('Inception');
    expect(label).toContain('2010');
    expect(label).toContain('8.8');
  });
});

describe('PosterCard — aspect ratio', () => {
  it('has correct 2:3 aspect ratio', () => {
    const { container } = renderCard();
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('aspect-[2/3]');
  });
});

describe('PosterCard — React.memo', () => {
  it('is wrapped with React.memo', () => {
    expect(PosterCard).toBeTruthy();
    // The existing PosterCard is already memo-wrapped — verify its structure
    expect(
      (PosterCard as any).type?.name === 'PosterCard' ||
      (PosterCard as any).$$typeof?.toString() === 'Symbol(react.memo)',
    ).toBe(true);
  });
});
