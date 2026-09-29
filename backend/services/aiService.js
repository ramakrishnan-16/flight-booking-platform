import fs from "fs";
import FormData from "form-data";
import axios from "axios";

// ======================================================
// AI SERVICE CONFIGURATION
// ======================================================

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000";


// ======================================================
// EXTRACT FLIGHTS FROM DOCUMENT
// ======================================================

export const extractFlightsFromDocument = async (
  filePath
) => {
  if (!filePath) {
    throw new Error(
      "Document file path is required."
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      "Document file does not exist."
    );
  }

  const formData = new FormData();

  formData.append(
    "file",
    fs.createReadStream(filePath)
  );

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/documents/extract-flights`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },

        maxContentLength:
          20 * 1024 * 1024,

        maxBodyLength:
          20 * 1024 * 1024,

        timeout: 120000,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "AI service extraction error:",
      error.response?.data ||
        error.message
    );

    const aiError = new Error(
      "AI service is unavailable. Please make sure the AI service is running."
    );

    aiError.statusCode =
      error.response?.status || 503;

    aiError.code =
      "AI_SERVICE_UNAVAILABLE";

    throw aiError;
  }
};


// ======================================================
// AI SERVICE HEALTH CHECK
// ======================================================

export const checkAIServiceHealth =
  async () => {
    try {
      const response =
        await axios.get(
          `${AI_SERVICE_URL}/api/health`,
          {
            timeout: 5000,
          }
        );

      return {
        available: true,
        data: response.data,
      };

    } catch (error) {
      console.error(
        "AI service health check failed:",
        error.message
      );

      return {
        available: false,
        data: null,
      };
    }
  };


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  extractFlightsFromDocument,
  checkAIServiceHealth,
};