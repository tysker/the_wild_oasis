import { useEffect, useRef } from 'react';

export function useOutsideMouseClick(handler: () => void, isCapturingDown: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler();
        }
      }

      document.addEventListener('click', handleClick, isCapturingDown);

      return () => document.removeEventListener('click', handleClick, isCapturingDown);
    },
    [handler, isCapturingDown],
  );

  return ref;
}
