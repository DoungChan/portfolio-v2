import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
   faBriefcase,
   faCompass,
   faEnvelope,
   faFilePdf,
   faGear,
   faLayerGroup,
   faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useId } from "react";
import type { AppId } from "@/lib/apps";

export type IconId = AppId | "github" | "folder" | "document";

interface IconSpec {
   background: string;
   glyph?: IconDefinition;
   glyphClass?: string;
}

const specs: Record<Exclude<IconId, "finder" | "terminal" | "folder" | "document">, IconSpec> = {
   safari: {
      background: "linear-gradient(180deg,#ffffff 0%,#e6ecf3 100%)",
      glyph: faCompass,
      glyphClass: "text-[#1a8cff]",
   },
   projects: {
      background: "linear-gradient(180deg,#ffcf5a 0%,#ff9f0a 100%)",
      glyph: faFolderOpen,
      glyphClass: "text-white",
   },
   skills: {
      background: "linear-gradient(180deg,#b88cff 0%,#7a3df0 100%)",
      glyph: faLayerGroup,
      glyphClass: "text-white",
   },
   experience: {
      background: "linear-gradient(180deg,#4fe0b6 0%,#14a37f 100%)",
      glyph: faBriefcase,
      glyphClass: "text-white",
   },
   mail: {
      background: "linear-gradient(180deg,#5ac8ff 0%,#0a6cff 100%)",
      glyph: faEnvelope,
      glyphClass: "text-white",
   },
   settings: {
      background: "linear-gradient(180deg,#a7a7ae 0%,#6c6c74 100%)",
      glyph: faGear,
      glyphClass: "text-[#ececf0]",
   },
   preview: {
      background: "linear-gradient(180deg,#ffffff 0%,#dfe3ea 100%)",
      glyph: faFilePdf,
      glyphClass: "text-[#e5483f]",
   },
   github: {
      background: "linear-gradient(180deg,#3a3f47 0%,#161a1f 100%)",
      glyph: faGithub,
      glyphClass: "text-white",
   },
};

// Gradient ids must be unique per instance: a copy inside a display:none subtree
// (e.g. the phone home grid on desktop) would otherwise break every other icon.
function useSvgId() {
   return useId().replace(/:/g, "");
}

function FinderGlyph() {
   const id = useSvgId();
   return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
         <defs>
            <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0" stopColor="#6ad0ff" />
               <stop offset="1" stopColor="#1a7cf5" />
            </linearGradient>
            <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0" stopColor="#f4f8fc" />
               <stop offset="1" stopColor="#d5dfea" />
            </linearGradient>
         </defs>
         <rect width="100" height="100" fill={`url(#${id}r)`} />
         <path d="M0 0H56C50 22 47 40 47 58H54C54 72 56 86 59 100H0Z" fill={`url(#${id}l)`} />
         <g fill="none" stroke="#10243f" strokeWidth="4.5" strokeLinecap="round">
            <path d="M30 32V44" />
            <path d="M70 32V44" />
            <path d="M24 68C38 79 62 79 76 68" />
         </g>
      </svg>
   );
}

function TerminalGlyph() {
   return (
      <div
         className="flex h-full w-full items-start p-[16%]"
         style={{ background: "linear-gradient(180deg,#3b3b3f 0%,#141416 100%)" }}
      >
         <span className="font-mono text-[34cqw] font-semibold leading-none text-[#e8e8ea]">&gt;_</span>
      </div>
   );
}

function FolderGlyph() {
   const id = useSvgId();
   return (
      <svg viewBox="0 0 100 80" className="h-full w-full drop-shadow-sm">
         <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0" stopColor="#7cc7ff" />
               <stop offset="1" stopColor="#3d9cf0" />
            </linearGradient>
         </defs>
         <path d="M6 10a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v6H6Z" fill="#2f86d8" />
         <rect x="4" y="18" width="92" height="58" rx="6" fill={`url(#${id})`} />
         <rect x="4" y="18" width="92" height="2" fill="#ffffff" opacity="0.35" />
      </svg>
   );
}

function DocumentGlyph() {
   return (
      <svg viewBox="0 0 80 100" className="h-full w-full drop-shadow-sm">
         <path d="M8 4h44l20 20v70a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" fill="#fff" />
         <path d="M52 4v16a4 4 0 0 0 4 4h16Z" fill="#d9dde3" />
         <g fill="#c7ccd4">
            <rect x="14" y="38" width="44" height="4" rx="2" />
            <rect x="14" y="48" width="52" height="4" rx="2" />
            <rect x="14" y="58" width="48" height="4" rx="2" />
         </g>
         <rect x="14" y="74" width="26" height="12" rx="3" fill="#ff3b30" />
         <text x="27" y="83.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="system-ui">
            PDF
         </text>
      </svg>
   );
}

/**
 * App icon in the macOS squircle style. Scales with its container
 * (container query units size the glyphs), so callers only set width/height.
 */
export function AppIcon({ id, className = "" }: { id: IconId; className?: string }) {
   if (id === "folder")
      return (
         <div className={className}>
            <FolderGlyph />
         </div>
      );
   if (id === "document")
      return (
         <div className={className}>
            <DocumentGlyph />
         </div>
      );

   return (
      <div className={`relative overflow-hidden rounded-icon shadow-icon [container-type:inline-size] ${className}`}>
         {id === "finder" ? (
            <FinderGlyph />
         ) : id === "terminal" ? (
            <TerminalGlyph />
         ) : (
            <div
               className="flex h-full w-full items-center justify-center"
               style={{ background: specs[id].background }}
            >
               <FontAwesomeIcon icon={specs[id].glyph!} className={`!h-[52%] !w-[52%] ${specs[id].glyphClass}`} />
            </div>
         )}
         {/* Subtle top highlight and inner edge for depth. */}
         <div className="pointer-events-none absolute inset-0 rounded-icon ring-1 ring-inset ring-black/10 [background:linear-gradient(180deg,rgba(255,255,255,0.22),transparent_45%)]" />
      </div>
   );
}
