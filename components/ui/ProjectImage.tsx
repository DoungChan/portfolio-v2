import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectImage({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
   // Phone screenshots are tall; show them whole on a soft backdrop instead of cropping.
   return project.platform === "mobile" ? (
      <div className="relative h-full w-full bg-gradient-to-br from-[#e9eef7] to-[#d7deeb] dark:from-[#2a2d36] dark:to-[#1d1f26]">
         <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain p-3"
         />
      </div>
   ) : (
      <Image
         src={project.image}
         alt={`${project.name} screenshot`}
         fill
         sizes={sizes}
         priority={priority}
         className="object-cover object-top"
      />
   );
}
