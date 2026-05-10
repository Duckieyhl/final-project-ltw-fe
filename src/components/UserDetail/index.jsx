import React from "react";
import { Typography } from "@mui/material";
import "./styles.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function UserDetail() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8081/users/" + userId, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ← gửi token
        }
      });
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, [userId]);

  if (!data) return <Typography>Loading...</Typography>;

  const { first_name, last_name, location, description, occupation } = data;
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h6">{first_name} {last_name}</Typography>
      <Typography variant="body1">{location}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Typography variant="body1">{occupation}</Typography>
      <Link to={`/photos/${userId}`}>View Photos</Link>
    </div>
  );
}

export default UserDetail;