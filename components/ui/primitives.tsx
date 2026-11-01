import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

type ButtonVariant = "primary" | "secondary" | "plain";

const buttonBase =
   "focus-ring inline-flex items-center justify-center gap-1.5 rounded-[7px] px-3 h-[28px] text-sm2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const buttonVariants: Record<ButtonVariant, string> = {
   primary: "bg-accent text-white shadow-[0_1px_1px_rgba(0,0,0,0.15)] hover:bg-accent/90 active:bg-accent/80",
   secondary:
      "bg-surface text-label border hairline shadow-[0_1px_1px_rgba(0,0,0,0.06)] hover:bg-surface-2 dark:bg-surface-3 dark:hover:bg-surface-3/80",
   plain: "text-accent hover:bg-accent/10",
};

export function buttonClass(variant: ButtonVariant = "secondary", className = "") {
   return `${buttonBase} ${buttonVariants[variant]} ${className}`;
}

export function Button({
   variant = "secondary",
   icon,
   className = "",
   children,
   ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: IconDefinition }) {
   return (
      <button type="button" className={buttonClass(variant, className)} {...props}>
         {icon && <FontAwesomeIcon icon={icon} className="!h-3 !w-3" />}
         {children}
      </button>
   );
}

/** Button-styled link to an external site. */
export function ExternalLink({
   href,
   variant = "secondary",
   icon = faArrowUpRightFromSquare,
   className = "",
   children,
}: {
   href: string;
   variant?: ButtonVariant;
   icon?: IconDefinition;
   className?: string;
   children: React.ReactNode;
}) {
   return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)}>
         <FontAwesomeIcon icon={icon} className="!h-3 !w-3" />
         {children}
         <span className="sr-only">(opens in a new tab)</span>
      </a>
   );
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
   return (
      <span
         className={`inline-flex items-center rounded-full bg-separator/[0.07] px-2 py-[2px] text-2xs font-medium text-label-2 ${className}`}
      >
         {children}
      </span>
   );
}

/** Finder-style sidebar row. */
export function SidebarItem({
   active,
   icon,
   children,
   onClick,
}: {
   active: boolean;
   icon?: React.ReactNode;
   children: React.ReactNode;
   onClick: () => void;
}) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-current={active ? "page" : undefined}
         className={`focus-ring flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-left text-sm2 transition-colors ${
            active ? "bg-separator/10 font-medium text-label" : "text-label hover:bg-separator/[0.05]"
         }`}
      >
         {icon && <span className="flex w-4 justify-center text-accent">{icon}</span>}
         <span className="truncate">{children}</span>
      </button>
   );
}

export function SidebarHeading({ children }: { children: React.ReactNode }) {
   return <p className="px-2 pb-1 pt-3 text-2xs font-semibold text-label-3 first:pt-0">{children}</p>;
}

/** Grouped settings-style card. */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
   return <div className={`rounded-xl border hairline bg-surface p-4 dark:bg-surface-2 ${className}`}>{children}</div>;
}
