import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthProvider from "../../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();

  const {
    login,
  } = AuthProvider.useAuth();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Please enter your email and password."
      );

      return;
    }


    try {
      setLoading(true);

      const data = await login(
        formData.email,
        formData.password
      );


      // ================================================
      // ADMIN
      // ================================================

      if (
        data.user?.userType === "Admin"
      ) {
        navigate("/admin", {
          replace: true,
        });

        return;
      }


      // ================================================
      // NORMAL USER
      // ================================================

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-6 col-lg-5">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <h2 className="text-center mb-2">
                Welcome Back
              </h2>

              <p className="text-center text-muted mb-4">
                Login to continue your journey
              </p>


              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}


              <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>


                {/* PASSWORD */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                </div>


                {/* FORGOT PASSWORD */}

                <div className="text-end mb-3">

                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >

                  {loading
                    ? "Logging in..."
                    : "Login"}

                </button>

              </form>


              {/* REGISTER */}

              <div className="text-center mt-4">

                <span className="text-muted">
                  Don't have an account?{" "}
                </span>

                <Link to="/register">
                  Create Account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default Login;