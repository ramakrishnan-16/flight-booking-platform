import { Link } from "react-router-dom";

const ManageFlights = () => {
  return (
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Flights</h2>
          <p className="text-muted">
            Add and manage available flights.
          </p>
        </div>

        <Link
          to="/admin/flights/add"
          className="btn btn-primary"
        >
          + Add Flight
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No flights available.
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

export default ManageFlights;