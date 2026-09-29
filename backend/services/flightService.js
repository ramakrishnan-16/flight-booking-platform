import Flight from "../models/Flight.js";

const searchFlights = async ({
  from,
  to,
  departureDate,
}) => {
  const query = {
    status: "scheduled",
  };

  if (from) {
    query["departure.city"] = {
      $regex: from,
      $options: "i",
    };
  }

  if (to) {
    query["arrival.city"] = {
      $regex: to,
      $options: "i",
    };
  }

  if (departureDate) {
    query["departure.date"] = departureDate;
  }

  return await Flight.find(query).sort({
    price: 1,
  });
};

export default {
  searchFlights,
};