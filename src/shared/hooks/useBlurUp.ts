/**
 * useBlurUp — blur-up image loading transition (SRI-40)
 *
 * Tracks whether an image has loaded and returns:
 * - imgProps: { onLoad } to spread on the <img> element
 * - imgClass: opacity transition class (opacity-0 → opacity-100 on load)
 *
 * When prefers-reduced-motion is active, the image is always visible
 * (no transition) to avoid FOIC (Flash Of Invisible Content).
 *
 * Usage:
 *   const { imgLoaded, imgProps, imgClass } = useBlurUp();
 *   <img src={url} {...imgProps} className={cn('absolute inset-0 ...', imgClass)} />
 */

import { useState, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface BlurUpResult {
  /** True once the image has fired its onLoad event */
  imgLoaded: boolean;
  /** Spread these props on the <img> element */
  imgProps: {
    onLoad: () => void;
  };
  /**
   * CSS class string to apply to the <img> element.
   * Fades from opacity-0 → opacity-100 on load.
   * When reduced motion is active, always returns opacity-100 (no transition).
   */
  imgClass: string;
}

export function useBlurUp(): BlurUpResult {
  const reducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  const onLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  // When reduced motion is active: skip transition — image is always visible
  // to prevent invisible-image accessibility issue.
  const imgClass = reducedMotion
    ? "opacity-100"
    : `transition-opacity duration-300 ease-out ${imgLoaded ? "opacity-100" : "opacity-0"}`;

  return { imgLoaded, imgProps: { onLoad }, imgClass };
}
