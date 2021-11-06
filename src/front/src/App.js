import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
import Navbar from "./Navbar";
import "./App.css";

function App() {
  React.useEffect(() => {
    fetch("http://localhost:8000/")
      .then((data) => data.json())
      .then((stuff) => {
        console.log(stuff);
      });
  }, []);

  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>

      <Navbar />
    </>
  );
}

export default App;
