import { useState, useEffect } from 'react';

export function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = '(pointer: coarse)';
      const media = window.matchMedia(mediaQuery);
      setIsCoarse(media.matches);

      const listener = () => setIsCoarse(media.matches);
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  return isCoarse;
}