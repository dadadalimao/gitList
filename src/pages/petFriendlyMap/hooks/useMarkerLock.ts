import { useRef, useCallback } from 'react';

export default function useMarkerLock(defaultDuration = 2000) {
  const markerLock = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const lockMarker = useCallback((duration?: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    markerLock.current = true;
    timerRef.current = setTimeout(() => {
      markerLock.current = false;
    }, duration || defaultDuration);
  }, [defaultDuration]);

  return {
    isLocked: () => markerLock.current,
    lockMarker,
  };
}
