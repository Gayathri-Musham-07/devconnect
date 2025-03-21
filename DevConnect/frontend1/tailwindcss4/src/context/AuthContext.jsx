// // src/context/AuthContext.jsx
// import { createContext, useContext, useReducer, useCallback } from 'react';
// import { useCookies } from 'react-cookie';
// import axios from 'axios';

// const AuthContext = createContext(null);

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return {
//         ...state,
//         user: action.payload.user,
//         isAuthenticated: true
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false
//       };
//     case 'UPDATE_USER':
//       return {
//         ...state,
//         user: { ...state.user, ...action.payload },
//         isAuthenticated: true  
//         // added manually
//       };
//     default:
//       return state;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token']);
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null,
//     isAuthenticated: false
//   });

//   const login = useCallback(async (credentials) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/token/', credentials);
//       const { access, refresh, user } = response.data;
      
//       // Set cookies with httpOnly flag
//       setCookie('access_token', access, { path: '/', secure: true, sameSite: 'strict' });
//       setCookie('refresh_token', refresh, { path: '/', secure: true, sameSite: 'strict' });
      
//       // Update auth state
//       dispatch({ type: 'LOGIN', payload: { user } });
      
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.detail || 'Login failed'
//       };
//     }
//   }, [setCookie]);

//   const logout = useCallback(() => {
//     removeCookie('access_token');
//     removeCookie('refresh_token');
//     dispatch({ type: 'LOGOUT' });
//   }, [removeCookie]);

//   const updateUser = useCallback((userData) => {
//     dispatch({ type: 'UPDATE_USER', payload: userData });
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       ...state,
//       login,
//       logout,
//       updateUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isAuthenticated: true  
        // added manually
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token']);
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false
  });

  const login = useCallback(async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', credentials);
      const { access, refresh, user } = response.data;
      
      // Set cookies with httpOnly flag
      setCookie('access_token', access, { path: '/', secure: true, sameSite: 'strict' });
      setCookie('refresh_token', refresh, { path: '/', secure: true, sameSite: 'strict' });
      
      // Update auth state
      dispatch({ type: 'LOGIN', payload: { user } });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  }, [setCookie]);

  const logout = useCallback(() => {
    removeCookie('access_token');
    removeCookie('refresh_token');
    dispatch({ type: 'LOGOUT' });
  }, [removeCookie]);

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  // Function to get the access token from cookies
  const getAccessToken = useCallback(() => {
    return cookies.access_token || null;
  }, [cookies]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      updateUser,
      getAccessToken // Add getAccessToken to the context
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
