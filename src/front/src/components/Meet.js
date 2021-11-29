import React, { useState, useEffect, useContext, useCallback } from "react";
import { Spin } from "antd";
import "../App.css";
import MatchInfo from "./common/MatchInfo";
import { AuthContext } from "../Context";
import { processUserInfo } from "../helpers";

/**
 * Component for the Meet page
 *
 * @returns {React.Fragment} Meet page, including photo,
 * basic information, and artists and songs in common with an unmet
 * user.
 *
 * @class
 */
const Meet = () => {
  const {
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof Meet
     */
    user,
    /**
     * Function from `ContextProvider` for setting next set of users
     * the current user hasn't met.
     * @type {Function}
     * @memberof Meet
     */
    setUnmetList,
    /**
     * `ContextProvider` state of logged-in user's list of unmet users.
     * @type {Object}
     * @memberof Meet
     */
    unmetList,
    /**
     * `ContextProvider` state of index of the next unmet user to appear
     * on Meet page.
     * @type {Number}
     * @memberof Meet
     */
    unmetListInd,
    /**
     * Function from `ContextProvider` for setting the next index in
     * `unmetList` that should appear on Meet page.
     * @type {Function}
     * @memberof Meet
     */
    setUnmetListInd,
  } = useContext(AuthContext);
  const [offsetY, setOffsetY] = useState(0);

  /**
   * @description The unmet user at `unmetListInd` of `unmetList`.
   * @typedef {Object} unmetUser
   * @memberof Meet
   */
  /**
   * @typedef {Function} setUnmetUser
   * @param {Object} newState - The next unmet user on `unmetList`.
   * @returns {void}
   * @memberof Meet
   */
  const [unmetUser, setUnmetUser] = useState({
    user_id: "",
    name: "",
    pic: "",
    pronouns: "",
    age: 0,
    desiredRelationship: "",
    education: "",
    QAs: [],
    description: "",
    artists_in_common: [],
    songs_in_common: [],
    tidbits: [],
  });
  const [loading, setLoading] = useState(true);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  /**
   * Function for fetching next batch of unmet users from our backend.
   */
  const getNextUser = useCallback(() => {
    setLoading(true);
    // get more unmet users
    fetch(`http://localhost:8000/getUnmet?email=${user.email}`)
      .then((data) => data.json())
      .then((data) => {
        if (data[1] !== 200) {
          console.error("Populating unmet list failed.");
          return;
        }
        const newList = data[0].map((newUser) => {
          newUser.artists_in_common = user.top_artists.filter((artist) =>
            newUser.top_artists.includes(artist)
          );

          newUser.songs_in_common = user.top_songs.filter((song) =>
            newUser.top_songs.includes(song)
          );
          return newUser;
        });
        setUnmetList(newList);
        setUnmetUser(processUserInfo(newList[0]));
        setUnmetListInd(0);
      })
      .catch((err) => console.error(err));
  }, [user.email]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    if (unmetListInd >= unmetList.length) getNextUser();
    else setUnmetUser(processUserInfo(unmetList[unmetListInd]));

    setLoading(false);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [getNextUser]);

  /**
   * Function to create LIKES relationship from user A to user B.
   *
   * @memberof Meet
   * @returns {void}
   */
  function like() {
    // create LIKES relationship from user to unmetUser
    fetch("http://localhost:8000/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid_a: user.user_id,
        userid_b: unmetUser.user_id,
      }),
    })
      .then((data) => data.json())
      .then((statusCode) => {
        if (statusCode !== 200)
          console.error("Failed to create LIKE relationship between users");

        // then get next user
        if (unmetListInd + 1 >= unmetList.length) getNextUser();
        else {
          setUnmetUser(processUserInfo(unmetList[unmetListInd + 1]));
          setUnmetListInd((latestInd) => latestInd + 1);
        }
      });
  }

  /**
   * Function to create DISLIKES relationship from user A to user B.
   *
   * @memberof Meet
   * @returns {void}
   */
  function dislike() {
    // create DISLIKES relationship from user to unmetUser
    fetch("http://localhost:8000/dislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid_a: user.user_id,
        userid_b: unmetUser.user_id,
      }),
    })
      .then((data) => data.json())
      .then((statusCode) => {
        if (statusCode !== 200)
          console.error("Failed to create DISLIKE relationship between users");

        // then get next user
        if (unmetListInd + 1 >= unmetList.length) getNextUser();
        else {
          setUnmetUser(processUserInfo(unmetList[unmetListInd + 1]));
          setUnmetListInd((latestInd) => latestInd + 1);
        }
      });
  }
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <MatchInfo
            meet={true}
            user={unmetUser}
            offsetY={offsetY}
            dislike={dislike}
            like={like}
          />
        </>
      )}
    </>
  );
};

export default Meet;
