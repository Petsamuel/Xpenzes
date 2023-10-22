import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const Authcontext = createContext<any>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | {}>();
  const [date, setDate] = useState<{
    year: string;
    day: any;
    month: string;
  }>();

  // function to call googleSign in
  const signInUser = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      {
        currentUser ? setUser(currentUser) : setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // logout function
  const signOutUser = async () => {
    signOut(auth);
  };

  //current date
  useEffect(() => {
    const DateYear = () => {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = date.getMonth().toString();
      const day = date.getDate().toString();
      return setDate({ year: year, day: day, month: month });
    };
    DateYear();
  });

  return (
    <Authcontext.Provider value={{ date, user, signInUser, signOutUser }}>
      {children}
    </Authcontext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(Authcontext);
};
