// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../UserContext"; // Import useUser

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles: string[]; // Change allowedRoles to an array of strings
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, element }) => {
  // const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { user, isLoading: userLoading } = useUser(); // Use user and loading state from UserContext

  if (userLoading) {
    return <div>Loading...</div>; // Show loading indicator while checking authentication
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/DoctorsAdmitted" replace />;
  }

  // Redirect to unauthorized if user role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return element;
};

export default PrivateRoute;