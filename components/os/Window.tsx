"use client";
import { motion, useAnimationControls } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { apps } from "@/lib/apps";
import { WindowState, useWindowManager } from "./WindowManager";

const DOCK_CLEARANCE = 84; // Dock height + gap, kept clear by maximized windows.
const INSET = 6;
const CASCADE = 26;

// Phones get full-screen windows. Applied in CSS too (overriding inline geometry) so the
// server-rendered window is already full-screen before hydration detects a phone.
const MOBILE_GEOMETRY =
   "max-md:!left-1.5 max-md:!top-[calc(var(--menubar-h)+6px)] max-md:!w-[calc(100vw-12px)] max-md:!h-[calc(100dvh-var(--menubar-h)-90px)]";

interface WindowProps {
   win: WindowState;
   active: boolean;
   mobile: boolean;
   children: React.ReactNode;
}

/** Geometry as CSS lengths so the browser resolves viewport units and transitions between states. */
function geometry(win: WindowState, mobile: boolean): React.CSSProperties {
   if (mobile || win.maximized) {
      return {
         left: INSET,
         top: `calc(var(--menubar-h) + ${INSET}px)`,
         width: `calc(100vw - ${INSET * 2}px)`,
         height: `calc(100dvh - var(--menubar-h) - ${INSET + DOCK_CLEARANCE}px)`,
      };
   }
   const { w, h } = apps[win.id].size;
   const width = `min(${w}px, calc(100vw - 32px))`;
   const height = `min(${h}px, calc(100dvh - var(--menubar-h) - ${DOCK_CLEARANCE + 24}px))`;
   if (win.pos) return { left: win.pos.x, top: win.pos.y, width, height };
   const offset = win.cascade * CASCADE;
   return {
      left: `calc((100vw - ${width}) / 2 + ${offset}px)`,
      top: `calc(var(--menubar-h) + max(12px, (100dvh - var(--menubar-h) - ${DOCK_CLEARANCE}px - ${height}) / 2) + ${offset}px)`,
      width,
      height,
   };
}

function TrafficLights({
   id,
   active,
   mobile,
   maximized,
}: {
   id: WindowState["id"];
   active: boolean;
   mobile: boolean;
   maximized: boolean;
}) {
   const { close, minimize, toggleMaximize } = useWindowManager();
   const title = apps[id].title;
   const base =
      "focus-ring flex h-3 w-3 items-center justify-center rounded-full border border-black/10 text-[9px] font-bold leading-none text-black/0 transition-colors group-hover/lights:text-black/60";
   const off = active ? "" : "!bg-separator/20 group-hover/lights:!bg-[var(--c)]";

   return (
      <div
         className={`group/lights flex items-center gap-2 ${mobile ? "[&>button]:h-4 [&>button]:w-4" : ""}`}
         onPointerDown={(e) => e.stopPropagation()}
         onDoubleClick={(e) => e.stopPropagation()}
      >
         <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={() => close(id)}
            style={{ "--c": "#ff5f57" } as React.CSSProperties}
            className={`${base} bg-[#ff5f57] ${off}`}
         >
            <svg
               viewBox="0 0 8 8"
               className="h-[6px] w-[6px]"
               stroke="currentColor"
               strokeWidth="1.4"
               aria-hidden="true"
            >
               <path d="M1 1l6 6M7 1 1 7" />
            </svg>
         </button>
         <button
            type="button"
            aria-label={`Minimize ${title}`}
            onClick={() => minimize(id)}
            style={{ "--c": "#febc2e" } as React.CSSProperties}
            className={`${base} bg-[#febc2e] ${off}`}
         >
            <svg
               viewBox="0 0 8 8"
               className="h-[6px] w-[6px]"
               stroke="currentColor"
               strokeWidth="1.4"
               aria-hidden="true"
            >
               <path d="M1 4h6" />
            </svg>
         </button>
         {!mobile && (
            <button
               type="button"
               aria-label={`${maximized ? "Restore" : "Zoom"} ${title}`}
               onClick={() => toggleMaximize(id)}
               style={{ "--c": "#28c840" } as React.CSSProperties}
               className={`${base} bg-[#28c840] ${off}`}
            >
               <svg viewBox="0 0 8 8" className="h-[6px] w-[6px]" fill="currentColor" aria-hidden="true">
                  <path d="M1.2 1.2h4L1.2 5.2zM6.8 6.8h-4l4-4z" />
               </svg>
            </button>
         )}
      </div>
   );
}

