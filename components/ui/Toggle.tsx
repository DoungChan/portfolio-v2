"use client";

/** macOS-style switch. */
export function Toggle({
   checked,
   onChange,
   label,
}: {
   checked: boolean;
   onChange: (checked: boolean) => void;
   label: string;
}) {
   return (
      <button
         type="button"
         role="switch"
         aria-checked={checked}
         aria-label={label}
         onClick={() => onChange(!checked)}
         className={`focus-ring relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 ${
            checked ? "bg-accent" : "bg-separator/20"
         }`}
      >
         <span
            className={`absolute left-0 top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
               checked ? "translate-x-[18px]" : "translate-x-[2px]"
            }`}
         />
      </button>
   );
}

/** Segmented control, used for small mutually exclusive choices. */
export function Segmented<T extends string>({
   value,
   options,
   onChange,
   label,
   className = "",
}: {
   value: T;
   options: { value: T; label: string }[];
   onChange: (value: T) => void;
   label: string;
   className?: string;
}) {
   return (
      <div
         role="radiogroup"
         aria-label={label}
         className={`inline-flex rounded-[7px] bg-separator/[0.07] p-[2px] text-sm2 ${className}`}
      >
         {options.map((o) => (
            <button
               key={o.value}
               type="button"
               role="radio"
               aria-checked={value === o.value}
               onClick={() => onChange(o.value)}
               className={`focus-ring whitespace-nowrap rounded-[5px] px-3 py-[3px] transition-colors ${
                  value === o.value
                     ? "bg-surface text-label shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:bg-surface-3"
                     : "text-label-2 hover:text-label"
               }`}
            >
               {o.label}
            </button>
         ))}
      </div>
   );
}
