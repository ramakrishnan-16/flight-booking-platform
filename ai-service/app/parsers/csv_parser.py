import pandas as pd


REQUIRED_COLUMNS = [
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
]


OPTIONAL_COLUMNS = [
    "originCode",
    "destinationCode",
    "availableSeats",
    "status",
]


def extract_csv(file_path: str):

    dataframe = pd.read_csv(
        file_path
    )

    # Normalize column names
    dataframe.columns = (
        dataframe.columns
        .astype(str)
        .str.strip()
    )

    # Check required columns
    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in dataframe.columns
    ]

    if missing_columns:
        raise ValueError(
            "CSV is missing required columns: "
            + ", ".join(missing_columns)
        )

    flights = []

    for _, row in dataframe.iterrows():

        flight = {}

        # Required fields
        for column in REQUIRED_COLUMNS:

            value = row[column]

            if pd.isna(value):
                value = None
            else:
                value = str(value).strip()

            flight[column] = value

        # Optional fields
        for column in OPTIONAL_COLUMNS:

            if column in dataframe.columns:

                value = row[column]

                if pd.isna(value):
                    value = None

                elif column in [
                    "availableSeats",
                    "status",
                    "originCode",
                    "destinationCode",
                ]:
                    value = str(value).strip()

                flight[column] = value

        # Convert numeric fields
        try:
            flight["price"] = float(
                flight["price"]
            )
        except (TypeError, ValueError):
            flight["price"] = None

        try:
            flight["totalSeats"] = int(
                float(flight["totalSeats"])
            )
        except (TypeError, ValueError):
            flight["totalSeats"] = None

        if flight.get("availableSeats") is not None:

            try:
                flight["availableSeats"] = int(
                    float(
                        flight["availableSeats"]
                    )
                )
            except (TypeError, ValueError):
                flight["availableSeats"] = None

        # Default available seats
        if (
            flight.get("availableSeats")
            is None
            and flight.get("totalSeats")
            is not None
        ):
            flight["availableSeats"] = (
                flight["totalSeats"]
            )

        # Default status
        if not flight.get("status"):
            flight["status"] = "Scheduled"

        flights.append(flight)

    return flights