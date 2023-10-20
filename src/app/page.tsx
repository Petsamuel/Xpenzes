"use client";
import { useState, useEffect } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState({ title: "", price: "" });
  const [list, setList] = useState([
    {
      title: "food",
      price: "300",
    },
    {
      title: "transport",
      price: "300",
    },
  ]);
  // add items to database

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setList([...list, value]);
    const docRef = await setDoc(doc(db, "expenses", value.title), value);
    console.log(docRef);
  };

  // read items
  // delete items frm database

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="">
          <form className="py-4 flex items-center justify-evenly gap-5">
            <div className="flex flex-col items-start">
              <label>Name</label>
              <input
                type="text"
                name="title"
                value={value.title}
                onChange={(e) => {
                  setValue({ ...value, title: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col ">
              <label>Price</label>
              <input
                type="text"
                name="price"
                value={value.price}
                onChange={(e) => {
                  setValue({ ...value, price: e.target.value });
                }}
              />
            </div>
            <input
              type="submit"
              className="cursor-pointer"
              onClick={(e) => addItem(e)}
            />
          </form>
          <ul>
            {list.map((value, id) => (
              <li key={id} className="flex justify-between ">
                <div className="capitalize">{value.title}</div>
                <div>{value.price}</div>
                <input type="button" value="X" />
              </li>
            ))}
          </ul>
          {list.length != 0 && (
            <div className="flex justify-between py-5">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
