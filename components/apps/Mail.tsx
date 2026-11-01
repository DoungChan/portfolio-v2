"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEnvelope, faPaperPlane, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { profile } from "@/data/profile";
import { useShell } from "@/components/os/ShellContext";
import { Button, SidebarHeading } from "@/components/ui/primitives";

interface Draft {
   name: string;
   email: string;
   subject: string;
   message: string;
}

const empty: Draft = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(d: Draft) {
   const errors: Partial<Record<keyof Draft, string>> = {};
   if (!d.name.trim()) errors.name = "Please enter your name.";
   if (!EMAIL_RE.test(d.email.trim())) errors.email = "Please enter a valid email address.";
   if (d.message.trim().length < 10) errors.message = "Please write a message of at least 10 characters.";
   return errors;
}

const contacts = [
   { label: "LinkedIn", detail: "Connect professionally", href: profile.socials.linkedin, icon: faLinkedin },
   { label: "GitHub", detail: `@${profile.socials.githubHandle}`, href: profile.socials.github, icon: faGithub },
   { label: "Telegram", detail: "Quick chat", href: profile.socials.telegram, icon: faTelegram },
];

function Field({
   label,
   error,
   children,
}: {
   label: string;
   error?: string;
   children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
   const id = `mail-${label.toLowerCase().replace(/\W+/g, "-")}`;
   return (
      <div className="border-b hairline">
         <div className="flex items-center gap-3 px-4">
            <label htmlFor={id} className="w-16 shrink-0 text-sm2 text-label-2">
               {label}
            </label>
            {children({ id, "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : undefined })}
         </div>
         {error && (
            <p id={`${id}-error`} className="px-4 pb-1.5 pl-[92px] text-2xs text-[#ff453a]">
               {error}
            </p>
         )}
      </div>
   );
}

export default function Mail() {
   const { notify } = useShell();
   const [draft, setDraft] = useState<Draft>(empty);
   const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
   const [sent, setSent] = useState(false);

   const set = (key: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((d) => ({ ...d, [key]: e.target.value }));
      if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
   };

   const copyEmail = async () => {
      try {
         await navigator.clipboard.writeText(profile.email);
         notify("Email address copied", profile.email);
      } catch {
         notify("Couldn't access the clipboard", profile.email);
      }
   };

   const send = (e: React.FormEvent) => {
      e.preventDefault();
      const found = validate(draft);
      setErrors(found);
      if (Object.keys(found).length) return;
      // No backend: hand the composed message to the visitor's mail client.
      const subject = draft.subject.trim() || `Hello from ${draft.name.trim()}`;
      const body = `${draft.message.trim()}\n\n— ${draft.name.trim()}\n${draft.email.trim()}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSent(true);
   };

   const input = "h-10 min-w-0 flex-1 bg-transparent text-[14px] text-label outline-none placeholder:text-label-3";

   return (
      <div className="flex h-full">
         <aside className="mac-scroll hidden w-[210px] shrink-0 overflow-y-auto border-r hairline bg-surface-2/70 p-2.5 md:block">
            <SidebarHeading>Mailboxes</SidebarHeading>
            <button
               type="button"
               onClick={() => setSent(false)}
               className="focus-ring flex w-full items-center gap-2 rounded-md bg-separator/10 px-2 py-[5px] text-left text-sm2 font-medium text-label"
            >
               <FontAwesomeIcon icon={faPenToSquare} className="!h-3.5 !w-3.5 text-accent" />
               New Message
            </button>
            <SidebarHeading>Contact</SidebarHeading>
            <button
               type="button"
               onClick={copyEmail}
               className="focus-ring flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left hover:bg-separator/[0.05]"
            >
               <FontAwesomeIcon icon={faEnvelope} className="mt-0.5 !h-3.5 !w-3.5 text-accent" />
               <span className="min-w-0">
                  <span className="block text-sm2 text-label">Email</span>
                  <span className="block truncate text-2xs text-label-3">{profile.email}</span>
               </span>
            </button>
            {contacts.map((c) => (
               <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-separator/[0.05]"
               >
                  <FontAwesomeIcon icon={c.icon} className="mt-0.5 !h-3.5 !w-3.5 text-accent" />
                  <span className="min-w-0">
                     <span className="block text-sm2 text-label">{c.label}</span>
                     <span className="block truncate text-2xs text-label-3">{c.detail}</span>
                  </span>
               </a>
            ))}
         </aside>

         <div className="flex min-w-0 flex-1 flex-col bg-surface">
            {sent ? (
               <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                     <FontAwesomeIcon icon={faPaperPlane} className="!h-6 !w-6" />
                  </span>
                  <h2 className="text-[17px] font-semibold text-label">Your message is ready</h2>
                  <p className="max-w-sm text-sm2 text-label-2">
                     Your email app should have opened with the message filled in — just press send. If nothing opened,
                     copy my address and write to me directly.
                  </p>
                  <div className="mt-1 flex flex-wrap justify-center gap-2">
                     <Button icon={faCopy} onClick={copyEmail}>
                        Copy Address
                     </Button>
                     <Button
                        variant="primary"
                        onClick={() => {
                           setDraft(empty);
                           setSent(false);
                        }}
                     >
                        New Message
                     </Button>
                  </div>
               </div>
            ) : (
               <form onSubmit={send} noValidate className="flex min-h-0 flex-1 flex-col">
                  <div className="flex h-11 shrink-0 items-center justify-between border-b hairline px-3">
                     <span className="text-sm2 font-semibold text-label">New Message</span>
                     <Button type="submit" variant="primary" icon={faPaperPlane}>
                        Send
                     </Button>
                  </div>
                  <div className="flex items-center gap-3 border-b hairline px-4">
                     <span className="w-16 shrink-0 text-sm2 text-label-2">To:</span>
                     <span className="my-2 inline-flex min-w-0 items-center gap-1 truncate rounded-full bg-accent/10 px-2.5 py-1 text-sm2 text-accent">
                        {profile.name} &lt;{profile.email}&gt;
                     </span>
                  </div>
                  <Field label="From:" error={errors.name}>
                     {(p) => (
                        <input
                           {...p}
                           value={draft.name}
                           onChange={set("name")}
                           placeholder="Your name"
                           autoComplete="name"
                           className={input}
                        />
                     )}
                  </Field>
                  <Field label="Reply-To:" error={errors.email}>
                     {(p) => (
                        <input
                           {...p}
                           type="email"
                           value={draft.email}
                           onChange={set("email")}
                           placeholder="you@example.com"
                           autoComplete="email"
                           className={input}
                        />
                     )}
                  </Field>
                  <Field label="Subject:">
                     {(p) => (
                        <input
                           {...p}
                           value={draft.subject}
                           onChange={set("subject")}
                           placeholder="Let's work together"
                           className={input}
                        />
                     )}
                  </Field>
                  <label htmlFor="mail-message" className="sr-only">
                     Message
                  </label>
                  <textarea
                     id="mail-message"
                     value={draft.message}
                     onChange={set("message")}
                     aria-invalid={!!errors.message}
                     aria-describedby={errors.message ? "mail-message-error" : undefined}
                     placeholder={`Hi ${profile.shortName},\n\nI'd love to talk about…`}
                     className="mac-scroll min-h-[140px] flex-1 resize-none bg-transparent px-4 py-3 text-[14px] leading-relaxed text-label outline-none placeholder:text-label-3"
                  />
                  {errors.message && (
                     <p id="mail-message-error" className="px-4 pb-3 text-2xs text-[#ff453a]">
                        {errors.message}
                     </p>
                  )}
                  {/* Phones have no sidebar, so surface the other channels here. */}
                  <div className="flex flex-wrap gap-2 border-t hairline p-3 md:hidden">
                     <Button icon={faCopy} onClick={copyEmail}>
                        Copy Email
                     </Button>
                     {contacts.map((c) => (
                        <a
                           key={c.label}
                           href={c.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label={c.label}
                           className="focus-ring inline-flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border hairline text-label"
                        >
                           <FontAwesomeIcon icon={c.icon} className="!h-3.5 !w-3.5" />
                        </a>
                     ))}
                  </div>
               </form>
            )}
         </div>
      </div>
   );
}
