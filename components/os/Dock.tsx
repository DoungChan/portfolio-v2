"use client";
import { MotionValue, motion, useAnimationControls, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { AppId, apps, dockApps, links, mobileDockApps } from "@/lib/apps";
import { useIsMobile } from "@/lib/useMediaQuery";
import { AppIcon, IconId } from "./AppIcon";
import { useSettings } from "./SettingsProvider";
import { useWindowManager } from "./WindowManager";

const BASE = 50;
const MAX = 78;
const RANGE = 140;

interface DockItemProps {
   icon: IconId;
   label: string;
   mouseX: MotionValue<number>;
   magnify: boolean;
   running?: boolean;
   /** Returns true when the click launched the app, which triggers the bounce. */
   onActivate?: () => boolean;
   href?: string;
   className?: string;
}

function DockItem({
   icon,
   label,
   mouseX,
   magnify,
   running,
   onActivate,
   href,
   className: itemClassName = "",
}: DockItemProps) {
   const ref = useRef<HTMLDivElement>(null);
   const bounce = useAnimationControls();

   const magnifyRef = useRef(magnify);
   magnifyRef.current = magnify;

   // Cosine falloff around the cursor gives the smooth macOS magnification curve.
   const target = useTransform(mouseX, (x) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!magnifyRef.current || !rect) return BASE;
      const d = Math.min(1, Math.abs(x - rect.left - rect.width / 2) / RANGE);
      return BASE + ((MAX - BASE) * (Math.cos(Math.PI * d) + 1)) / 2;
   });
   const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

   const handle = () => {
      // Launching a closed app gets the classic bounce.
      if (onActivate?.()) bounce.start({ y: [0, -18, 0, -8, 0], transition: { duration: 0.7, ease: "easeOut" } });
   };

   const iconEl = (
      <motion.div ref={ref} style={{ width: size, height: size }} animate={bounce} data-dock-app={icon}>
         <AppIcon id={icon} className="h-full w-full" />
      </motion.div>
   );

   const className =
      "group relative flex flex-col items-center outline-none focus-visible:[&>div:first-child]:ring-2 focus-visible:[&>div:first-child]:ring-white/80 focus-visible:[&>div:first-child]:rounded-icon";

   return (
      <li className={`relative flex flex-col items-center ${itemClassName}`}>
         {href ? (
            <a
               href={href}
               target="_blank"
               rel="noopener noreferrer"
               aria-label={`${label} (opens in a new tab)`}
               className={className}
            >
               {iconEl}
            </a>
         ) : (
            <button type="button" aria-label={label} onClick={handle} className={className}>
               {iconEl}
            </button>
         )}
         <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+10px)] whitespace-nowrap rounded-md border border-black/10 bg-[#f2f2f4]/90 px-2.5 py-1 text-[12px] text-[#1d1d1f] opacity-0 shadow-popover backdrop-blur-xl transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/10 dark:bg-[#2c2c30]/90 dark:text-white max-md:hidden"
         >
            {label}
         </span>
         <span
            aria-hidden="true"
            className={`mt-[3px] h-1 w-1 rounded-full bg-white/90 shadow-[0_0_2px_rgba(0,0,0,0.5)] transition-opacity ${
               running ? "opacity-100" : "opacity-0"
            }`}
         />
      </li>
   );
}

export function Dock() {
   const wm = useWindowManager();
   const { magnification, reduceMotion } = useSettings();
   const isMobile = useIsMobile();
   const mouseX = useMotionValue(Infinity);
   const magnify = magnification && !reduceMotion && !isMobile;

   // Apps without a permanent Dock slot (e.g. Preview) appear while they're open, like on macOS.
   const transient = wm.windows.map((w) => w.id).filter((id) => !dockApps.includes(id));

   const activate = (id: AppId) => {
      const launching = !wm.isOpen(id);
      wm.open(id);
      return launching;
   };

   return (
      <nav aria-label="Dock" className="pointer-events-none fixed inset-x-0 bottom-1.5 z-dock flex justify-center px-2">
         <ul
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="pointer-events-auto flex h-[66px] items-end gap-[6px] rounded-[22px] border border-white/20 bg-white/20 px-[7px] pb-[3px] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/25"
         >
            {[...dockApps, ...transient].map((id) => (
               <DockItem
                  key={id}
                  // Phones keep a shorter Dock; the rest live on the home grid.
                  className={mobileDockApps.includes(id) || transient.includes(id) ? "" : "max-md:hidden"}
                  icon={id}
                  label={apps[id].name}
                  mouseX={mouseX}
                  magnify={magnify}
                  running={wm.isOpen(id)}
                  onActivate={() => activate(id)}
               />
            ))}
            <li aria-hidden="true" className="mx-1 mb-[9px] h-[46px] w-px self-end bg-white/35" />
            <DockItem
               icon="github"
               label={links.github.name}
               mouseX={mouseX}
               magnify={magnify}
               href={links.github.href}
            />
         </ul>
      </nav>
   );
}
