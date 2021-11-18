import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../datifyLogo.png";
import { loginUrl } from "../spotify";

const useStyles = makeStyles({
  login: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    backgroundColor: "black",

    "& img": {
      width: "50%",
    },

    "& a": {
      padding: "20px",
      borderRadius: "99px",
      backgroundColor: "#EE82EE",
      fontWeight: 600,
      color: "white",
      textDecoration: "none",
    },

    "& a:hover": {
      backgroundColor: " white",
      borderColor: "#1db954",
      color: "#EE82EE",
    },
  },
});

/**
 * Class Component that renders our Login/Landing page and redirects us to either:
 * 1. the page we came from that required authentication
 * 2. the "Home" page for now
 *
 * @property {Object} location - `{ from: { pathname: "path/of/last/page/we/were/on" } }`
 * @returns {HTML} Meet page, soon to include Profile page
 *
 * @class
 */
function Landing({ state }) {
  const [local, setLocal] = useState("/meet/");

  useEffect(() => {
    if (state && state !== "/") setLocal(state);
  }, [state]);

  const classes = useStyles();
  return (
    <div className={classes.login}>
      <img
        src={Logo}
        alt="Youdate Logo"
        style={{
          maxHeight: "35vh",
          display: "block",
          width: "auto",
          height: "auto",
        }}
      />
      <a href={`${loginUrl}${local}`}>LOGIN WITH SPOTIFY</a>
    </div>
  );
}

export default Landing;
