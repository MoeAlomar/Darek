// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from './ui/skeleton'; // Or any loading spinner

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading skeleton or spinner while checking auth
    return (
        <div className="container mx-auto p-8">
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!user) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in, but doesn't have the correct role
    // Redirect them to their default homepage
    return <Navigate to="/home" replace />;
  }

  // User is authenticated and authorized, render the child route
  return <Outlet />;
}

export default ProtectedRoute;