"use client";
import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SETTINGS_STORAGE_KEY } from "@/lib/storage";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { WallpaperId, wallpaperIds } from "./Wallpaper";

export type Appearance = "auto" | "light" | "dark";
export type MotionPreference = "system" | "reduce" | "full";

export interface Settings {
   appearance: Appearance;
   wallpaper: WallpaperId;
   motion: MotionPreference;
   magnification: boolean;
}

export const defaultSettings: Settings = {
   appearance: "auto",
   wallpaper: "sonoma",
   motion: "system",
   magnification: true,
};

interface SettingsContextValue extends Settings {
   update: (patch: Partial<Settings>) => void;
   reset: () => void;
   nextWallpaper: () => void;
   isDark: boolean;
   /** Resolved from the Settings override, falling back to prefers-reduced-motion. */
   reduceMotion: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStored(): Settings {
   try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = { ...defaultSettings, ...JSON.parse(raw) } as Settings;
      if (!wallpaperIds.includes(parsed.wallpaper)) parsed.wallpaper = defaultSettings.wallpaper;
      return parsed;
   } catch {
      return defaultSettings;
   }
}

function persist(next: Settings) {
   try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
   } catch {
      // Storage may be unavailable (private mode); settings still apply for this visit.
   }
   return next;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
   const [settings, setSettings] = useState<Settings>(defaultSettings);
   const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
   const systemReduce = useMediaQuery("(prefers-reduced-motion: reduce)");

   useEffect(() => setSettings(readStored()), []);

   const isDark = settings.appearance === "dark" || (settings.appearance === "auto" && systemDark);
   const reduceMotion = settings.motion === "reduce" || (settings.motion === "system" && systemReduce);

   useEffect(() => {
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
   }, [isDark]);

   useEffect(() => {
      document.documentElement.classList.toggle("reduce-motion", reduceMotion);
   }, [reduceMotion]);

   const update = useCallback((patch: Partial<Settings>) => {
      setSettings((prev) => persist({ ...prev, ...patch }));
   }, []);

   const reset = useCallback(() => update(defaultSettings), [update]);

   const nextWallpaper = useCallback(() => {
      setSettings((prev) => {
         const i = wallpaperIds.indexOf(prev.wallpaper);
         return persist({ ...prev, wallpaper: wallpaperIds[(i + 1) % wallpaperIds.length] });
      });
   }, []);

   const value = useMemo(
      () => ({ ...settings, update, reset, nextWallpaper, isDark, reduceMotion }),
      [settings, update, reset, nextWallpaper, isDark, reduceMotion],
   );

   return (
      <SettingsContext.Provider value={value}>
         <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>{children}</MotionConfig>
      </SettingsContext.Provider>
   );
}

export function useSettings() {
   const ctx = useContext(SettingsContext);
   if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
   return ctx;
}
