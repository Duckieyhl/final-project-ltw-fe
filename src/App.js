import './App.css';

import React from "react";
import { Grid, Typography, Paper } from "@mui/material";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Context/AuthContext";

// Component bảo vệ route
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

function AppInner() {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <div className="main-topbar-buffer" />

      {user && !isLoginPage && (
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList />
          </Paper>
        </Grid>
      )}

      <Grid item sm={user && !isLoginPage ? 9 : 12}>
        <Paper className="main-grid-item">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/users/:userId" element={<ProtectedRoute element={<UserDetail />} />} />
            <Route path="/photos/:userId" element={<ProtectedRoute element={<UserPhotos />} />} />
            <Route path="/users" element={<ProtectedRoute element={<UserList />} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Bọc toàn bộ app trong AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}