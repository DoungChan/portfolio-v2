"use client";
import CustomAvatar from "@/components/CustomAvatar";
import { faAward, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React from "react";

const about = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between ">
      <motion.div
        className=" bg-black bg-opacity-30 lg:p-10 p-5 m-auto rounded-lg"
        animate={{ opacity: 1, y: 1 }}
        initial={{ opacity: 1, y: 2000 }}
        transition={{
          duration: 4,
          delay: 0.5,
          bounceStiffness: 100,
          type: "spring",
        }}
      >
        <div className="flex mb-6 flex-col min-[1363px]:flex-row gap-5 max-w-[1000px] m-auto">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-fit"
          >
            <CustomAvatar
              imageUrl="/about.jpeg"
              altText="profile"
              sizeWidth={300}
              sizeHeight={400}
            />
          </motion.div>

          <div className="flex flex-col items-start top-0 justify-start  p-2 rounded-lg lg:border-2">
            <h1 className="text-lg lg:text-3xl font-bold text-center mt-5  ">
              Hi! I'm Sroeun Doungchan
            </h1>

            <p className="text-opacity-60 text-xs  pt-4">
              I'm a software developer passionate about building innovative and
              user-friendly products. I believe in continuous learning and value
              the insights gained from collaborating with others.
            </p>
            <p className="text-opacity-60 text-sm py-4">
              I am a qualified software engineer with 4 years of experience with
              a demonstrated history of working in the information technology
              and services industry. Skilled in JavaScript, React, Node.js,
              MongoDB, Express.js, and TypeScript.
            </p>
            <p className="text-opacity-60 text-sm">
              Feel free to explore my portfolio for project examples. If you
              have any questions or collaboration opportunities, let's connect
              and create remarkable solutions together.
            </p>
            <div className="flex mt-4 w-fit ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="mr-2 fill-current text-white w-5 h-5"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
              <p className="align-text-top text-sm ">
                doungchansroeun@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start lg:mx-10 mx-5">
          <h1 className="text-xl lg:text-2xl font-bold py-3 pr-20 pl-5 border-2 mb-4">
            EDUCATION
          </h1>
          <div className=" flex py-2 gap-2">
            <FontAwesomeIcon icon={faUserGraduate} size="lg" />
            <p>
              Kirirom Institute of Technology (KIT) - Bachelor of Software
              Engineering
            </p>
          </div>
          <div className=" flex gap-2">
            <FontAwesomeIcon icon={faUserGraduate} size="lg" />
            <p>Pheam Cheang High School - High School Diploma</p>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold py-3 pr-20 pl-5 border-2 my-4">
            ACHIEVEMENT
          </h2>
          <div className=" flex gap-2">
            <FontAwesomeIcon icon={faAward} size="lg" />
            <p>PI Approximation day certificate</p>
          </div>
          <div className=" flex gap-2">
            <FontAwesomeIcon icon={faAward} size="lg" />
            <p>Jobify volunteer certificate</p>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold py-3 pr-20 pl-5 border-2 my-4">
            LANGUAGE
          </h2>
          <div className=" flex gap-2">
            <FontAwesomeIcon icon={faAward} size="lg" />
            <p>Khmer</p>
          </div>
          <div className=" flex gap-2">
            <FontAwesomeIcon icon={faAward} size="lg" />
            <p>English</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default about;
