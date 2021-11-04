import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Login";
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

export default App;
