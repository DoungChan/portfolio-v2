// Skill names match the keys in components/icons/techLogos.tsx where a logo exists;
// others render as a monogram badge.

export interface SkillCategory {
   id: string;
   title: string;
   description: string;
   skills: string[];
}

export const skillCategories: SkillCategory[] = [
   {
      id: "languages",
      title: "Languages",
      description: "Day-to-day programming languages.",
      skills: ["JavaScript", "TypeScript", "Java", "Dart", "Kotlin", "HTML5", "CSS3"],
   },
   {
      id: "frontend",
      title: "Front-end",
      description: "Frameworks and UI libraries for the web.",
      skills: ["React", "Next.js", "Vue", "Nuxt", "Tailwind CSS", "Material UI"],
   },
   {
      id: "mobile",
      title: "Mobile",
      description: "Cross-platform and native mobile development.",
      skills: ["Flutter", "Android (Kotlin)", "H5 / Mobile Web"],
   },
   {
      id: "backend",
      title: "Back-end",
      description: "APIs, services and data stores.",
      skills: ["Node.js", "Express", "NestJS", "Spring Boot", "MongoDB", "PostgreSQL", "Firebase"],
   },
   {
      id: "tools",
      title: "Tools & Workflow",
      description: "Shipping, collaboration and design tooling.",
      skills: ["Git", "Docker", "Vite", "Electron", "Swagger", "Figma"],
   },
   {
      id: "ai",
      title: "AI-Assisted Development",
      description: "AI coding tools I use in daily work.",
      skills: ["Claude Code", "GitHub Copilot"],
   },
];

export const allSkills = skillCategories.flatMap((c) => c.skills);
