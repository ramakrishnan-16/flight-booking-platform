// backend/controllers/flightController.js

import Flight from "../models/Flight.js";

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

/**
 * Convert a value into a Date safely.
 */
const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};


/**
 * Convert a value into a number safely.
 */
const parseNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
};


/**
 * Validate required flight fields.
 */
const validateFlightData = (data) => {
  const requiredFields = [
    "flightNumber",
    "airline",
    "origin",
    "destination",
    "departureDate",
    "departureTime",
    "arrivalDate",
    "arrivalTime",
    "price",
    "totalSeats",
  ];

  const missingFields = [];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      missingFields.push(field);
    }
  }

  return missingFields;
};


/**
 * Normalize flight data before saving.
 */
const normalizeFlightData = (data) => {
  const departureDate = parseDate(
    data.departureDate
  );

  const arrivalDate = parseDate(
    data.arrivalDate
  );

  const price = parseNumber(data.price);

  const totalSeats = parseNumber(
    data.totalSeats
  );

  return {
    flightNumber:
      data.flightNumber
        ?.trim()
        .toUpperCase(),

    airline:
      data.airline?.trim(),

    origin:
      data.origin?.trim(),

    destination:
      data.destination?.trim(),

    departureDate,

    departureTime:
      data.departureTime?.trim(),

    arrivalDate,

    arrivalTime:
      data.arrivalTime?.trim(),

    price,

    totalSeats,

    availableSeats:
      data.availableSeats !== undefined
        ? parseNumber(
            data.availableSeats
          )
        : totalSeats,

    status:
      data.status || "Scheduled",
  };
};


/*
|--------------------------------------------------------------------------
| CREATE FLIGHT
|--------------------------------------------------------------------------
|
| POST /api/flights
|
| Admin only
|
*/

