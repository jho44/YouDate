import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fakeAuth } from "./Login";

/**
 * Private route wrapper that checks whether the user is logged in
 * before sending them to the right page.
 *
 * @property {Component} children - the page to send the user to if
 * they're already logged in
 * @returns {HTML} Conditionally returns `component` if logged in,
 * else returns `<Navigate />` to login page.
 *
 * @class
 */
const PrivateRoute = ({ children }) => {
  let location = useLocation();
  useEffect(() => {
    fetch(
      `http://localhost:8000/accessToken?code=${new URLSearchParams(
        location.search
      ).get("code")}`
    )
      .then((res) => res.text())
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  });

  return fakeAuth.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};
export default PrivateRoute;
