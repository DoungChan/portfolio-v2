export interface Project {
   id: string;
   name: string;
   image: string;
   /** Mobile screenshots are portrait and are framed differently. */
   platform: "web" | "mobile";
   category: string;
   year?: string;
   description: string;
   tech: string[];
   github?: string;
   link?: string;
   featured?: boolean;
}

export const projects: Project[] = [
   {
      id: "trading-bot-marketplace",
      name: "Trading Bot Marketplace",
      image: "/web3.png",
      platform: "web",
      category: "Web3",
      description:
         "A Web 3.0 marketplace for trading bots, inspired by OpenSea for NFTs. The work was split into smart contract, front-end and back-end development.",
      tech: ["Solidity", "React", "NestJS", "MongoDB", "Firebase", "Docker"],
      github: "https://github.com/DoungChan/Web3-Tradingbot-Frontend",
      link: "https://web3-tradingbot.vercel.app/",
      featured: true,
   },
   {
      id: "promokh",
      name: "PromoKH",
      image: "/promokh.png",
      platform: "web",
      category: "Web App",
      description:
         "PromoKH is a web application that allows users to create and publish promotions for their products and services.",
      tech: ["Next.js", "Spring Boot", "MongoDB", "Tailwind CSS", "Docker"],
      github: "https://github.com/DoungChan/B8-FullStack--Website--Group1",
      link: "https://promokh.vercel.app/",
      featured: true,
   },
   {
      id: "school-management-system",
      name: "School Management System",
      image: "/sms.png",
      platform: "web",
      category: "Desktop App",
      description: "Helps schools manage students, teachers, classes, schedules, attendance and reports.",
      tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Electron", "Node.js", "Express", "PostgreSQL", "Swagger"],
      github: "https://github.com/incubation-center/Electron-DesktopApp---Group7",
   },
   {
      id: "efind",
      name: "eFind",
      image: "/efind.png",
      platform: "mobile",
      category: "Mobile App",
      description: "A mobile application that helps users find products, services and shops around them.",
      tech: ["Flutter"],
      github: "https://github.com/DoungChan/eFine_NewUI",
   },
   {
      id: "vconnect",
      name: "Vconnect",
      image: "/vconnect.png",
      platform: "mobile",
      category: "Mobile App",
      description:
         "Makes exchanging contacts easier. Users create a QR code containing their name, phone number and social media; scanning it saves those details straight to the other person's phone.",
      tech: ["Flutter"],
      github: "https://github.com/incubation-center/Flutter-app---Group3",
   },
   {
      id: "queue",
      name: "Queue",
      image: "/order.jpg",
      platform: "mobile",
      category: "Android App",
      description:
         "A native Android app that manages customer order queues in a shop, alerting customers when their order is ready so the shop stays calm and quiet.",
      tech: ["Kotlin", "FastAPI"],
      github: "https://github.com/incubation-center/B8-Native--Mobile-Application--Group2",
   },
   {
      id: "ai-recommendation-service",
      name: "AI Recommendation Service",
      image: "/AI-Service.png",
      platform: "web",
      category: "Web App",
      description:
         "A web app that recommends movies, books and music. I challenged myself to design the UX/UI and build the front end within two days.",
      tech: ["Next.js", "React", "Tailwind CSS"],
      github: "https://github.com/DoungChan/AI-Services",
      link: "https://ai-services-nine.vercel.app/",
   },
   {
      id: "m-pos",
      name: "M-POS Landing Page",
      image: "/Home-M-POS.png",
      platform: "web",
      category: "Landing Page",
      description:
         "A fully responsive landing page for a mobile point-of-sale system, showcasing its features, ease of use, security and convenience for businesses of all sizes, with a smooth interactive experience across devices.",
      tech: ["Vue 2", "JavaScript", "CSS3"],
      link: "https://www.m-pos.cc/",
      featured: true,
   },
   {
      id: "skybooking",
      name: "SkyBooking",
      image: "/SKYBOOKING.png",
      platform: "mobile",
      category: "H5 App",
      description:
         "An H5 flight and hotel booking app to search and book by travel dates, destinations and preferences, with intuitive filters and sorting, and real-time data from external APIs.",
      tech: ["HTML5", "CSS3", "JavaScript"],
      link: "https://test-h5.skybooking.cc/",
      featured: true,
   },
   {
      id: "skybooking-backoffice",
      name: "SkyBooking Back Office",
      image: "/skybooking-backoffice.png",
      platform: "web",
      category: "Dashboard",
      description:
         "A centralized back-office dashboard for administrators covering user management, content management, analytics and reporting.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Material UI"],
      link: "https://test-bo.skybooking.cc/auth/login",
   },
   {
      id: "teccadoor",
      name: "Teccadoor",
      image: "/teccadoor.jpg",
      platform: "web",
      category: "AI Tool",
      description:
         "Search the latest technology blogs from around the world written in English and read summaries in Japanese. Uses Llama 3 for translation, improving the accuracy of technical terms.",
      tech: ["Next.js", "Llama 3", "TypeScript"],
      link: "https://teccadoor.kirirom-digital.com/",
      featured: true,
   },
];
