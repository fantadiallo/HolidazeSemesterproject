import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from './storage';

/**
 * Higher-order component for protecting routes that require authentication.
 * Usage: export default authGuard(YourComponent);
 *
 * @param {React.ComponentType} Component - The component to protect.
 * @returns {JSX.Element} The guarded component or a redirect to login.
 */
export default function authGuard(Component) {
  return function Guarded(props) {
    const location = useLocation();
    if (isLoggedIn()) {
      return <Component {...props} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  };
}
