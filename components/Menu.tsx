"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHouse,
   faUser,
   faBars,
   faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Menu = () => {
   // hover state
   const [hoverHome, setHoverHome] = useState(false);
   const [hoverAbout, setHoverAbout] = useState(false);
   const [hoverSkill, setHoverSkill] = useState(false);
   const [hoverProject, setHoverProject] = useState(false);
   const pathname = usePathname();

   return (
      <div className="bg-transparent fixed bottom-0 left-0 right-0 p-1">
         <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
               duration: 1,
               delay: 0.5,
               stiffness: 100,
               type: "spring",
            }}
            className="flex m-auto w-fit gap-10 md:gap-20 bg-black bg-opacity-60 p-3 rounded-xl px-4 items-center justify-center"
         >
            <Link href="/">
               <FontAwesomeIcon
                  icon={faHouse}
                  bounce={hoverHome}
                  onMouseEnter={() => setHoverHome(true)}
                  onMouseLeave={() => setHoverHome(false)}
                  size="2xl"
                  className="cursor-pointer "
               />
               {
                  // if the pathname is home, show the line
                  pathname === "/" && (
                     <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                           duration: 0.5,
                           delay: 0,
                           stiffness: 100,
                           type: "spring",
                        }}
                        className="text-center "
                     >
                        &#9900;
                     </motion.h1>
                  )
               }
            </Link>

            <Link href="/about">
               <FontAwesomeIcon
                  icon={faUser}
                  bounce={hoverAbout}
                  onMouseEnter={() => setHoverAbout(true)}
                  onMouseLeave={() => setHoverAbout(false)}
                  size="2xl"
                  className="cursor-pointer "
               />
               {
                  // if the pathname is home, show the line
                  pathname === "/about" && (
                     <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                           duration: 0.5,
                           delay: 0,
                           stiffness: 100,
                           type: "spring",
                        }}
                        className="text-center "
                     >
                        &#9900;
                     </motion.h1>
                  )
               }
            </Link>

            <Link href="/skill">
               <FontAwesomeIcon
                  icon={faBars}
                  bounce={hoverSkill}
                  onMouseEnter={() => setHoverSkill(true)}
                  onMouseLeave={() => setHoverSkill(false)}
                  size="2xl"
                  className="cursor-pointer "
               />
               {
                  // if the pathname is home, show the line
                  pathname === "/skill" && (
                     <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                           duration: 0.5,
                           delay: 0,
                           stiffness: 100,
                           type: "spring",
                        }}
                        className="text-center "
                     >
                        &#9900;
                     </motion.h1>
                  )
               }
            </Link>
            <Link href="/project">
               <FontAwesomeIcon
                  icon={faFolderOpen}
                  bounce={hoverProject}
                  onMouseEnter={() => setHoverProject(true)}
                  onMouseLeave={() => setHoverProject(false)}
                  size="2xl"
                  className="cursor-pointer"
               />
               {
                  // if the pathname is home, show the line
                  pathname === "/project" && (
                     <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                           duration: 0.5,
                           delay: 0,
                           stiffness: 100,
                           type: "spring",
                        }}
                        className="text-center "
                     >
                        &#9900;
                     </motion.h1>
                  )
               }
            </Link>
         </motion.div>
      </div>
   );
};

export default Menu;
