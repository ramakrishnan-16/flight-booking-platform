import fs from "fs";
import Flight from "../models/Flight.js";
import aiService from "../services/aiService.js";

const parseDateTime = (date, time) => {
  if (!date || !time) {
    return null;
  }

  const value = new Date(`${date}T${time}`);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value;
};

const normalizeFlight = (flight) => {
  const departureDate = new Date(flight.departureDate);
  const arrivalDate = new Date(flight.arrivalDate);

  if (Number.isNaN(departureDate.getTime())) {
    return null;
  }

  if (Number.isNaN(arrivalDate.getTime())) {
    return null;
  }

  const departureDateTime = parseDateTime(
    flight.departureDate,
    flight.departureTime
  );

  if (!departureDateTime) {
    return null;
  }

  const price = Number(flight.price);
  const totalSeats = Number(flight.totalSeats);

  if (Number.isNaN(price) || price < 0) {
    return null;
  }

  if (Number.isNaN(totalSeats) || totalSeats <= 0) {
    return null;
  }

  return {
    flightNumber: flight.flightNumber?.trim().toUpperCase(),
    airline: flight.airline?.trim(),
    origin: flight.origin?.trim(),
    destination: flight.destination?.trim(),
    departureDate,
    departureTime: flight.departureTime?.trim(),
    arrivalDate,
    arrivalTime: flight.arrivalTime?.trim(),
    price,
    totalSeats,
    availableSeats:
      flight.availableSeats !== undefined
        ? Number(flight.availableSeats)
        : totalSeats,
    status: flight.status || "Scheduled",
    expiresAt: departureDateTime,
  };
};

export const extractFlightsFromDocument = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    filePath = req.file.path;

    const result =
      await aiService.extractFlightsFromDocument(filePath);

    const extractedFlights = Array.isArray(result.flights)
      ? result.flights
      : [];

    if (extractedFlights.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No flights were extracted from the document.",
      });
    }

    const createdFlights = [];
    const skippedFlights = [];

    for (let index = 0; index < extractedFlights.length; index++) {
      const extractedFlight = extractedFlights[index];

      try {
        const flight = normalizeFlight(extractedFlight);

        if (!flight) {
          skippedFlights.push({
            index,
            flightNumber:
              extractedFlight?.flightNumber || null,
            reason: "Invalid or incomplete flight data.",
          });

          continue;
        }

        if (
          !flight.flightNumber ||
          !flight.airline ||
          !flight.origin ||
          !flight.destination ||
          !flight.departureTime ||
          !flight.arrivalTime
        ) {
          skippedFlights.push({
            index,
            flightNumber:
              extractedFlight?.flightNumber || null,
            reason: "Required flight fields are missing.",
          });

          continue;
        }

        if (
          flight.origin.toLowerCase() ===
          flight.destination.toLowerCase()
        ) {
          skippedFlights.push({
            index,
            flightNumber: flight.flightNumber,
            reason:
              "Origin and destination cannot be the same.",
          });

          continue;
        }

        if (
          flight.availableSeats < 0 ||
          flight.availableSeats > flight.totalSeats
        ) {
          skippedFlights.push({
            index,
            flightNumber: flight.flightNumber,
            reason: "Invalid available seats.",
          });

          continue;
        }

        if (flight.expiresAt <= new Date()) {
          skippedFlights.push({
            index,
            flightNumber: flight.flightNumber,
            reason: "Flight departure time has already passed.",
          });

          continue;
        }

        const existingFlight = await Flight.findOne({
          flightNumber: flight.flightNumber,
          departureDate: flight.departureDate,
        });

        if (existingFlight) {
          skippedFlights.push({
            index,
            flightNumber: flight.flightNumber,
            reason: "Flight already exists.",
          });

          continue;
        }

        const createdFlight = await Flight.create(flight);

        createdFlights.push(createdFlight);
      } catch (error) {
        console.error(
          `Flight import error at index ${index}:`,
          error
        );

        skippedFlights.push({
          index,
          flightNumber:
            extractedFlight?.flightNumber || null,
          reason: "Unable to save flight.",
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Flight import completed.",
      filename: req.file.originalname,
      totalExtracted: extractedFlights.length,
      createdCount: createdFlights.length,
      skippedCount: skippedFlights.length,
      flights: createdFlights,
      skipped: skippedFlights,
    });
  } catch (error) {
    console.error(
      "Document extraction error:",
      error.response?.data || error.message
    );

    if (error.code === "AI_SERVICE_UNAVAILABLE") {
      return res.status(503).json({
        success: false,
        message:
          "AI service is unavailable. Please make sure the AI service is running.",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Unable to extract flight information from document.",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error(
          "Unable to delete temporary file:",
          cleanupError.message
        );
      }
    }
  }
};