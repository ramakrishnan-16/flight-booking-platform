// frontend/src/services/flightService.js

import api from "./api";


// ======================================================
// GET FLIGHTS
// ======================================================

export const getFlights = async (params = {}) => {

  const response = await api.get(
    "/flights",
    {
      params,
    }
  );

  return response.data;
};


// ======================================================
// SEARCH FLIGHTS
// ======================================================

export const searchFlights = async (params = {}) => {

  const response = await api.get(
    "/flights/search",
    {
      params,
    }
  );

  return response.data;
};


// ======================================================
// GET FLIGHT
// ======================================================

export const getFlightById = async (id) => {

  const response = await api.get(
    `/flights/${id}`
  );

  return response.data;
};


// ======================================================
// CREATE FLIGHT
// ======================================================

export const createFlight = async (flightData) => {

  const response = await api.post(
    "/flights",
    flightData
  );

  return response.data;
};


// ======================================================
// BULK CREATE FLIGHTS
// ======================================================

export const bulkCreateFlights = async (
  flights
) => {

  const response = await api.post(
    "/flights/bulk",
    {
      flights,
    }
  );

  return response.data;
};


// ======================================================
// EXTRACT FLIGHTS FROM FILE
// ======================================================

export const extractFlightsFromDocument = async (
  file
) => {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );


  const response = await api.post(
    "/flights/extract",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


  return response.data;
};


// ======================================================
// UPDATE FLIGHT
// ======================================================

export const updateFlight = async (
  id,
  flightData
) => {

  const response = await api.put(
    `/flights/${id}`,
    flightData
  );

  return response.data;
};


// ======================================================
// DELETE FLIGHT
// ======================================================

export const deleteFlight = async (id) => {

  const response = await api.delete(
    `/flights/${id}`
  );

  return response.data;
};


export default {
  getFlights,
  searchFlights,
  getFlightById,
  createFlight,
  bulkCreateFlights,
  extractFlightsFromDocument,
  updateFlight,
  deleteFlight,
};