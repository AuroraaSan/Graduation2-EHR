import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  role: string;
  id: string
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean; // Add isLoading state
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // const { logout: auth0Logout } = useAuth0(); // Use Auth0 logout if integrated
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // Define public routes
  const publicRoutes = ['/', '/login', '/register'];

  // Load user data from the server on initial load
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/profile', {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("Response:", response.data);
          const userData = {
            name: response.data.data.user.full_name,
            email: response.data.data.user.email,
            role: response.data.data.user.role,
            id: response.data.data.user.id
          };
          setUser(userData); // Set the user if a valid session exists
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        setUser(null); // No user session exists, reset the user
        localStorage.removeItem('user'); // Remove user from local storage
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false); // Set loading to false after the request completes
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user from local storage
      checkLoggedInUser(); // Always check if the user is logged in on the server
    } else if (!publicRoutes.includes(location.pathname)) {
      // Redirect to login only if the current route is not a public route
      navigate('/login');
    }
  }, [navigate, location.pathname]); // Add location.pathname to dependencies

  // Logout function
  const logout = useCallback(async () => {
    try {
      Cookies.remove('accessToken', { path: '/', domain: 'localhost' });
      Cookies.remove('idToken', { path: '/', domain: 'localhost' });

      localStorage.removeItem('user'); // Remove user from local storage
      setUser(null); // Clear the user state

      // Call Auth0 logout with a custom redirect URL
      // auth0Logout?.({ returnTo: window.location.origin });

      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  // Context value
  const value = {
    user,
    setUser,
    logout,
    isLoading, // Include isLoading in the context value
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};