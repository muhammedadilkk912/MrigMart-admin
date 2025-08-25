import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authentication, children }) => {
   console.log("inside the protect router check authentication status=",authentication)
  if (!authentication) {
    // Redirect unauthenticated users to login
    return <Navigate to="/" replace />;
  }
  
  // Render children (nested routes)
  return children;
};

export default ProtectedRoute;
