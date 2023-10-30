"use client";
import React from "react";
import CustomAvatar from "./CustomAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
export const Profile = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center m-auto gap-10 lg:gap-20 lg:px-40">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 5, delay: 0.5, stiffness: 100, type: "spring" }}
        className="flex flex-col items-center justify-center"
      >
        {" "}
        <CustomAvatar
          imageUrl="./profile.jpg"
          altText="profile"
          sizeHeight={400}
        />
        <div className="bg-white z-40" />
        <div className="flex flex-row items-center justify-center mt-5 gap-5">
          <a href="https://github.com/DoungChan">
            {" "}
            <FontAwesomeIcon
              icon={faGithub}
              size="2xl"
              className="hover:opacity-60 hover:scale-125 duration-700"
            />
          </a>
          <a href="https://www.linkedin.com/in/doungchan-sroeun-9524a8253/">
            <FontAwesomeIcon
              icon={faLinkedin}
              size="2xl"
              className="hover:opacity-60 hover:scale-125 duration-700"
            />
          </a>
          <a href="https://t.me/DoungChan">
            <FontAwesomeIcon
              icon={faTelegram}
              size="2xl"
              className="hover:opacity-60 hover:scale-125 duration-700"
            />
          </a>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 1, stiffness: 100, type: "spring" }}
        className="flex flex-col items-start top-0 justify-start"
      >
        <h1 className="text-xl lg:text-3xl font-bold text-center mt-5  ">
          Sroeun Doungchan
        </h1>
        <h2 className="text-xl lg:text-3xl font-bold text-center mt-5">
          I'm a full-stack developer
        </h2>
        <p className="text-opacity-60 text-sm max-w-6xl">
          A qualified software engineer with 4 years of experience with
          excellent front-end and mobile app development and designing skills,
          as well as a flexible working environment, Responsibility, and
          willingness to learn new things
        </p>
        <button className="p-3 bg-slate-700 rounded-md mt-2">
          <a href="https://drive.google.com/file/d/1h5Z8q9X2z0gq9WwJ0ZQ8gkQ5GJXHk8Gd/view?usp=sharing">
            Download CV
          </a>
        </button>
      </motion.div>
    </div>
  );
};
