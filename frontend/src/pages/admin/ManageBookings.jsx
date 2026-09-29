const ManageBookings = () => {
  return (
    <div className="container-fluid py-4">

      <h2>Manage Bookings</h2>

      <p className="text-muted mb-4">
        View and manage customer flight bookings.
      </p>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4"
                  >
                    No bookings available.
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

export default ManageBookings;