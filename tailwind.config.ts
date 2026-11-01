import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
   darkMode: "class",
   content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
   theme: {
      extend: {
         colors: {
            surface: {
               DEFAULT: token("surface"),
               2: token("surface-2"),
               3: token("surface-3"),
            },
            label: {
               DEFAULT: token("label"),
               2: token("label-2"),
               3: token("label-3"),
            },
            separator: token("separator"),
            accent: token("accent"),
         },
         fontFamily: {
            sans: [
               "-apple-system",
               "BlinkMacSystemFont",
               '"SF Pro Text"',
               "var(--font-inter)",
               "system-ui",
               "sans-serif",
            ],
            mono: ['"SF Mono"', "ui-monospace", "Menlo", "Monaco", "Consolas", "monospace"],
         },
         fontSize: {
            "2xs": ["11px", "14px"],
            sm2: ["13px", "18px"],
         },
         borderRadius: {
            window: "12px",
            icon: "22.5%",
         },
         boxShadow: {
            window: "0 0 0 0.5px rgb(0 0 0 / 0.18), 0 22px 70px 4px rgb(0 0 0 / 0.36), 0 6px 18px rgb(0 0 0 / 0.12)",
            "window-inactive": "0 0 0 0.5px rgb(0 0 0 / 0.14), 0 12px 40px rgb(0 0 0 / 0.22)",
            popover: "0 0 0 0.5px rgb(0 0 0 / 0.16), 0 10px 32px rgb(0 0 0 / 0.28)",
            icon: "0 1px 1px rgb(0 0 0 / 0.08), 0 4px 10px rgb(0 0 0 / 0.22)",
         },
         zIndex: {
            dock: "9000",
            menubar: "9100",
            popover: "9200",
            spotlight: "9500",
         },
      },
   },
   plugins: [],
};
export default config;
