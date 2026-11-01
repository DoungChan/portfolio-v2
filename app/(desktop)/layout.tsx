import { Desktop } from "@/components/os/Desktop";

// Every route in this group shows the desktop; the page decides which app opens first.
export default function DesktopLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Desktop />
         {children}
      </>
   );
}
