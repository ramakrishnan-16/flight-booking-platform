import express from "express";

import {
  searchFlights,
  createFlight,
  bulkCreateFlights,
  getFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  updateFlightStatus,
  updateAvailableSeats,
} from "../controllers/flightController.js";

import {
  extractFlightsFromDocument,
} from "../controllers/documentController.js";

import uploadFlightDocument from "../middleware/uploadMiddleware.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get(
  "/search",
  searchFlights
);

router.get(
  "/",
  getFlights
);

router.get(
  "/:id",
  getFlightById
);

// ======================================================
// ADMIN - MANUAL CREATE
// ======================================================

router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  createFlight
);

// ======================================================
// ADMIN - BULK CREATE
// ======================================================

router.post(
  "/bulk",
  protect,
  authorizeRoles("Admin"),
  bulkCreateFlights
);

// ======================================================
// ADMIN - DOCUMENT EXTRACTION
// ======================================================

router.post(
  "/extract",
  protect,
  authorizeRoles("Admin"),
  uploadFlightDocument.single("file"),
  extractFlightsFromDocument
);

// ======================================================
// ADMIN - UPDATE
// ======================================================

router.put(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  updateFlight
);

// ======================================================
// ADMIN - DELETE
// ======================================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteFlight
);

// ======================================================
// ADMIN - STATUS
// ======================================================

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("Admin"),
  updateFlightStatus
);

// ======================================================
// ADMIN - SEATS
// ======================================================

router.patch(
  "/:id/seats",
  protect,
  authorizeRoles("Admin"),
  updateAvailableSeats
);

export default router;