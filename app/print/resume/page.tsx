import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { AutoPrint } from "./AutoPrint";

export const metadata: Metadata = {
   title: "Resume (print)",
   robots: { index: false },
};

// Standalone, print-ready résumé. `npm run resume:pdf` prints this page to public/resume.pdf,
// and the Preview app's Print button opens it with ?print=1.
export default function PrintResumePage() {
   return (
      <div className="min-h-screen bg-[#e8e8ed] py-8 print:bg-white print:py-0">
         <style>{`
            html, body { overflow: auto; }
            @page { size: A4; margin: 12mm 14mm; }
            @media print {
               .resume-sheet { width: auto !important; min-height: 0 !important; padding: 0 !important; box-shadow: none !important; }
            }
         `}</style>
         <div className="shadow-[0_4px_24px_rgba(0,0,0,0.12)] print:shadow-none" style={{ width: "fit-content", margin: "0 auto" }}>
            <ResumeDocument />
         </div>
         <AutoPrint />
      </div>
   );
}
