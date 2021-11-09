import React from "react";
import { Redirect } from "react-router-dom";
// import { fakeAuth } from "./fakeAuth";

/**
 * Class Component that renders our Login page and redirects us to either:
 * 1. the page we came from that required authentication
 * 2. the "Home" page for now
 *
 * (No special reason why this is a Class Component rather than a
 * functional component.)
 * @property {Object} location - `{ from: { pathname: "path/of/last/page/we/were/on" } }`
 * @returns {HTML} Meet page, soon to include Profile page
 */
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false,
    };
    this.login = this.login.bind(this);
  }

  /**
   * Checks whether user has proper authentication. Takes no
   * parameters. For now, uses fake authenticator to set a login
   * state to true immediately upon button click. Upon state change,
   * redirects to the page user came from.
   *
   * @private
   */
  login() {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

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
