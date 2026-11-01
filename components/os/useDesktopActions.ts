"use client";
import { useMemo } from "react";
import { profile } from "@/data/profile";
import { useSettings } from "./SettingsProvider";
import { useShell } from "./ShellContext";
import { useWindowManager } from "./WindowManager";

/** Commands shared by the menu bar, context menu and Spotlight. */
export function useDesktopActions() {
   const { notify, setSpotlightOpen } = useShell();
   const { update, isDark, nextWallpaper } = useSettings();
   const wm = useWindowManager();

   return useMemo(() => {
      const copy = async (text: string, title: string) => {
         try {
            await navigator.clipboard.writeText(text);
            notify(title, text);
         } catch {
            notify("Couldn't access the clipboard", text);
         }
      };
      return {
         openSpotlight: () => setSpotlightOpen(true),
         copyEmail: () => copy(profile.email, "Email address copied"),
         copyLink: () => copy(window.location.href, "Link copied"),
         toggleAppearance: () => update({ appearance: isDark ? "light" : "dark" }),
         nextWallpaper,
         showDesktop: wm.minimizeAll,
         restart: () => window.location.assign("/"),
      };
   }, [notify, setSpotlightOpen, update, isDark, nextWallpaper, wm.minimizeAll]);
}
