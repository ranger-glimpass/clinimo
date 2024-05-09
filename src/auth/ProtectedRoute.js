// src/auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = sessionStorage.getItem('user'); // Check if the user is authenticated
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
