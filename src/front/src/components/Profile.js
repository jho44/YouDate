import React, { useState, useEffect, useContext } from "react";
import { Descriptions, Switch, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "../App.css";
import Tidbit from "./common/Tidbit";
import QA from "./common/QA";
import SpotifyDataBlock from "./common/SpotifyDataBlock";
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
 * @returns {React.Fragment} Profile page, including a user's photo,
 * basic information, favorite artists and songs
 *
 * @class
 */
const Profile = () => {
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
    /**
     * Function from `ContextProvider` for setting logged-in user's access and refresh tokens.
     * @type {Function}
     * @memberof Profile
     */
    setTokens,
    /**
     * Function from `ContextProvider` for setting logged-in user's info.
     * @type {Function}
     * @memberof Profile
     */
    setUser,
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
        // delete acc
        fetch("http://localhost:8000/deleteUser", {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        })
          .then((data) => data.json())
          .then((data) => {
            // err handling
            if (data[1] !== 200) console.error("Deletion failed");

            return;
          })
          .then(() => {
            // logout
            logout();
          })
          .catch((err) => console.error(err));
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
  const location = useLocation();
  function logout() {
    // credit: https://stackoverflow.com/a/50738483/11294788
    const url = "https://accounts.spotify.com/en/logout";
    window.open(url, "Spotify Logout", "width=700,height=500,top=40,left=40");
    new URLSearchParams(location.search).delete("code");
    setTokens(null); // Need to remove auth token
    setUser(null);
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
            {user.description.replace(/\\'/g, "'")}
          </h2>
        </Descriptions.Item>

        <h3>Favorite Artists</h3>
        {(!user || !user.top_artists.length) && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No favorite artists at this time
          </Title>
        )}
        <SpotifyDataBlock
          user={user}
          userContent={user.top_artists}
          type="artist"
        />
        <h3>Favorite Songs</h3>
        {(!user || !user.top_songs.length) && (
          <Title level={5} style={{ color: "#dbdbdb" }}>
            No favorite songs at this time
          </Title>
        )}
        <SpotifyDataBlock
          user={user}
          userContent={user.top_songs}
          type="track"
        />
        <div className="basic-info column-flex">
          {(!user || !user.tidbits.length) && (
            <Title level={5} style={{ color: "#dbdbdb" }}>
              No tidbits at this time
            </Title>
          )}
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
