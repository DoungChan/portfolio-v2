"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faWandMagicSparkles, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { useSettings } from "./SettingsProvider";
import { WallpaperThumb, wallpaperIds, wallpaperName } from "./Wallpaper";
import { useWindowManager } from "./WindowManager";
import { WifiIcon, useOnline } from "./StatusIcons";

function Tile({
   active,
   onClick,
   icon,
   title,
   subtitle,
}: {
   active: boolean;
   onClick: () => void;
   icon: React.ReactNode;
   title: string;
   subtitle: string;
}) {
   return (
      <button
         type="button"
         role="switch"
         aria-checked={active}
         onClick={onClick}
         className="focus-ring flex items-center gap-2.5 rounded-xl bg-separator/[0.06] p-2.5 text-left transition-colors hover:bg-separator/10"
      >
         <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] transition-colors ${
               active ? "bg-accent text-white" : "bg-separator/15 text-label"
            }`}
         >
            {icon}
         </span>
         <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold leading-tight">{title}</span>
            <span className="block truncate text-2xs text-label-2">{subtitle}</span>
         </span>
      </button>
   );
}

export const ControlCenter = forwardRef<HTMLDivElement, { onClose: () => void }>(function ControlCenter(
   { onClose },
   ref,
) {
   const settings = useSettings();
   const { open } = useWindowManager();
   const online = useOnline();

   return (
      <motion.div
         ref={ref}
         role="dialog"
         aria-label="Control Center"
         initial={{ opacity: 0, y: -6, scale: 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         exit={{ opacity: 0, transition: { duration: 0.12 } }}
         transition={{ duration: 0.16, ease: "easeOut" }}
         className="material-thick absolute right-2 [text-shadow:none] top-[calc(var(--menubar-h)+6px)] w-[min(320px,calc(100vw-16px))] rounded-2xl border hairline p-3 text-label shadow-popover"
      >
         <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex items-center gap-2.5 rounded-xl bg-separator/[0.06] p-2.5">
               <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                     online ? "bg-accent text-white" : "bg-separator/15 text-label"
                  }`}
               >
                  <WifiIcon off={!online} />
               </span>
               <span>
                  <span className="block text-[12px] font-semibold leading-tight">Network</span>
                  <span className="block text-2xs text-label-2">{online ? "Connected" : "Offline"}</span>
               </span>
            </div>
            <Tile
               active={settings.isDark}
               onClick={() => settings.update({ appearance: settings.isDark ? "light" : "dark" })}
               icon={<FontAwesomeIcon icon={faMoon} />}
               title="Dark Mode"
               subtitle={settings.isDark ? "On" : "Off"}
            />
            <Tile
               active={settings.reduceMotion}
               onClick={() => settings.update({ motion: settings.reduceMotion ? "full" : "reduce" })}
               icon={<FontAwesomeIcon icon={faWaveSquare} />}
               title="Reduce Motion"
               subtitle={settings.reduceMotion ? "On" : "Off"}
            />
            <Tile
               active={settings.magnification}
               onClick={() => settings.update({ magnification: !settings.magnification })}
               icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
               title="Magnification"
               subtitle="Dock"
            />
            <button
               type="button"
               onClick={() => {
                  onClose();
                  open("settings");
               }}
               className="focus-ring rounded-xl bg-separator/[0.06] p-2.5 text-left text-[12px] font-semibold transition-colors hover:bg-separator/10"
            >
               System Settings…
            </button>
         </div>
         <p className="mb-2 mt-3 px-0.5 text-2xs font-semibold text-label-2">Wallpaper</p>
         <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Wallpaper">
            {wallpaperIds.map((id) => (
               <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={settings.wallpaper === id}
                  aria-label={wallpaperName(id)}
                  title={wallpaperName(id)}
                  onClick={() => settings.update({ wallpaper: id })}
                  className={`focus-ring aspect-[16/10] overflow-hidden rounded-lg ring-2 ring-offset-1 ring-offset-transparent transition ${
                     settings.wallpaper === id ? "ring-accent" : "ring-transparent hover:ring-separator/20"
                  }`}
               >
                  <WallpaperThumb id={id} className="h-full w-full" />
               </button>
            ))}
         </div>
      </motion.div>
   );
});
