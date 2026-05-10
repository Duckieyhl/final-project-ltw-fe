import React from "react";
import { List, ListItem, Typography } from "@mui/material";
import "./styles.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function UserList() {
  const [data, setData] = useState([]);
  const { token } = useAuth();
  // console.log("Token trong UserList:", token);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8081/users/list", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      // console.log("API trả về:", result); // xem trả về gì
      setData(Array.isArray(result) ? result : []); // đảm bảo luôn là array
    };
    fetchData();
  }, [token]);

  return (
    <ul>
      {data.map((d) => (
        <li key={d._id}>
          <Link to={`/users/${d._id}`}>   {/* ✅ thêm {} vào template literal */}
            <Typography>{d.first_name} {d.last_name}</Typography>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default UserList;