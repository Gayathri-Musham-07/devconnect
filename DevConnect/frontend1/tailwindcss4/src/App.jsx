// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { store } from './store';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import ProfilePage from './components/user/ProfilePage';
import UserList from './components/user/UserList';
import Notifications from './components/common/Notifications';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import CreatePost from './components/CreatePost';
import Home from './pages/Home';
import FollowingFeed from "./components/FollowingFeed";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route 
                  path="/home" 
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  } 
                />
                 <Route path="/home" element={<Navigate to="/home" replace />} />
                 <Route path="/following-feed" element={<FollowingFeed />} />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <PrivateRoute>
                      <UserList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/createpost" 
                  element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  } 
                />
               
              </Routes>
            </main>
            <Notifications />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;