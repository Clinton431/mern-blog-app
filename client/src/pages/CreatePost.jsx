import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e) {
    e.preventDefault();

    if (!title || !summary || !content) {
      toast.error("Please fill in all fields!");
      return;
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files?.[0]) data.set("file", files[0]);

    try {
      const response = await fetch("http://localhost:4000/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Post created successfully!");
        setTimeout(() => setRedirect(true), 1500); // redirect after toast
      } else {
        toast.error("Failed to create post.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .container { max-width: 800px; margin: 0 auto; padding: 24px; }
        h1 { font-size: 28px; font-weight: bold; margin-bottom: 24px; }
        .form-container { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; }
        label { margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #374151; }
        input[type="text"], input[type="file"], textarea {
          width: 100%; padding: 10px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;
        }
        input[type="text"]:focus, input[type="file"]:focus, textarea:focus {
          outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        textarea { font-family: 'Courier New', monospace; resize: vertical; }
        button {
          width: 100%; background-color: #2563eb; color: white; padding: 10px 16px; border: none; border-radius: 8px;
          font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;
        }
        button:hover { background-color: #1d4ed8; }
        button[type="submit"] { margin-top: 8px; }
      `}</style>

      <div className="container">
        <h1>Create New Post</h1>

        <form className="form-container" onSubmit={createNewPost}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              rows={12}
            />
          </div>

          <button type="submit">Create Post</button>
        </form>
      </div>
    </>
  );
}
