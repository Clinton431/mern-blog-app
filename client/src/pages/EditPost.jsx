import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EditPost() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);

  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  function normalizeImage(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}/${url.replace(/^\/+/, "")}`;
  }

  useEffect(() => {
    if (!id) {
      toast.error("Invalid post ID");
      return;
    }

    async function loadPost() {
      try {
        const res = await fetch(`${API_URL}/post/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Post not found");

        const postInfo = await res.json();

        setTitle(postInfo.title || "");
        setSummary(postInfo.summary || "");
        setContent(postInfo.content || "");
        setCurrentImage(normalizeImage(postInfo.cover));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setFiles(e.target.files);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  }

  async function updatePost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);

    if (files?.[0]) {
      data.set("file", files[0]);
    }

    try {
      const response = await fetch(`${API_URL}/post`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (!response.ok) throw new Error();

      toast.success("Post updated!");
      setTimeout(() => setRedirect(true), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  // ✅ UPDATED SKELETON — ONLY CHANGE HERE
  if (loading) {
    return (
      <div className="post-skeleton">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-image"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container">
        <h1>Update the Post</h1>

        <form className="form-container" onSubmit={updatePost}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Current Image</label>

            {previewImage ? (
              <img
                src={previewImage}
                alt="New Preview"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              />
            ) : currentImage ? (
              <img
                src={currentImage}
                alt="Current"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              />
            ) : (
              <p style={{ color: "#666" }}>No image yet</p>
            )}

            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
            />
          </div>

          <button type="submit">Update Post</button>
        </form>
      </div>
    </>
  );
}
