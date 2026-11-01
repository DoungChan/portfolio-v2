"use client";
import { useEffect, useState } from "react";

/** Returns false during SSR and the first client render, then tracks the query. */
export function useMediaQuery(query: string) {
   const [matches, setMatches] = useState(false);

   useEffect(() => {
      const mql = window.matchMedia(query);
      setMatches(mql.matches);
      const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
   }, [query]);

   return matches;
}

export const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile() {
   return useMediaQuery(MOBILE_QUERY);
}
