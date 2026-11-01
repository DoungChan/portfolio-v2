import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

// A4 at 96dpi. The same markup is shown in the Preview app and printed to /resume.pdf,
// so it uses fixed paper colours rather than the theme tokens.
export const A4_WIDTH = 794;

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
   return (
      <section className="mt-5 break-inside-avoid-page">
         <h2 className="mb-2 flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0a5bd3]">
            {title}
            <span className="h-px flex-1 bg-[#d9dee7]" />
         </h2>
         {children}
      </section>
   );
}

export function ResumeDocument() {
   const featured = projects.filter((p) => p.featured);
   const contacts = [
      { label: profile.location },
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: strip(profile.socials.github), href: profile.socials.github },
      { label: "linkedin.com/in/doungchan-sroeun", href: profile.socials.linkedin },
      { label: strip(profile.website), href: profile.website },
   ];

   return (
      <article
         className="resume-sheet mx-auto bg-white px-[52px] py-[46px] font-sans text-[11px] leading-[1.5] text-[#1d1d1f] [print-color-adjust:exact]"
         style={{ width: A4_WIDTH, minHeight: 1123 }}
      >
         <header>
            <h1 className="text-[28px] font-bold leading-tight tracking-tight">{profile.name}</h1>
            <p className="mt-0.5 text-[14px] font-medium text-[#0a5bd3]">{profile.role}</p>
            <p className="mt-2 flex flex-wrap gap-x-2 text-[10.5px] text-[#55575e]">
               {contacts.map((c, i) => (
                  <span key={c.label} className="flex gap-2">
                     {i > 0 && <span aria-hidden="true">·</span>}
                     {c.href ? (
                        <a href={c.href} className="text-[#55575e] no-underline">
                           {c.label}
                        </a>
                     ) : (
                        c.label
                     )}
                  </span>
               ))}
            </p>
         </header>

         <Section title="Summary">
            <p className="text-[#33353b]">{profile.summary}</p>
         </Section>

         <Section title="Experience">
            <div className="space-y-3.5">
               {experience.map((e) => (
                  <div key={e.id} className="break-inside-avoid">
                     <div className="flex items-baseline justify-between gap-4">
                        <p className="text-[12px]">
                           <span className="font-semibold">{e.role}</span>
                           <span className="text-[#55575e]"> · {e.company}</span>
                        </p>
                        <p className="shrink-0 text-[10.5px] font-medium text-[#55575e]">{e.period}</p>
                     </div>
                     <ul className="mt-1 space-y-0.5 text-[#33353b]">
                        {e.highlights.map((h) => (
                           <li key={h} className="relative pl-3 before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[#8a8d96]">
                              {h}
                           </li>
                        ))}
                     </ul>
                     <p className="mt-1 text-[10px] text-[#6e7079]">{e.tech.join(" · ")}</p>
                  </div>
               ))}
            </div>
         </Section>

         <Section title="Selected Projects">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
               {featured.map((p) => (
                  <div key={p.id} className="break-inside-avoid">
                     <p className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold">{p.name}</span>
                        {p.link && (
                           <a href={p.link} className="truncate text-[10px] text-[#0a5bd3] no-underline">
                              {strip(p.link)}
                           </a>
                        )}
                     </p>
                     <p className="text-[#33353b]">{p.description}</p>
                     <p className="text-[10px] text-[#6e7079]">{p.tech.join(" · ")}</p>
                  </div>
               ))}
            </div>
         </Section>

         <Section title="Skills">
            <dl className="space-y-1">
               {skillCategories.map((c) => (
                  <div key={c.id} className="flex gap-3">
                     <dt className="w-[150px] shrink-0 font-semibold">{c.title}</dt>
                     <dd className="text-[#33353b]">{c.skills.join(", ")}</dd>
                  </div>
               ))}
            </dl>
         </Section>

         <div className="grid grid-cols-[1.4fr_1fr] gap-x-8">
            <Section title="Education">
               <div className="space-y-1.5">
                  {profile.education.map((ed) => (
                     <div key={ed.school}>
                        <div className="flex items-baseline justify-between gap-3">
                           <p className="font-semibold">{ed.school}</p>
                           <p className="shrink-0 text-[10.5px] text-[#55575e]">{ed.period}</p>
                        </div>
                        <p className="text-[#33353b]">{ed.degree}</p>
                     </div>
                  ))}
               </div>
            </Section>
            <div>
               <Section title="Languages">
                  {profile.languages.map((l) => (
                     <p key={l.name}>
                        <span className="font-semibold">{l.name}</span>
                        <span className="text-[#55575e]"> — {l.level}</span>
                     </p>
                  ))}
               </Section>
               <Section title="Achievements">
                  {profile.achievements.map((a) => (
                     <p key={a} className="text-[#33353b]">
                        {a}
                     </p>
                  ))}
               </Section>
            </div>
         </div>
      </article>
   );
}
