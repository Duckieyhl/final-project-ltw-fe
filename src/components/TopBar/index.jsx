import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material"; // ← thêm Button
import { useNavigate } from "react-router-dom"; // ← chỉ cần useNavigate, bỏ bớt
import { useAuth } from "../Context/AuthContext";
import { useRef } from "react";
import axios from "axios";
import "./styles.css";

function TopBar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // ref cho input file

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file); // dùng FormData thay vì JSON

      const response = await fetch('http://localhost:8081/photos/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // KHÔNG set Content-Type
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Upload failed!!!');
        return;
      }

      console.log("Upload thành công!");
      // Reset input để có thể upload lại cùng file
      fileInputRef.current.value = "";

    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8081/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Nếu bạn cần gửi token hoặc cookie, thêm credentials vào đây:
          // 'Authorization': `Bearer ${your_token}`
        },
      });

      if (!response.ok) {
        console.error('Logout failed');
      }
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Photo App
        </Typography>

        {user ? (
          // khi đã login
          <>
            <Typography sx={{ mr: 2 }}>
              Hi {user.first_name}
            </Typography>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAddPhoto}
            />
            <Button color="inherit" onClick={() => fileInputRef.current.click()}>
              Add Photo
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;