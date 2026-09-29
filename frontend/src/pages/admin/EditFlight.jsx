import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditFlight = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Backend update will be connected here.

    console.log("Updating flight:", id, formData);

    navigate("/admin/flights");
  };

  return (
    <div className="container py-4">

      <h2>Edit Flight</h2>

      <p className="text-muted mb-4">
        Update flight information.
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">
                  Flight Number
                </label>

                <input
                  type="text"
                  name="flightNumber"
                  className="form-control"
                  value={formData.flightNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Airline
                </label>

                <input
                  type="text"
                  name="airline"
                  className="form-control"
                  value={formData.airline}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Origin
                </label>

                <input
                  type="text"
                  name="origin"
                  className="form-control"
                  value={formData.origin}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  className="form-control"
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Departure Date
                </label>

                <input
                  type="date"
                  name="departureDate"
                  className="form-control"
                  value={formData.departureDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Departure Time
                </label>

                <input
                  type="time"
                  name="departureTime"
                  className="form-control"
                  value={formData.departureTime}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Arrival Date
                </label>

                <input
                  type="date"
                  name="arrivalDate"
                  className="form-control"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Arrival Time
                </label>

                <input
                  type="time"
                  name="arrivalTime"
                  className="form-control"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Total Seats
                </label>

                <input
                  type="number"
                  name="totalSeats"
                  className="form-control"
                  value={formData.totalSeats}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary me-2"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/admin/flights")
                }
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default EditFlight;