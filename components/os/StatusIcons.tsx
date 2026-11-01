"use client";
import { useEffect, useState } from "react";

// Status-area glyphs drawn to match the menu bar's 14–16px icon grid.

export function WifiIcon({ off = false }: { off?: boolean }) {
   return (
      <svg viewBox="0 0 20 14" className="h-[13px] w-[18px]" fill="currentColor" aria-hidden="true">
         <g opacity={off ? 0.35 : 1}>
            <path d="M10 2.2c2.9 0 5.6 1.1 7.6 3.1.3.3.8.3 1.1 0l.2-.2c.3-.3.3-.8 0-1.1C16.6 1.6 13.4.3 10 .3S3.4 1.6 1.1 4c-.3.3-.3.8 0 1.1l.2.2c.3.3.8.3 1.1 0 2-2 4.7-3.1 7.6-3.1Z" />
            <path d="M10 6.1c1.9 0 3.6.7 5 1.9.3.3.8.3 1.1 0l.2-.2c.3-.3.3-.8 0-1.1C14.6 5 12.4 4.2 10 4.2S5.4 5 3.7 6.7c-.3.3-.3.8 0 1.1l.2.2c.3.3.8.3 1.1 0 1.4-1.2 3.1-1.9 5-1.9Z" />
            <path d="M10 9.9c.9 0 1.7.3 2.4.9.3.3.8.3 1.1 0l.2-.2c.3-.3.3-.8 0-1.1-1-1-2.3-1.5-3.7-1.5s-2.7.5-3.7 1.5c-.3.3-.3.8 0 1.1l.2.2c.3.3.8.3 1.1 0 .7-.6 1.5-.9 2.4-.9Z" />
            <circle cx="10" cy="12.6" r="1.3" />
         </g>
         {off && <path d="M2 1 18 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
      </svg>
   );
}

export function ControlCenterIcon() {
   return (
      <svg
         viewBox="0 0 18 14"
         className="h-[13px] w-[16px]"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.5"
         aria-hidden="true"
      >
         <rect x="1" y="1" width="16" height="5" rx="2.5" />
         <circle cx="13.5" cy="3.5" r="1.4" fill="currentColor" stroke="none" />
         <rect x="1" y="8" width="16" height="5" rx="2.5" />
         <circle cx="4.5" cy="10.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
   );
}

export function SearchIcon({ className = "h-[13px] w-[13px]" }: { className?: string }) {
   return (
      <svg
         viewBox="0 0 16 16"
         className={className}
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinecap="round"
         aria-hidden="true"
      >
         <circle cx="6.8" cy="6.8" r="5.2" />
         <path d="m10.8 10.8 4 4" />
      </svg>
   );
}

interface BatteryManagerLike extends EventTarget {
   level: number;
   charging: boolean;
}

/** Real battery level via the Battery Status API; renders nothing where it's unsupported. */
export function Battery() {
   const [state, setState] = useState<{ level: number; charging: boolean } | null>(null);

   useEffect(() => {
      const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> };
      if (!nav.getBattery) return;
      let battery: BatteryManagerLike | null = null;
      const sync = () => battery && setState({ level: battery.level, charging: battery.charging });
      nav.getBattery()
         .then((b) => {
            battery = b;
            sync();
            b.addEventListener("levelchange", sync);
            b.addEventListener("chargingchange", sync);
         })
         .catch(() => {});
      return () => {
         battery?.removeEventListener("levelchange", sync);
         battery?.removeEventListener("chargingchange", sync);
      };
   }, []);

   if (!state) return null;
   const pct = Math.round(state.level * 100);
   return (
      <span
         className="hidden items-center gap-1 sm:flex"
         title={`Battery ${pct}%${state.charging ? ", charging" : ""}`}
         aria-label={`Battery ${pct}%${state.charging ? ", charging" : ""}`}
      >
         <span className="text-[12px] tabular-nums">{pct}%</span>
         <svg viewBox="0 0 26 12" className="h-[12px] w-[25px]" aria-hidden="true">
            <rect
               x="0.75"
               y="0.75"
               width="21.5"
               height="10.5"
               rx="3"
               fill="none"
               stroke="currentColor"
               strokeOpacity="0.5"
               strokeWidth="1.2"
            />
            <rect x="23.4" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" fillOpacity="0.5" />
            <rect
               x="2.3"
               y="2.3"
               width={Math.max(1.5, 18.4 * state.level)}
               height="7.4"
               rx="1.6"
               fill={state.level <= 0.2 && !state.charging ? "#ff453a" : "currentColor"}
            />
            {state.charging && <path d="M12.6 1.8 8.8 6.6h2.6L10 10.2l4-4.9h-2.6Z" fill="#000" fillOpacity="0.6" />}
         </svg>
      </span>
   );
}

export function useOnline() {
   const [online, setOnline] = useState(true);
   useEffect(() => {
      setOnline(navigator.onLine);
      const on = () => setOnline(true);
      const off = () => setOnline(false);
      window.addEventListener("online", on);
      window.addEventListener("offline", off);
      return () => {
         window.removeEventListener("online", on);
         window.removeEventListener("offline", off);
      };
   }, []);
   return online;
}

export function Clock() {
   const [now, setNow] = useState<Date | null>(null);

   useEffect(() => {
      setNow(new Date());
      let interval: ReturnType<typeof setInterval>;
      // Align ticks to the start of each minute.
      const timeout = setTimeout(
         () => {
            setNow(new Date());
            interval = setInterval(() => setNow(new Date()), 60_000);
         },
         60_000 - (Date.now() % 60_000),
      );
      return () => {
         clearTimeout(timeout);
         clearInterval(interval);
      };
   }, []);

   if (!now) return <span className="w-12 sm:w-[120px]" />;
   const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
   const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
   return (
      <time dateTime={now.toISOString()} className="whitespace-nowrap tabular-nums">
         <span className="hidden sm:inline">{date.replace(",", "")}&nbsp;&nbsp;</span>
         {time}
      </time>
   );
}
