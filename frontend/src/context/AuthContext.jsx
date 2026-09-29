import {
  createContext,
  useContext,
  useState,
} from "react";

import axios from "axios";


// ======================================================
// AUTH CONTEXT
// ======================================================

const AuthContext = createContext(null);


// ======================================================
// GET STORED USER
// ======================================================

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Unable to read stored user:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return null;
  }
};


// ======================================================
// AUTH PROVIDER
// ======================================================

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    getStoredUser
  );

  const [loading, setLoading] = useState(false);


  // ====================================================
  // LOGIN
  // ====================================================

  const login = async (
    email,
    password
  ) => {

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      const data = response.data;


      // ==================================================
      // ACCEPT COMMON BACKEND RESPONSE STRUCTURES
      // ==================================================

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token;


      const loggedInUser =
        data.user ||
        data.data?.user;


      if (!token || !loggedInUser) {

        console.error(
          "Unexpected login response:",
          data
        );

        throw new Error(
          "Invalid login response from server."
        );
      }


      // ==================================================
      // SAVE TOKEN
      // ==================================================

      localStorage.setItem(
        "token",
        token
      );


      // ==================================================
      // SAVE USER
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );


      // ==================================================
      // UPDATE AUTH STATE
      // ==================================================

      setUser(loggedInUser);


      return {
        token,
        user: loggedInUser,
      };

    } catch (error) {

      console.error(
        "Login request failed:",
        error.response?.data || error.message
      );

      throw error;

    } finally {

      setLoading(false);

    }
  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };


  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ======================================================
// AUTH HOOK
// ======================================================

AuthProvider.useAuth = () => {
  return useContext(AuthContext);
};


// ======================================================
// EXPORT
// ======================================================

export default AuthProvider;