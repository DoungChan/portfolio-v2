// Work history for the Experience app, newest first. Remaining TODOs need exact dates
// and details.

export interface Experience {
   id: string;
   company: string;
   role: string;
   period: string;
   location: string;
   type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance";
   summary: string;
   highlights: string[];
   tech: string[];
}

export const experience: Experience[] = [
   {
      id: "aba-bank",
      company: "ABA Bank",
      role: "Front-end Developer",
      period: "2025 – Present", // TODO: confirm start year
      location: "Phnom Penh, Cambodia",
      type: "Full-time",
      summary:
         "Building banking web applications with Nuxt and Tailwind CSS, using AI-assisted development to ship faster without compromising quality.",
      highlights: [
         // TODO: replace with concrete products and outcomes you can share
         "Develop and maintain customer-facing and internal web features with Nuxt, Vue and TypeScript.",
         "Build consistent, responsive interfaces with Tailwind CSS and reusable components.",
         "Use AI coding tools such as Claude Code and GitHub Copilot day to day for implementation, refactoring and code review.",
      ],
      tech: ["Nuxt", "Vue", "TypeScript", "Tailwind CSS", "Claude Code", "GitHub Copilot"],
   },
   {
      id: "kirirom-digital",
      company: "Kirirom Digital",
      role: "Software Engineer", // TODO: confirm title
      period: "2024 – 2025", // TODO: confirm dates
      location: "Phnom Penh, Cambodia",
      type: "Full-time",
      summary: "Worked on AI-assisted products for Japanese clients, focusing on front-end architecture and UX.",
      highlights: [
         "Built Teccadoor, a tech-blog search tool that translates articles to Japanese using Llama 3.",
         "Designed and shipped the AI Recommendation Service UI end to end in two days.",
      ],
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
   },
   {
      id: "skybooking",
      company: "SkyBooking",
      role: "Front-end Developer", // TODO: confirm title
      period: "2023 – 2024", // TODO: confirm start year
      location: "Phnom Penh, Cambodia",
      type: "Full-time",
      summary: "Built consumer booking experiences and internal tooling for a flight and hotel booking platform.",
      highlights: [
         "Built the H5 flight and hotel booking app with search, filters and real-time availability.",
         "Developed the back-office dashboard for user, content and booking management.",
         "Delivered the responsive M-POS marketing landing page in Vue 2.",
      ],
      tech: ["Vue", "React", "JavaScript", "Material UI", "Node.js"],
   },
   {
      id: "incubation-center",
      company: "Incubation Center", // TODO: confirm organisation
      role: "Full-stack Developer Trainee", // TODO: confirm title
      period: "2022 – 2023", // TODO: confirm dates
      location: "Cambodia",
      type: "Internship",
      summary: "Intensive product-team program building web, desktop and mobile apps across the stack.",
      highlights: [
         "Built a School Management System desktop app with Electron, React and PostgreSQL.",
         "Delivered PromoKH with Next.js and Spring Boot, and the Queue Android app with Kotlin.",
         "Shipped the Vconnect Flutter app for QR-based contact sharing.",
      ],
      tech: ["React", "Next.js", "Spring Boot", "Flutter", "Kotlin", "PostgreSQL"],
   },
];
