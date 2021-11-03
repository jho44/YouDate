import React, { Component } from "react";
import { Redirect, Link, Route, Switch } from "react-router-dom";
import Login, { fakeAuth } from "./Login";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar">
          <ul className="nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">My Profile</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </div>
    );
  }
}

//Private router function
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

//Home component
const Home = (props) => (
  <div>
    <h2>Home {console.log(props)}</h2>
  </div>
);

//Admin component
const Profile = ({ match }) => {
  return (
    <div>
      {" "}
      <h2>Welcome user </h2>
    </div>
  );
};

export default App;
