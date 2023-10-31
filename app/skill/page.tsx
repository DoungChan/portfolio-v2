"use client";
import React from "react";
import Image from "next/image";
import { Technology } from "@/components/Technology";
import { motion } from "framer-motion";
const skill = () => {
  return (
    <div>
      <div className=" flex flex-col lg:flex-row items-center min-h-screen justify-center  max-w-5xl lg:gap-10 md:gap-5 gap-2 m-auto">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.5,
            duration: 1,
            type: "spring",
            stiffness: 100,
          }}
          className="w-2/3 items-center justify-center"
        >
          <h1 className="text-2xl md:text-4xl font-bold ">
            My Development Skills
          </h1>
          <Image src={"/coding.png"} alt="coding" width={400} height={400} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1,
            duration: 3,
            type: "spring",
            staggerChildren: 2,
          }}
          className="w-full max-w-[700px]"
        >
          <Technology />
        </motion.div>
      </div>
    </div>
  );
};

export default skill;
