// src/components/Post.jsx
import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const Post = ({ post, onLike, onDelete }) => {
  const { user, getAccessToken } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const token = getAccessToken();
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLike(post.id, response.data);
    } catch (error) {
      console.error("Like failed:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/posts/${post.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(post.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${post.author.username}`}>
          <img
            src={`http://localhost:8000${post.author.profile_picture}`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author.username}`} className="font-semibold text-sm">
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mt-2 text-sm">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mt-2 rounded-md w-full object-cover"
        />
      )}

      {/* Actions: Like, Comment, Delete */}
      <div className="flex items-center justify-between mt-2 text-gray-600 text-xs">
        <button onClick={handleLike} className="flex items-center space-x-1">
          <Heart className={`w-4 h-4 ${post.is_liked ? "text-red-500" : "text-gray-500"}`} />
          <span>{post.likes_count}</span>
        </button>
        <Link to={`/posts/${post.id}`} className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments_count}</span>
        </Link>
        {user?.id === post.author.id && (
          <button onClick={handleDelete} className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
