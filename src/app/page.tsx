"use client";
import React, { useState, useEffect } from "react";
// import { UserAuth } from "./auth/Authcontext";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Define the Expense type
interface Expense {
  title: string;
  price: number;
}
export default function Home() {
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState({ title: "", price: "" });
  const [list, setList] = useState([{ title: "test", price: 0 }]);
  // add items to database

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const docRef = await setDoc(doc(db, "expenses", value.title), value);
    console.log(docRef);
    setValue({ title: "", price: "" });
  };

  // read items
  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "expenses"),
      (QuerySnapshot) => {
        const expense: Expense[] = [];
        QuerySnapshot.forEach((doc) => {
          expense.push({
            title: doc.data().title,
            price: doc.data().price,
          });
        });
        setList(expense);
        // read total
        const calculateTotal = () => {
          const total = expense.reduce(
            (acc, curr) => acc + Number(curr.price),
            0
          );
          setTotal(total);
        };
        calculateTotal();
        return () => unSubscribe();
      }
    );
  }, []);

  // delete items from database
  const removeItem = async (e: string) => {
    await deleteDoc(doc(db, "expenses", e));
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="">
          <form className="py-4 flex items-center justify-around gap-5">
            <div className="flex flex-col items-start">
              <label>Name</label>
              <input
                className="p-3 rounded-sm"
                type="text"
                name="title"
                value={value.title}
                placeholder="Enter title"
                onChange={(e) => {
                  setValue({ ...value, title: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col ">
              <label>Price</label>
              <input
                className="p-3 rounded-sm"
                type="number"
                name="price"
                placeholder="Enter price"
                value={value.price}
                onChange={(e) => {
                  setValue({ ...value, price: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col mt-5">
              <input
                type="submit"
                className="cursor-pointer p-3 shadow-sm ring-4 rounded-sm"
                onClick={(e) => addItem(e)}
              />
            </div>
          </form>
          <ul>
            {list.map((value, id) => (
              <li key={id} className="flex justify-between py-3 cursor-pointer">
                <div className="capitalize">{value.title}</div>
                <div>{value.price}</div>
                <div className="flex items-center ">
                  {" "}
                  <input
                    type="button"
                    className="cursor-pointer flex justify-center items-center ring-3 ring-red-200 "
                    value="X"
                    onClick={() => {
                      removeItem(value.title);
                    }}
                  />
                </div>
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
