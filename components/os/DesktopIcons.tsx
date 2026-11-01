"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { AppId, apps, dockApps, openExternal } from "@/lib/apps";
import { AppIcon, IconId } from "./AppIcon";
import { useWindowManager } from "./WindowManager";

interface Shortcut {
   key: string;
   label: string;
   icon: IconId;
   app?: AppId;
   href?: string;
}

const shortcuts: Shortcut[] = [
   { key: "about", label: "About Me", icon: "folder", app: "finder" },
   { key: "projects", label: "Projects", icon: "folder", app: "projects" },
   { key: "resume", label: "Resume.pdf", icon: "document", app: "preview" },
   { key: "contact", label: "Contact Me", icon: "mail", app: "mail" },
];

/** Desktop shortcuts in the top-right column: click selects, double-click (or Enter) opens. */
export function DesktopIcons({
   selected,
   onSelect,
}: {
   selected: string | null;
   onSelect: (key: string | null) => void;
}) {
   const { open } = useWindowManager();
   const [coarse, setCoarse] = useState(false);

   useEffect(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), []);

   const launch = (s: Shortcut) => (s.app ? open(s.app) : s.href && openExternal(s.href));

   return (
      <ul
         aria-label="Desktop"
         className="absolute right-4 top-[calc(var(--menubar-h)+14px)] flex flex-col items-center gap-3"
      >
         {shortcuts.map((s) => {
            const isSelected = selected === s.key;
            return (
               <li key={s.key}>
                  <button
                     type="button"
                     onClick={(e) => {
                        e.stopPropagation();
                        // Touch screens have no double-click, so a tap opens directly.
                        if (coarse) launch(s);
                        else onSelect(s.key);
                     }}
                     onDoubleClick={() => launch(s)}
                     onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), launch(s))}
                     onFocus={() => onSelect(s.key)}
                     aria-label={`${s.label}${s.href ? " (opens in a new tab)" : ""}`}
                     className="group flex w-[88px] flex-col items-center gap-1 outline-none"
                  >
                     <span
                        className={`flex h-[64px] w-[72px] items-center justify-center rounded-md p-1.5 transition-colors ${
                           isSelected ? "bg-black/25" : "group-hover:bg-white/10"
                        }`}
                     >
                        <AppIcon
                           id={s.icon}
                           className={
                              s.icon === "document"
                                 ? "h-[52px] w-[42px]"
                                 : s.icon === "folder"
                                   ? "h-[46px] w-[58px]"
                                   : "h-[50px] w-[50px]"
                           }
                        />
                     </span>
                     <span
                        className={`max-w-full rounded px-1.5 py-px text-center text-[12px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] ${
                           isSelected ? "bg-accent [text-shadow:none]" : ""
                        }`}
                     >
                        {s.label}
                     </span>
                  </button>
               </li>
            );
         })}
      </ul>
   );
}

/** Phone layout: a greeting widget plus a grid of every app, opened with a single tap. */
export function MobileHome() {
   const { open } = useWindowManager();
   const tile =
      "focus-ring flex flex-col items-center gap-1.5 rounded-2xl p-1 text-[11px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] active:scale-95 transition-transform";

   return (
      <div className="absolute inset-x-0 bottom-[92px] top-[calc(var(--menubar-h)+12px)] overflow-y-auto px-5 no-scrollbar">
         <button
            type="button"
            onClick={() => open("finder")}
            className="focus-ring mb-6 flex w-full items-center gap-3.5 rounded-3xl border border-white/20 bg-white/15 p-4 text-left text-white backdrop-blur-2xl"
         >
            <Image
               src={profile.avatar}
               alt=""
               width={112}
               height={112}
               className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-white/40"
            />
            <span className="min-w-0">
               <span className="block text-[17px] font-semibold leading-tight">{profile.name}</span>
               <span className="block text-sm2 text-white/80">{profile.role}</span>
               <span className="mt-1 inline-flex items-center gap-1.5 text-2xs text-white/80">
                  <span className={`h-1.5 w-1.5 rounded-full ${profile.openToWork ? "bg-[#30d158]" : "bg-white/70"}`} />{" "}
                  {profile.availability}
               </span>
            </span>
         </button>
         <ul className="grid grid-cols-4 gap-x-3 gap-y-5">
            {dockApps.map((id) => (
               <li key={id}>
                  <button type="button" onClick={() => open(id)} className={`${tile} w-full`}>
                     <AppIcon id={id} className="h-[58px] w-[58px]" />
                     <span className="w-full truncate text-center">{apps[id].name.replace("System ", "")}</span>
                  </button>
               </li>
            ))}
            <li>
               <button type="button" onClick={() => open("preview")} className={`${tile} w-full`}>
                  <span className="flex h-[58px] w-[58px] items-center justify-center">
                     <AppIcon id="document" className="h-[54px] w-[44px]" />
                  </span>
                  <span>Resume</span>
               </button>
            </li>
         </ul>
      </div>
   );
}
