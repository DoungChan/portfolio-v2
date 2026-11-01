import { memo } from "react";

// Vector wallpapers: rolling-hill layers in the spirit of recent macOS releases.
// Rendered as inline SVG so they stay crisp at any size and cost no image requests.

interface Layer {
   d: string;
   from: string;
   to: string;
}

interface WallpaperSpec {
   name: string;
   sky: [string, string, string];
   glow: { cx: number; cy: number; r: number; color: string };
   layers: Layer[];
}

const wallpapers = {
   sonoma: {
      name: "Sonoma Dusk",
      sky: ["#232a6b", "#8b5cc6", "#f6a38f"],
      glow: { cx: 1180, cy: 440, r: 340, color: "#ffd9b0" },
      layers: [
         { d: "M0 560C240 470 470 520 720 565S1210 610 1600 495V1000H0Z", from: "#f7b6a8", to: "#cf7cba" },
         { d: "M0 675C300 585 560 635 830 690S1310 725 1600 620V1000H0Z", from: "#b06ad6", to: "#7034c2" },
         { d: "M0 795C270 735 600 775 900 825S1400 850 1600 775V1000H0Z", from: "#5b2aa6", to: "#2a1a6b" },
         { d: "M0 905C400 860 800 905 1110 930S1460 940 1600 900V1000H0Z", from: "#22165a", to: "#100b2e" },
      ],
   },
   sequoia: {
      name: "Sequoia Blue",
      sky: ["#081538", "#1d47c4", "#6fb8ff"],
      glow: { cx: 420, cy: 360, r: 380, color: "#9fd4ff" },
      layers: [
         { d: "M0 520C320 600 620 470 900 520S1360 640 1600 560V1000H0Z", from: "#7cc2ff", to: "#3b82f6" },
         { d: "M0 650C260 590 560 700 860 670S1340 560 1600 640V1000H0Z", from: "#3b6fe6", to: "#1e40af" },
         { d: "M0 780C330 820 650 720 960 760S1400 860 1600 800V1000H0Z", from: "#1e3a8a", to: "#172554" },
         { d: "M0 900C300 870 700 940 1050 915S1450 880 1600 905V1000H0Z", from: "#111c46", to: "#070d26" },
      ],
   },
   graphite: {
      name: "Graphite",
      sky: ["#1b1b1f", "#2a2a31", "#3b3b44"],
      glow: { cx: 1100, cy: 380, r: 420, color: "#6b6b7a" },
      layers: [
         { d: "M0 590C290 520 560 570 800 600S1250 640 1600 540V1000H0Z", from: "#4a4a55", to: "#33333b" },
         { d: "M0 710C320 640 600 700 880 730S1330 740 1600 660V1000H0Z", from: "#2f2f37", to: "#232329" },
         { d: "M0 840C300 790 640 830 940 860S1420 870 1600 820V1000H0Z", from: "#1f1f25", to: "#17171b" },
      ],
   },
   meadow: {
      name: "Meadow",
      sky: ["#0f3b3a", "#2f8f83", "#bfe8c9"],
      glow: { cx: 800, cy: 420, r: 360, color: "#f4ffd9" },
      layers: [
         { d: "M0 580C260 520 520 600 800 590S1280 500 1600 570V1000H0Z", from: "#9bd9a7", to: "#4fae8a" },
         { d: "M0 700C340 650 620 730 900 715S1380 640 1600 700V1000H0Z", from: "#3f9a7a", to: "#1f6b5c" },
         { d: "M0 830C280 780 620 850 950 840S1400 790 1600 830V1000H0Z", from: "#1c5a4f", to: "#0f3a35" },
         { d: "M0 925C420 895 820 935 1150 925S1480 905 1600 925V1000H0Z", from: "#0d302c", to: "#071c1a" },
      ],
   },
} satisfies Record<string, WallpaperSpec>;

export type WallpaperId = keyof typeof wallpapers;
export const wallpaperIds = Object.keys(wallpapers) as WallpaperId[];
export const wallpaperName = (id: WallpaperId) => wallpapers[id].name;

function WallpaperArt({ id, className, prefix = "wp" }: { id: WallpaperId; className?: string; prefix?: string }) {
   const w: WallpaperSpec = wallpapers[id];
   const p = `${prefix}-${id}`;
   return (
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
         <defs>
            <linearGradient id={`${p}-sky`} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0" stopColor={w.sky[0]} />
               <stop offset="0.55" stopColor={w.sky[1]} />
               <stop offset="1" stopColor={w.sky[2]} />
            </linearGradient>
            <radialGradient id={`${p}-glow`}>
               <stop offset="0" stopColor={w.glow.color} stopOpacity="0.55" />
               <stop offset="1" stopColor={w.glow.color} stopOpacity="0" />
            </radialGradient>
            {w.layers.map((l, i) => (
               <linearGradient key={i} id={`${p}-l${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={l.from} />
                  <stop offset="1" stopColor={l.to} />
               </linearGradient>
            ))}
         </defs>
         <rect width="1600" height="1000" fill={`url(#${p}-sky)`} />
         <circle cx={w.glow.cx} cy={w.glow.cy} r={w.glow.r} fill={`url(#${p}-glow)`} />
         {w.layers.map((l, i) => (
            <path key={i} d={l.d} fill={`url(#${p}-l${i})`} />
         ))}
      </svg>
   );
}

/** Full-screen wallpaper. Cross-fades when the selection changes. */
export const Wallpaper = memo(function Wallpaper({ id }: { id: WallpaperId }) {
   return (
      <div className="absolute inset-0 overflow-hidden bg-[#141428]" aria-hidden="true">
         {wallpaperIds.map((wid) => (
            <WallpaperArt
               key={wid}
               id={wid}
               className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                  wid === id ? "opacity-100" : "opacity-0"
               }`}
            />
         ))}
      </div>
   );
});

/** Small preview used in Settings and Control Center. */
export function WallpaperThumb({ id, className }: { id: WallpaperId; className?: string }) {
   return <WallpaperArt id={id} className={className} prefix="thumb" />;
}
