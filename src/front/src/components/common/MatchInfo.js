import React from "react";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "../../App.css";
import About from "./About";
import Tidbit from "./Tidbit";
import QA from "./QA";
import SpotifyDataBlock from "./SpotifyDataBlock";
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
  AccountBalance as AccountBalanceIcon,
  Height as HeightIcon,
} from "@mui/icons-material";
import { Typography } from "antd";

const { Title } = Typography;

/**
 * MatchInfo sub-component used by Meet and Matched component.
 * Template for displaying a match or a unmet potential match.
 *
 * @property {Boolean} meet - determines if this is for the Meet component or
 * Matched component
 * @property {Object} user - User object
 * @property {Number} offsetY - offset of Y used for formatting calcuations
 * @property {Function} dislike - function to dislike a user for the Meet component
 * @property {Function} like - function to like a user for the Meet component
 * @returns {HTML} Styled div wrapped around said common artists, common songs,
 * Tidbits, QAs, and like and dislike buttons (for Meet component only).
 *
 * @package
 * @class
 */
const MatchInfo = ({ meet, user, offsetY, dislike, like }) => {
  let isOffsetY = true;
  if (!meet) {
    offsetY = null;
    isOffsetY = false;
  }
  return (
    <>
      <About isOffsetY={isOffsetY} user={user} offsetY={offsetY} />
      <div className="container">
        <h3>Artists in Common</h3>
        {(!user || !user.artists_in_common.length) && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No top artists in common
          </Title>
        )}
        <SpotifyDataBlock
          user={user}
          userContent={user.artists_in_common}
          type="artist"
        />

        <h3>Songs in Common</h3>
        {(!user || !user.songs_in_common.length) && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No top songs in common
          </Title>
        )}
        <SpotifyDataBlock
          user={user}
          userContent={user.songs_in_common}
          type="track"
        />

        {user && user.tidbits && <h3>Tidbits</h3>}
        <div className="basic-info column-flex">
          {user &&
            user.tidbits.map((tidbit, ind) => {
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

                return <Tidbit key={ind} Component={component} content={val} />;
              } else return <></>;
            })}
        </div>

        {user && user.QAs && <h3>QAs</h3>}
        {user &&
          user.QAs.map((qa, ind) => {
            if (qa.A) return <QA Q={qa.Q} A={qa.A} key={ind} />;
            else return <></>;
          })}

        {meet && (
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
        )}
      </div>
    </>
  );
};

export default MatchInfo;
