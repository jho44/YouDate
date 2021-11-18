import React from "react";
import { useLocation } from "react-router-dom";
import { loginUrl } from "./spotify";
import { Typography } from "antd";
const { Title } = Typography;

/**
 * Class Component that renders our Login page and redirects us to either:
 * 1. the page we came from that required authentication
 * 2. the "Home" page for now
 *
 * (No special reason why this is a Class Component rather than a
 * functional component.)
 * @property {Object} location - `{ from: { pathname: "path/of/last/page/we/were/on" } }`
 * @returns {HTML} Meet page, soon to include Profile page
 *
 * @class
 */
const Login = () => {
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  return (
    <div>
      <Title>Datify</Title>
      <a href={`${loginUrl}${from.pathname}`}>Login with your Spotify</a>
    </div>
  );
};

/**
 * Temporary fake authentication Object containing `isAuthenticated`
 * boolean state and `authenticate` function
 *
 * @class
 * @hideconstructor
 */
export const fakeAuth = {
  isAuthenticated: false,
  /**
   * The `authenticate` function:
   * Temporary fake `authenticate` function that sets `isAuthenticated`
   * to true. Returns nothing.
   *
   * @param {Function} cb - callback function to run after
   * setting `isAuthenticated` state
   *
   * @public
   */
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
};

export default Login;
