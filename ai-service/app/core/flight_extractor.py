import re
from datetime import datetime


FIELD_PATTERNS = {
    "flightNumber": [
        r"flight\s*(?:no|number)?\s*[:\-]?\s*([A-Z]{1,3}\s?\d{1,5})",
        r"\b([A-Z]{2,3}\s?\d{2,5})\b",
    ],

    "airline": [
        r"airline\s*[:\-]\s*(.+)",
    ],

    "origin": [
        r"origin\s*[:\-]\s*(.+)",
        r"from\s*[:\-]\s*(.+)",
    ],

    "destination": [
        r"destination\s*[:\-]\s*(.+)",
        r"to\s*[:\-]\s*(.+)",
    ],

    "departureDate": [
        r"departure\s*date\s*[:\-]\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2})",
        r"departure\s*date\s*[:\-]\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
    ],

    "departureTime": [
        r"departure\s*time\s*[:\-]\s*(\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)",
        r"departure\s*[:\-]\s*(\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)",
    ],

    "arrivalDate": [
        r"arrival\s*date\s*[:\-]\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2})",
        r"arrival\s*date\s*[:\-]\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
    ],

    "arrivalTime": [
        r"arrival\s*time\s*[:\-]\s*(\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)",
        r"arrival\s*[:\-]\s*(\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)",
    ],

    "price": [
        r"(?:price|fare)\s*[:\-]?\s*[₹$]?\s*([\d,]+(?:\.\d+)?)",
    ],

    "totalSeats": [
        r"(?:total\s*)?seats\s*[:\-]\s*(\d+)",
    ],
}


def clean_value(value: str):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    return value


def extract_field(
    text: str,
    patterns: list[str]
):
    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            value = clean_value(
                match.group(1)
            )

            if value is not None:
                return value

    return None


# ======================================================
# DATE CONVERSION
# ======================================================

def convert_date(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    formats = [
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%d-%m-%y",
        "%d/%m/%y",
        "%m-%d-%Y",
        "%m/%d/%Y",
        "%m-%d-%y",
        "%m/%d/%y",
    ]

    for date_format in formats:
        try:
            date = datetime.strptime(
                value,
                date_format
            )

            return date.strftime(
                "%Y-%m-%d"
            )

        except ValueError:
            continue

    return None


# ======================================================
# TIME CONVERSION
# ======================================================

def convert_time(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    formats = [
        "%H:%M",
        "%I:%M %p",
        "%I:%M%p",
    ]

    for time_format in formats:
        try:
            time = datetime.strptime(
                value.upper(),
                time_format
            )

            return time.strftime(
                "%H:%M"
            )

        except ValueError:
            continue

    return None


# ======================================================
# PRICE CONVERSION
# ======================================================

def convert_price(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    value = value.replace(",", "")
    value = value.replace("₹", "")
    value = value.replace("$", "")
    value = value.strip()

    if not value:
        return None

    try:
        return float(value)

    except ValueError:
        return None


# ======================================================
# SEAT CONVERSION
# ======================================================

def convert_total_seats(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    try:
        return int(float(value))

    except ValueError:
        return None


# ======================================================
# EXTRACT SINGLE FLIGHT
# ======================================================

def extract_single_flight(text: str):

    flight = {}

    for field, patterns in FIELD_PATTERNS.items():

        value = extract_field(
            text,
            patterns
        )

        if value is not None:
            flight[field] = value

    # ==================================================
    # DATE NORMALIZATION
    # ==================================================

    if "departureDate" in flight:

        departure_date = convert_date(
            flight["departureDate"]
        )

        if departure_date is None:
            flight.pop(
                "departureDate",
                None
            )
        else:
            flight["departureDate"] = (
                departure_date
            )

    if "arrivalDate" in flight:

        arrival_date = convert_date(
            flight["arrivalDate"]
        )

        if arrival_date is None:
            flight.pop(
                "arrivalDate",
                None
            )
        else:
            flight["arrivalDate"] = (
                arrival_date
            )

    # ==================================================
    # TIME NORMALIZATION
    # ==================================================

    if "departureTime" in flight:

        departure_time = convert_time(
            flight["departureTime"]
        )

        if departure_time is None:
            flight.pop(
                "departureTime",
                None
            )
        else:
            flight["departureTime"] = (
                departure_time
            )

    if "arrivalTime" in flight:

        arrival_time = convert_time(
            flight["arrivalTime"]
        )

        if arrival_time is None:
            flight.pop(
                "arrivalTime",
                None
            )
        else:
            flight["arrivalTime"] = (
                arrival_time
            )

    # ==================================================
    # PRICE
    # ==================================================

    if "price" in flight:

        price = convert_price(
            flight["price"]
        )

        if price is None:
            flight.pop(
                "price",
                None
            )
        else:
            flight["price"] = price

    # ==================================================
    # SEATS
    # ==================================================

    if "totalSeats" in flight:

        total_seats = convert_total_seats(
            flight["totalSeats"]
        )

        if total_seats is None:
            flight.pop(
                "totalSeats",
                None
            )
        else:
            flight["totalSeats"] = (
                total_seats
            )

    return flight

def extract_flights(data):

    # ======================================================
    # STRUCTURED CSV / EXCEL DATA
    # ======================================================

    if isinstance(data, list):

        flights = []

        for flight in data:

            if not isinstance(flight, dict):
                continue

            # Only keep rows that contain
            # basic flight information.
            if (
                flight.get("flightNumber")
                or flight.get("origin")
                or flight.get("destination")
            ):
                flights.append(flight)

        return flights

    # ======================================================
    # TEXT DOCUMENT
    # ======================================================

    text = str(data)

    blocks = re.split(
        r"\n\s*\n",
        text
    )

    flights = []

    for block in blocks:

        if not block.strip():
            continue

        flight = extract_single_flight(
            block
        )

        if (
            flight.get("flightNumber")
            or flight.get("origin")
            or flight.get("destination")
        ):
            flights.append(flight)

    if not flights:

        flight = extract_single_flight(
            text
        )

        if flight:
            flights.append(flight)

    return flights


# ======================================================
# EXTRACT MULTIPLE FLIGHTS
# ======================================================

def extract_flights(text: str):

    blocks = re.split(
        r"\n\s*\n",
        text
    )

    flights = []

    for block in blocks:

        if not block.strip():
            continue

        flight = extract_single_flight(
            block
        )

        if (
            flight.get("flightNumber")
            or flight.get("origin")
            or flight.get("destination")
        ):
            flights.append(flight)

    # ==================================================
    # FALLBACK
    # ==================================================

    if not flights:

        flight = extract_single_flight(
            text
        )

        if flight:
            flights.append(flight)

    return flights