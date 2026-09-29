import { Routes, Route } from "react-router-dom";

// Public
import Home from "../pages/public/Home";
import Flights from "../pages/public/Flights";
// import About from "../pages/public/About";
// import NotFound from "../pages/public/NotFound";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageFlights from "../pages/admin/ManageFlights";
import AddFlight from "../pages/admin/AddFlight";
import EditFlight from "../pages/admin/EditFlight";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminProfile from "../pages/admin/AdminProfile";

// Common
import ProtectedRoute from "../components/common/ProtectedRoute";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC
      ================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/flights"
        element={<Flights />}
      />

      {/* <Route
        path="/about"
        element={<About />}
      /> */}


      {/* ==================================================
          AUTH
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* ==================================================
          ADMIN
      ================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/flights"
        element={
          <ProtectedRoute role="Admin">
            <ManageFlights />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/flights/add"
        element={
          <ProtectedRoute role="Admin">
            <AddFlight />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/flights/edit/:id"
        element={
          <ProtectedRoute role="Admin">
            <EditFlight />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute role="Admin">
            <ManageBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="Admin">
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="Admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          404
      ================================================== */}

      {/* <Route
        path="*"
        element={<NotFound />}
      /> */}

    </Routes>
  );
};


export default AppRoutes;