import React from "react";
import { Redirect } from "react-router-dom";

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

/* Temp fake authentication function */
export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
};

export default Login;
