// backend/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ======================================================
// PROTECT ROUTES
// ======================================================

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // --------------------------------------------------
    // Check Authorization header
    // --------------------------------------------------

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_MISSING",
        message: "Authentication required.",
      });
    }

    // --------------------------------------------------
    // Extract token
    // --------------------------------------------------

    const token = authHeader
      .substring(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_MISSING",
        message:
          "Authentication token is missing.",
      });
    }

    // --------------------------------------------------
    // Check JWT secret
    // --------------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured correctly.",
      });
    }

    // --------------------------------------------------
    // Verify token
    // --------------------------------------------------

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (jwtError) {
      console.error(
        "JWT verification error:",
        jwtError.message
      );

      if (
        jwtError.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          code: "TOKEN_EXPIRED",
          message:
            "Authentication token has expired.",
        });
      }

      return res.status(401).json({
        success: false,
        code: "TOKEN_INVALID",
        message:
          "Invalid authentication token.",
      });
    }

    // --------------------------------------------------
    // Validate userId
    // --------------------------------------------------

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_INVALID",
        message:
          "Invalid authentication token.",
      });
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message:
          "User no longer exists.",
      });
    }

    // --------------------------------------------------
    // Check account status
    // --------------------------------------------------

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DISABLED",
        message:
          "Your account has been disabled.",
      });
    }

    // --------------------------------------------------
    // Attach user to request
    // --------------------------------------------------

    req.user = user;

    // Also keep userId available for controllers
    req.userId = user._id.toString();

    next();

  } catch (error) {

    console.error(
      "Authentication middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};


// ======================================================
// ROLE-BASED ACCESS CONTROL
// ======================================================

export const authorizeRoles = (
  ...allowedRoles
) => {

  return (req, res, next) => {

    // --------------------------------------------------
    // Check authentication
    // --------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_INVALID",
        message:
          "Authentication required.",
      });
    }

    // --------------------------------------------------
    // User role
    // --------------------------------------------------

    const userRole =
      req.user.userType;

    // --------------------------------------------------
    // Check role
    // --------------------------------------------------

    if (
      !allowedRoles.includes(userRole)
    ) {

      console.error(
        "Authorization denied:",
        {
          userId: req.user._id,
          userRole,
          allowedRoles,
        }
      );

      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message:
          "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};