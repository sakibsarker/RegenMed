import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // Check if the user is logged in from local storage
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);
  }, []);

  const login = ({ userData }) => {
    setLoggedIn(true);
    setCurrentUser(userData);
    // Save the login state to local storage
    localStorage.setItem('loggedIn', 'true');
    // Additional login logic if needed
  };

  const logout = () => {
    setLoggedIn(false);
    setCurrentUser({});
    // Remove the login state from local storage
    localStorage.removeItem('loggedIn');
    // Additional logout logic if needed
  };

  // Log the state variables
	console.log('loggedIn:', loggedIn);
	console.log('currentUser:', currentUser);
	console.log('userId:', currentUser.hasOwnProperty('userId') ? currentUser.userId : 'undefined');
	


  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
