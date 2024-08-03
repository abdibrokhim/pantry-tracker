'use client';

import React, { useEffect, useState, MouseEvent } from "react";
// import { auth } from "../firebaseConfig"; // Import the initialized auth
import { User } from "firebase/auth";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Link } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { firebaseConfig } from "../firebaseConfig";

export const firebaseConfig = {
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

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex">
            <a href="/store">
              My Store
            </a>
            <a href="/" className="mx-8">
              Camera
            </a>
          </Box>
          <Box>
            {user ? (
              <>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <img
                    src={user.photoURL || ''}
                    alt="User Profile"
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>{user.email}</MenuItem>
                </Menu>
              </>
            ) : (
              <AccountCircle />
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
