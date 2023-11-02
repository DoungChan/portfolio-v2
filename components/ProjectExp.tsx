"use client";
import React from "react";
import projectExp from "../data/projectExp";
import { motion } from "framer-motion";
import Link from "next/link";
export const ProjectExp = () => {
  return (
    <div>
      <div className=" flex flex-wrap xl:grid-cols-3 min-[1650px]:grid-cols-4 min-[1000px]:grid-cols-1  lg:grid-cols-2 sm:grid-cols-1 grid-cols-2 grid-flow-row gap-10  justify-center md:justify-start">
        {projectExp.map((data, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1,
              duration: 2,
              staggerChildren: 0.5,
              type: "",
            }}
            key={index}
            className={`rounded-[10px] h-fit w-fit font-black text-2xl flex flex-col px-3 py-3 justify-center bg-[#282828] bg-opacity-70 hover:bg-opacity-100 duration-700 ease-in-out cursor-pointer`}
          >
            <div className="w-72 h-48 bg-slate-700 rounded-[10px] overflow-hidden transition-opacity duration-300 ease-in-out">
              <img
                className="object-contain w-full h-full bg-transparent"
                src={data.image}
              ></img>
            </div>
            <div className="py-2">
              <div className="space-x-2 w-full"></div>
              <div className="flex justify-between items-center">
                <h1 className={`text-base font-bold rounded-xl w-fit`}>
                  {data.name}
                </h1>
              </div>
              <div className=" h-60 py-5">
                <p className="text-white text-xs font-light text-opacity-70 max-w-[260px] max-h-7  break-all">
                  {data.description}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {data.link !== "" ? (
                <button
                  className="bg-yellow-100 text-slate-800 text-xs font-sans
                                    p-[6px] rounded-xl "
                  onClick={() => {
                    data.link ? window.open(data.link) : null;
                  }}
                >
                  Public
                </button>
              ) : null}

              <Link href={data.github}>
                <button
                  className="bg-yellow-100 text-slate-800  text-xs font-sans
                                    p-[10px] rounded-2xl "
                >
                  Git Hub
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
