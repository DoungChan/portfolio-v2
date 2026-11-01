import { profile } from "@/data/profile";

export type AppId =
  | "finder"
  | "safari"
  | "terminal"
  | "projects"
  | "skills"
  | "experience"
  | "mail"
  | "settings"
  | "preview";

export interface AppMeta {
  id: AppId;
  /** Name shown in the Dock, menu bar and Spotlight. */
  name: string;
  /** Window title. */
  title: string;
  description: string;
  keywords: string[];
  /** Route that deep-links to this app (kept in sync with the focused window). */
  route?: string;
  /** Preferred window size on desktop, clamped to the viewport. */
  size: { w: number; h: number };
}

export const apps: Record<AppId, AppMeta> = {
  finder: {
    id: "finder",
    name: "Finder",
    title: "About Me",
    description: "Introduction, background and education",
    keywords: [
      "about",
      "me",
      "bio",
      "profile",
      "education",
      "achievement",
      "language",
    ],
    route: "/about",
    size: { w: 860, h: 560 },
  },
  safari: {
    id: "safari",
    name: "Safari",
    title: "Safari",
    description: "Browse featured work and live sites",
    keywords: ["browser", "website", "portfolio", "live", "demo", "featured"],
    size: { w: 1000, h: 640 },
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    title: `${profile.shortName.toLowerCase()} — zsh`,
    description: "Developer profile in the shell",
    keywords: ["shell", "cli", "command", "developer", "philosophy", "whoami"],
    size: { w: 720, h: 470 },
  },
  projects: {
    id: "projects",
    name: "Projects",
    title: "Projects",
    description: "Things I've designed and built",
    keywords: ["work", "portfolio", "apps", "github", "demo"],
    route: "/project",
    size: { w: 1040, h: 660 },
  },
  skills: {
    id: "skills",
    name: "Skills",
    title: "Technical Skills",
    description: "Languages, frameworks and tools",
    keywords: [
      "technology",
      "stack",
      "tech",
      "frameworks",
      "languages",
      "tools",
    ],
    route: "/skill",
    size: { w: 820, h: 600 },
  },
  experience: {
    id: "experience",
    name: "Experience",
    title: "Work Experience",
    description: "Career history and education",
    keywords: ["work", "job", "career", "timeline", "company", "education"],
    route: "/experience",
    size: { w: 840, h: 620 },
  },
  mail: {
    id: "mail",
    name: "Mail",
    title: "New Message",
    description: "Get in touch",
    keywords: ["contact", "email", "message", "hire", "linkedin", "telegram"],
    route: "/contact",
    size: { w: 820, h: 580 },
  },
  settings: {
    id: "settings",
    name: "System Settings",
    title: "System Settings",
    description: "Appearance, wallpaper and motion",
    keywords: [
      "preferences",
      "theme",
      "dark",
      "light",
      "wallpaper",
      "motion",
      "dock",
    ],
    size: { w: 720, h: 520 },
  },
  preview: {
    id: "preview",
    name: "Preview",
    title: "Resume.pdf",
    description: "View and download my resume",
    keywords: ["resume", "resume", "cv", "pdf", "download", "print"],
    route: "/resume",
    size: { w: 900, h: 760 },
  },
};

export const appIds = Object.keys(apps) as AppId[];

/** Order of apps in the Dock (left of the separator). */
export const dockApps: AppId[] = [
  "finder",
  "safari",
  "terminal",
  "projects",
  "skills",
  "experience",
  "mail",
  "settings",
];

/** Smaller set shown in the Dock on phones; everything else lives on the home grid. */
export const mobileDockApps: AppId[] = [
  "finder",
  "projects",
  "experience",
  "mail",
];

export interface ExternalLink {
  id: "github" | "linkedin" | "telegram";
  name: string;
  href: string;
}

export const links: Record<ExternalLink["id"], ExternalLink> = {
  github: { id: "github", name: "GitHub", href: profile.socials.github },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    href: profile.socials.linkedin,
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    href: profile.socials.telegram,
  },
};

export function appForPath(pathname: string | null): AppId | null {
  if (!pathname || pathname === "/") return null;
  return appIds.find((id) => apps[id].route === pathname) ?? null;
}

export function openExternal(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}
