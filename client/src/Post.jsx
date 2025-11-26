import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
}) {
  // Normalize the image path (fixes broken URLs on production/localhost)
  const imageUrl = cover ? `${API_URL}/${cover.replace(/^\/+/, "")}` : null;

  return (
    <div className="post">
      {imageUrl && (
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={imageUrl} alt={title} loading="lazy" />
          </Link>
        </div>
      )}

      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <a className="author">{author?.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>

        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
