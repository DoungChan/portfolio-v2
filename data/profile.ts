// Personal information shown across the Finder, Terminal, Mail and Spotlight apps.
// Fields marked TODO are sensible placeholders — replace them with real details.

export const profile = {
  name: "Sroeun Doungchan",
  shortName: "Doungchan",
  role: "Front-end Developer",
  location: "Phnom Penh, Cambodia", // TODO: confirm
  yearsOfExperience: 4,
  email: "doungchansroeun@gmail.com",
  avatar: "/profile-v3.jpeg",
  portrait: "/about.jpeg",
  // Generated from the résumé page with `npm run resume:pdf` (see README).
  cv: "/resume.pdf",
  cvFileName: "Sroeun-Doungchan-Resume.pdf",
  website: "https://doungchan.vercel.app", // TODO: confirm production URL
  availability: "Currently at ABA Bank",
  // Set to true (and update `availability`) to show the green "available" dot.
  openToWork: false,
  headline:
    "A qualified software engineer with 4 years of experience with excellent front-end and mobile app development and designing skills, as well as a flexible working environment, responsibility, and willingness to learn new things.",
  // Professional summary at the top of the résumé. TODO: review wording
  summary:
    "Front-end developer with 4+ years of experience building web and mobile products with Nuxt, Vue, React and Flutter. Currently building banking web applications at ABA Bank with Nuxt and Tailwind CSS, using an AI-assisted workflow with Claude Code and GitHub Copilot. Focused on clean, accessible interfaces, maintainable code and shipping quickly.",
  bio: [
    "I'm a software developer passionate about building innovative and user-friendly products. I believe in continuous learning and value the insights gained from collaborating with others.",
    "I am a qualified software engineer with 4 years of experience with a demonstrated history of working in the information technology and services industry. Skilled in JavaScript, React, Node.js, MongoDB, Express.js, and TypeScript.",
    "Feel free to explore my portfolio for project examples. If you have any questions or collaboration opportunities, let's connect and create remarkable solutions together.",
  ],
  philosophy: [
    "Ship small, ship often — fast feedback beats big reveals.",
    "Design is part of engineering: details users feel matter.",
    "Readable code is a feature for the next developer.",
    "Keep learning; every project teaches something new.",
  ],
  socials: {
    github: "https://github.com/DoungChan",
    githubHandle: "DoungChan",
    linkedin: "https://www.linkedin.com/in/doungchan-sroeun-9524a8253/",
    telegram: "https://t.me/chann_00",
  },
  education: [
    {
      school: "Kirirom Institute of Technology (KIT)",
      degree: "Bachelor of Software Engineering",
      period: "2019 – 2023", // TODO: confirm
    },
    {
      school: "Pheam Cheang High School",
      degree: "High School Diploma",
      period: "2016 – 2019", // TODO: confirm
    },
  ],
  achievements: [
    "PI Approximation Day certificate",
    "Jobify volunteer certificate",
  ],
  languages: [
    { name: "Khmer", level: "Native" },
    { name: "English", level: "Professional working proficiency" }, // TODO: confirm
  ],
};

export type Profile = typeof profile;
