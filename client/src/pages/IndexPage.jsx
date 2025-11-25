import { useEffect, useState } from "react";
import Post from "../Post";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        // console.log(posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
}
