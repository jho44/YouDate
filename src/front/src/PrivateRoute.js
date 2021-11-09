import React from "react";
import { Redirect, Route } from "react-router-dom";
import { fakeAuth } from "./Login";

/**
 * Private route wrapper that checks whether the user is logged in
 * before sending them to the right page.
 *
 * @property {Component} component - the page to send the user to if
 * they're already logged in
 * @returns {HTML} Conditionally returns `component` if logged in,
 * else returns `<Redirect />` to login page.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        fakeAuth.isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
