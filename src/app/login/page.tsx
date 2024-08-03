'use client';

import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { firebaseConfig } from "../firebaseConfig";
import { Button, Box } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface LoginProps {
  // setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
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
  );
}

export default Login;
