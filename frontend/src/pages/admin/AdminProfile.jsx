// frontend/src/pages/admin/AdminProfile.jsx

const AdminProfile = () => {
  let user = null;

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Unable to read stored user:", error);
    }
  }

  return (
    <div className="container py-4">

      <h2 className="mb-1">
        Admin Profile
      </h2>

      <p className="text-muted mb-4">
        Administrator account information.
      </p>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">

          <div className="mb-4">
            <label className="form-label text-muted">
              Full Name
            </label>

            <div className="fw-semibold">
              {user?.name || "Not available"}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">
              Email
            </label>

            <div className="fw-semibold">
              {user?.email || "Not available"}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">
              Account Type
            </label>

            <div>
              <span className="badge bg-primary">
                {user?.userType || "Not available"}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminProfile;