import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Manage your flight booking platform
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Flights
              </p>

              <h3 className="mb-0">0</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Bookings
              </p>

              <h3 className="mb-0">0</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Total Users
              </p>

              <h3 className="mb-0">0</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Revenue
              </p>

              <h3 className="mb-0">₹0</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Flight Management</h5>

              <p className="text-muted">
                Add, edit and manage available flights.
              </p>

              <Link
                to="/admin/flights"
                className="btn btn-primary"
              >
                Manage Flights
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Booking Management</h5>

              <p className="text-muted">
                View and manage customer bookings.
              </p>

              <Link
                to="/admin/bookings"
                className="btn btn-primary"
              >
                Manage Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>User Management</h5>

              <p className="text-muted">
                View and manage registered users.
              </p>

              <Link
                to="/admin/users"
                className="btn btn-primary"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Admin Profile</h5>

              <p className="text-muted">
                View your administrator account.
              </p>

              <Link
                to="/admin/profile"
                className="btn btn-primary"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;