import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    airline: {
      type: String,
      required: true,
      trim: true,
    },

    origin: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    departureDate: {
      type: Date,
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalDate: {
      type: Date,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    // ======================================================
    // FLIGHT EXPIRY
    // ======================================================

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expireAfterSeconds: 0,
      },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Delayed",
        "Cancelled",
        "Completed",
      ],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

flightSchema.index({
  flightNumber: 1,
});

flightSchema.index({
  origin: 1,
  destination: 1,
  departureDate: 1,
});

const Flight = mongoose.model(
  "Flight",
  flightSchema
);

export default Flight;