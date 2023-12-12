// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current user when the app initializes
    async function fetchCurrentUser() {
      try {
        const response = await axios.get('/auth/currentUser');
        if (response.data) {
          console.log(response.data);
          setUser(response.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);