"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCompass, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Project, projects } from "@/data/projects";
import { SearchIcon } from "@/components/os/StatusIcons";
import { useWindowManager } from "@/components/os/WindowManager";
import { Button, ExternalLink, Tag } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/Toggle";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { TechLogo } from "@/components/ui/TechLogo";
import type { AppProps } from "./types";

type Filter = "all" | "web" | "mobile";

function ProjectLinks({ project, size = "sm" }: { project: Project; size?: "sm" | "md" }) {
   const cls = size === "sm" ? "!h-[26px] !px-2.5 !text-[12px]" : "";
   return (
      <div className="flex flex-wrap gap-2">
         {project.link && (
            <ExternalLink href={project.link} variant="primary" icon={faGlobe} className={cls}>
               Live Demo
            </ExternalLink>
         )}
         {project.github && (
            <ExternalLink href={project.github} icon={faGithub} className={cls}>
               Source
            </ExternalLink>
         )}
         {!project.link && !project.github && <span className="text-2xs text-label-3">Private project</span>}
      </div>
   );
}

function ProjectCard({ project, onOpen, index }: { project: Project; onOpen: () => void; index: number }) {
   const extra = project.tech.length - 4;
   return (
      <motion.article
         layout
         initial={{ opacity: 0, y: 8 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.97 }}
         transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.025 }}
         className="group flex flex-col overflow-hidden rounded-xl border hairline bg-surface transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:bg-surface-2"
      >
         <button
            type="button"
            onClick={onOpen}
            className="focus-ring flex flex-1 flex-col text-left"
            aria-label={`Show details for ${project.name}`}
         >
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b hairline bg-surface-2">
               <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                  <ProjectImage project={project} sizes="(max-width: 768px) 100vw, 320px" priority={index < 3} />
               </div>
            </div>
            <div className="flex flex-1 flex-col p-3.5 pb-2">
               <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-[14px] font-semibold text-label">{project.name}</h3>
                  <span className="shrink-0 text-2xs text-label-3">{project.category}</span>
               </div>
               <p className="mt-1 line-clamp-3 text-[12.5px] leading-snug text-label-2">{project.description}</p>
               <div className="mt-2.5 flex flex-wrap gap-1">
                  {project.tech.slice(0, 4).map((t) => (
                     <Tag key={t}>{t}</Tag>
                  ))}
                  {extra > 0 && <Tag>+{extra}</Tag>}
               </div>
            </div>
         </button>
         <div className="px-3.5 pb-3.5 pt-1.5">
            <ProjectLinks project={project} />
         </div>
      </motion.article>
   );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
   const { open } = useWindowManager();
   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.2 }}
         className="mac-scroll absolute inset-0 overflow-y-auto bg-surface"
      >
         <div className="sticky top-0 z-10 flex h-11 items-center gap-2 border-b hairline bg-surface/85 px-3 backdrop-blur-xl">
            <Button variant="plain" icon={faChevronLeft} onClick={onBack} className="!px-2">
               All Projects
            </Button>
         </div>
         <div className="mx-auto max-w-3xl p-5 md:p-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border hairline bg-surface-2 shadow-sm">
               <ProjectImage project={project} sizes="(max-width: 768px) 100vw, 768px" priority />
            </div>
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
               <div>
                  <p className="text-sm2 font-medium text-accent">{project.category}</p>
                  <h2 className="text-[26px] font-bold tracking-tight text-label">{project.name}</h2>
               </div>
               <div className="flex flex-wrap gap-2">
                  <ProjectLinks project={project} size="md" />
                  {project.link && (
                     <Button icon={faCompass} onClick={() => open("safari", { projectId: project.id })}>
                        Open in Safari
                     </Button>
                  )}
               </div>
            </div>
            <p className="mt-4 text-[14.5px] leading-relaxed text-label">{project.description}</p>
            <h3 className="mb-2.5 mt-7 text-2xs font-semibold uppercase tracking-wider text-label-3">Built with</h3>
            <ul className="flex flex-wrap gap-2">
               {project.tech.map((t) => (
                  <li
                     key={t}
                     className="flex items-center gap-2 rounded-lg border hairline bg-surface-2 px-2.5 py-1.5 text-sm2 text-label"
                  >
                     <TechLogo name={t} className="h-4 w-4" />
                     {t}
                  </li>
               ))}
            </ul>
         </div>
      </motion.div>
   );
}

export default function Projects({ payload, payloadVersion }: AppProps) {
   const [query, setQuery] = useState("");
   const [filter, setFilter] = useState<Filter>("all");
   const [selectedId, setSelectedId] = useState<string | undefined>(payload?.projectId);

   useEffect(() => {
      if (payloadVersion > 0 && payload?.projectId) setSelectedId(payload.projectId);
   }, [payloadVersion, payload?.projectId]);

   const visible = useMemo(() => {
      const q = query.trim().toLowerCase();
      return projects.filter(
         (p) =>
            (filter === "all" || p.platform === filter) &&
            (!q || `${p.name} ${p.category} ${p.tech.join(" ")} ${p.description}`.toLowerCase().includes(q)),
      );
   }, [query, filter]);

   const selected = projects.find((p) => p.id === selectedId);

   return (
      <div className="relative flex h-full flex-col bg-surface-2/40">
         <div className="flex shrink-0 flex-wrap items-center gap-2 border-b hairline bg-surface px-3 py-2">
            <label className="relative flex min-w-0 flex-1 items-center md:max-w-[260px]">
               <span className="sr-only">Search projects</span>
               <SearchIcon className="pointer-events-none absolute left-2.5 h-3 w-3 text-label-3" />
               <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects"
                  className="focus-ring h-7 w-full rounded-[7px] bg-separator/[0.06] pl-7 pr-2 text-sm2 text-label placeholder:text-label-3"
               />
            </label>
            <Segmented<Filter>
               label="Platform"
               value={filter}
               onChange={setFilter}
               options={[
                  { value: "all", label: "All" },
                  { value: "web", label: "Web" },
                  { value: "mobile", label: "Mobile" },
               ]}
            />
            <span className="ml-auto hidden text-2xs text-label-3 sm:block">
               {visible.length} of {projects.length} projects
            </span>
         </div>

         <div className="mac-scroll min-h-0 flex-1 overflow-y-auto p-4">
            {visible.length > 0 ? (
               <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                  <AnimatePresence mode="popLayout">
                     {visible.map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i} onOpen={() => setSelectedId(p.id)} />
                     ))}
                  </AnimatePresence>
               </div>
            ) : (
               <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-[15px] font-semibold text-label">No projects found</p>
                  <p className="text-sm2 text-label-2">Try a different search or filter.</p>
                  <Button
                     onClick={() => {
                        setQuery("");
                        setFilter("all");
                     }}
                  >
                     Clear Filters
                  </Button>
               </div>
            )}
         </div>

         <AnimatePresence>
            {selected && <ProjectDetail key={selected.id} project={selected} onBack={() => setSelectedId(undefined)} />}
         </AnimatePresence>
      </div>
   );
}
