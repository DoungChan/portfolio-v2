"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faDownload,
   faMagnifyingGlassMinus,
   faMagnifyingGlassPlus,
   faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { A4_WIDTH, ResumeDocument } from "@/components/resume/ResumeDocument";
import { buttonClass } from "@/components/ui/primitives";

const ZOOM_STEPS = [0.5, 0.67, 0.8, 1, 1.25, 1.5];

export default function Preview() {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [fit, setFit] = useState(1);
   // null = fit to width; otherwise an explicit zoom level.
   const [zoom, setZoom] = useState<number | null>(null);

   useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      const observer = new ResizeObserver(([entry]) => {
         setFit(Math.min(1.25, (entry.contentRect.width - 32) / A4_WIDTH));
      });
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   const scale = zoom ?? fit;
   const stepZoom = (dir: 1 | -1) => {
      const next =
         dir > 0 ? ZOOM_STEPS.find((z) => z > scale + 0.01) : [...ZOOM_STEPS].reverse().find((z) => z < scale - 0.01);
      if (next) setZoom(next);
   };

   const iconBtn =
      "focus-ring flex h-7 w-7 items-center justify-center rounded-md text-label-2 hover:bg-separator/[0.06] disabled:opacity-30";

   return (
      <div className="flex h-full flex-col">
         <div className="flex h-11 shrink-0 items-center gap-2 border-b hairline bg-surface-2 px-3">
            <div className="hidden items-center gap-0.5 sm:flex">
               <button type="button" aria-label="Zoom out" onClick={() => stepZoom(-1)} disabled={scale <= ZOOM_STEPS[0]} className={iconBtn}>
                  <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="!h-3.5 !w-3.5" />
               </button>
               <button
                  type="button"
                  onClick={() => setZoom(null)}
                  title="Fit to width"
                  className="focus-ring w-12 rounded-md py-1 text-center text-2xs tabular-nums text-label-2 hover:bg-separator/[0.06]"
               >
                  {Math.round(scale * 100)}%
               </button>
               <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => stepZoom(1)}
                  disabled={scale >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
                  className={iconBtn}
               >
                  <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="!h-3.5 !w-3.5" />
               </button>
            </div>
            <div className="ml-auto flex items-center gap-2">
               <a href="/print/resume?print=1" target="_blank" rel="noopener" className={buttonClass("secondary")}>
                  <FontAwesomeIcon icon={faPrint} className="!h-3 !w-3" />
                  Print
               </a>
               <a href={profile.cv} download={profile.cvFileName} className={buttonClass("primary")}>
                  <FontAwesomeIcon icon={faDownload} className="!h-3 !w-3" />
                  Download PDF
               </a>
            </div>
         </div>

         <div ref={scrollRef} className="mac-scroll min-h-0 flex-1 overflow-auto bg-[#d9d9de] px-4 py-5 dark:bg-[#2a2a2e]">
            {/* `zoom` scales layout size too, so scrolling and centring stay correct. */}
            <div
               className="mx-auto w-fit shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
               style={{ zoom: scale }}
            >
               <ResumeDocument />
            </div>
         </div>
      </div>
   );
}
