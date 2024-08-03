'use client'

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Login from "./login/page";
import Dashboard from "./playground/page";

const Home: React.FC = () => {
  // const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  // const router = useRouter();

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   if (userId) {
  //     setIsLoggedIn(true);
  //     router.push('/playground');
  //   } else {
  //     router.push('/login');
  //   }
  // }, [router]);

  return (
    <>
        <Dashboard />

      {/* {isLoggedIn ?  */}
        {/* <Login setIsLoggedIn={setIsLoggedIn} /> */}
      {/* } */}
    </>
  );
}

export default Home;
