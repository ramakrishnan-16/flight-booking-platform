const FlightCard = ({ flight }) => {
  return (
    <div className="card flight-card mb-3">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h5 className="mb-1">
              {flight.airline}
            </h5>

            <small className="text-muted">
              {flight.flightNumber}
            </small>
          </div>

          <div className="text-end">
            <h5 className="mb-0">
              ₹{flight.price.toLocaleString("en-IN")}
            </h5>

            <small className="text-muted">
              {flight.currency}
            </small>
          </div>

        </div>

        <div className="row align-items-center">

          <div className="col-md-4">
            <strong>
              {flight.departure.time}
            </strong>

            <div>
              {flight.departure.city}
            </div>

            <small className="text-muted">
              {flight.departure.airport}
            </small>
          </div>

          <div className="col-md-4 text-center">
            <div>
              {flight.duration}
            </div>

            <hr />

            <small className="text-muted">
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} stop(s)`}
            </small>
          </div>

          <div className="col-md-4 text-end">
            <strong>
              {flight.arrival.time}
            </strong>

            <div>
              {flight.arrival.city}
            </div>

            <small className="text-muted">
              {flight.arrival.airport}
            </small>
          </div>

        </div>

        <div className="mt-3 d-flex justify-content-between">

          <small className="text-muted">
            {flight.seatsAvailable} seats available
          </small>

          <button className="btn btn-outline-primary">
            View Details
          </button>

        </div>

      </div>
    </div>
  );
};

export default FlightCard;