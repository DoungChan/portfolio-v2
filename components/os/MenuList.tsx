"use client";
import { motion } from "framer-motion";
import { forwardRef, useEffect, useRef } from "react";

export type MenuEntry =
   | { type: "separator" }
   | {
        type?: "item";
        label: string;
        onSelect: () => void;
        shortcut?: string;
        disabled?: boolean;
        checked?: boolean;
     };

export const separator: MenuEntry = { type: "separator" };

interface MenuListProps {
   items: MenuEntry[];
   onClose: () => void;
   label: string;
   /** Focus the first item on open (keyboard-initiated menus). */
   autoFocus?: boolean;
   className?: string;
   style?: React.CSSProperties;
}

/** A macOS-style dropdown: translucent panel, accent highlight, arrow-key navigation. */
export const MenuList = forwardRef<HTMLDivElement, MenuListProps>(function MenuList(
   { items, onClose, label, autoFocus, className = "", style },
   ref,
) {
   const listRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (autoFocus) listRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
   }, [autoFocus]);

   const onKeyDown = (e: React.KeyboardEvent) => {
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
      const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === "ArrowDown") {
         e.preventDefault();
         buttons[(i + 1) % buttons.length]?.focus();
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
      } else if (e.key === "Escape") {
         e.preventDefault();
         onClose();
      }
   };

   return (
      <motion.div
         ref={ref}
         role="menu"
         aria-label={label}
         initial={{ opacity: 0, y: -4, scale: 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         exit={{ opacity: 0, transition: { duration: 0.12 } }}
         transition={{ duration: 0.14, ease: "easeOut" }}
         style={style}
         className={`material-thick min-w-[220px] rounded-[10px] border hairline p-[5px] text-sm2 text-label shadow-popover ${className}`}
         onKeyDown={onKeyDown}
      >
         <div ref={listRef}>
            {items.map((item, i) =>
               item.type === "separator" ? (
                  <div key={i} role="separator" className="mx-2 my-[5px] h-px bg-separator/10" />
               ) : (
                  <button
                     key={i}
                     role={item.checked === undefined ? "menuitem" : "menuitemcheckbox"}
                     aria-checked={item.checked}
                     disabled={item.disabled}
                     onClick={() => {
                        onClose();
                        item.onSelect();
                     }}
                     className="group flex w-full items-center gap-2 rounded-[5px] px-2 py-[3px] text-left outline-none hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white disabled:pointer-events-none disabled:text-label-3"
                  >
                     <span className="w-3 text-xs">{item.checked ? "✓" : ""}</span>
                     <span className="flex-1 whitespace-nowrap">{item.label}</span>
                     {item.shortcut && (
                        <span className="pl-6 text-label-3 group-hover:text-white/80 group-focus-visible:text-white/80">
                           {item.shortcut}
                        </span>
                     )}
                  </button>
               ),
            )}
         </div>
      </motion.div>
   );
});
