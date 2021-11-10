import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

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
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  /**
   * Checks whether user has proper authentication. Takes no
   * parameters. For now, uses fake authenticator to set a login
   * state to true immediately upon button click. Upon state change,
   * redirects to the page user came from.
   *
   * @private
   */
  function login() {
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true);
    });
  }

  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  if (redirectToReferrer) {
    return <Navigate to={from} />;
  }

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
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
