import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Landing from "./components/Landing";
import { AuthContext } from "./Context";
import { useNavigate } from "react-router-dom";

/**
 * Private route wrapper that checks whether the user is logged in
 * before sending them to the right page.
 *
 * @property {Component} children - the page to send the user to if
 * they're already logged in
 * @returns {HTML} Conditionally returns `component` if logged in,
 * else renders Login/Landing page.
 *
 * @class
 */
const PrivateRoute = ({ children }) => {
  const {
    /**
     * Function from `ContextProvider` for setting logged-in user's access and refresh tokens.
     * @type {Function}
     * @memberof PrivateRoute
     */
    setTokens,
    /**
     * `ContextProvider` state of logged-in user's access and refresh tokens.
     * @type {Object}
     * @memberof PrivateRoute
     */
    tokens,
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof PrivateRoute
     */
    user,
    /**
     * Function from `ContextProvider` for setting logged-in user's info.
     * @type {Function}
     * @memberof PrivateRoute
     */
    setUser,
  } = useContext(AuthContext);

  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    let localToken = null;
    if (tokens === null && code) {
      fetch(
        `http://localhost:8000/accessToken?code=${code}&redirect=http://localhost:3000${location.pathname}`
      )
        .then((res) => res.json())
        .then((res) => {
          setTokens({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          });
          localToken = res.access_token;

          // check if this user has a Datify account
          return fetch(`http://localhost:8000/getUser?token=${localToken}}`);
        })
        .then((data) => data.json())
        .then((data) => {
          const datifyUser = data[0];
          const statusCode = data[1];
          if (statusCode === 404) {
            // no Datify account so let's create one
            navigate("/info-form");
          }

          datifyUser["QAs"] = [
            {
              Q: "Life goal of mine...",
              A: datifyUser.life_goal,
            },
            {
              Q: "Believe it or not, I...",
              A: datifyUser.believe_or_not,
            },
            {
              Q: "My life peaked when...",
              A: datifyUser.life_peaked,
            },
            {
              Q: "I feel famous when...",
              A: datifyUser.feel_famous,
            },
            {
              Q: "Biggest risk I've ever taken",
              A: datifyUser.biggest_risk,
            },
          ];

          const qas = [
            "life_goal",
            "believe_or_not",
            "life_peaked",
            "feel_famous",
            "biggest_risk",
          ];
          for (const qa of qas) {
            delete datifyUser[qa];
          }

          datifyUser["tidbits"] = {
            desired_relationship: datifyUser.desired_relationship,
            education: datifyUser.education,
            occupation: datifyUser.occupation,
            sexual_orientation: datifyUser.sexual_orientation,
            location: datifyUser.location,
            political_view: datifyUser.political_view,
            height: datifyUser.height,
          };

          const tidbits = [
            "desired_relationship",
            "education",
            "occupation",
            "sexual_orientation",
            "location",
            "political_view",
            "height",
          ];
          for (const tidbit of tidbits) {
            delete datifyUser[tidbit];
          }

          const today = new Date();
          let age =
            today.getFullYear() -
            datifyUser.birth_month._DateTime__date._Date__year;
          const m =
            today.getMonth() -
            datifyUser.birth_month._DateTime__date._Date__month;
          if (m < 0) age--;

          datifyUser["age"] = age;
          setUser(datifyUser);
        })
        .catch((err) => console.error(err));
    }
  }, [
    tokens,
    location.search,
    setTokens,
    location.pathname,
    navigate,
    setUser,
  ]);

  return tokens !== null && user !== null ? (
    children
  ) : (
    <Landing state={location.pathname} />
  );
};
export default PrivateRoute;
