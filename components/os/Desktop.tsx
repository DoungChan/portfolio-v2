"use client";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";
import { AppId, appForPath } from "@/lib/apps";
import { useIsMobile } from "@/lib/useMediaQuery";
import type { AppProps } from "@/components/apps/types";
import { DesktopIcons, MobileHome } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { MenuList, separator } from "./MenuList";
import { SettingsProvider, useSettings } from "./SettingsProvider";
import { ShellProvider, useShell } from "./ShellContext";
import { Spotlight } from "./Spotlight";
import { Wallpaper } from "./Wallpaper";
import { Window } from "./Window";
import { WindowManagerProvider, useWindowManager } from "./WindowManager";
import { useDesktopActions } from "./useDesktopActions";

// Font Awesome's stylesheet is imported in the root layout; don't inject a second copy.
faConfig.autoAddCss = false;

// Each app is its own chunk. They still render on the server, so the app a route
// opens with is in the initial HTML for SEO.
const AppLoading = () => <div className="h-full w-full bg-surface" />;
const appComponents: Record<AppId, ComponentType<AppProps>> = {
   finder: dynamic(() => import("@/components/apps/Finder"), { loading: AppLoading }),
   safari: dynamic(() => import("@/components/apps/Safari"), { loading: AppLoading }),
   terminal: dynamic(() => import("@/components/apps/Terminal"), { loading: AppLoading }),
   projects: dynamic(() => import("@/components/apps/Projects"), { loading: AppLoading }),
   skills: dynamic(() => import("@/components/apps/Skills"), { loading: AppLoading }),
   experience: dynamic(() => import("@/components/apps/Experience"), { loading: AppLoading }),
   mail: dynamic(() => import("@/components/apps/Mail"), { loading: AppLoading }),
   settings: dynamic(() => import("@/components/apps/Settings"), { loading: AppLoading }),
   preview: dynamic(() => import("@/components/apps/Preview"), { loading: AppLoading }),
};

function DesktopShell() {
   const wm = useWindowManager();
   const { wallpaper } = useSettings();
   const { spotlightOpen, setSpotlightOpen } = useShell();
   const actions = useDesktopActions();
   const isMobile = useIsMobile();
   const [selected, setSelected] = useState<string | null>(null);
   const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

   useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setContextMenu(null);
            setSpotlightOpen(!spotlightOpen);
         }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [spotlightOpen, setSpotlightOpen]);

   const onContextMenu = (e: React.MouseEvent) => {
      if (isMobile) return;
      e.preventDefault();
      // Keep the menu on screen near the right and bottom edges.
      setContextMenu({
         x: Math.min(e.clientX, window.innerWidth - 240),
         y: Math.min(e.clientY, window.innerHeight - 260),
      });
   };

   return (
      <div className="fixed inset-0 select-none overflow-hidden font-sans">
         <Wallpaper id={wallpaper} />

         <main
            id="desktop"
            className="absolute inset-0"
            onPointerDown={() => setSelected(null)}
            onContextMenu={onContextMenu}
         >
            <h1 className="sr-only">Sroeun Doungchan — Front-end Developer Portfolio</h1>
            <div className="hidden md:block">
               <DesktopIcons selected={selected} onSelect={setSelected} />
            </div>
            <div className="md:hidden">
               <MobileHome />
            </div>
         </main>

         <AnimatePresence>
            {wm.windows.map((win) => {
               const App = appComponents[win.id];
               return (
                  <Window key={win.id} win={win} active={win.id === wm.activeId} mobile={isMobile}>
                     <App payload={win.payload} payloadVersion={win.payloadVersion} />
                  </Window>
               );
            })}
         </AnimatePresence>

         <Dock />
         <MenuBar />
         <Spotlight />

         <AnimatePresence>
            {contextMenu && (
               <div
                  className="fixed inset-0 z-popover"
                  onPointerDown={() => setContextMenu(null)}
                  onContextMenu={(e) => {
                     e.preventDefault();
                     setContextMenu(null);
                  }}
               >
                  <div
                     className="absolute"
                     style={{ left: contextMenu.x, top: contextMenu.y }}
                     onPointerDown={(e) => e.stopPropagation()}
                  >
                     <MenuList
                        label="Desktop"
                        onClose={() => setContextMenu(null)}
                        items={[
                           { label: "Spotlight Search", shortcut: "⌘K", onSelect: actions.openSpotlight },
                           separator,
                           { label: "Next Wallpaper", onSelect: actions.nextWallpaper },
                           {
                              label: "Change Wallpaper…",
                              onSelect: () => wm.open("settings", { section: "wallpaper" }),
                           },
                           separator,
                           { label: "Show Desktop", disabled: wm.windows.length === 0, onSelect: wm.minimizeAll },
                           { label: "Close All Windows", disabled: wm.windows.length === 0, onSelect: wm.closeAll },
                           separator,
                           { label: "Open Resume", onSelect: () => wm.open("preview") },
                           { label: "Copy Email Address", onSelect: actions.copyEmail },
                        ]}
                     />
                  </div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}

export function Desktop() {
   const pathname = usePathname();
   // The home route greets visitors with the About window.
   const initialApp = appForPath(pathname) ?? "finder";

   return (
      <SettingsProvider>
         <WindowManagerProvider initialApp={initialApp}>
            <ShellProvider>
               <DesktopShell />
            </ShellProvider>
         </WindowManagerProvider>
      </SettingsProvider>
   );
}
