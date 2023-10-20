"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";

export default function Home() {
  const [list, setList] = useState([
    {
      title: "food",
      price: "$300",
    },
    {
      title: "transport",
      price: "$300",
    },
  ]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="">
          <form className="py-4 flex items-center justify-evenly gap-5">
            <div className="flex flex-col items-start">
              <label>name</label>
              <input type="text" name="title" />
            </div>
            <div className="flex flex-col ">
              <label>Price</label>
              <input type="text" name="price" />
            </div>
            <input type="submit" className="cursor-pointer" />
          </form>
          <ul>
            {list.map((value, id) => (
              <li key={id} className="flex justify-between ">
                <span>{value.title}</span>
                <span>{value.price}</span>
                <input type="button" value="X" />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
