"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { AppId, appIds, apps } from "@/lib/apps";
import { useWindowManager } from "@/components/os/WindowManager";
import type { AppProps } from "./types";

const USER = profile.shortName.toLowerCase();
const HOST = "portfolio";

type Line = { id: number; node: React.ReactNode };
type Open = (id: AppId, payload?: Record<string, string>) => void;

const c = {
  green: "text-[#32d74b]",
  cyan: "text-[#64d2ff]",
  yellow: "text-[#ffd60a]",
  pink: "text-[#ff6482]",
  purple: "text-[#bf5af2]",
  dim: "text-[#8e8e93]",
  red: "text-[#ff453a]",
};

const LOGO = String.raw` ███████╗██████╗
 ██╔════╝██╔══██╗
 ███████╗██║  ██║
 ╚════██║██║  ██║
 ███████║██████╔╝
 ╚══════╝╚═════╝ `;

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${c.cyan} underline decoration-dotted underline-offset-2 hover:decoration-solid`}
    >
      {children}
    </a>
  );
}

function Neofetch() {
  const cat = (id: string) =>
    skillCategories.find((s) => s.id === id)?.skills.join(", ");
  const rows: [string, React.ReactNode][] = [
    ["Role", profile.role],
    ["Location", profile.location],
    ["Experience", `${profile.yearsOfExperience}+ years`],
    ["Languages", cat("languages")],
    ["Front-end", cat("frontend")],
    ["Mobile", cat("mobile")],
    ["Back-end", cat("backend")],
    ["Shell", "zsh (portfolio edition)"],
    ["Contact", profile.email],
  ];
  return (
    <div className="flex gap-6 py-1">
      <pre
        className={`hidden shrink-0 bg-gradient-to-b from-[#64d2ff] to-[#bf5af2] bg-clip-text font-bold leading-[1.15] text-transparent sm:block`}
      >
        {LOGO}
      </pre>
      <div className="min-w-0">
        <p>
          <span className={c.green}>{USER}</span>@
          <span className={c.green}>{HOST}</span>
        </p>
        <p className={c.dim}>{"-".repeat(USER.length + HOST.length + 1)}</p>
        {rows.map(([k, v]) => (
          <p key={k}>
            <span className={c.yellow}>{k}</span>: {v}
          </p>
        ))}
        <p className="mt-1.5 flex gap-0">
          {[
            "#ff453a",
            "#ff9f0a",
            "#ffd60a",
            "#32d74b",
            "#64d2ff",
            "#0a84ff",
            "#bf5af2",
            "#e5e5ea",
          ].map((col) => (
            <span
              key={col}
              className="inline-block h-3 w-5"
              style={{ background: col }}
            />
          ))}
        </p>
      </div>
    </div>
  );
}

interface Command {
  description: string;
  run: (args: string[], open: Open) => React.ReactNode | "clear";
}

const files: Record<string, string> = {
  "about.txt": "about",
  "skills.txt": "skills",
  "experience.txt": "experience",
  "contact.txt": "contact",
  "philosophy.md": "philosophy",
};

