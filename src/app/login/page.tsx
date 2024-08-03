'use client';

import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../firebaseConfig";
import { Button, Box } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface LoginProps {
//   setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem("userId", user.uid);
        // setIsLoggedIn(true);
        router.push('/playground');
        console.log("User signed in: ", user);
      })
      .catch((error) => {
        console.error("Error during sign in: ", error.code, error.message);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // setIsLoggedIn(true);
      router.push('/playground');
    }
  }
  , [router]);

  return (
    <>
      <p className='flex text-[32px] mt-8 items-center justify-center'>Collaborative Pantry</p>
        <div className="flex min-h-screen items-center justify-center p-24">
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              >
              Sign in with Google
            </Button>
          </Box>
        </div>
        </>
  );
}

export default Login;
