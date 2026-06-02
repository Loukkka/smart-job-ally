import { useCallback, useEffect, useRef } from "react";

// Renvoie une fonction stable dont l'identité ne change jamais, tout en
// appelant toujours la dernière version du callback fourni. Évite de
// redéclencher les effets qui en dépendent.
export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T): T {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => ref.current(...args)) as T, []);
}
