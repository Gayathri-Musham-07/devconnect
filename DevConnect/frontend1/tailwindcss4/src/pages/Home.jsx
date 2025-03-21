// src/pages/Home.jsx
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';

import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Home Feed</h1>
        <Link
          to="/createpost"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Post
        </Link>
      </div>
      
      <PostList 
        viewType="home" 
        key={refreshKey}
      />
    </div>
  );
};

export default Home;