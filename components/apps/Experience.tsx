"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { allSkills } from "@/data/skills";
import { Tag } from "@/components/ui/primitives";
import type { AppProps } from "./types";

function TimelineItem({
   icon,
   highlighted,
   id,
   children,
}: {
   icon: typeof faBriefcase;
   highlighted?: boolean;
   id?: string;
   children: React.ReactNode;
}) {
   return (
      <li data-entry={id} className="relative pb-6 pl-12 last:pb-0">
         {/* Rail */}
         <span
            aria-hidden="true"
            className="absolute bottom-0 left-[15px] top-8 w-px bg-separator/10 [li:last-child>&]:hidden"
         />
         <span
            aria-hidden="true"
            className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border hairline bg-surface text-accent shadow-sm dark:bg-surface-3"
         >
            <FontAwesomeIcon icon={icon} className="!h-3.5 !w-3.5" />
         </span>
         <div
            className={`rounded-xl border bg-surface p-4 transition-[box-shadow,border-color] duration-300 dark:bg-surface-2 ${
               highlighted ? "border-accent shadow-[0_0_0_3px_rgb(var(--accent)/0.25)]" : "hairline"
            }`}
         >
            {children}
         </div>
      </li>
   );
}

export default function Experience({ payload, payloadVersion }: AppProps) {
   const [highlight, setHighlight] = useState<string | undefined>(payload?.experienceId);
   const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (payloadVersion > 0 && payload?.experienceId) setHighlight(payload.experienceId);
   }, [payloadVersion, payload?.experienceId]);

   useEffect(() => {
      if (!highlight) return;
      scrollRef.current
         ?.querySelector(`[data-entry="${CSS.escape(highlight)}"]`)
         ?.scrollIntoView({ block: "center", behavior: "smooth" });
      const t = setTimeout(() => setHighlight(undefined), 2400);
      return () => clearTimeout(t);
   }, [highlight]);

   const stats = [
      { value: `${profile.yearsOfExperience}+`, label: "Years of experience" },
      { value: String(projects.length), label: "Projects shipped" },
      { value: String(allSkills.length), label: "Technologies" },
   ];

   return (
      <div ref={scrollRef} className="mac-scroll h-full overflow-y-auto bg-surface-2/40 px-5 pb-8 pt-5 md:px-8">
         <div className="mx-auto max-w-2xl">
            <h2 className="text-[22px] font-bold tracking-tight text-label">Work Experience</h2>
            <p className="mt-1 text-sm2 text-label-2">Where I&apos;ve worked and what I built there.</p>

            <dl className="mt-5 grid grid-cols-3 gap-2.5">
               {stats.map((s) => (
                  <div
                     key={s.label}
                     className="flex flex-col-reverse rounded-xl border hairline bg-surface p-3 text-center dark:bg-surface-2"
                  >
                     <dt className="text-2xs text-label-2">{s.label}</dt>
                     <dd className="text-[22px] font-bold tracking-tight text-label">{s.value}</dd>
                  </div>
               ))}
            </dl>

            <ol className="mt-7">
               {experience.map((e) => (
                  <TimelineItem key={e.id} id={e.id} icon={faBriefcase} highlighted={highlight === e.id}>
                     <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <div className="min-w-0">
                           <h3 className="text-[15px] font-semibold text-label">{e.role}</h3>
                           <p className="text-sm2 font-medium text-accent">{e.company}</p>
                        </div>
                        <div className="text-right text-2xs text-label-2">
                           <p className="font-medium">{e.period}</p>
                           <p>{e.type}</p>
                        </div>
                     </div>
                     <p className="mt-1 inline-flex items-center gap-1.5 text-2xs text-label-3">
                        <FontAwesomeIcon icon={faLocationDot} className="!h-2.5 !w-2.5" />
                        {e.location}
                     </p>
                     <p className="mt-2.5 text-sm2 leading-relaxed text-label">{e.summary}</p>
                     <ul className="mt-2 space-y-1 text-sm2 leading-relaxed text-label-2">
                        {e.highlights.map((h) => (
                           <li
                              key={h}
                              className="relative pl-3.5 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-label-3"
                           >
                              {h}
                           </li>
                        ))}
                     </ul>
                     <div className="mt-3 flex flex-wrap gap-1">
                        {e.tech.map((t) => (
                           <Tag key={t}>{t}</Tag>
                        ))}
                     </div>
                  </TimelineItem>
               ))}
            </ol>

            <h2 className="mb-4 mt-9 text-[17px] font-semibold text-label">Education</h2>
            <ol>
               {profile.education.map((ed) => (
                  <TimelineItem key={ed.school} icon={faGraduationCap}>
                     <div className="flex flex-wrap items-start justify-between gap-x-3">
                        <div className="min-w-0">
                           <h3 className="text-[15px] font-semibold text-label">{ed.school}</h3>
                           <p className="text-sm2 text-label-2">{ed.degree}</p>
                        </div>
                        <p className="text-2xs font-medium text-label-2">{ed.period}</p>
                     </div>
                  </TimelineItem>
               ))}
            </ol>
         </div>
      </div>
   );
}
