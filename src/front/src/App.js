import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Meet from "./components/Meet";
import Profile from "./components/Profile";
import Matched from "./components/Matched";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import InfoForm from "./components/InfoForm";
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
        <Route exact path="/" element={<Landing />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/info-form" element={<InfoForm />} />
        <Route
          path="/meet"
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
