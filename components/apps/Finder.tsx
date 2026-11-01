"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faAward,
   faChevronLeft,
   faChevronRight,
   faFilePdf,
   faGraduationCap,
   faLanguage,
   faLocationDot,
   faPaperPlane,
   faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faTelegram } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { useWindowManager } from "@/components/os/WindowManager";
import { Button, Card, SidebarHeading, SidebarItem } from "@/components/ui/primitives";
import type { AppProps } from "./types";

const sections = [
   { id: "about", label: "About Me", icon: faUser },
   { id: "education", label: "Education", icon: faGraduationCap },
   { id: "achievements", label: "Achievements", icon: faAward },
   { id: "languages", label: "Languages", icon: faLanguage },
] as const;

type SectionId = (typeof sections)[number]["id"];

const isSection = (s?: string): s is SectionId => sections.some((x) => x.id === s);

const socialLinks = [
   { label: "GitHub", href: profile.socials.github, icon: faGithub },
   { label: "LinkedIn", href: profile.socials.linkedin, icon: faLinkedin },
   { label: "Telegram", href: profile.socials.telegram, icon: faTelegram },
];

function About() {
   const { open } = useWindowManager();
   const info: [string, string][] = [
      ["Role", profile.role],
      ["Experience", `${profile.yearsOfExperience}+ years`],
      ["Location", profile.location],
      ["Email", profile.email],
      ["Languages", profile.languages.map((l) => l.name).join(", ")],
   ];

   return (
      <div className="flex flex-col gap-6 lg:flex-row">
         <div className="flex shrink-0 flex-col items-center gap-3 lg:w-[220px]">
            <Image
               src={profile.portrait}
               alt={`Portrait of ${profile.name}`}
               width={440}
               height={560}
               priority
               sizes="220px"
               className="aspect-[11/14] w-40 rounded-xl object-cover shadow-md lg:w-full"
            />
            <div className="flex gap-1">
               {socialLinks.map((s) => (
                  <a
                     key={s.label}
                     href={s.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label={`${s.label} (opens in a new tab)`}
                     className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-label-2 transition-colors hover:bg-separator/[0.06] hover:text-label"
                  >
                     <FontAwesomeIcon icon={s.icon} className="!h-4 !w-4" />
                  </a>
               ))}
            </div>
         </div>

         <div className="min-w-0 flex-1">
            <p className="text-sm2 font-medium text-accent">Hello, I&apos;m</p>
            <h1 className="mt-0.5 text-[28px] font-bold leading-tight tracking-tight text-label">{profile.name}</h1>
            <p className="mt-1 text-[15px] text-label-2">{profile.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm2 text-label-2">
               <span className="inline-flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="!h-3 !w-3" />
                  {profile.location}
               </span>
               <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${profile.openToWork ? "bg-[#30d158]" : "bg-accent"}`} />
                  {profile.availability}
               </span>
            </div>

            <div className="mt-5 space-y-3 text-[14px] leading-relaxed text-label">
               {profile.bio.map((p) => (
                  <p key={p}>{p}</p>
               ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
               <Button variant="primary" icon={faFilePdf} onClick={() => open("preview")}>
                  View Resume
               </Button>
               <Button icon={faPaperPlane} onClick={() => open("mail")}>
                  Contact Me
               </Button>
               <Button onClick={() => open("projects")}>View Projects</Button>
            </div>

            <Card className="mt-6 !p-0">
               <dl className="divide-y divide-separator/[0.08] text-sm2">
                  {info.map(([k, v]) => (
                     <div key={k} className="flex gap-4 px-4 py-2">
                        <dt className="w-24 shrink-0 text-label-2">{k}</dt>
                        <dd className="min-w-0 break-words text-label">{v}</dd>
                     </div>
                  ))}
               </dl>
            </Card>
         </div>
      </div>
   );
}

function ListSection({
   title,
   items,
   icon,
}: {
   title: string;
   items: { title: string; detail?: string; meta?: string }[];
   icon: typeof faAward;
}) {
   return (
      <div>
         <h2 className="mb-4 text-[22px] font-bold tracking-tight text-label">{title}</h2>
         <ul className="space-y-2">
            {items.map((item) => (
               <li key={item.title}>
                  <Card className="flex items-start gap-3">
                     <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <FontAwesomeIcon icon={icon} className="!h-4 !w-4" />
                     </span>
                     <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-label">{item.title}</p>
                        {item.detail && <p className="text-sm2 text-label-2">{item.detail}</p>}
                     </div>
                     {item.meta && <span className="shrink-0 text-2xs text-label-3">{item.meta}</span>}
                  </Card>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default function Finder({ payload, payloadVersion }: AppProps) {
   const { open } = useWindowManager();
   const requested = payload?.section;
   const initial = isSection(requested) ? requested : "about";
   // Back/forward history, like Finder's toolbar.
   const [history, setHistory] = useState<{ stack: SectionId[]; index: number }>({ stack: [initial], index: 0 });
   const current = history.stack[history.index];

   const go = (id: SectionId) => {
      if (id === current) return;
      setHistory(({ stack, index }) => ({ stack: [...stack.slice(0, index + 1), id], index: index + 1 }));
   };

   useEffect(() => {
      const section = payload?.section;
      if (payloadVersion > 0 && isSection(section)) go(section);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [payloadVersion]);

   const currentLabel = sections.find((s) => s.id === current)!.label;

   return (
      <div className="flex h-full">
         <aside className="mac-scroll hidden w-[190px] shrink-0 overflow-y-auto border-r hairline bg-surface-2/70 p-2.5 md:block">
            <SidebarHeading>Favorites</SidebarHeading>
            <nav className="space-y-0.5">
               {sections.map((s) => (
                  <SidebarItem
                     key={s.id}
                     active={current === s.id}
                     onClick={() => go(s.id)}
                     icon={<FontAwesomeIcon icon={s.icon} className="!h-3.5 !w-3.5" />}
                  >
                     {s.label}
                  </SidebarItem>
               ))}
            </nav>
            <SidebarHeading>Links</SidebarHeading>
            <div className="space-y-0.5">
               <SidebarItem
                  active={false}
                  onClick={() => open("preview")}
                  icon={<FontAwesomeIcon icon={faFilePdf} className="!h-3.5 !w-3.5" />}
               >
                  Resume.pdf
               </SidebarItem>
               {socialLinks.map((l) => (
                  <a
                     key={l.label}
                     href={l.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="focus-ring flex items-center gap-2 rounded-md px-2 py-[5px] text-sm2 text-label hover:bg-separator/[0.05]"
                  >
                     <span className="flex w-4 justify-center text-accent">
                        <FontAwesomeIcon icon={l.icon} className="!h-3.5 !w-3.5" />
                     </span>
                     {l.label}
                  </a>
               ))}
            </div>
         </aside>

         <div className="flex min-w-0 flex-1 flex-col">
            <div className="hidden h-11 shrink-0 items-center gap-1 border-b hairline px-3 md:flex">
               <button
                  type="button"
                  aria-label="Back"
                  disabled={history.index === 0}
                  onClick={() => setHistory((h) => ({ ...h, index: h.index - 1 }))}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-label-2 hover:bg-separator/[0.06] disabled:opacity-30"
               >
                  <FontAwesomeIcon icon={faChevronLeft} className="!h-3 !w-3" />
               </button>
               <button
                  type="button"
                  aria-label="Forward"
                  disabled={history.index === history.stack.length - 1}
                  onClick={() => setHistory((h) => ({ ...h, index: h.index + 1 }))}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-label-2 hover:bg-separator/[0.06] disabled:opacity-30"
               >
                  <FontAwesomeIcon icon={faChevronRight} className="!h-3 !w-3" />
               </button>
               <span className="ml-1 text-sm2 font-semibold text-label">{currentLabel}</span>
            </div>

            {/* Phones: sections as a scrollable tab row instead of the sidebar. */}
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b hairline px-3 py-2 md:hidden">
               {sections.map((s) => (
                  <button
                     key={s.id}
                     type="button"
                     onClick={() => go(s.id)}
                     aria-current={current === s.id ? "page" : undefined}
                     className={`focus-ring shrink-0 rounded-full px-3 py-1 text-sm2 ${
                        current === s.id ? "bg-accent text-white" : "bg-separator/[0.06] text-label"
                     }`}
                  >
                     {s.label}
                  </button>
               ))}
            </div>

            <div className="mac-scroll min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
               {/* All sections stay in the markup (hidden when inactive) so crawlers see every one. */}
               <section hidden={current !== "about"}>
                  <About />
               </section>
               <section hidden={current !== "education"}>
                  <ListSection
                     title="Education"
                     icon={faGraduationCap}
                     items={profile.education.map((e) => ({ title: e.school, detail: e.degree, meta: e.period }))}
                  />
               </section>
               <section hidden={current !== "achievements"}>
                  <ListSection
                     title="Achievements"
                     icon={faAward}
                     items={profile.achievements.map((a) => ({ title: a }))}
                  />
               </section>
               <section hidden={current !== "languages"}>
                  <ListSection
                     title="Languages"
                     icon={faLanguage}
                     items={profile.languages.map((l) => ({ title: l.name, detail: l.level }))}
                  />
               </section>
            </div>
         </div>
      </div>
   );
}
