"use client";
import { useEffect } from "react";

/** Opens the print dialog when the page is loaded with ?print=1. */
export function AutoPrint() {
   useEffect(() => {
      if (new URLSearchParams(window.location.search).get("print") === "1") window.print();
   }, []);
   return null;
}
