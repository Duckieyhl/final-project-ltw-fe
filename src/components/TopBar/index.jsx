import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

import "./styles.css";
import UserDetail from "../UserDetail/index";
import UserList from "../UserList/index";
import UserPhotos from "../UserPhotos/index";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          hallo
        </Typography>
      </Toolbar>
    </AppBar >
  );
}

export default TopBar;
