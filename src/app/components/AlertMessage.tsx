

import React from "react";

interface Props {
  message: {
    message: string;
    status: number;
  };
}
export const AlertMessage: React.FC<Props> = ({ message }) => {
  return (
    <div>
      <div
        className={`${
          message?.status === 200
            ? "bg-green-200 text-green-900 ring-green-400"
            : "bg-rose-200 text-rose-900 ring-red-400 "
        } absolute lg:top-[12vh] right-4  p-3 transition-all ease-in-out hover:shadow-lg rounded-sm ring-2 `}
      >
        <p>{message?.message}</p>
      </div>
    </div>
  );
};
