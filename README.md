# Sroeun Doungchan — Portfolio (v3)

A developer portfolio presented as a macOS-inspired desktop: menu bar, Dock with magnification, draggable windows, Spotlight search and a set of "apps" for each portfolio section. Built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS and Framer Motion.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing content

All portfolio content lives in `data/` — no component changes needed:

| File                 | Used by                                       |
| -------------------- | --------------------------------------------- |
| `data/profile.ts`    | Finder (About), Terminal, Mail, SEO metadata  |
| `data/projects.ts`   | Projects, Safari, Spotlight                   |
| `data/experience.ts` | Experience, Terminal, Spotlight               |
| `data/skills.ts`     | Skills, Terminal, Spotlight                   |

Fields marked `// TODO` are placeholders to replace with real details. Project screenshots go in `public/`. Technology logos are in `components/icons/techLogos.tsx`; skills without a logo render as a monogram.

## Résumé

The résumé is generated from the same `data/` files. It opens in the Preview app (`/resume`), and its printable version is at `/print/resume`. After you change any content, regenerate the downloadable PDF while the app is running:

```bash
npm run dev            # in one terminal
npm run resume:pdf     # writes public/resume.pdf using your installed Chrome
```

Set `CHROME_PATH` if Chrome isn't found, or `RESUME_URL` to print from another host.

## Structure

```
app/                 Routes (/, /about, /project, /skill, /experience, /contact) + metadata, sitemap, robots
components/os/       Desktop shell: Desktop, MenuBar, Dock, Window, WindowManager, Spotlight, ControlCenter, …
components/apps/     One component per app (Finder, Safari, Terminal, Projects, Skills, Experience, Mail, Settings)
components/ui/       Shared primitives (buttons, tags, toggles, tech logos, project images)
lib/apps.ts          App registry: names, routes, window sizes, Dock order
data/                Portfolio content
```

Each route renders the same desktop with its app already open, so every section is server-rendered and shareable. Focusing a window updates the URL.

## Keyboard shortcuts

- `⌘K` / `Ctrl K` — Spotlight search (↑/↓ to move, Enter to open, Esc to close)
- Double-click a title bar — zoom / restore
- Terminal: `help` lists commands; ↑/↓ history, Tab completion, `Ctrl L` clears
