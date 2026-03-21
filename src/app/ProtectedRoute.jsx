import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../features/auth/services/authService';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const user = authService.getCurrentUser();

  // 🛡️ 1. CHECK IDENTITY: Is there even a badge?
  if (!user || !user.token) {
    return <Navigate to="/" replace />;
  }

  // 🛡️ 2. CHECK CLEARANCE: Does the badge have the right roles?
  const hasAccess = allowedRoles.length === 0 || 
                    user.roles.some(role => allowedRoles.includes(role));

  if (!hasAccess) {
    // If they are logged in but NOT an Admin, send them back to the Showroom
    return <Navigate to="/" replace />;
  }

  // 🚀 CLEARANCE GRANTED: Render the nested Admin routes
  return <Outlet />;
}