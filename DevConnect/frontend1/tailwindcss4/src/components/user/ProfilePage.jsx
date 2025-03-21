// src/components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';
import { UserPlus, UserMinus, Edit, PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
//import Post from "../Post"; // Import Post component
const DEFAULT_PROFILE_PIC = "https://wallpaperaccess.com/full/1111980.jpg";

export default function ProfilePage() {
  const { user, updateUser, getAccessToken } = useAuth();
  const dispatch = useDispatch();

  // Profile States
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    birth_date: '',
    profile_picture: null,
    is_followed: false,
    followers_count: 0,
    following_count: 0
  });



     // User Posts State
  // const [posts, setPosts] = useState([]);
  // const [postsLoading, setPostsLoading] = useState(true);
  
    // Fetch User's Posts
    // useEffect(() => {
    //   const fetchUserPosts = async () => {
    //     setPostsLoading(true);
    //     try {
    //       const token = getAccessToken();
    //       const response = await axios.get(
    //         `${API_BASE_URL}/posts/?view_type=profile&username=${user.username}`,
    //         {
    //           headers: { Authorization: `Bearer ${token}` },
    //         }
    //       );
    //       setPosts(response.data);
    //     } catch (error) {
    //       console.error("Error fetching user's posts:", error);
    //     } finally {
    //       setPostsLoading(false);
    //     }
    //   };
  
    //   if (user?.username) {
    //     fetchUserPosts();
    //   }
    // }, [user, getAccessToken]);
  

  // Create Post States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postPreview, setPostPreview] = useState('');
  const [postError, setPostError] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  // Profile Fetch Effect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        const response = await axios.get(
          `${API_BASE_URL}/users/${user}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, getAccessToken]);

  // User Data Effect
  useEffect(() => {
    if (user) {
      setProfileData({
        bio: user.bio || '',
        location: user.location || '',
        birth_date: user.birth_date || '',
        profile_picture: user.profile_picture,
        is_followed: user.is_followed || false,
        followers_count: user.followers_count || 0,
        following_count: user.following_count || 0
      });
    }
  }, [user]);

  // Profile Image Handlers
  const handleImageError = () => {
    setImageError(true);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({ ...profileData, profile_picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Post Image Handler
  const handlePostImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setPostPreview(URL.createObjectURL(file));
    }
  };

  // Create Post Handler
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent && !postImage) {
      setPostError('Please add either text or an image');
      return;
    }

    setPostLoading(true);
    setPostError('');

    const formData = new FormData();
    if (postContent) formData.append('content', postContent);
    if (postImage) formData.append('image', postImage);

    try {
      const token = getAccessToken();
      await axios.post(`${API_BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset post form
      setPostContent('');
      setPostImage(null);
      setPostPreview('');
      setShowCreatePost(false);
      
      dispatch(addNotification({
        type: 'success',
        message: 'Post created successfully!'
      }));
    } catch (error) {
      setPostError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setPostLoading(false);
    }
  };

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append('bio', profileData.bio);
      formData.append('location', profileData.location);
      formData.append('birth_date', profileData.birth_date);
      if (profileData.profile_picture instanceof File) {
        formData.append('profile_picture', profileData.profile_picture);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/users/me/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      updateUser(response.data);
      setEditing(false);
      setPreviewImage(null);
      dispatch(addNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      }));
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error.response?.data?.message || 'Failed to update profile'
        }));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const avatarUrl = imageError ? DEFAULT_PROFILE_PIC : (previewImage || user.profile_picture || DEFAULT_PROFILE_PIC);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header Section */}
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {showCreatePost ? 'Cancel Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        {showCreatePost && (
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="bg-white rounded-lg p-4 mb-4">
                <form onSubmit={handleCreatePost}>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                  />
                  
                  {postPreview && (
                    <div className="relative mb-2">
                      <img
                        src={postPreview}
                        alt="Preview"
                        className="max-h-96 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPostImage(null);
                          setPostPreview('');
                        }}
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {postError && <div className="text-red-500 mb-2">{postError}</div>}

                  <div className="flex justify-between items-center mt-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePostImageChange}
                        className="hidden"
                      />
                      <span className="text-indigo-500 hover:text-indigo-600">Add Photo</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={postLoading || (!postContent && !postImage)}
                        className={`px-4 py-2 rounded-lg ${
                          postLoading || (!postContent && !postImage)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {postLoading ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="px-4 py-5 sm:px-6 flex justify-center">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Profile"
              onError={handleImageError}
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Profile Edit Form */}
        {editing ? (
          <form onSubmit={handleProfileUpdate} className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={profileData.birth_date}
                  onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-center gap-8">
              <p className="text-2xl font-bold">{user.username}</p>
            </div>
            <div className="flex justify-center gap-8">
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.bio || '-'}
              </p>
            </div>
          </div>
        )}

        {/* Profile Stats */}
        <div className="px-4 py-5 sm:px-6 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{profileData.followers_count}</div>
            <div className="text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profileData.following_count}</div>
            <div className="text-gray-500">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}