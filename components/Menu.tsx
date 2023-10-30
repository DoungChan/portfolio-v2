"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faBars,
  faFolderOpen,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { addHoverListener } from "@/util/hover";
const Menu = () => {
  // hover state
  const [hoverHome, setHoverHome] = useState(false);
  const [hoverAbout, setHoverAbout] = useState(false);
  const [hoverSkill, setHoverSkill] = useState(false);
  const [hoverProject, setHoverProject] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);

  return (
    <div className="bg-transparent fixed bottom-0 left-0 right-0 p-1">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, stiffness: 100, type: "spring" }}
        className="flex m-auto w-fit gap-10 md:gap-20 bg-black bg-opacity-60 p-3 rounded-lg px-4"
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
        </Link>
      </motion.div>
    </div>
  );
};

export default Menu;
