import { useState } from "react";

import FlightSearch from "../../components/flight/FlightSearch";
import FlightCard from "../../components/flight/FlightCard";

const Home = () => {
  const [flights, setFlights] = useState([]);

  return (
    <div>

      <section className="hero-section">
        <div className="container">

          <div className="hero-content">
            <span className="badge bg-primary mb-3">
              Your journey starts here
            </span>

            <h1>
              Find your perfect flight
            </h1>

            <p>
              Search flights, compare prices and plan
              your next journey.
            </p>
          </div>

          <FlightSearch onResults={setFlights} />

        </div>
      </section>

      <section className="container py-5">

        {flights.length > 0 && (
          <>
            <h2 className="mb-4">
              Available Flights
            </h2>

            {flights.map((flight) => (
              <FlightCard
                key={flight._id}
                flight={flight}
              />
            ))}
          </>
        )}

        {flights.length === 0 && (
          <div className="text-center py-5">
            <h3>
              Search for a flight
            </h3>

            <p className="text-muted">
              Enter your departure, destination and travel
              date above.
            </p>
          </div>
        )}

      </section>

    </div>
  );
};

export default Home;