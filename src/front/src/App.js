import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Meet from "./components/Meet";
import Profile from "./components/Profile";
import Matched from "./components/Matched";
import Login from "./Login";
import Navbar from "./components/Navbar";
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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          exact
          path="/"
          element={
            <PrivateRoute>
              <Meet />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/matched"
          element={
            <PrivateRoute>
              <Matched />
            </PrivateRoute>
          }
        />
      </Routes>

      <Navbar />
    </>
  );
};

export default App;
