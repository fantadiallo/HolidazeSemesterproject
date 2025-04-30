import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './storage';

export default function authGuard(Component) {
  return function Guarded(props) {
    return isLoggedIn() ? <Component {...props} /> : <Navigate to="/login" replace />;
  };
}
