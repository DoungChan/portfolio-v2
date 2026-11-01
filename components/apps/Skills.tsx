"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { TechLogo } from "@/components/ui/TechLogo";
import type { AppProps } from "./types";

export default function Skills({ payload, payloadVersion }: AppProps) {
   const [category, setCategory] = useState("all");
   const [highlight, setHighlight] = useState<string | undefined>(payload?.skill);
   const scrollRef = useRef<HTMLDivElement>(null);

   // How many portfolio projects use each skill, to give the list some evidence.
   const usage = useMemo(() => {
      const counts: Record<string, number> = {};
      projects.forEach((p) => p.tech.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1)));
      return counts;
   }, []);

   useEffect(() => {
      if (payloadVersion > 0 && payload?.skill) {
         setCategory("all");
         setHighlight(payload.skill);
      }
   }, [payloadVersion, payload?.skill]);

   useEffect(() => {
      if (!highlight) return;
      const el = scrollRef.current?.querySelector(`[data-skill="${CSS.escape(highlight)}"]`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      const t = setTimeout(() => setHighlight(undefined), 2400);
      return () => clearTimeout(t);
   }, [highlight]);

   const shown = category === "all" ? skillCategories : skillCategories.filter((c) => c.id === category);
   const tabs = [{ id: "all", title: "All" }, ...skillCategories];

   return (
      <div className="flex h-full flex-col">
         <div
            className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto border-b hairline px-4 py-2.5"
            role="tablist"
            aria-label="Skill categories"
         >
            {tabs.map((t) => (
               <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={category === t.id}
                  onClick={() => setCategory(t.id)}
                  className={`focus-ring shrink-0 rounded-full px-3 py-1 text-sm2 transition-colors ${
                     category === t.id ? "bg-accent text-white" : "bg-separator/[0.06] text-label hover:bg-separator/10"
                  }`}
               >
                  {t.title}
               </button>
            ))}
         </div>

         <div ref={scrollRef} className="mac-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-5 md:px-7">
            {category === "all" && (
               <header className="mb-6">
                  <h2 className="text-[22px] font-bold tracking-tight text-label">Technical Skills</h2>
                  <p className="mt-1 max-w-xl text-sm2 text-label-2">
                     The languages, frameworks and tools I use to design and ship web and mobile products.
                  </p>
               </header>
            )}
            <div className="space-y-7">
               {shown.map((c) => (
                  <section key={c.id} aria-labelledby={`skills-${c.id}`}>
                     <div className="mb-3 flex items-baseline justify-between gap-3">
                        <h3 id={`skills-${c.id}`} className="text-[15px] font-semibold text-label">
                           {c.title}
                        </h3>
                        <p className="truncate text-2xs text-label-3">{c.description}</p>
                     </div>
                     <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
                        {c.skills.map((s) => (
                           <li
                              key={s}
                              data-skill={s}
                              className={`flex items-center gap-3 rounded-xl border bg-surface p-3 transition-[box-shadow,border-color] duration-300 dark:bg-surface-2 ${
                                 highlight === s
                                    ? "border-accent shadow-[0_0_0_3px_rgb(var(--accent)/0.25)]"
                                    : "hairline"
                              }`}
                           >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 dark:bg-surface-3">
                                 <TechLogo name={s} className="h-6 w-6" />
                              </span>
                              <span className="min-w-0">
                                 <span className="line-clamp-2 block text-sm2 font-medium leading-tight text-label">{s}</span>
                                 <span className="block truncate text-2xs text-label-3">
                                    {usage[s] ? `${usage[s]} project${usage[s] > 1 ? "s" : ""}` : c.title}
                                 </span>
                              </span>
                           </li>
                        ))}
                     </ul>
                  </section>
               ))}
            </div>
         </div>
      </div>
   );
}
