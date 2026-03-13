import { useState, useRef, useEffect, useCallback } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  aspectRatio?: 'square' | 'poster' | 'landscape';
}

const aspectClasses = {
  square: 'aspect-square',
  poster: 'aspect-[2/3]',
  landscape: 'aspect-video',
};

type LoadState = 'placeholder' | 'loading' | 'loaded' | 'error';

export function LazyImage({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  aspectRatio = 'poster',
}: LazyImageProps) {
  const [state, setState] = useState<LoadState>(!src ? 'error' : 'placeholder');
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setState('error');
      return;
    }

    // Reset to placeholder when src changes
    setState('placeholder');

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setState('loading');
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  const handleLoad = useCallback(() => {
    setState('loaded');
  }, []);

  const handleError = useCallback(() => {
    setState('error');
  }, []);

  const showImage = state === 'loading' || state === 'loaded';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Gradient placeholder / fallback */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-surface-raised to-surface ${fallbackClassName}`}
      />

      {/* Placeholder icon */}
      {state === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted/30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Image element */}
      {showImage && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
