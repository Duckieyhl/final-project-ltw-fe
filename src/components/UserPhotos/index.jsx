import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./styles.css";

function UserPhotos() {
  const { userId } = useParams();
  const { token } = useAuth(); // lấy token từ context
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState({}); // lưu text theo photoId

  // Tách fetchData ra ngoài useEffect
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8081/photos/" + userId, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error(`Lỗi ${response.status}`);
      const result = await response.json();
      setPhotos(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleAddComment = async (photoId) => {
    const text = commentText[photoId];
    if (!text || text.trim() === "") return;

    await fetch(`http://localhost:8081/commentsOfPhoto/${photoId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment: text }),
    });

    // Xóa input và fetch lại
    setCommentText(prev => ({ ...prev, [photoId]: "" }));
    fetchData();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (photos.length === 0) return <Typography>Người dùng chưa có ảnh.</Typography>;

  return (
    <div style={{ padding: 20 }}>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: 30 }}>
          <img
            src={`http://localhost:8081/images/${photo.file_name}`}
            alt={photo.file_name}
            style={{ maxWidth: "100%", height: "auto", display: "block", marginBottom: 8 }}
          />
          <Typography variant="caption">
            {new Date(photo.date_time).toLocaleString()}
          </Typography>

          {photo.comments?.map((c) => (
            <div key={c._id} style={{ marginTop: 8, paddingLeft: 10 }}>
              <Typography variant="body2">
                <strong>{c.user?.first_name} {c.user?.last_name}</strong>: {c.comment}
              </Typography>
              <Typography variant="caption">
                {new Date(c.date_time).toLocaleString()}
              </Typography>
            </div>
          ))}

          {/* Input thêm comment */}
          <div style={{ marginTop: 10 }}>
            <input
              type="text"
              placeholder="Thêm comment..."
              value={commentText[photo._id] || ""}
              onChange={(e) => setCommentText(prev => ({ ...prev, [photo._id]: e.target.value }))}
            />
            <button onClick={() => handleAddComment(photo._id)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;