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
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Context/AuthContext";

// Component bảo vệ route
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className="main-topbar-buffer" />

        {/* Chỉ hiện UserList nếu đã login */}
        {user && (
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
        )}

        <Grid item sm={user ? 9 : 12}>
          <Paper className="main-grid-item">
            <Routes>
              {/* Route public */}
              <Route path="/login" element={<Login />} />

              {/* Route cần login */}
              <Route path="/users/:userId" element={
                <ProtectedRoute element={<UserDetail />} />
              } />
              <Route path="/photos/:userId" element={
                <ProtectedRoute element={<UserPhotos />} />
              } />
              <Route path="/users" element={
                <ProtectedRoute element={<UserList />} />
              } />

              {/* Mặc định redirect về login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Router>
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