import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Post from "./Post"; // Reusing the Post component
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const FollowingFeed = () => {
  const { getAccessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowingPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken();
      const response = await axios.get(
        `${API_BASE_URL}/posts/?view_type=following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data);
    } catch (error) {
      setError("Failed to fetch following feed. Please try again.");
      console.error("Error fetching following feed:", error);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchFollowingPosts();
  }, [fetchFollowingPosts]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-16 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold">Following Feed</h2>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No posts from followed users yet.</p>
        </div>
      )}

      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FollowingFeed;
