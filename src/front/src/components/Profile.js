import React, { useState, useEffect, useContext } from "react";
import { Descriptions, Switch, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Tidbit from "./common/Tidbit";
import QA from "./common/QA";
import { AuthContext } from "../Context";
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
 * Component for the Profile page
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @returns {React.Fragment} Profile page, including a user's photo,
 * basic information, favorite artists and songs
 *
 * @class
 */
const Profile = ({ meet }) => {
  /**
   * @typedef {Boolean} deleteAccChecked
   * @description (Private) state variable controlling whether the
   * Delete Account Confirmation modal should be open.
   * @memberof Profile
   */
  /**
   * @typedef {Function} setDeleteAccChecked
   * @param {Boolean} newState - If `false`, Delete Account
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `deleteAccChecked` to `newState`
   * @returns {void}
   * @memberof Profile
   * @private
   */
  const [deleteAccChecked, setDeleteAccChecked] = useState(false);

  const {
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof Profile
     */
    user,
  } = useContext(AuthContext);

  /* Parallax effect for scrolling */
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Function to open Delete Account Confirmation modal. Includes
   * `OnOK()` and `onCancel()`.
   *
   * @returns {void}
   */
  function showConfirm() {
    Modal.confirm({
      centered: true,
      title: "Delete Account",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete your account?",
      /**
       * @description Function to actually delete account if user hits "OK"
       * @memberof Profile
       * @returns {void}
       * @private
       */
      onOk() {
        // TODO: delete acc
      },
      /**
       * @description Function to set `deleteAccChecked` to `false` to close modal.
       * @memberof Profile
       * @returns {void}
       * @private
       */
      onCancel() {
        setDeleteAccChecked(false);
      },
    });
  }

  /**
   * Function to open Delete Account Confirmation modal.
   *
   * @memberof Profile
   * @returns {void}
   */
  function deleteAcc() {
    setDeleteAccChecked(true);
    showConfirm();
  }

  /**
   * Function to logout the current user.
   *
   * @memberof Profile
   * @returns {void}
   */
  const navigate = useNavigate();
  function logout() {
    navigate("/");
    // Need to remove auth token
  }

  return (
    <>
      {user.pic ? (
        <div
          className="profilePhoto"
          style={{
            backgroundImage: `url('${user.pic}')`,
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
          title={`${user.name} (${user.pronouns})`}
          labelStyle={{ color: "white" }}
          contentStyle={{ color: "white" }}
          extra={<span className="extra">{user.age}</span>}
        />
      </div>
      <div className="container">
        <Descriptions.Item label="">
          <h2
            className="description"
            style={{ transform: `translateY(${offsetY * 0.4}px)` }}
          >
            {user.description}
          </h2>
        </Descriptions.Item>

        <h3>Favorite Artists</h3>
        {!user.top_artists.length && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No favorite artists at this time
          </Title>
        )}
        {user.top_artists.map((artist, ind) => (
          <div style={{ display: "flex", alignItems: "center" }} key={ind}>
            <div
              className="photo"
              style={{
                backgroundImage: `url('${artist.img}')`,
                backgroundColor: "grey",
                width: 85,
                height: 85,
                marginBottom: "1rem",
              }}
            />

            <span style={{ paddingLeft: "1rem" }}>{artist.name}</span>
          </div>
        ))}
        <h3>Favorite Songs</h3>
        {!user.top_songs.length && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No favorite songs at this time
          </Title>
        )}
        {user.top_songs.map((song, ind) => (
          <div style={{ display: "flex", alignItems: "center" }} key={ind}>
            <div
              className="photo"
              style={{
                backgroundImage: `url('${song.img}')`,
                backgroundColor: "grey",
                width: 85,
                height: 85,
                marginBottom: "1rem",
              }}
            />

            <span style={{ paddingLeft: "1rem" }}>
              {song.name} by {song.artist}
            </span>
          </div>
        ))}

        <div className="basic-info column-flex">
          {Object.entries(user.tidbits).map(([tidbit, val], ind) => {
            if (val) {
              let component;
              switch (tidbit) {
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

        {user.QAs.map((qa, ind) => {
          if (qa.A) return <QA Q={qa.Q} A={qa.A} key={ind} />;
          else return <></>;
        })}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ color: "#E8BFFB" }}>Delete Account</p>
          <Switch
            checked={deleteAccChecked}
            onChange={deleteAcc}
            data-testid="delete-acc"
          />
        </div>

        <div onClick={logout}>
          <button>Logout</button>
        </div>
      </div>
      );
    </>
  );
};

export default Profile;
