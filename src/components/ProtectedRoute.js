import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(LoginContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;