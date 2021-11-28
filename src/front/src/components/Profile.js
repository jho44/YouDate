import React, { useState, useEffect, useContext } from "react";
import { Switch, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "../App.css";
import About from "./common/About";
import EditInfo from "./common/EditInfo";
import SpotifyDataBlock from "./common/SpotifyDataBlock";
import { AuthContext } from "../Context";
import { Person as PersonIcon } from "@mui/icons-material";
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
      <About user={user} offsetY={offsetY} />
      <div className="container">
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
        <h3>Edit Info</h3>
        {user && <EditInfo />}
        <div
          className="deleteTxt"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
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