export const Window = memo(function Window({ win, active, mobile, children }: WindowProps) {
   const { focus, move, toggleMaximize } = useWindowManager();
   const frameRef = useRef<HTMLDivElement>(null);
   const controls = useAnimationControls();
   const meta = apps[win.id];

   // Genie-style minimize: shrink toward this app's Dock icon, restore by reversing.
   useEffect(() => {
      const frame = frameRef.current;
      if (!frame) return;
      let cancelled = false;
      if (win.minimized) {
         const rect = frame.getBoundingClientRect();
         const found = document.querySelector(`[data-dock-app="${win.id}"]`)?.getBoundingClientRect();
         // Icons hidden from the phone Dock measure 0×0; fall back to the Dock's centre.
         const icon = found && found.width > 0 ? found : null;
         const tx = icon ? icon.left + icon.width / 2 : window.innerWidth / 2;
         const ty = icon ? icon.top + icon.height / 2 : window.innerHeight - 40;
         controls
            .start({
               x: tx - (rect.left + rect.width / 2),
               y: ty - (rect.top + rect.height / 2),
               scale: 0.06,
               opacity: 0,
               transition: { duration: 0.42, ease: [0.5, 0, 0.75, 0.2] },
            })
            .then(() => {
               if (!cancelled) frame.style.visibility = "hidden";
            });
      } else {
         frame.style.visibility = "";
         controls.start({
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
         });
      }
      return () => {
         cancelled = true;
      };
   }, [win.minimized, win.id, controls]);

   // Move focus into newly opened windows so keyboard users land in them,
   // unless the app already focused something of its own (child effects run first).
   useEffect(() => {
      const frame = frameRef.current;
      if (frame && !frame.contains(document.activeElement)) frame.focus({ preventScroll: true });
   }, []);

   const onTitlePointerDown = (e: React.PointerEvent) => {
      if (mobile || win.maximized || e.button !== 0) return;
      const frame = frameRef.current;
      if (!frame) return;
      const start = frame.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const menubar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 28;
      let moved = false;
      let next = { x: start.left, y: start.top };
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      frame.style.transition = "none";

      const onMove = (ev: PointerEvent) => {
         const dx = ev.clientX - startX;
         const dy = ev.clientY - startY;
         if (!moved && Math.hypot(dx, dy) < 3) return;
         moved = true;
         // Keep at least part of the title bar reachable.
         next = {
            x: Math.min(window.innerWidth - 80, Math.max(80 - start.width, start.left + dx)),
            y: Math.min(window.innerHeight - 60, Math.max(menubar, start.top + dy)),
         };
         frame.style.left = `${next.x}px`;
         frame.style.top = `${next.y}px`;
      };
      const onUp = () => {
         target.removeEventListener("pointermove", onMove);
         target.removeEventListener("pointerup", onUp);
         target.removeEventListener("pointercancel", onUp);
         frame.style.transition = "";
         if (moved) move(win.id, next);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
   };

   return (
      <motion.section
         ref={frameRef}
         role="dialog"
         aria-modal="false"
         aria-label={meta.title}
         aria-hidden={win.minimized || undefined}
         tabIndex={-1}
         initial={{ opacity: 0, scale: 0.94, y: 10 }}
         animate={controls}
         exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16, ease: "easeIn" } }}
         onPointerDownCapture={() => focus(win.id)}
         onFocusCapture={() => !win.minimized && focus(win.id)}
         style={{ ...geometry(win, mobile), zIndex: win.z }}
         className={`absolute flex flex-col overflow-hidden rounded-window border border-black/10 bg-surface outline-none transition-[left,top,width,height,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] dark:border-white/10 ${MOBILE_GEOMETRY} ${
            active ? "shadow-window" : "shadow-window-inactive"
         } ${win.minimized ? "pointer-events-none" : ""}`}
      >
         <div
            onPointerDown={onTitlePointerDown}
            onDoubleClick={() => !mobile && toggleMaximize(win.id)}
            className={`relative flex h-[38px] shrink-0 select-none items-center border-b hairline bg-surface-2 px-3.5 ${
               mobile || win.maximized ? "" : "cursor-default touch-none"
            }`}
         >
            <TrafficLights id={win.id} active={active} mobile={mobile} maximized={win.maximized} />
            <h2
               className={`pointer-events-none absolute inset-x-24 truncate text-center text-sm2 font-semibold ${
                  active ? "text-label" : "text-label-3"
               }`}
            >
               {meta.title}
            </h2>
         </div>
         <div className="relative min-h-0 flex-1">{children}</div>
      </motion.section>
   );
});
