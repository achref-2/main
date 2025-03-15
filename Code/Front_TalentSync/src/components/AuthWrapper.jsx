import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // You might want to add token expiration check here
  // For example, if you store the expiration time:
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    return false;
  }

  return true;
};

export const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = checkTokenValidity();
      const isAuthPage = location.pathname.includes('/candidate/login') || 
                        location.pathname.includes('/candidate/signup');
      
      // Public routes that don't need authentication
      const publicRoutes = ['/', '/Pricing', '/JobList','/admin'];
      
      if (!isAuthenticated && !isAuthPage && !publicRoutes.includes(location.pathname)) {
        navigate('/');
      }
    };

    checkAuth();

    // Check token validity every hour
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [navigate, location]);

  return children;
};
