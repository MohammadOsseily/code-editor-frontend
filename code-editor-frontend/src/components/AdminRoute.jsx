import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  if (decodedToken.role !== 'admin') {
    return <Navigate to="/submissions" />;
  }

  return children;
};

export default AdminRoute;
