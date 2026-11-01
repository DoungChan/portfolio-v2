"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faArrowRotateRight,
   faArrowUpRightFromSquare,
   faChevronLeft,
   faChevronRight,
   faLock,
   faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { Project, projects } from "@/data/projects";
import { openExternal } from "@/lib/apps";
import { useShell } from "@/components/os/ShellContext";
import { ExternalLink } from "@/components/ui/primitives";
import { ProjectImage } from "@/components/ui/ProjectImage";
import type { AppProps } from "./types";

const live = projects.filter((p): p is Project & { link: string } => !!p.link);
const featured = live.filter((p) => p.featured);
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

type Page = "start" | string; // "start" or a project id

function StartPage({ onOpen }: { onOpen: (id: string) => void }) {
   const elsewhere = [
      { label: "GitHub", href: profile.socials.github, icon: faGithub, bg: "#24292f" },
      { label: "LinkedIn", href: profile.socials.linkedin, icon: faLinkedin, bg: "#0a66c2" },
   ];
   return (
      <div className="mx-auto max-w-3xl px-6 py-8">
         <h2 className="text-[19px] font-bold text-label">Favorites</h2>
         <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-x-3 gap-y-5">
            {live.map((p) => (
               <li key={p.id}>
                  <button
                     type="button"
                     onClick={() => onOpen(p.id)}
                     className="focus-ring group flex w-full flex-col items-center gap-1.5 rounded-xl p-1"
                  >
                     <span className="relative h-[60px] w-[60px] overflow-hidden rounded-[14px] border hairline bg-surface shadow-sm transition-transform group-hover:scale-105">
                        <Image src={p.image} alt="" fill sizes="60px" className="object-cover object-top" />
                     </span>
                     <span className="w-full truncate text-center text-2xs text-label">{p.name}</span>
                  </button>
               </li>
            ))}
            {elsewhere.map((e) => (
               <li key={e.label}>
                  <a
                     href={e.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="focus-ring group flex flex-col items-center gap-1.5 rounded-xl p-1"
                  >
                     <span
                        className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] text-white shadow-sm transition-transform group-hover:scale-105"
                        style={{ background: e.bg }}
                     >
                        <FontAwesomeIcon icon={e.icon} className="!h-7 !w-7" />
                     </span>
                     <span className="text-2xs text-label">{e.label}</span>
                  </a>
               </li>
            ))}
         </ul>

         <h2 className="mt-10 text-[19px] font-bold text-label">Featured Work</h2>
         <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((p) => (
               <li key={p.id}>
                  <button
                     type="button"
                     onClick={() => onOpen(p.id)}
                     className="focus-ring group w-full overflow-hidden rounded-xl border hairline bg-surface text-left shadow-sm transition-shadow hover:shadow-md dark:bg-surface-2"
                  >
                     <span className="relative block aspect-[16/9] overflow-hidden bg-surface-2">
                        <span className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                           <ProjectImage project={p} sizes="(max-width: 640px) 100vw, 380px" />
                        </span>
                     </span>
                     <span className="block p-3">
                        <span className="block text-sm2 font-semibold text-label">{p.name}</span>
                        <span className="block truncate text-2xs text-label-3">{host(p.link)}</span>
                     </span>
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}

function SitePreview({ project }: { project: Project & { link: string } }) {
   return (
      <div className="relative min-h-full bg-surface-2">
         {project.platform === "mobile" ? (
            <div className="flex justify-center px-4 py-8">
               <div className="w-[300px] overflow-hidden rounded-[36px] border-[10px] border-[#1d1d1f] bg-black shadow-xl">
                  <Image
                     src={project.image}
                     alt={`${project.name} preview`}
                     width={600}
                     height={1300}
                     sizes="300px"
                     className="h-auto w-full"
                  />
               </div>
            </div>
         ) : (
            <Image
               src={project.image}
               alt={`${project.name} preview`}
               width={1920}
               height={1000}
               sizes="(max-width: 1024px) 100vw, 1000px"
               className="h-auto w-full"
            />
         )}
         <div className="sticky bottom-3 mx-auto mb-3 flex w-fit max-w-[calc(100%-24px)] flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border hairline bg-surface/85 py-1.5 pl-4 pr-1.5 shadow-popover backdrop-blur-xl">
            <span className="text-2xs text-label-2">Preview of {project.name}</span>
            <ExternalLink href={project.link} variant="primary" className="!h-[26px] !rounded-full !text-[12px]">
               Visit Live Site
            </ExternalLink>
         </div>
      </div>
   );
}

export default function Safari({ payload, payloadVersion }: AppProps) {
   const { notify } = useShell();
   const initial = live.some((p) => p.id === payload?.projectId) ? payload!.projectId! : "start";
   const [nav, setNav] = useState<{ stack: Page[]; index: number }>({ stack: [initial], index: 0 });
   const [loadKey, setLoadKey] = useState(0);
   const page = nav.stack[nav.index];
   const project = live.find((p) => p.id === page);
   const [address, setAddress] = useState("");

   useEffect(() => setAddress(project ? host(project.link) : ""), [project]);

   const go = (next: Page) => {
      if (next === page) return;
      setNav(({ stack, index }) => ({ stack: [...stack.slice(0, index + 1), next], index: index + 1 }));
      setLoadKey((k) => k + 1);
   };

   useEffect(() => {
      if (payloadVersion > 0 && payload?.projectId && live.some((p) => p.id === payload.projectId))
         go(payload.projectId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [payloadVersion]);

   const step = (delta: number) => {
      setNav((n) => ({ ...n, index: n.index + delta }));
      setLoadKey((k) => k + 1);
   };

   const submitAddress = (e: React.FormEvent) => {
      e.preventDefault();
      const q = address.trim().toLowerCase();
      if (!q) return go("start");
      const match = live.find((p) => p.name.toLowerCase().includes(q) || host(p.link).toLowerCase().includes(q));
      if (match) return go(match.id);
      const looksLikeUrl = /^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(q) || q.startsWith("http");
      openExternal(
         looksLikeUrl
            ? q.startsWith("http")
               ? q
               : `https://${q}`
            : `https://www.google.com/search?q=${encodeURIComponent(address.trim())}`,
      );
   };

   const share = async () => {
      const url = project ? project.link : window.location.href;
      try {
         await navigator.clipboard.writeText(url);
         notify("Link copied", url);
      } catch {
         notify("Couldn't access the clipboard", url);
      }
   };

   const iconBtn =
      "focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-label-2 hover:bg-separator/[0.06] disabled:opacity-30";

   return (
      <div className="flex h-full flex-col">
         <div className="flex h-12 shrink-0 items-center gap-1 border-b hairline bg-surface-2 px-2.5">
            <button
               type="button"
               aria-label="Back"
               disabled={nav.index === 0}
               onClick={() => step(-1)}
               className={iconBtn}
            >
               <FontAwesomeIcon icon={faChevronLeft} className="!h-3.5 !w-3.5" />
            </button>
            <button
               type="button"
               aria-label="Forward"
               disabled={nav.index === nav.stack.length - 1}
               onClick={() => step(1)}
               className={`${iconBtn} max-sm:hidden`}
            >
               <FontAwesomeIcon icon={faChevronRight} className="!h-3.5 !w-3.5" />
            </button>
            <form onSubmit={submitAddress} className="relative mx-1 flex min-w-0 flex-1 justify-center">
               <label className="relative flex w-full max-w-[520px] items-center">
                  <span className="sr-only">Address</span>
                  {project && (
                     <FontAwesomeIcon
                        icon={faLock}
                        className="pointer-events-none absolute left-3 !h-2.5 !w-2.5 text-label-3"
                     />
                  )}
                  <input
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     onFocus={(e) => e.target.select()}
                     placeholder="Search or enter website name"
                     spellCheck={false}
                     autoComplete="off"
                     className="focus-ring h-[30px] w-full rounded-lg bg-separator/[0.07] px-7 text-center text-sm2 text-label placeholder:text-label-3 focus:text-left"
                  />
                  <button
                     type="button"
                     aria-label="Reload page"
                     onClick={() => setLoadKey((k) => k + 1)}
                     className="focus-ring absolute right-1.5 flex h-5 w-5 items-center justify-center rounded text-label-3 hover:text-label"
                  >
                     <FontAwesomeIcon icon={faArrowRotateRight} className="!h-2.5 !w-2.5" />
                  </button>
               </label>
            </form>
            <button type="button" aria-label="Copy link" onClick={share} className={iconBtn}>
               <FontAwesomeIcon icon={faShareFromSquare} className="!h-3.5 !w-3.5" />
            </button>
            {project && (
               <button
                  type="button"
                  aria-label="Open in new tab"
                  onClick={() => openExternal(project.link)}
                  className={iconBtn}
               >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="!h-3.5 !w-3.5" />
               </button>
            )}
         </div>

         <div className="relative min-h-0 flex-1">
            {/* Page-load progress bar, replayed on navigation and reload. */}
            <motion.div
               key={loadKey}
               aria-hidden="true"
               className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-accent"
               initial={{ scaleX: 0, opacity: 1 }}
               animate={{ scaleX: 1, opacity: [1, 1, 0] }}
               transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <div key={`${page}-${loadKey}`} className="mac-scroll h-full overflow-y-auto bg-surface">
               {project ? <SitePreview project={project} /> : <StartPage onOpen={go} />}
            </div>
         </div>
      </div>
   );
}
