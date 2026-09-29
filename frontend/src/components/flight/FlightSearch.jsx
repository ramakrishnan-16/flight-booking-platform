import { useState } from "react";
import { searchFlights } from "../../services/flightService";

const FlightSearch = ({ onResults }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.from || !formData.to || !formData.departureDate) {
      setError("Please enter departure, destination and date.");
      return;
    }

    if (formData.from.toLowerCase() === formData.to.toLowerCase()) {
      setError("Departure and destination cannot be the same.");
      return;
    }

    try {
      setLoading(true);

      const result = await searchFlights(formData);

      onResults(result.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to search flights."
      );

      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-search-card">
      <h2>Search Flights</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-md-4">
            <label className="form-label">
              From
            </label>

            <input
              type="text"
              className="form-control"
              name="from"
              placeholder="Kochi"
              value={formData.from}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              To
            </label>

            <input
              type="text"
              className="form-control"
              name="to"
              placeholder="Dubai"
              value={formData.to}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              Departure Date
            </label>

            <input
              type="date"
              className="form-control"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
          </div>

        </div>

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;