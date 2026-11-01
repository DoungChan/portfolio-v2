"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { appIds, apps, links, openExternal } from "@/lib/apps";
import { TechLogo } from "@/components/ui/TechLogo";
import { AppIcon } from "./AppIcon";
import { useShell } from "./ShellContext";
import { SearchIcon } from "./StatusIcons";
import { useWindowManager } from "./WindowManager";

interface Result {
  key: string;
  group: string;
  title: string;
  subtitle: string;
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
}

const GROUP_LIMIT = 5;

function score(r: Result, q: string) {
  const title = r.title.toLowerCase();
  if (title.startsWith(q)) return 3;
  if (title.includes(q)) return 2;
  if (`${r.subtitle} ${r.keywords}`.toLowerCase().includes(q)) return 1;
  return 0;
}

export function Spotlight() {
  const { spotlightOpen, setSpotlightOpen } = useShell();
  const { open } = useWindowManager();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = () => setSpotlightOpen(false);

  const all = useMemo<Result[]>(() => {
    const icon = (id: Parameters<typeof AppIcon>[0]["id"]) => (
      <AppIcon id={id} className="h-7 w-7" />
    );
    return [
      ...appIds.map((id) => ({
        key: `app-${id}`,
        group: "Applications",
        title: apps[id].name,
        subtitle: apps[id].description,
        keywords: apps[id].keywords.join(" "),
        icon: icon(id),
        run: () => open(id),
      })),
      ...projects.map((p) => ({
        key: `project-${p.id}`,
        group: "Projects",
        title: p.name,
        subtitle: `${p.category} · ${p.tech.slice(0, 3).join(", ")}`,
        keywords: `${p.tech.join(" ")} ${p.description}`,
        icon: (
          <Image
            src={p.image}
            alt=""
            width={56}
            height={56}
            className="h-7 w-7 rounded-md object-cover object-top"
          />
        ),
        run: () => open("projects", { projectId: p.id }),
      })),
      ...skillCategories.flatMap((c) =>
        c.skills.map((s) => ({
          key: `skill-${s}`,
          group: "Skills",
          title: s,
          subtitle: c.title,
          keywords: c.title,
          icon: <TechLogo name={s} className="h-6 w-6" />,
          run: () => open("skills", { skill: s }),
        })),
      ),
      ...experience.map((e) => ({
        key: `exp-${e.id}`,
        group: "Experience",
        title: `${e.role} · ${e.company}`,
        subtitle: e.period,
        keywords: `${e.summary} ${e.tech.join(" ")}`,
        icon: icon("experience"),
        run: () => open("experience", { experienceId: e.id }),
      })),
      ...profile.education.map((ed) => ({
        key: `edu-${ed.school}`,
        group: "Experience",
        title: ed.school,
        subtitle: ed.degree,
        keywords: "education school university study",
        icon: icon("finder"),
        run: () => open("finder", { section: "education" }),
      })),
      ...Object.values(links).map((l) => ({
        key: `link-${l.id}`,
        group: "Links",
        title: l.name,
        subtitle: l.href.replace(/^https?:\/\//, ""),
        keywords: `${l.id} social profile`,
        icon: l.id === "github" ? icon("github") : icon("safari"),
        run: () => openExternal(l.href),
      })),
      {
        key: "resume",
        group: "Links",
        title: "Resume.pdf",
        subtitle: "View or download my resume",
        keywords: "resume cv pdf download print",
        icon: <AppIcon id="document" className="h-7 w-6" />,
        run: () => open("preview"),
      },
      {
        key: "email",
        group: "Links",
        title: "Email Me",
        subtitle: profile.email,
        keywords: "contact mail message hire",
        icon: icon("mail"),
        run: () => open("mail"),
      },
    ];
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q)
      return all
        .filter((r) => r.group === "Applications")
        .map((r) => ({ ...r, group: "Suggestions" }));
    const counts: Record<string, number> = {};
    return (
      all
        .map((r) => ({ r, s: score(r, q) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .map(({ r }) => r)
        .filter(
          (r) => (counts[r.group] = (counts[r.group] ?? 0) + 1) <= GROUP_LIMIT,
        )
        // Keep groups together in a stable order after ranking.
        .sort((a, b) => groupOrder(a.group) - groupOrder(b.group))
    );
  }, [all, query]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    if (spotlightOpen) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [spotlightOpen]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const choose = (r: Result | undefined) => {
    if (!r) return;
    close();
    r.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const activeId = results[index]
    ? `spotlight-${results[index].key}`
    : undefined;

  return (
    <AnimatePresence>
      {spotlightOpen && (
        <div className="fixed inset-0 z-spotlight" onPointerDown={close}>
          {/* Centering lives on a wrapper because framer-motion owns the panel's transform. */}
          <div className="absolute left-1/2 top-[max(64px,16vh)] w-[min(640px,calc(100vw-24px))] -translate-x-1/2">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Spotlight Search"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 500, damping: 36 }}
              onPointerDown={(e) => e.stopPropagation()}
              className="material-thick overflow-hidden rounded-2xl border hairline text-label shadow-popover"
            >
              <div className="flex items-center gap-3 px-4">
                <SearchIcon className="h-5 w-5 shrink-0 text-label-2" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Spotlight Search"
                  aria-label="Search apps, projects, skills and more"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="spotlight-results"
                  aria-activedescendant={activeId}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-[52px] w-full bg-transparent text-[20px] font-light outline-none placeholder:text-label-3"
                />
                <kbd className="hidden shrink-0 rounded border hairline px-1.5 py-0.5 font-sans text-2xs text-label-3 sm:block">
                  esc
                </kbd>
              </div>
              {results.length > 0 ? (
                <ul
                  ref={listRef}
                  id="spotlight-results"
                  role="listbox"
                  className="mac-scroll max-h-[min(420px,55vh)] overflow-y-auto border-t hairline p-1.5"
                >
                  {results.map((r, i) => (
                    <li key={r.key} role="presentation">
                      {(i === 0 || results[i - 1].group !== r.group) && (
                        <p className="px-2.5 pb-1 pt-2 text-2xs font-semibold text-label-3">
                          {r.group}
                        </p>
                      )}
                      <div
                        id={`spotlight-${r.key}`}
                        role="option"
                        aria-selected={i === index}
                        data-index={i}
                        onPointerMove={() => setIndex(i)}
                        onClick={() => choose(r)}
                        className={`flex cursor-default items-center gap-3 rounded-lg px-2.5 py-1.5 ${
                          i === index ? "bg-accent text-white" : ""
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                          {r.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm2 font-medium">
                            {r.title}
                          </span>
                        </span>
                        <span
                          className={`hidden truncate text-2xs sm:block ${i === index ? "text-white/80" : "text-label-3"}`}
                        >
                          {r.subtitle}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-t hairline px-4 py-6 text-center text-sm2 text-label-2">
                  No results for “{query}”
                </p>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

const groups = [
  "Suggestions",
  "Applications",
  "Projects",
  "Skills",
  "Experience",
  "Links",
];
const groupOrder = (g: string) => groups.indexOf(g);
