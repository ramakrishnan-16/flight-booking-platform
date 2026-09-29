// frontend/src/pages/admin/AddFlight.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";


const initialFlight = {
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
};


const AddFlight = () => {

  const navigate = useNavigate();


  // ======================================================
  // MODE
  // ======================================================

  const [mode, setMode] = useState("manual");


  // ======================================================
  // MANUAL FLIGHT
  // ======================================================

  const [formData, setFormData] =
    useState(initialFlight);


  // ======================================================
  // DOCUMENT IMPORT
  // ======================================================

  const [file, setFile] = useState(null);

  const [extractedFlights, setExtractedFlights] =
    useState([]);


  // ======================================================
  // AIRLINE API
  // ======================================================

  const [apiData, setApiData] = useState({
    apiUrl: "",
    apiKey: "",
    airlineCode: "",
  });

  const [apiFlights, setApiFlights] =
    useState([]);


  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [extracting, setExtracting] =
    useState(false);

  const [apiLoading, setApiLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ======================================================
  // CHANGE MODE
  // ======================================================

  const changeMode = (newMode) => {

    setMode(newMode);

    setError("");

    setSuccess("");

    setExtractedFlights([]);

    setApiFlights([]);

    setFile(null);
  };


  // ======================================================
  // MANUAL FORM
  // ======================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ======================================================
  // MANUAL SUBMIT
  // ======================================================

  const handleManualSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    setSuccess("");


    try {

      setLoading(true);


      const response = await api.post(
        "/flights",
        {
          flightNumber:
            formData.flightNumber.trim(),

          airline:
            formData.airline.trim(),

          origin:
            formData.origin.trim(),

          destination:
            formData.destination.trim(),

          departureDate:
            formData.departureDate,

          departureTime:
            formData.departureTime,

          arrivalDate:
            formData.arrivalDate,

          arrivalTime:
            formData.arrivalTime,

          price:
            Number(formData.price),

          totalSeats:
            Number(formData.totalSeats),
        }
      );


      console.log(
        "Flight created:",
        response.data
      );


      setSuccess(
        "Flight added successfully."
      );


      setFormData(initialFlight);


      setTimeout(() => {

        navigate(
          "/admin/flights"
        );

      }, 1000);


    } catch (error) {

      console.error(
        "Add flight error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to add flight."
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================================
  // FILE SELECTION
  // ======================================================

  const handleFileChange = (
    event
  ) => {

    const selectedFile =
      event.target.files?.[0];


    setError("");

    setSuccess("");


    if (!selectedFile) {

      setFile(null);

      return;
    }


    setFile(selectedFile);
  };


  // ======================================================
// EXTRACT FLIGHTS
// ======================================================

const handleExtractFlights = async () => {
  if (!file) {
    setError("Please select a file first.");
    return;
  }

  setError("");
  setSuccess("");
  setExtractedFlights([]);

  try {
    setExtracting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Authentication token is missing. Please login again."
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    console.log("====================================");
    console.log("Uploading flight document...");
    console.log("File:", file.name);
    console.log("Token exists:", Boolean(token));
    console.log("Token length:", token.length);
    console.log("====================================");

    const response = await api.post(
      "/flights/extract",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Extraction response:",
      response.data
    );

    const flights =
      response.data?.flights || [];

    if (!flights.length) {
      setError(
        "No flight information could be extracted from this file."
      );

      return;
    }

    setExtractedFlights(flights);

    setSuccess(
      `${flights.length} flight(s) extracted successfully.`
    );

  } catch (error) {
    console.error(
      "Flight extraction error:",
      error
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Response:",
      error.response?.data
    );

    /*
     * Do NOT manually logout here.
     */

    if (error.response?.status === 401) {
      setError(
        error.response?.data?.message ||
        "Authentication failed. Your login session may have expired."
      );

      return;
    }

    setError(
      error.response?.data?.message ||
      "Unable to extract flight information."
    );

  } finally {
    setExtracting(false);
  }
};


  // ======================================================
  // EDIT EXTRACTED FLIGHT
  // ======================================================

  const handleExtractedChange = (
    index,
    field,
    value
  ) => {

    setExtractedFlights(
      (previous) =>
        previous.map(
          (flight, flightIndex) =>
            flightIndex === index
              ? {
                  ...flight,
                  [field]: value,
                }
              : flight
        )
    );
  };


  // ======================================================
  // REMOVE EXTRACTED FLIGHT
  // ======================================================

  const removeExtractedFlight = (
    index
  ) => {

    setExtractedFlights(
      (previous) =>
        previous.filter(
          (_, flightIndex) =>
            flightIndex !== index
        )
    );
  };


  // ======================================================
  // IMPORT EXTRACTED FLIGHTS
  // ======================================================

  const handleImportFlights =
    async () => {

      if (!extractedFlights.length) {

        setError(
          "There are no flights to import."
        );

        return;
      }


      setError("");

      setSuccess("");


      try {

        setLoading(true);


        const response =
          await api.post(
            "/flights/bulk",
            {
              flights:
                extractedFlights,
            }
          );


        console.log(
          "Flights imported:",
          response.data
        );


        setSuccess(
          `${extractedFlights.length} flight(s) imported successfully.`
        );


        setExtractedFlights([]);

        setFile(null);


        setTimeout(() => {

          navigate(
            "/admin/flights"
          );

        }, 1200);


      } catch (error) {

        console.error(
          "Flight import error:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Unable to import flights."
        );

      } finally {

        setLoading(false);

      }
    };


  // ======================================================
  // AIRLINE API CHANGE
  // ======================================================

  const handleApiChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setApiData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // ======================================================
  // FETCH AIRLINE API
  // ======================================================

  const handleFetchAirlineFlights =
    async () => {

      if (!apiData.apiUrl.trim()) {

        setError(
          "Please enter the airline API URL."
        );

        return;
      }


      setError("");

      setSuccess("");

      setApiFlights([]);


      try {

        setApiLoading(true);


        /*
         * IMPORTANT:
         *
         * Do NOT call the external airline API
         * directly from the browser.
         *
         * The API key should remain on the backend.
         *
         * The frontend sends the configuration
         * to our backend.
         */


        const response =
          await api.post(
            "/flights/airline-api/import",
            {
              apiUrl:
                apiData.apiUrl.trim(),

              apiKey:
                apiData.apiKey.trim(),

              airlineCode:
                apiData.airlineCode.trim(),
            }
          );


        console.log(
          "Airline API response:",
          response.data
        );


        const flights =
          response.data?.flights ||
          response.data?.data?.flights ||
          [];


        if (!flights.length) {

          setError(
            "No flights were returned by the airline API."
          );

          return;
        }


        setApiFlights(
          flights
        );


        setSuccess(
          `${flights.length} flight(s) received from the airline API.`
        );


      } catch (error) {

        console.error(
          "Airline API error:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Unable to fetch flights from airline API."
        );

      } finally {

        setApiLoading(false);

      }
    };


  // ======================================================
  // IMPORT AIRLINE API FLIGHTS
  // ======================================================

  const handleImportApiFlights =
    async () => {

      if (!apiFlights.length) {

        setError(
          "There are no API flights to import."
        );

        return;
      }


      setError("");

      setSuccess("");


      try {

        setLoading(true);


        const response =
          await api.post(
            "/flights/bulk",
            {
              flights:
                apiFlights,
            }
          );


        console.log(
          "API flights imported:",
          response.data
        );


        setSuccess(
          `${apiFlights.length} flight(s) imported successfully.`
        );


        setApiFlights([]);


        setTimeout(() => {

          navigate(
            "/admin/flights"
          );

        }, 1200);


      } catch (error) {

        console.error(
          "API flight import error:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Unable to import API flights."
        );

      } finally {

        setLoading(false);

      }
    };


  // ======================================================
  // EDIT API FLIGHT
  // ======================================================

  const handleApiFlightChange = (
    index,
    field,
    value
  ) => {

    setApiFlights(
      (previous) =>
        previous.map(
          (flight, flightIndex) =>
            flightIndex === index
              ? {
                  ...flight,
                  [field]: value,
                }
              : flight
        )
    );
  };


  // ======================================================
  // REMOVE API FLIGHT
  // ======================================================

  const removeApiFlight = (
    index
  ) => {

    setApiFlights(
      (previous) =>
        previous.filter(
          (_, flightIndex) =>
            flightIndex !== index
        )
    );
  };


  // ======================================================
  // FLIGHT EDIT FIELDS
  // ======================================================

  const renderFlightFields = (
    flight,
    index,
    changeHandler
  ) => {

    const fields = [
      [
        "flightNumber",
        "Flight Number",
        "text",
      ],
      [
        "airline",
        "Airline",
        "text",
      ],
      [
        "origin",
        "Origin",
        "text",
      ],
      [
        "destination",
        "Destination",
        "text",
      ],
      [
        "departureDate",
        "Departure Date",
        "date",
      ],
      [
        "departureTime",
        "Departure Time",
        "time",
      ],
      [
        "arrivalDate",
        "Arrival Date",
        "date",
      ],
      [
        "arrivalTime",
        "Arrival Time",
        "time",
      ],
      [
        "price",
        "Price",
        "number",
      ],
      [
        "totalSeats",
        "Total Seats",
        "number",
      ],
    ];


    return fields.map(
      ([field, label, type]) => (

        <div
          className="col-md-6"
          key={field}
        >

          <label className="form-label">
            {label}
          </label>


          <input
            type={type}
            className="form-control"
            value={
              flight[field] ?? ""
            }
            onChange={(event) =>
              changeHandler(
                index,
                field,
                event.target.value
              )
            }
          />

        </div>

      )
    );
  };


  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="mb-1">
          Add Flight
        </h2>

        <p className="text-muted mb-0">
          Add flights manually, import
          documents, or connect an airline API.
        </p>

      </div>


      {/* ALERTS */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {success && (

        <div className="alert alert-success">
          {success}
        </div>

      )}


      {/* ==================================================
          MODE SELECTOR
      ================================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div
            className="btn-group"
            role="group"
          >

            <button
              type="button"
              className={`btn ${
                mode === "manual"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() =>
                changeMode("manual")
              }
            >
              Manual Entry
            </button>


            <button
              type="button"
              className={`btn ${
                mode === "document"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() =>
                changeMode("document")
              }
            >
              Import Document
            </button>


            <button
              type="button"
              className={`btn ${
                mode === "airline-api"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() =>
                changeMode("airline-api")
              }
            >
              Airline API
            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          MANUAL ENTRY
      ================================================== */}

      {mode === "manual" && (

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4">

            <h5 className="mb-4">
              Flight Information
            </h5>


            <form
              onSubmit={
                handleManualSubmit
              }
            >

              <div className="row g-3">

                <div className="col-md-6">

                  <label className="form-label">
                    Flight Number
                  </label>

                  <input
                    type="text"
                    name="flightNumber"
                    className="form-control"
                    placeholder="EK531"
                    value={
                      formData.flightNumber
                    }
                    onChange={
                      handleChange
                    }
                    required
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
                    placeholder="Emirates"
                    value={
                      formData.airline
                    }
                    onChange={
                      handleChange
                    }
                    required
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
                    placeholder="Kochi"
                    value={
                      formData.origin
                    }
                    onChange={
                      handleChange
                    }
                    required
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
                    placeholder="Dubai"
                    value={
                      formData.destination
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-md-3">

                  <label className="form-label">
                    Departure Date
                  </label>

                  <input
                    type="date"
                    name="departureDate"
                    className="form-control"
                    value={
                      formData.departureDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-md-3">

                  <label className="form-label">
                    Departure Time
                  </label>

                  <input
                    type="time"
                    name="departureTime"
                    className="form-control"
                    value={
                      formData.departureTime
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-md-3">

                  <label className="form-label">
                    Arrival Date
                  </label>

                  <input
                    type="date"
                    name="arrivalDate"
                    className="form-control"
                    value={
                      formData.arrivalDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-md-3">

                  <label className="form-label">
                    Arrival Time
                  </label>

                  <input
                    type="time"
                    name="arrivalTime"
                    className="form-control"
                    value={
                      formData.arrivalTime
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-md-6">

                  <label className="form-label">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    min="0"
                    placeholder="28500"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    required
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
                    min="1"
                    placeholder="180"
                    value={
                      formData.totalSeats
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>


              <div className="mt-4">

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading
                    ? "Adding Flight..."
                    : "Add Flight"}
                </button>


                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate(
                      "/admin/flights"
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==================================================
          DOCUMENT IMPORT
      ================================================== */}

      {mode === "document" && (

        <>

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h5 className="mb-2">
                Import Flight Document
              </h5>

              <p className="text-muted">
                Upload flight information from
                CSV, PDF, DOCX, Excel, JSON or
                TXT files.
              </p>


              <div className="border rounded p-4 text-center">

                <input
                  type="file"
                  id="flightDocument"
                  className="form-control mb-3"
                  accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.json,.txt"
                  onChange={
                    handleFileChange
                  }
                />


                {file && (

                  <div className="mb-3">

                    <strong>
                      Selected file:
                    </strong>{" "}

                    {file.name}

                  </div>

                )}


                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    handleExtractFlights
                  }
                  disabled={
                    !file ||
                    extracting
                  }
                >

                  {extracting
                    ? "Extracting Flights..."
                    : "Extract Flights"}

                </button>

              </div>


              <div className="mt-3">

                <small className="text-muted">
                  Supported formats: PDF, DOC,
                  DOCX, CSV, XLS, XLSX, JSON
                  and TXT.
                </small>

              </div>

            </div>

          </div>


          {/* EXTRACTED FLIGHTS */}

          {extractedFlights.length > 0 && (

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h5 className="mb-1">
                      Extracted Flights
                    </h5>

                    <small className="text-muted">
                      Review the extracted
                      information before importing.
                    </small>

                  </div>


                  <span className="badge bg-primary">
                    {extractedFlights.length}
                    {" "}
                    Flights
                  </span>

                </div>


                {extractedFlights.map(
                  (flight, index) => (

                    <div
                      className="border rounded p-3 mb-4"
                      key={index}
                    >

                      <div className="d-flex justify-content-between mb-3">

                        <h6>
                          Flight #{index + 1}
                        </h6>


                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            removeExtractedFlight(
                              index
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>


                      <div className="row g-3">

                        {renderFlightFields(
                          flight,
                          index,
                          handleExtractedChange
                        )}

                      </div>

                    </div>

                  )
                )}


                <div className="d-flex gap-2">

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={
                      handleImportFlights
                    }
                    disabled={loading}
                  >
                    {loading
                      ? "Importing..."
                      : `Confirm & Import ${extractedFlights.length} Flight(s)`}
                  </button>


                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {

                      setExtractedFlights([]);

                      setFile(null);

                    }}
                  >
                    Clear
                  </button>

                </div>

              </div>

            </div>

          )}

        </>

      )}


      {/* ==================================================
          AIRLINE API
      ================================================== */}

      {mode === "airline-api" && (

        <>

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body p-4">

              <h5 className="mb-2">
                Airline API
              </h5>

              <p className="text-muted">
                Connect an airline or flight-data
                provider API and retrieve flight
                information automatically.
              </p>


              <div className="alert alert-info">

                <strong>
                  Security:
                </strong>{" "}

                API keys should ultimately be
                stored and managed on the backend.
                Do not expose permanent airline
                API credentials in frontend code.

              </div>


              <div className="row g-3">

                {/* API URL */}

                <div className="col-12">

                  <label className="form-label">
                    Airline API URL
                  </label>

                  <input
                    type="url"
                    name="apiUrl"
                    className="form-control"
                    placeholder="https://api.example.com/flights"
                    value={
                      apiData.apiUrl
                    }
                    onChange={
                      handleApiChange
                    }
                  />

                </div>


                {/* API KEY */}

                <div className="col-md-6">

                  <label className="form-label">
                    API Key
                  </label>

                  <input
                    type="password"
                    name="apiKey"
                    className="form-control"
                    placeholder="Enter API key"
                    value={
                      apiData.apiKey
                    }
                    onChange={
                      handleApiChange
                    }
                  />

                </div>


                {/* AIRLINE CODE */}

                <div className="col-md-6">

                  <label className="form-label">
                    Airline Code
                  </label>

                  <input
                    type="text"
                    name="airlineCode"
                    className="form-control"
                    placeholder="EK"
                    value={
                      apiData.airlineCode
                    }
                    onChange={
                      handleApiChange
                    }
                  />

                </div>

              </div>


              <div className="mt-4">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    handleFetchAirlineFlights
                  }
                  disabled={apiLoading}
                >

                  {apiLoading
                    ? "Fetching Flights..."
                    : "Fetch Flights"}

                </button>

              </div>

            </div>

          </div>


          {/* API FLIGHTS */}

          {apiFlights.length > 0 && (

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h5 className="mb-1">
                      API Flights
                    </h5>

                    <small className="text-muted">
                      Review the flights returned
                      by the airline API.
                    </small>

                  </div>


                  <span className="badge bg-primary">
                    {apiFlights.length}
                    {" "}
                    Flights
                  </span>

                </div>


                {apiFlights.map(
                  (flight, index) => (

                    <div
                      className="border rounded p-3 mb-4"
                      key={index}
                    >

                      <div className="d-flex justify-content-between mb-3">

                        <h6>
                          Flight #{index + 1}
                        </h6>


                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            removeApiFlight(
                              index
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>


                      <div className="row g-3">

                        {renderFlightFields(
                          flight,
                          index,
                          handleApiFlightChange
                        )}

                      </div>

                    </div>

                  )
                )}


                <button
                  type="button"
                  className="btn btn-success"
                  onClick={
                    handleImportApiFlights
                  }
                  disabled={loading}
                >

                  {loading
                    ? "Importing..."
                    : `Confirm & Import ${apiFlights.length} Flight(s)`}

                </button>

              </div>

            </div>

          )}

        </>

      )}

    </div>
  );
};


export default AddFlight;