"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { AppId, apps } from "@/lib/apps";
import { profile } from "@/data/profile";

/** Optional data an app can be opened with, e.g. a project to show or a command to run. */
export type AppPayload = Record<string, string | undefined>;

export interface WindowState {
   id: AppId;
   z: number;
   minimized: boolean;
   maximized: boolean;
   /** Top-left in px relative to the desktop. Undefined until measured, which centers it. */
   pos?: { x: number; y: number };
   /** Stagger index for newly opened windows. */
   cascade: number;
   payload?: AppPayload;
   /** Increments every time the window is (re)opened with a payload, so apps can react. */
   payloadVersion: number;
}

interface State {
   windows: WindowState[];
   topZ: number;
}

type Action =
   | { type: "open"; id: AppId; payload?: AppPayload }
   | { type: "close"; id: AppId }
   | { type: "focus"; id: AppId }
   | { type: "minimize"; id: AppId }
   | { type: "toggleMaximize"; id: AppId }
   | { type: "move"; id: AppId; pos: { x: number; y: number } }
   | { type: "minimizeAll" }
   | { type: "restoreAll" }
   | { type: "closeAll" };

const BASE_Z = 10;
const SITE_NAME = `${profile.name} — ${profile.role}`;

function patch(state: State, id: AppId, fn: (w: WindowState) => WindowState): State {
   return { ...state, windows: state.windows.map((w) => (w.id === id ? fn(w) : w)) };
}

function reducer(state: State, action: Action): State {
   switch (action.type) {
      case "open": {
         const topZ = state.topZ + 1;
         const existing = state.windows.find((w) => w.id === action.id);
         if (existing) {
            return patch({ ...state, topZ }, action.id, (w) => ({
               ...w,
               z: topZ,
               minimized: false,
               payload: action.payload ?? w.payload,
               payloadVersion: action.payload ? w.payloadVersion + 1 : w.payloadVersion,
            }));
         }
         return {
            topZ,
            windows: [
               ...state.windows,
               {
                  id: action.id,
                  z: topZ,
                  minimized: false,
                  maximized: false,
                  cascade: state.windows.length % 6,
                  payload: action.payload,
                  payloadVersion: action.payload ? 1 : 0,
               },
            ],
         };
      }
      case "close":
         return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
      case "focus": {
         const target = state.windows.find((w) => w.id === action.id);
         if (!target || (target.z === state.topZ && !target.minimized)) return state;
         const topZ = state.topZ + 1;
         return patch({ ...state, topZ }, action.id, (w) => ({ ...w, z: topZ, minimized: false }));
      }
      case "minimize":
         return patch(state, action.id, (w) => ({ ...w, minimized: true }));
      case "toggleMaximize":
         return patch(state, action.id, (w) => ({ ...w, maximized: !w.maximized }));
      case "move":
         return patch(state, action.id, (w) => ({ ...w, pos: action.pos }));
      case "minimizeAll":
         return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: true })) };
      case "restoreAll":
         return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: false })) };
      case "closeAll":
         return { ...state, windows: [] };
   }
}

/** The focused window is the top-most one that isn't minimized. */
export function getActiveWindow(windows: WindowState[]) {
   return windows.reduce<WindowState | null>((top, w) => (!w.minimized && (!top || w.z > top.z) ? w : top), null);
}

interface WindowManagerValue {
   windows: WindowState[];
   activeId: AppId | null;
   isOpen: (id: AppId) => boolean;
   open: (id: AppId, payload?: AppPayload) => void;
   close: (id: AppId) => void;
   focus: (id: AppId) => void;
   minimize: (id: AppId) => void;
   toggleMaximize: (id: AppId) => void;
   move: (id: AppId, pos: { x: number; y: number }) => void;
   minimizeAll: () => void;
   restoreAll: () => void;
   closeAll: () => void;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({
   initialApp,
   children,
}: {
   initialApp: AppId | null;
   children: React.ReactNode;
}) {
   const [state, dispatch] = useReducer(
      reducer,
      initialApp,
      (app): State =>
         app
            ? {
                 topZ: BASE_Z,
                 windows: [{ id: app, z: BASE_Z, minimized: false, maximized: false, cascade: 0, payloadVersion: 0 }],
              }
            : { topZ: BASE_Z, windows: [] },
   );

   const activeId = getActiveWindow(state.windows)?.id ?? null;

   // Keep the address bar pointing at the focused app so links are shareable.
   // replaceState avoids flooding history while still letting Next.js track the path.
   const firstSync = useRef(true);
   useEffect(() => {
      if (firstSync.current) {
         firstSync.current = false;
         return;
      }
      const path = (activeId && apps[activeId].route) || "/";
      if (window.location.pathname !== path) window.history.replaceState(null, "", path);
      document.title = activeId ? `${apps[activeId].title} · ${SITE_NAME}` : SITE_NAME;
   }, [activeId]);

   const actions = useMemo(
      () => ({
         open: (id: AppId, payload?: AppPayload) => dispatch({ type: "open", id, payload }),
         close: (id: AppId) => dispatch({ type: "close", id }),
         focus: (id: AppId) => dispatch({ type: "focus", id }),
         minimize: (id: AppId) => dispatch({ type: "minimize", id }),
         toggleMaximize: (id: AppId) => dispatch({ type: "toggleMaximize", id }),
         move: (id: AppId, pos: { x: number; y: number }) => dispatch({ type: "move", id, pos }),
         minimizeAll: () => dispatch({ type: "minimizeAll" }),
         restoreAll: () => dispatch({ type: "restoreAll" }),
         closeAll: () => dispatch({ type: "closeAll" }),
      }),
      [],
   );

   const value = useMemo<WindowManagerValue>(
      () => ({
         ...actions,
         windows: state.windows,
         activeId,
         isOpen: (id) => state.windows.some((w) => w.id === id),
      }),
      [actions, state.windows, activeId],
   );

   return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
   const ctx = useContext(WindowManagerContext);
   if (!ctx) throw new Error("useWindowManager must be used inside <WindowManagerProvider>");
   return ctx;
}
