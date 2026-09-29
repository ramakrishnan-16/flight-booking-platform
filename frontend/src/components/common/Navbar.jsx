import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthProvider from "../../context/AuthContext";


const Navbar = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = AuthProvider.useAuth();


  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">

      <div className="container">


        {/* LOGO */}

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          FlightBook
        </Link>


        {/* MOBILE TOGGLE */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >

          <span className="navbar-toggler-icon"></span>

        </button>


        {/* NAVIGATION */}

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >


          {/* LEFT MENU */}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">

              <Link
                className="nav-link"
                to="/"
              >
                Home
              </Link>

            </li>


            <li className="nav-item">

              <Link
                className="nav-link"
                to="/flights"
              >
                Flights
              </Link>

            </li>


            <li className="nav-item">

              <Link
                className="nav-link"
                to="/about"
              >
                About
              </Link>

            </li>

          </ul>


          {/* RIGHT MENU */}

          <ul className="navbar-nav align-items-lg-center">


            {user ? (

              <>

                {/* USER NAME */}

                <li className="nav-item me-lg-3">

                  <span className="nav-link">

                    Hello,{" "}

                    <strong>
                      {user.name}
                    </strong>

                  </span>

                </li>


                {/* ADMIN DASHBOARD */}

                {user.userType === "Admin" && (

                  <li className="nav-item me-lg-2">

                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to="/admin"
                    >
                      Admin Dashboard
                    </Link>

                  </li>

                )}


                {/* USER DASHBOARD */}

                {user.userType !== "Admin" && (

                  <li className="nav-item me-lg-2">

                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to="/dashboard"
                    >
                      Dashboard
                    </Link>

                  </li>

                )}


                {/* LOGOUT */}

                <li className="nav-item">

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                </li>

              </>

            ) : (

              <>

                {/* LOGIN */}

                <li className="nav-item me-lg-2">

                  <Link
                    className="btn btn-outline-primary btn-sm"
                    to="/login"
                  >
                    Login
                  </Link>

                </li>


                {/* REGISTER */}

                <li className="nav-item">

                  <Link
                    className="btn btn-primary btn-sm"
                    to="/register"
                  >
                    Sign Up
                  </Link>

                </li>

              </>

            )}

          </ul>

        </div>

      </div>

    </nav>
  );
};


export default Navbar;