
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires admin but user is not admin, redirect to regular dashboard
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If non-admin user tries to access admin routes
  if (user?.role !== 'admin' && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If admin user tries to access seller routes
  if (user?.role === 'admin' && !window.location.pathname.startsWith('/admin') && window.location.pathname !== '/') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // All checks passed, render the protected content
  return <Outlet />;
};
