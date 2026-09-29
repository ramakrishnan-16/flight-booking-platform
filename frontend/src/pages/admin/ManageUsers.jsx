const ManageUsers = () => {
  return (
    <div className="container-fluid py-4">

      <h2>Manage Users</h2>

      <p className="text-muted mb-4">
        Manage registered users.
      </p>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4"
                  >
                    No users available.
                  </td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ManageUsers;