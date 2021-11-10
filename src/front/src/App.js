import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Meet from "./Meet";
import Profile from "./Profile";
import Login from "./Login";
import Navbar from "./Navbar";
import "./App.css";

/**
 * Wrapper component for proper page (rendered conditionally based on
 * history path) and navigation bar. Takes no props.
 *
 * @returns {React.Fragment} Wrapper around Routes and Navigation Bar
 *
 * @class
 */
const App = () => {
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Meet} />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>

      <Navbar />
    </>
  );
};

export default App;
