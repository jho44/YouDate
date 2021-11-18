import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Landing from "./components/Landing";
import { AuthContext } from "./Context";

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
  const { setTokens, tokens } = useContext(AuthContext);
  let location = useLocation();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");

    if (tokens === null && code) {
      fetch(
        `http://localhost:8000/accessToken?code=${code}&redirect=http://localhost:3000${location.pathname}`
      )
        .then((res) => res.json())
        .then((res) => {
          setTokens({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          });
        })
        .catch((err) => console.error(err));
    }
  }, [tokens, location.search, setTokens, location.pathname]);

  return tokens !== null ? children : <Landing state={location.pathname} />;
};
export default PrivateRoute;
