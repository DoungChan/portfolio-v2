import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { SETTINGS_STORAGE_KEY } from "@/lib/storage";
import { profile } from "@/data/profile";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const description = `${profile.name} is a ${profile.role.toLowerCase()} with ${profile.yearsOfExperience} years of experience building web and mobile products with React, Next.js, Vue and Flutter.`;

export const metadata: Metadata = {
   metadataBase: new URL(profile.website),
   title: {
      default: `${profile.name} — ${profile.role}`,
      template: `%s · ${profile.name}`,
   },
   description,
   keywords: ["Sroeun Doungchan", "Front-end Developer", "React", "Next.js", "Vue", "Flutter", "Portfolio", "Cambodia"],
   authors: [{ name: profile.name, url: profile.socials.github }],
   openGraph: {
      type: "website",
      title: `${profile.name} — ${profile.role}`,
      description,
      images: [{ url: "/ogp.png", width: 1440, height: 1024 }],
   },
   twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.role}`,
      description,
      images: ["/ogp.png"],
   },
   icons: {
      icon: [
         { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
         { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
   },
};

export const viewport: Viewport = {
   themeColor: "#141428",
   width: "device-width",
   initialScale: 1,
   viewportFit: "cover",
};

// Applies the saved appearance before first paint to avoid a light/dark flash.
const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
   SETTINGS_STORAGE_KEY,
)})||"{}");var a=s.appearance||"auto";var d=a==="dark"||(a==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

const personJsonLd = {
   "@context": "https://schema.org",
   "@type": "Person",
   name: profile.name,
   jobTitle: profile.role,
   email: `mailto:${profile.email}`,
   url: profile.website,
   sameAs: [profile.socials.github, profile.socials.linkedin],
   alumniOf: profile.education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={inter.variable} suppressHydrationWarning>
         <head>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
         </head>
         <body>{children}</body>
      </html>
   );
}
