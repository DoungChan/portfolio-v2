import { techLogos } from "@/components/icons/techLogos";

// Monogram colours for technologies without a bundled logo, picked deterministically.
const tints = ["#0a84ff", "#30b0c7", "#5e5ce6", "#ff9f0a", "#34c759", "#ff375f", "#bf5af2", "#64748b"];

function monogram(name: string) {
   const words = name
      .replace(/[^\w\s]/g, " ")
      .trim()
      .split(/\s+/);
   return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

export function TechLogo({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
   const logo = techLogos[name];
   if (logo) {
      return (
         <svg viewBox={logo.viewBox} className={`${className} text-label`} fill="currentColor" aria-hidden="true">
            {logo.body}
         </svg>
      );
   }
   const tint = tints[name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % tints.length];
   return (
      <span
         aria-hidden="true"
         className={`${className} inline-flex items-center justify-center rounded-[28%] text-[10px] font-bold text-white`}
         style={{ background: tint }}
      >
         {monogram(name)}
      </span>
   );
}
