import { Navigate } from 'react-router-dom';

export const UserDashboard = () => {
  // Redirect to profile page
  return <Navigate to="/profile" replace />;
};

