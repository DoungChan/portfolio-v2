"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { appIds, apps, links, openExternal } from "@/lib/apps";
import { ControlCenter } from "./ControlCenter";
import { MenuEntry, MenuList, separator } from "./MenuList";
import { useSettings } from "./SettingsProvider";
import { Battery, Clock, ControlCenterIcon, SearchIcon, WifiIcon, useOnline } from "./StatusIcons";
import { useDesktopActions } from "./useDesktopActions";
import { useShell } from "./ShellContext";
import { useWindowManager } from "./WindowManager";

type MenuId = "apple" | "app" | "file" | "edit" | "view" | "window" | "help";

const MOD_KEY = "⌘K";

export function MenuBar() {
   const wm = useWindowManager();
   const settings = useSettings();
   const actions = useDesktopActions();
   const { notify } = useShell();
   const online = useOnline();

   const [openMenu, setOpenMenu] = useState<MenuId | "control" | null>(null);
   const [viaKeyboard, setViaKeyboard] = useState(false);
   const barRef = useRef<HTMLDivElement>(null);

   const active = wm.activeId ? apps[wm.activeId] : null;
   const activeWindow = wm.windows.find((w) => w.id === wm.activeId);
   const appName = active?.name ?? "Finder";

   useEffect(() => {
      if (!openMenu) return;
      const onPointerDown = (e: PointerEvent) => {
         if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
      };
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKey);
      return () => {
         document.removeEventListener("pointerdown", onPointerDown);
         document.removeEventListener("keydown", onKey);
      };
   }, [openMenu]);

   const menus = useMemo((): { id: MenuId; label: string; items: MenuEntry[] }[] => {
      const noWindow = !wm.activeId;
      return [
         {
            id: "apple",
            label: "Apple menu",
            items: [
               { label: "About This Portfolio", onSelect: () => wm.open("finder") },
               separator,
               { label: "System Settings…", onSelect: () => wm.open("settings") },
               separator,
               { label: "Spotlight Search", shortcut: MOD_KEY, onSelect: actions.openSpotlight },
               separator,
               { label: "Show Desktop", onSelect: actions.showDesktop, disabled: wm.windows.length === 0 },
               { label: "Restart…", onSelect: actions.restart },
            ],
         },
         {
            id: "app",
            label: appName,
            items: [
               {
                  label: `About ${appName}`,
                  onSelect: () => notify(appName, active?.description ?? "Browse the portfolio from the desktop."),
               },
               separator,
               { label: "Settings…", onSelect: () => wm.open("settings") },
               separator,
               {
                  label: `Hide ${appName}`,
                  disabled: noWindow,
                  onSelect: () => wm.activeId && wm.minimize(wm.activeId),
               },
               { label: `Quit ${appName}`, disabled: noWindow, onSelect: () => wm.activeId && wm.close(wm.activeId) },
            ],
         },
         {
            id: "file",
            label: "File",
            items: [
               { label: "New Message", onSelect: () => wm.open("mail") },
               { label: "Open…", shortcut: MOD_KEY, onSelect: actions.openSpotlight },
               separator,
               { label: "Open Resume", onSelect: () => wm.open("preview") },
               separator,
               { label: "Close Window", disabled: noWindow, onSelect: () => wm.activeId && wm.close(wm.activeId) },
            ],
         },
         {
            id: "edit",
            label: "Edit",
            items: [
               { label: "Copy Email Address", onSelect: actions.copyEmail },
               { label: "Copy Link to This Page", onSelect: actions.copyLink },
            ],
         },
         {
            id: "view",
            label: "View",
            items: [
               {
                  label: activeWindow?.maximized ? "Exit Full Screen" : "Enter Full Screen",
                  disabled: noWindow,
                  onSelect: () => wm.activeId && wm.toggleMaximize(wm.activeId),
               },
               separator,
               { label: "Dark Appearance", checked: settings.isDark, onSelect: actions.toggleAppearance },
               { label: "Next Wallpaper", onSelect: actions.nextWallpaper },
            ],
         },
         {
            id: "window",
            label: "Window",
            items: [
               { label: "Minimize", disabled: noWindow, onSelect: () => wm.activeId && wm.minimize(wm.activeId) },
               { label: "Zoom", disabled: noWindow, onSelect: () => wm.activeId && wm.toggleMaximize(wm.activeId) },
               separator,
               { label: "Bring All to Front", disabled: wm.windows.length === 0, onSelect: wm.restoreAll },
               ...(wm.windows.length ? [separator] : []),
               ...appIds
                  .filter((id) => wm.isOpen(id))
                  .map((id) => ({
                     label: apps[id].title,
                     checked: id === wm.activeId,
                     onSelect: () => wm.focus(id),
                  })),
            ],
         },
         {
            id: "help",
            label: "Help",
            items: [
               { label: "Search Portfolio", shortcut: MOD_KEY, onSelect: actions.openSpotlight },
               { label: "Terminal Commands", onSelect: () => wm.open("terminal", { command: "help" }) },
               separator,
               { label: "Contact Me", onSelect: () => wm.open("mail") },
               { label: "GitHub Profile", onSelect: () => openExternal(links.github.href) },
            ],
         },
      ];
   }, [wm, actions, settings.isDark, appName, active, activeWindow?.maximized, notify]);

   const toggle = (id: MenuId | "control", keyboard: boolean) => {
      setViaKeyboard(keyboard);
      setOpenMenu((cur) => (cur === id ? null : id));
   };

   return (
      <header
         ref={barRef}
         className="fixed inset-x-0 top-0 z-menubar flex h-[var(--menubar-h)] select-none items-center justify-between bg-black/25 px-2 text-[13px] text-white shadow-[0_0.5px_0_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150 [text-shadow:0_0_6px_rgba(0,0,0,0.25)]"
      >
         <nav aria-label="Menu bar" className="flex h-full items-center">
            {menus.map((menu) => {
               const hiddenOnMobile = menu.id !== "apple" && menu.id !== "app";
               return (
                  <div key={menu.id} className={`relative h-full ${hiddenOnMobile ? "hidden md:block" : ""}`}>
                     <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={openMenu === menu.id}
                        aria-label={menu.id === "apple" ? "Apple menu" : undefined}
                        onClick={(e) => toggle(menu.id, e.detail === 0)}
                        onPointerEnter={() => openMenu && openMenu !== "control" && setOpenMenu(menu.id)}
                        className={`focus-ring flex h-[22px] items-center rounded-[5px] px-2.5 mt-[3px] ${
                           menu.id === "app" ? "font-semibold" : ""
                        } ${openMenu === menu.id ? "bg-white/20" : ""}`}
                     >
                        {menu.id === "apple" ? (
                           <FontAwesomeIcon icon={faApple} className="!h-[15px] !w-[15px]" />
                        ) : (
                           menu.label
                        )}
                     </button>
                     <AnimatePresence>
                        {openMenu === menu.id && (
                           <div className="absolute left-0 top-[calc(100%+1px)] [text-shadow:none]">
                              <MenuList
                                 label={menu.label}
                                 items={menu.items}
                                 autoFocus={viaKeyboard}
                                 onClose={() => setOpenMenu(null)}
                              />
                           </div>
                        )}
                     </AnimatePresence>
                  </div>
               );
            })}
         </nav>

         <div className="flex h-full items-center gap-0.5 pr-1">
            <Battery />
            <span
               className="hidden h-[22px] items-center rounded-[5px] px-2 sm:flex"
               title={online ? "Wi-Fi: Connected" : "Wi-Fi: Offline"}
               aria-label={online ? "Wi-Fi connected" : "Wi-Fi offline"}
               role="img"
            >
               <WifiIcon off={!online} />
            </span>
            <button
               type="button"
               aria-label="Spotlight Search"
               onClick={actions.openSpotlight}
               className="focus-ring flex h-[22px] items-center rounded-[5px] px-2 hover:bg-white/15"
            >
               <SearchIcon />
            </button>
            <button
               type="button"
               aria-label="Control Center"
               aria-expanded={openMenu === "control"}
               onClick={(e) => toggle("control", e.detail === 0)}
               className={`focus-ring flex h-[22px] items-center rounded-[5px] px-2 hover:bg-white/15 ${
                  openMenu === "control" ? "bg-white/20" : ""
               }`}
            >
               <ControlCenterIcon />
            </button>
            <span className="px-2">
               <Clock />
            </span>
         </div>

         <AnimatePresence>
            {openMenu === "control" && <ControlCenter onClose={() => setOpenMenu(null)} />}
         </AnimatePresence>
      </header>
   );
}
