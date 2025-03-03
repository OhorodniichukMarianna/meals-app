import { useCallback, useEffect, useRef } from 'react';

type Callback = (...args: any[]) => void;

function useDebouncedCallback<F extends Callback>(callback: F, delay: number): F {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  ) as F;
}

export default useDebouncedCallback;