const commands: Record<string, Command> = {
  help: {
    description: "List available commands",
    run: () => (
      <div>
        <p>Available commands:</p>
        {Object.entries(commands).map(([name, cmd]) => (
          <p key={name}>
            <span className={`${c.green} inline-block w-28`}>{name}</span>
            <span className={c.dim}>{cmd.description}</span>
          </p>
        ))}
        <p className={`${c.dim} mt-1`}>
          Tip: ↑/↓ browse history, Tab completes, Ctrl+L clears.
        </p>
      </div>
    ),
  },
  whoami: {
    description: "Who is behind this portfolio",
    run: () => `${profile.name} — ${profile.role}`,
  },
  neofetch: {
    description: "Developer profile at a glance",
    run: () => <Neofetch />,
  },
  about: {
    description: "Professional summary",
    run: () => (
      <div className="space-y-2">
        {profile.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    ),
  },
  skills: {
    description: "Technical expertise by category",
    run: () => (
      <div>
        {skillCategories.map((cat) => (
          <p key={cat.id}>
            <span className={`${c.yellow} inline-block w-36`}>{cat.title}</span>
            {cat.skills.join(" · ")}
          </p>
        ))}
      </div>
    ),
  },
  projects: {
    description: "Selected projects",
    run: (_, open) => (
      <div>
        {projects.map((p) => (
          <p key={p.id}>
            <button
              type="button"
              onClick={() => open("projects", { projectId: p.id })}
              className={`${c.cyan} hover:underline`}
            >
              {p.name}
            </button>
            <span className={c.dim}> — {p.tech.slice(0, 4).join(", ")}</span>
          </p>
        ))}
        <p className={`${c.dim} mt-1`}>
          Click a project to open it, or run `open projects`.
        </p>
      </div>
    ),
  },
  experience: {
    description: "Work history",
    run: () => (
      <div className="space-y-1">
        {experience.map((e) => (
          <p key={e.id}>
            <span className={c.yellow}>{e.period.padEnd(16, " ")}</span>
            {e.role} <span className={c.dim}>@</span>{" "}
            <span className={c.purple}>{e.company}</span>
          </p>
        ))}
      </div>
    ),
  },
  philosophy: {
    description: "How I like to build software",
    run: () => (
      <div>
        {profile.philosophy.map((p, i) => (
          <p key={p}>
            <span className={c.pink}>{i + 1}.</span> {p}
          </p>
        ))}
      </div>
    ),
  },
  contact: {
    description: "Ways to reach me",
    run: () => (
      <div>
        <p>
          <span className={`${c.yellow} inline-block w-24`}>Email</span>
          <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
        </p>
        <p>
          <span className={`${c.yellow} inline-block w-24`}>GitHub</span>
          <Link href={profile.socials.github}>
            github.com/{profile.socials.githubHandle}
          </Link>
        </p>
        <p>
          <span className={`${c.yellow} inline-block w-24`}>LinkedIn</span>
          <Link href={profile.socials.linkedin}>linkedin.com/in/…</Link>
        </p>
        <p>
          <span className={`${c.yellow} inline-block w-24`}>Telegram</span>
          <Link href={profile.socials.telegram}>t.me/…</Link>
        </p>
      </div>
    ),
  },
  resume: {
    description: "Preview and download my resume",
    run: (_, open) => {
      open("preview");
      return (
        <span>
          Opening Résumé.pdf in Preview… or download it directly:{" "}
          <a
            href={profile.cv}
            download={profile.cvFileName}
            className={`${c.cyan} underline decoration-dotted underline-offset-2`}
          >
            {profile.cvFileName}
          </a>
        </span>
      );
    },
  },
  open: {
    description: "Open an app, e.g. `open projects`",
    run: (args, open) => {
      const name = args.join(" ").toLowerCase();
      const id = appIds.find(
        (a) => a === name || apps[a].name.toLowerCase() === name,
      );
      if (!id)
        return (
          <span className={c.red}>
            open: unknown app &quot;{name}&quot;. Try: {appIds.join(", ")}
          </span>
        );
      open(id);
      return `Opening ${apps[id].name}…`;
    },
  },
  ls: {
    description: "List files",
    run: () => (
      <p className="flex flex-wrap gap-x-5">
        {Object.keys(files).map((f) => (
          <span key={f}>{f}</span>
        ))}
        <span className={c.cyan}>projects/</span>
      </p>
    ),
  },
  cat: {
    description: "Print a file, e.g. `cat about.txt`",
    run: (args, open) => {
      const target = files[args[0]];
      if (!target)
        return (
          <span className={c.red}>
            cat: {args[0] ?? ""}: No such file or directory
          </span>
        );
      return commands[target].run([], open);
    },
  },
  date: {
    description: "Show the current date",
    run: () => new Date().toString(),
  },
  echo: { description: "Print text", run: (args) => args.join(" ") },
  clear: { description: "Clear the screen", run: () => "clear" },
};

function Prompt() {
  return (
    <span className="shrink-0">
      <span className={c.green}>
        {USER}@{HOST}
      </span>{" "}
      <span className={c.cyan}>~</span> %&nbsp;
    </span>
  );
}

export default function Terminal({ payload, payloadVersion }: AppProps) {
  const { open } = useWindowManager();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const run = (raw: string) => {
    const text = raw.trim();
    const [name, ...args] = text.split(/\s+/);
    const echo: Line = {
      id: nextId.current++,
      node: (
        <p className="flex">
          <Prompt />
          <span className="break-all">{raw}</span>
        </p>
      ),
    };
    if (!text) return setLines((l) => [...l, echo]);
    setHistory((h) => [...h, text]);
    const cmd = commands[name.toLowerCase()];
    const result = cmd ? (
      cmd.run(args, open)
    ) : (
      <span>
        zsh: command not found: {name}. Type{" "}
        <span className={c.green}>help</span> to see what&apos;s available.
      </span>
    );
    if (result === "clear") return setLines([]);
    setLines((l) => [
      ...l,
      echo,
      { id: nextId.current++, node: <div className="mb-2">{result}</div> },
    ]);
  };

  // Boot: greet with the profile, then run any command the window was opened with.
  useEffect(() => {
    const login = new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setLines([
      {
        id: nextId.current++,
        node: <p className={c.dim}>Last login: {login} on ttys000</p>,
      },
    ]);
    run("neofetch");
    if (payload?.command) run(payload.command);
    inputRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (payloadVersion > 1 && payload?.command) run(payload.command);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadVersion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      setCursor(null);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const i = cursor + 1;
      setCursor(i >= history.length ? null : i);
      setInput(i >= history.length ? "" : history[i]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [first, ...rest] = input.split(" ");
      if (rest.length === 0) {
        const match = Object.keys(commands).filter((k) => k.startsWith(first));
        if (match.length === 1) setInput(`${match[0]} `);
      } else if (first === "open" || first === "cat") {
        const pool = first === "open" ? appIds : Object.keys(files);
        const match = pool.filter((k) => k.startsWith(rest.join(" ")));
        if (match.length === 1) setInput(`${first} ${match[0]}`);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={scrollRef}
      onMouseUp={() => {
        // Focus the prompt on click, but don't steal a text selection.
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
      className="mac-scroll h-full cursor-text overflow-y-auto bg-[#1c1c1e] p-3 font-mono text-[12.5px] leading-[1.55] text-[#e5e5ea] selection:bg-[#64d2ff]/30"
    >
      {lines.map((l) => (
        <Fragment key={l.id}>{l.node}</Fragment>
      ))}
      <div className="flex">
        <Prompt />
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-[#e5e5ea] caret-[#e5e5ea] outline-none"
        />
      </div>
    </div>
  );
}
