import { ProjectExp } from "@/components/ProjectExp";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen ">
      <h1 className="text-3xl font-bold m-auto py-10"> Experience Project</h1>
      <div
        className="flex
                        space-x-10
                        min-h-screen                     
                        py-10
                        item-start justify-center"
      >
        <div className="flex-1 space-x-3 justify-center pb-10">
          <ProjectExp />
        </div>
      </div>
    </div>
  );
};

export default page;
