// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 120000,
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // --------------------------------------------------
    // Multipart FormData
    // --------------------------------------------------

    if (
      config.data instanceof FormData
    ) {
      delete config.headers[
        "Content-Type"
      ];
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(

  (response) => {
    return response;
  },

  (error) => {

    const status =
      error.response?.status;

    const code =
      error.response?.data?.code;

    const message =
      error.response?.data?.message;

    console.error(
      "API Error:",
      {
        status,
        code,
        message,
        url:
          error.config?.url,
        method:
          error.config?.method,
      }
    );


    // ==================================================
    // AUTHENTICATION FAILURE
    // ==================================================

    if (
      status === 401 &&
      (
        code ===
          "TOKEN_INVALID" ||
        code ===
          "TOKEN_EXPIRED"
      )
    ) {

      console.warn(
        "JWT is invalid or expired. Logging out."
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    }


    // ==================================================
    // DO NOT LOGOUT
    // ==================================================

    /*
     * 401 TOKEN_MISSING
     *
     * We intentionally do NOT
     * automatically logout here.
     *
     * 403
     * 404
     * 409
     * 422
     * 500
     * 503
     *
     * also do not logout.
     */


    return Promise.reject(error);
  }
);

export default api;