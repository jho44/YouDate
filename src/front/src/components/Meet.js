import React, { useState, useEffect, useContext, useCallback } from "react";
import { Descriptions, Button, Spin } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "../App.css";
import Tidbit from "./common/Tidbit";
import QA from "./common/QA";
import SpotifyDataBlock from "./common/SpotifyDataBlock";
import { AuthContext } from "../Context";
import { processUserInfo } from "../helpers";
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Height as HeightIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Typography } from "antd";

const { Title } = Typography;

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
     * @type {Object}
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
   *
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
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [user.email]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    if (unmetListInd >= unmetList.length) getNextUser();

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
    // create DISLIKES relationship from useer to unmetUser
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
          {unmetUser.pic ? (
            <div
              className="profilePhoto"
              style={{
                backgroundImage: `url('${unmetUser.pic}')`,
                transform: `translateY(${offsetY * 0.25}px)`,
              }}
            />
          ) : (
            <div
              className="profilePhoto"
              style={{
                transform: `translateY(${offsetY * 0.25}px)`,
                padding: 0,
                border: "solid white",
              }}
            >
              <PersonIcon
                style={{ height: "100%", width: "100%", color: "white" }}
              />
            </div>
          )}

          <div
            className="userName"
            style={{ transform: `translateY(${offsetY * 0.4}px)` }}
          >
            <Descriptions
              title={`${unmetUser.name} (${unmetUser.pronouns})`}
              labelStyle={{ color: "white" }}
              contentStyle={{ color: "white" }}
              extra={<span className="extra">{unmetUser.age}</span>}
            />
          </div>

          <div className="container">
            <Descriptions.Item label="">
              <h2
                className="description"
                style={{ transform: `translateY(${offsetY * 0.4}px)` }}
              >
                {unmetUser.description}
              </h2>
            </Descriptions.Item>

            <h3>Artists in Common</h3>
            {(!unmetUser || !unmetUser.artists_in_common.length) && (
              <Title level={5} style={{ color: "#dbdbdb" }}>
                No top artists in common
              </Title>
            )}
            <SpotifyDataBlock
              user={unmetUser}
              userContent={unmetUser.artists_in_common}
              type="artist"
            />

            <h3>Songs in Common</h3>
            {(!unmetUser || !unmetUser.songs_in_common.length) && (
              <Title level={5} style={{ color: "#dbdbdb" }}>
                No top songs in common
              </Title>
            )}
            <SpotifyDataBlock
              user={unmetUser}
              userContent={unmetUser.songs_in_common}
              type="track"
            />

            <div className="basic-info column-flex">
              {unmetUser &&
                unmetUser.tidbits.map((tidbit, ind) => {
                  const { key, val } = tidbit;
                  if (val) {
                    let component;
                    switch (key) {
                      case "desired_relationship":
                        component = SearchIcon;
                        break;
                      case "education":
                        component = SchoolIcon;
                        break;
                      case "occupation":
                        component = WorkIcon;
                        break;
                      case "sexual_orientation":
                        component = FavoriteIcon;
                        break;
                      case "location":
                        component = LocationOnIcon;
                        break;
                      case "political_view":
                        component = AccountBalanceIcon;
                        break;
                      case "height":
                        component = HeightIcon;
                        break;
                      default:
                    }

                    return (
                      <Tidbit key={ind} Component={component} content={val} />
                    );
                  } else return <></>;
                })}
            </div>

            {unmetUser.QAs.map((qa, ind) => {
              if (qa.A) return <QA Q={qa.Q} A={qa.A} key={ind} />;
              else return <></>;
            })}

            <div
              style={{
                position: "fixed",
                bottom: 75,
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "5rem" }}>
                  <Button
                    ghost
                    size="large"
                    icon={<CloseOutlined style={{ color: "white" }} />}
                    onClick={dislike}
                    data-testid="left-swipe"
                  />
                </div>
                <Button
                  ghost
                  size="large"
                  icon={<CheckOutlined style={{ color: "white" }} />}
                  onClick={like}
                  data-testid="right-swipe"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Meet;