export const createFlight = async (
  req,
  res
) => {
  try {
    const missingFields =
      validateFlightData(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Required flight fields are missing.",
        missingFields,
      });
    }

    const flightData =
      normalizeFlightData(req.body);

    /*
    |--------------------------------------------------------------------------
    | Validate dates
    |--------------------------------------------------------------------------
    */

    if (!flightData.departureDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid departure date.",
      });
    }

    if (!flightData.arrivalDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid arrival date.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate price
    |--------------------------------------------------------------------------
    */

    if (
      flightData.price === null ||
      flightData.price < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be a valid positive number.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate seats
    |--------------------------------------------------------------------------
    */

    if (
      flightData.totalSeats === null ||
      flightData.totalSeats <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Total seats must be greater than zero.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate route
    |--------------------------------------------------------------------------
    */

    if (
      flightData.origin.toLowerCase() ===
      flightData.destination.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Origin and destination cannot be the same.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate flight
    |--------------------------------------------------------------------------
    */

    const existingFlight =
      await Flight.findOne({
        flightNumber:
          flightData.flightNumber,

        departureDate:
          flightData.departureDate,
      });

    if (existingFlight) {
      return res.status(409).json({
        success: false,
        message:
          "A flight with this flight number already exists for this date.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create flight
    |--------------------------------------------------------------------------
    */

    const flight =
      await Flight.create(
        flightData
      );

    return res.status(201).json({
      success: true,
      message:
        "Flight created successfully.",
      flight,
    });

  } catch (error) {
    console.error(
      "Create flight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create flight.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| BULK CREATE FLIGHTS
|--------------------------------------------------------------------------
|
| POST /api/flights/bulk
|
| Used after AI document extraction.
|
| Admin only
|
*/

export const bulkCreateFlights = async (
  req,
  res
) => {
  try {
    const { flights } = req.body;

    if (
      !Array.isArray(flights) ||
      flights.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No flights were provided.",
      });
    }

    const createdFlights = [];
    const skippedFlights = [];

    /*
    |--------------------------------------------------------------------------
    | Process each flight
    |--------------------------------------------------------------------------
    */

    for (
      let index = 0;
      index < flights.length;
      index++
    ) {
      const flightData =
        flights[index];

      try {
        /*
        |--------------------------------------------------------------------------
        | Validate fields
        |--------------------------------------------------------------------------
        */

        const missingFields =
          validateFlightData(
            flightData
          );

        if (
          missingFields.length > 0
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber ||
              null,

            reason:
              "Missing required fields.",

            missingFields,
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize
        |--------------------------------------------------------------------------
        */

        const normalizedFlight =
          normalizeFlightData(
            flightData
          );

        /*
        |--------------------------------------------------------------------------
        | Validate dates
        |--------------------------------------------------------------------------
        */

        if (
          !normalizedFlight.departureDate
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber,

            reason:
              "Invalid departure date.",
          });

          continue;
        }

        if (
          !normalizedFlight.arrivalDate
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber,

            reason:
              "Invalid arrival date.",
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate price
        |--------------------------------------------------------------------------
        */

        if (
          normalizedFlight.price ===
            null ||
          normalizedFlight.price < 0
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber,

            reason:
              "Invalid price.",
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate seats
        |--------------------------------------------------------------------------
        */

        if (
          normalizedFlight.totalSeats ===
            null ||
          normalizedFlight.totalSeats <=
            0
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber,

            reason:
              "Invalid total seats.",
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate route
        |--------------------------------------------------------------------------
        */

        if (
          normalizedFlight.origin.toLowerCase() ===
          normalizedFlight.destination.toLowerCase()
        ) {
          skippedFlights.push({
            index,

            flightNumber:
              flightData.flightNumber,

            reason:
              "Origin and destination cannot be the same.",
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Check duplicate
        |--------------------------------------------------------------------------
        */

        const existingFlight =
          await Flight.findOne({
            flightNumber:
              normalizedFlight.flightNumber,

            departureDate:
              normalizedFlight.departureDate,
          });

        if (existingFlight) {
          skippedFlights.push({
            index,

            flightNumber:
              normalizedFlight.flightNumber,

            reason:
              "Flight already exists.",
          });

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Create flight
        |--------------------------------------------------------------------------
        */

        const createdFlight =
          await Flight.create(
            normalizedFlight
          );

        createdFlights.push(
          createdFlight
        );

      } catch (error) {
        console.error(
          `Bulk flight ${index} error:`,
          error
        );

        skippedFlights.push({
          index,

          flightNumber:
            flightData?.flightNumber ||
            null,

          reason:
            "Unable to process this flight.",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Flight import completed.",

      totalReceived:
        flights.length,

      createdCount:
        createdFlights.length,

      skippedCount:
        skippedFlights.length,

      flights:
        createdFlights,

      skipped:
        skippedFlights,
    });

  } catch (error) {
    console.error(
      "Bulk create flights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to import flights.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL FLIGHTS
|--------------------------------------------------------------------------
|
| GET /api/flights
|
| Public
|
| Supports:
| ?origin=Kochi
| ?destination=Dubai
| ?date=2026-09-15
| ?airline=Emirates
| ?status=Scheduled
| ?minPrice=1000
| ?maxPrice=50000
| ?sort=price_asc
| ?page=1
| ?limit=10
|
*/

export const getFlights = async (
  req,
  res
) => {
  try {
    const {
      origin,
      destination,
      date,
      airline,
      status,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    /*
    |--------------------------------------------------------------------------
    | Build query
    |--------------------------------------------------------------------------
    */

    const query = {};

    if (origin) {
      query.origin = {
        $regex: origin,
        $options: "i",
      };
    }

    if (destination) {
      query.destination = {
        $regex: destination,
        $options: "i",
      };
    }

    if (airline) {
      query.airline = {
        $regex: airline,
        $options: "i",
      };
    }

    if (status) {
      query.status = status;
    }

    /*
    |--------------------------------------------------------------------------
    | Date filtering
    |--------------------------------------------------------------------------
    */

    if (date) {
      const searchDate =
        parseDate(date);

      if (!searchDate) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date.",
        });
      }

      const startDate =
        new Date(searchDate);

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      const endDate =
        new Date(searchDate);

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      query.departureDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Price filtering
    |--------------------------------------------------------------------------
    */

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      query.price = {};

      if (minPrice !== undefined) {
        const minimum =
          parseNumber(minPrice);

        if (
          minimum === null ||
          minimum < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid minimum price.",
          });
        }

        query.price.$gte =
          minimum;
      }

      if (maxPrice !== undefined) {
        const maximum =
          parseNumber(maxPrice);

        if (
          maximum === null ||
          maximum < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid maximum price.",
          });
        }

        query.price.$lte =
          maximum;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const pageNumber =
      Math.max(
        Number(page) || 1,
        1
      );

    const limitNumber =
      Math.min(
        Math.max(
          Number(limit) || 20,
          1
        ),
        100
      );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    let sortOption = {
      departureDate: 1,
      departureTime: 1,
    };

    if (sort === "price_asc") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_desc") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "departure_asc") {
      sortOption = {
        departureDate: 1,
      };
    }

    if (sort === "departure_desc") {
      sortOption = {
        departureDate: -1,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Database query
    |--------------------------------------------------------------------------
    */

    const [
      flights,
      totalFlights,
    ] = await Promise.all([
      Flight.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),

      Flight.countDocuments(query),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      count:
        flights.length,

      total:
        totalFlights,

      page:
        pageNumber,

      pages:
        Math.ceil(
          totalFlights /
            limitNumber
        ),

      flights,
    });

  } catch (error) {
    console.error(
      "Get flights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch flights.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE FLIGHT
|--------------------------------------------------------------------------
|
| GET /api/flights/:id
|
| Public
|
*/

export const getFlightById = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const flight =
      await Flight.findById(id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found.",
      });
    }

    return res.status(200).json({
      success: true,
      flight,
    });

  } catch (error) {
    console.error(
      "Get flight by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch flight.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE FLIGHT
|--------------------------------------------------------------------------
|
| PUT /api/flights/:id
|
| Admin only
|
*/

export const updateFlight = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const existingFlight =
      await Flight.findById(id);

    if (!existingFlight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize incoming data
    |--------------------------------------------------------------------------
    */

    const updateData = {};

    const allowedFields = [
      "flightNumber",
      "airline",
      "origin",
      "destination",
      "departureDate",
      "departureTime",
      "arrivalDate",
      "arrivalTime",
      "price",
      "totalSeats",
      "availableSeats",
      "status",
    ];

    for (
      const field of allowedFields
    ) {
      if (
        req.body[field] !==
        undefined
      ) {
        updateData[field] =
          req.body[field];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | String fields
    |--------------------------------------------------------------------------
    */

    if (
      updateData.flightNumber !==
      undefined
    ) {
      updateData.flightNumber =
        updateData.flightNumber
          .trim()
          .toUpperCase();
    }

    if (
      updateData.airline !==
      undefined
    ) {
      updateData.airline =
        updateData.airline.trim();
    }

    if (
      updateData.origin !==
      undefined
    ) {
      updateData.origin =
        updateData.origin.trim();
    }

    if (
      updateData.destination !==
      undefined
    ) {
      updateData.destination =
        updateData.destination.trim();
    }

    if (
      updateData.departureTime !==
      undefined
    ) {
      updateData.departureTime =
        updateData.departureTime.trim();
    }

    if (
      updateData.arrivalTime !==
      undefined
    ) {
      updateData.arrivalTime =
        updateData.arrivalTime.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Date fields
    |--------------------------------------------------------------------------
    */

    if (
      updateData.departureDate !==
      undefined
    ) {
      const date =
        parseDate(
          updateData.departureDate
        );

      if (!date) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid departure date.",
        });
      }

      updateData.departureDate =
        date;
    }

    if (
      updateData.arrivalDate !==
      undefined
    ) {
      const date =
        parseDate(
          updateData.arrivalDate
        );

      if (!date) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid arrival date.",
        });
      }

      updateData.arrivalDate =
        date;
    }

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    if (
      updateData.price !==
      undefined
    ) {
      const price =
        parseNumber(
          updateData.price
        );

      if (
        price === null ||
        price < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid price.",
        });
      }

      updateData.price =
        price;
    }

    /*
    |--------------------------------------------------------------------------
    | Total seats
    |--------------------------------------------------------------------------
    */

    if (
      updateData.totalSeats !==
      undefined
    ) {
      const totalSeats =
        parseNumber(
          updateData.totalSeats
        );

      if (
        totalSeats === null ||
        totalSeats <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid total seats.",
        });
      }

      updateData.totalSeats =
        totalSeats;
    }

    /*
    |--------------------------------------------------------------------------
    | Available seats
    |--------------------------------------------------------------------------
    */

    if (
      updateData.availableSeats !==
      undefined
    ) {
      const availableSeats =
        parseNumber(
          updateData.availableSeats
        );

      if (
        availableSeats === null ||
        availableSeats < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid available seats.",
        });
      }

      updateData.availableSeats =
        availableSeats;
    }

    /*
    |--------------------------------------------------------------------------
    | Route validation
    |--------------------------------------------------------------------------
    */

    const finalOrigin =
      updateData.origin ??
      existingFlight.origin;

    const finalDestination =
      updateData.destination ??
      existingFlight.destination;

    if (
      finalOrigin.toLowerCase() ===
      finalDestination.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Origin and destination cannot be the same.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Seat validation
    |--------------------------------------------------------------------------
    */

    const finalTotalSeats =
      updateData.totalSeats ??
      existingFlight.totalSeats;

    const finalAvailableSeats =
      updateData.availableSeats ??
      existingFlight.availableSeats;

    if (
      finalAvailableSeats >
      finalTotalSeats
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Available seats cannot exceed total seats.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate check
    |--------------------------------------------------------------------------
    */

    const finalFlightNumber =
      updateData.flightNumber ??
      existingFlight.flightNumber;

    const finalDepartureDate =
      updateData.departureDate ??
      existingFlight.departureDate;

    const duplicate =
      await Flight.findOne({
        _id: {
          $ne: id,
        },

        flightNumber:
          finalFlightNumber,

        departureDate:
          finalDepartureDate,
      });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "Another flight with this flight number already exists for this date.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const updatedFlight =
      await Flight.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Flight updated successfully.",
      flight:
        updatedFlight,
    });

  } catch (error) {
    console.error(
      "Update flight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update flight.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE FLIGHT
|--------------------------------------------------------------------------
|
| DELETE /api/flights/:id
|
| Admin only
|
*/

export const deleteFlight = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const flight =
      await Flight.findById(id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    await Flight.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Flight deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete flight error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete flight.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE FLIGHT STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/flights/:id/status
|
| Admin only
|
*/

export const updateFlightStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      const allowedStatuses = [
        "Scheduled",
        "Delayed",
        "Cancelled",
        "Completed",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid flight status.",
        });
      }

      const flight =
        await Flight.findById(id);

      if (!flight) {
        return res.status(404).json({
          success: false,
          message:
            "Flight not found.",
        });
      }

      flight.status =
        status;

      await flight.save();

      return res.status(200).json({
        success: true,
        message:
          "Flight status updated successfully.",
        flight,
      });

    } catch (error) {
      console.error(
        "Update flight status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update flight status.",
      });
    }
  };

// ======================================================
// SEARCH FLIGHTS
// ======================================================

export const searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      passengers,
    } = req.query;

    const query = {};

    if (origin) {
      query.origin = {
        $regex: origin,
        $options: "i",
      };
    }

    if (destination) {
      query.destination = {
        $regex: destination,
        $options: "i",
      };
    }

    if (departureDate) {
      const date = new Date(departureDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid departure date.",
        });
      }

      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.departureDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Only show flights that can currently be booked
    query.status = {
      $in: ["Scheduled", "Delayed"],
    };

    query.availableSeats = {
      $gt: 0,
    };

    const flights = await Flight.find(query)
      .sort({
        departureDate: 1,
        departureTime: 1,
        price: 1,
      });

    return res.status(200).json({
      success: true,
      count: flights.length,
      passengers: passengers
        ? Number(passengers)
        : 1,
      flights,
    });

  } catch (error) {
    console.error(
      "Search flights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to search flights.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE AVAILABLE SEATS
|--------------------------------------------------------------------------
|
| PATCH /api/flights/:id/seats
|
| This can later be used by the booking system.
|
*/

export const updateAvailableSeats =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        availableSeats,
      } = req.body;

      const seats =
        parseNumber(
          availableSeats
        );

      if (
        seats === null ||
        seats < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid available seats.",
        });
      }

      const flight =
        await Flight.findById(id);

      if (!flight) {
        return res.status(404).json({
          success: false,
          message:
            "Flight not found.",
        });
      }

      if (
        seats >
        flight.totalSeats
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Available seats cannot exceed total seats.",
        });
      }

      flight.availableSeats =
        seats;

      await flight.save();

      return res.status(200).json({
        success: true,
        message:
          "Available seats updated successfully.",
        flight,
      });

    } catch (error) {
      console.error(
        "Update available seats error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update available seats.",
      });
    }
  };