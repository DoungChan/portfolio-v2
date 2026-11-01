"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke, faCircleInfo, faDisplay, faImage } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { Appearance, MotionPreference, useSettings } from "@/components/os/SettingsProvider";
import { WallpaperThumb, wallpaperIds, wallpaperName } from "@/components/os/Wallpaper";
import { Button, Card, SidebarItem } from "@/components/ui/primitives";
import { Segmented, Toggle } from "@/components/ui/Toggle";
import type { AppProps } from "./types";

const panes = [
   { id: "appearance", label: "Appearance", icon: faCircleHalfStroke, tint: "#1d1d1f" },
   { id: "wallpaper", label: "Wallpaper", icon: faImage, tint: "#30b0c7" },
   { id: "dock", label: "Desktop & Dock", icon: faDisplay, tint: "#0a84ff" },
   { id: "about", label: "About", icon: faCircleInfo, tint: "#8e8e93" },
] as const;

type PaneId = (typeof panes)[number]["id"];
const isPane = (s?: string): s is PaneId => panes.some((p) => p.id === s);

function Row({ title, detail, children }: { title: string; detail?: string; children: React.ReactNode }) {
   return (
      <div className="flex items-center justify-between gap-4 px-4 py-3">
         <div className="min-w-0">
            <p className="text-sm2 text-label">{title}</p>
            {detail && <p className="text-2xs text-label-3">{detail}</p>}
         </div>
         {children}
      </div>
   );
}

const appearanceOptions: { value: Appearance; label: string; preview: string }[] = [
   { value: "auto", label: "Auto", preview: "linear-gradient(135deg,#f5f5f7 50%,#1e1e20 50%)" },
   { value: "light", label: "Light", preview: "#f5f5f7" },
   { value: "dark", label: "Dark", preview: "#1e1e20" },
];

export default function Settings({ payload, payloadVersion }: AppProps) {
   const s = useSettings();
   const requested = payload?.section;
   const [pane, setPane] = useState<PaneId>(isPane(requested) ? requested : "appearance");

   useEffect(() => {
      if (payloadVersion > 0 && isPane(requested)) setPane(requested);
   }, [payloadVersion, requested]);

   const current = panes.find((p) => p.id === pane)!;

   return (
      <div className="flex h-full flex-col md:flex-row">
         <nav
            aria-label="Settings"
            className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b hairline bg-surface-2/70 p-2 md:w-[200px] md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-2.5"
         >
            {panes.map((p) => (
               <div key={p.id} className="shrink-0 md:shrink">
                  <SidebarItem
                     active={pane === p.id}
                     onClick={() => setPane(p.id)}
                     icon={
                        <span
                           className="flex h-5 w-5 items-center justify-center rounded-[5px] text-white"
                           style={{ background: p.tint }}
                        >
                           <FontAwesomeIcon icon={p.icon} className="!h-3 !w-3" />
                        </span>
                     }
                  >
                     {p.label}
                  </SidebarItem>
               </div>
            ))}
         </nav>

         <div className="mac-scroll min-h-0 flex-1 overflow-y-auto bg-surface-2/40 p-5 md:p-6">
            <h2 className="mb-4 text-[17px] font-semibold text-label">{current.label}</h2>

            {pane === "appearance" && (
               <Card className="!p-4">
                  <p className="mb-3 text-sm2 text-label">Appearance</p>
                  <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Appearance">
                     {appearanceOptions.map((o) => (
                        <button
                           key={o.value}
                           type="button"
                           role="radio"
                           aria-checked={s.appearance === o.value}
                           onClick={() => s.update({ appearance: o.value })}
                           className="focus-ring flex flex-col items-center gap-1.5 rounded-lg"
                        >
                           <span
                              className={`h-[52px] w-[76px] rounded-lg border-[3px] shadow-sm transition-colors ${
                                 s.appearance === o.value
                                    ? "border-accent"
                                    : "border-transparent ring-1 ring-separator/15"
                              }`}
                              style={{ background: o.preview }}
                           />
                           <span
                              className={`text-2xs ${s.appearance === o.value ? "font-semibold text-label" : "text-label-2"}`}
                           >
                              {o.label}
                           </span>
                        </button>
                     ))}
                  </div>
                  <p className="mt-3 text-2xs text-label-3">Auto follows your system&apos;s light or dark setting.</p>
               </Card>
            )}

            {pane === "wallpaper" && (
               <div
                  className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]"
                  role="radiogroup"
                  aria-label="Wallpaper"
               >
                  {wallpaperIds.map((id) => (
                     <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={s.wallpaper === id}
                        onClick={() => s.update({ wallpaper: id })}
                        className="focus-ring group flex flex-col gap-1.5 rounded-xl text-left"
                     >
                        <span
                           className={`block aspect-[16/10] w-full overflow-hidden rounded-xl border-[3px] transition-colors ${
                              s.wallpaper === id ? "border-accent" : "border-transparent"
                           }`}
                        >
                           <WallpaperThumb
                              id={id}
                              className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                           />
                        </span>
                        <span
                           className={`px-1 text-2xs ${s.wallpaper === id ? "font-semibold text-label" : "text-label-2"}`}
                        >
                           {wallpaperName(id)}
                        </span>
                     </button>
                  ))}
               </div>
            )}

            {pane === "dock" && (
               <Card className="divide-y divide-separator/[0.08] !p-0">
                  <Row title="Magnification" detail="Enlarge Dock icons under the pointer">
                     <Toggle
                        label="Magnification"
                        checked={s.magnification}
                        onChange={(v) => s.update({ magnification: v })}
                     />
                  </Row>
                  <Row title="Motion" detail="System follows your device's Reduce Motion setting">
                     <Segmented<MotionPreference>
                        label="Motion"
                        value={s.motion}
                        onChange={(v) => s.update({ motion: v })}
                        options={[
                           { value: "system", label: "System" },
                           { value: "reduce", label: "Reduced" },
                           { value: "full", label: "Full" },
                        ]}
                     />
                  </Row>
               </Card>
            )}

            {pane === "about" && (
               <Card className="text-center">
                  <p className="text-[15px] font-semibold text-label">{profile.name}&apos;s Portfolio</p>
                  <p className="mt-0.5 text-2xs text-label-2">Version 3.0 · macOS-inspired edition</p>
                  <dl className="mx-auto mt-4 grid max-w-xs grid-cols-2 gap-x-4 gap-y-1.5 text-left text-sm2">
                     <dt className="text-right text-label-2">Built with</dt>
                     <dd className="text-label">Next.js, React, Tailwind</dd>
                     <dt className="text-right text-label-2">Animation</dt>
                     <dd className="text-label">Framer Motion</dd>
                     <dt className="text-right text-label-2">Projects</dt>
                     <dd className="text-label">{projects.length}</dd>
                     <dt className="text-right text-label-2">Shortcut</dt>
                     <dd className="text-label">⌘K / Ctrl K to search</dd>
                  </dl>
                  <Button className="mt-5" onClick={s.reset}>
                     Restore Defaults
                  </Button>
               </Card>
            )}
         </div>
      </div>
   );
}
