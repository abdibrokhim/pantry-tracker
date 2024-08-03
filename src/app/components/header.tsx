'use client';

import React, { useEffect, useState, MouseEvent } from "react";
// import { auth } from "../firebaseConfig"; // Import the initialized auth
// import { User } from "firebase/auth";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Link } from "@mui/material";
// import { AccountCircle } from "@mui/icons-material";

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { firebaseConfig } from "../firebaseConfig";

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  // const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // useEffect(() => {
  //   const currentUser = auth.currentUser;
  //   setUser(currentUser);
  // }, []);

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
              Store
            </a>
            <a href="/" className="mx-8">
              Camera
            </a>
          </Box>
          <Box>
          <Button
              aria-controls="donate-menu"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              Donate
            </Button>
            <Menu
              id="donate-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="https://www.patreon.com/abdibrokhim" color="inherit" underline="none">
                  Patreon
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="https://buymeacoffee.com/abdibrokhim" color="inherit" underline="none">
                  Buy me a coffee
                </Link>
              </MenuItem>
            </Menu>

            {/* {user ? (
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
            )} */}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
