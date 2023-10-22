"use client";

import React from "react";

interface Props {
  handleEvent: () => void;
}

export const DownloadButton: React.FC<Props> = ({ handleEvent }) => {
  return (
    <div className="flex  w-full items-center mt-4">
      <div
        onClick={() => {
          handleEvent();
        }}
        className="cursor-pointer p-2 flex itms-center mr-3 sm:mr-6  rounded-md text-gray-900 text-sm font-semibold ring-2 ring-gray-300/50 bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all ease-in-out"
      >
        <p>Download</p>
      </div>
    </div>
  );
};
