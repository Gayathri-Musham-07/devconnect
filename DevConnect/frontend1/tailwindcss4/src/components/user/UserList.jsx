  // src/components/user/UserList.jsx
  import { useState, useEffect } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { setUsers, toggleFollow } from '../../store/slices/userSlice';
  import { addNotification } from '../../store/slices/notificationSlice';
  import axios from 'axios';
  import { useAuth } from '../../context/AuthContext';
  import { API_BASE_URL } from '../../config';
  
  export default function UserList() {
    const { getAccessToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);
  
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const token = getAccessToken()
          const response = await axios.get(`${API_BASE_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          dispatch(setUsers(response.data));
        } catch (error) {
          dispatch(addNotification({
            type: 'error',
            message: 'Failed to load users'
          }));
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, [dispatch, getAccessToken]);

  
    const handleFollow = async (userId, isFollowed) => {
      try {
        const token = getAccessToken();
        const response = await axios.post(
           `${API_BASE_URL}/users/${userId}/follow/`,
          {},
          { 
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
          }
        );
        

        dispatch(toggleFollow({ userId, isFollowed }));
        dispatch(addNotification({
          type: 'success',
          message: `Successfully ${isFollowed ? 'unfollowed' : 'followed'} user`
        }));
      } catch (error) {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update follow status'
        }));
      }
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center pt-20 h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 lg:px-8 py-8">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map(user => (
            <li key={user.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">{user.username}</h3>
                    {user.location && (
                      <span className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-100 rounded-full">
                        {user.location}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{user.bio || 'No bio'}</p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="w-0 flex-1 flex">
                    <button
                      onClick={() => handleFollow(user.id, user.is_followed)}
                      className={`relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm font-medium rounded-bl-lg
                        ${user.is_followed 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-indigo-600 hover:text-indigo-700'}`}
                    >
                      {user.is_followed ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }