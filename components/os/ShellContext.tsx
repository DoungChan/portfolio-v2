"use client";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface Notice {
   id: number;
   title: string;
   body?: string;
}

interface ShellValue {
   spotlightOpen: boolean;
   setSpotlightOpen: (open: boolean) => void;
   notify: (title: string, body?: string) => void;
}

const ShellContext = createContext<ShellValue | null>(null);

export function ShellProvider({ children }: { children: React.ReactNode }) {
   const [spotlightOpen, setSpotlightOpen] = useState(false);
   const [notice, setNotice] = useState<Notice | null>(null);
   const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

   const notify = useCallback((title: string, body?: string) => {
      clearTimeout(timer.current);
      setNotice({ id: Date.now(), title, body });
      timer.current = setTimeout(() => setNotice(null), 3200);
   }, []);

   const value = useMemo(() => ({ spotlightOpen, setSpotlightOpen, notify }), [spotlightOpen, notify]);

   return (
      <ShellContext.Provider value={value}>
         {children}
         <div
            aria-live="polite"
            className="pointer-events-none fixed right-3 top-[calc(var(--menubar-h)+8px)] z-popover w-[min(340px,calc(100vw-24px))]"
         >
            <AnimatePresence>
               {notice && (
                  <motion.div
                     key={notice.id}
                     initial={{ opacity: 0, x: 40 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 40 }}
                     transition={{ type: "spring", stiffness: 380, damping: 32 }}
                     className="material-thick pointer-events-auto rounded-2xl border hairline px-4 py-3 shadow-popover"
                  >
                     <p className="text-sm2 font-semibold text-label">{notice.title}</p>
                     {notice.body && <p className="mt-0.5 text-sm2 text-label-2">{notice.body}</p>}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </ShellContext.Provider>
   );
}

export function useShell() {
   const ctx = useContext(ShellContext);
   if (!ctx) throw new Error("useShell must be used inside <ShellProvider>");
   return ctx;
}
