import {
  Navigate,
  useLocation,
} from "react-router-dom";

import AuthProvider from "../../context/AuthContext";


const ProtectedRoute = ({
  children,
  role,
}) => {

  const location = useLocation();

  const {
    user,
    loading,
  } = AuthProvider.useAuth();


  // Still checking authentication

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }


  // Not logged in

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  // Role protection

  if (
    role &&
    user.userType !== role
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
};


export default ProtectedRoute;