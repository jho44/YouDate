import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Landing from "./components/Landing";
import { AuthContext } from "./Context";
import { useNavigate } from "react-router-dom";

/**
 * Private route wrapper that checks whether the user is logged in
 * before sending them to the right page.
 *
 * @property {Component} children - the page to send the user to if
 * they're already logged in
 * @returns {HTML} Conditionally returns `component` if logged in,
 * else renders Login/Landing page.
 *
 * @class
 */
const PrivateRoute = ({ children }) => {
  const {
    /**
     * AuthContext state of logged-in user's access and refresh tokens.
     * @type {Object}
     * @memberof PrivateRoute
     */
    setTokens,
    /**
     * Function from AuthContext for setting logged-in user's access and refresh tokens.
     * @type {Function}
     * @memberof PrivateRoute
     */
    tokens,
    user,
    setUser,
  } = useContext(AuthContext);

  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    let localToken = null;
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
          localToken = res.access_token;

          // check if this user has a Datify account
          return fetch(`http://localhost:8000/getUser?token=${localToken}}`);
        })
        .then((data) => data.json())
        .then((data) => {
          const datifyUser = data[0];
          const statusCode = data[1];
          if (statusCode === 404) {
            // no Datify account so let's create one
            navigate("/info-form");
          }
          setUser(datifyUser);
        })
        .catch((err) => console.error(err));
    }
  }, [
    tokens,
    location.search,
    setTokens,
    location.pathname,
    navigate,
    setUser,
  ]);

  return tokens !== null && user !== null ? (
    children
  ) : (
    <Landing state={location.pathname} />
  );
};
export default PrivateRoute;
