import React, { useState } from "react";
import { Descriptions, Switch, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./App.css";
import data from "./fakeData.json";

/**
 * Tidbit sub-component used exclusively by Profile component.
 * For things like a user's desired relationship type or education.
 *
 * @property {string} imgPath - path to icon's image file
 * corresponding to tidbit about user
 * @property {string} alt - `alt` attribute for said icon's image
 * element
 * @property {string} content - words for this Tidbit
 * @returns {HTML} Styled div wrapped around icon `img` and `span`
 * for `content`
 *
 * @package
 * @class
 */
const Tidbit = ({ imgPath, alt, content }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <img
        src={imgPath}
        alt={alt}
        style={{ weight: "1.5rem", paddingRight: "1rem" }}
      />
      <span>{content}</span>
    </div>
  );
};

/**
 * QA sub-component used exclusively by Profile component.
 * Later, user is to create question and answer pairs to put more of
 * their information on their profile.
 *
 * @property {string} Q - question about the user
 * @property {string} A - user's answer to that question
 * @returns {HTML} Styled div wrapped around said `Q` and `A`.
 *
 * @package
 * @class
 */
const QA = ({ Q, A }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4>{Q}</h4>
      <span>{A}</span>
    </div>
  );
};

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

  return (
    <>
      <div
        className="photo"
        style={{ backgroundImage: `url('${data.user.img}')` }}
      />

      <div className="container">
        <Descriptions
          title={`${data.user.name} (${data.user.pronouns})`}
          labelStyle={{ color: "white" }}
          contentStyle={{ color: "white" }}
          extra={<span>{data.user.age}</span>}
        >
          <Descriptions.Item label="">
            {data.user.description}
          </Descriptions.Item>
        </Descriptions>

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
          <p>Delete Account</p>
          <Switch checked={deleteAccChecked} onChange={deleteAcc} />
        </div>
      </div>
    </>
  );
};

export default Profile;
