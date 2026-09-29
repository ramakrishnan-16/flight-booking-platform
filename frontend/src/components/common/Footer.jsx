const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-4">

        <div className="row">

          <div className="col-md-6">
            <h5>FlightBook</h5>

            <p className="mb-0">
              Search and discover flights for your next journey.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-0">
              © {new Date().getFullYear()} FlightBook
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;