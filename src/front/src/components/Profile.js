import React, { useState, useEffect, useContext } from "react";
import { Descriptions, Switch, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../App.css";
import data from "./fakeData.json";
import Tidbit from "./common/Tidbit";
import QA from "./common/QA";

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
      <div className="profilePhoto"
        style={{ backgroundImage: `url('${data.user.img}')`, transform: `translateY(${offsetY * 0.25}px)` }}>
      </div>

      <div className="userName" style={{ transform: `translateY(${offsetY * 0.4}px)` }}>
        <Descriptions
          title={`${data.user.name} (${data.user.pronouns})`}
          labelStyle={{ color: "white" }}
          contentStyle={{ color: "white" }}
          extra={<span className="extra">{data.user.age}</span>}
        />  
     </div>

     <div className="container">
          <Descriptions.Item label="">
            <h2 className="description" style={{ transform: `translateY(${offsetY * 0.4}px)` }}>{data.user.description}</h2>
          </Descriptions.Item>

        <h3>Favorite Artists</h3>
        {data.user.artists.map((artist, ind) => (
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
        {data.user.songs.map((song, ind) => (
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
          <Tidbit
            imgPath="/LookingIcon.png"
            alt="desired-relationship"
            content={data.user.desiredRelationship}
          />
          <Tidbit
            imgPath="/EducationIcon.png"
            alt="education"
            content={data.user.education}
          />
        </div>

        {data.user.QAs.map((qa, ind) => (
          <QA Q={qa.Q} A={qa.A} key={ind} />
        ))}

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
