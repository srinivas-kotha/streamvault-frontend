import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroBanner, type HeroBannerProps } from '../HeroBanner';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultProps: HeroBannerProps = {
  title: 'Stranger Things',
  description: 'When a young boy vanishes, a small town uncovers a mystery.',
  imageUrl: 'https://example.com/stranger-things-hero.jpg',
  genres: ['Sci-Fi', 'Horror', 'Drama'],
  rating: '8.7',
  onPlay: vi.fn(),
};

function renderBanner(overrides?: Partial<HeroBannerProps>) {
  return render(<HeroBanner {...defaultProps} {...overrides} />);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('HeroBanner — rendering', () => {
  it('renders featured content title', () => {
    renderBanner();
    expect(screen.getByText('Stranger Things')).toBeTruthy();
  });

  it('renders description text', () => {
    renderBanner();
    expect(screen.getByText(/When a young boy vanishes/)).toBeTruthy();
  });

  it('renders genre badges', () => {
    renderBanner();
    expect(screen.getByText('Sci-Fi')).toBeTruthy();
    expect(screen.getByText('Horror')).toBeTruthy();
    expect(screen.getByText('Drama')).toBeTruthy();
  });

  it('renders rating', () => {
    renderBanner();
    expect(screen.getByText('8.7')).toBeTruthy();
  });
});

describe('HeroBanner — CTA button', () => {
  it('renders a CTA button (Play/Watch Now)', () => {
    renderBanner();
    const cta = screen.getByRole('button', { name: /play|watch now/i });
    expect(cta).toBeTruthy();
  });

  it('calls onPlay when CTA button is clicked', () => {
    const onPlay = vi.fn();
    renderBanner({ onPlay });
    const cta = screen.getByRole('button', { name: /play|watch now/i });
    fireEvent.click(cta);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});

describe('HeroBanner — image loading', () => {
  it('hero image uses loading="eager" for fast LCP', () => {
    renderBanner();
    const img = screen.getByRole('img');
    expect(img.getAttribute('loading')).toBe('eager');
  });

  it('hero image uses fetchpriority="high"', () => {
    renderBanner();
    const img = screen.getByRole('img');
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });
});

describe('HeroBanner — gradient overlay', () => {
  it('renders a gradient overlay for text readability', () => {
    const { container } = renderBanner();
    // Gradient overlay should exist as an aria-hidden decorative element
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
  });
});

describe('HeroBanner — loading state', () => {
  it('renders skeleton when loading', () => {
    const { container } = renderBanner({ isLoading: true } as any);
    // Skeleton should have animate-pulse or a skeleton-specific class/testid
    const skeleton = container.querySelector('[data-testid="hero-skeleton"]') ||
                     container.querySelector('.animate-pulse');
    expect(skeleton).not.toBeNull();
  });
});

describe('HeroBanner — accessibility', () => {
  it('has ARIA landmark (banner or region)', () => {
    renderBanner();
    const landmark = screen.getByRole('banner') || screen.getByRole('region');
    expect(landmark).toBeTruthy();
  });
});
