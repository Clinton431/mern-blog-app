import { Link } from "react-router-dom";
import "./App.css";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <span className="user-greeting">Hello, {username}</span>
            <Link to="/create" className="newpost-btn">
              Create new post
            </Link>
            <a onClick={logout} className="logout-btn">
              Logout
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/register" className="newpost-btn">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
