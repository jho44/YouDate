import React, { useState } from "react";
import { Descriptions, Modal, Button, Affix} from "antd";
import { ExclamationCircleOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "./App.css";
import data from "./fakeData.json";

/**
 * Tidbit sub-component used by Meet and Profile component.
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
 * QA sub-component used by Meet and Profile component.
 * User specified question and answer pairs.
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
 * Component for the Meet page
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @returns {React.Fragment} Profile page, including a user's photo,
 * basic information, favorite artists and songs
 *
 * @class
 */
const Meet = ({ meet }) => {
  /**
   * @typedef {Boolean} rightSwipePressed
   * @description (Private) state variable controlling whether the
   * Match Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setRightSwipePressed
   * @param {Boolean} newState - If `false`, Match
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `rightSwipePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */
  /**
   * @typedef {Boolean} leftSwipePressed
   * @description (Private) state variable controlling whether the
   * Not Match Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setLeftSwipePressed
   * @param {Boolean} newState - If `false`, Not Match
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `leftSwipePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */

   const [rightSwipePressed, setRightSwipePressed] = useState(false);
   const [leftSwipePressed, setLeftSwipePressed] = useState(false);

   /**
    * Function to open Match Confirmation modal. Includes
    * `OnOK()` and `onCancel()`.
    *
    * @returns {void}
    */
   function showRightConfirm() {
     Modal.confirm({
       centered: true,
       title: "Match",
       icon: <ExclamationCircleOutlined />,
       content: "Are you sure you want to swipe right?",
       /**
        * @description Function to add person to matched page if user hits "OK"
        * @memberof Meet
        * @returns {void}
        * @private
        */
       onOk() {
         // TODO: add person to matched page/database
       },
       /**
        * @description Function to set `rightSwipePressed` to `false` to close modal.
        * @memberof Meet
        * @returns {void}
        * @private
        */
       onCancel() {
        setRightSwipePressed(false);
       },
     });
   }

   /**
    * Function to open Not Match Confirmation modal. Includes
    * `OnOK()` and `onCancel()`.
    *
    * @returns {void}
    */
    function showLeftConfirm() {
      Modal.confirm({
        centered: true,
        title: "Not Match",
        icon: <ExclamationCircleOutlined />,
        content: "Are you sure you want to swipe left?",
        /**
         * @description Function to display the next person if user hits "OK"
         * @memberof Meet
         * @returns {void}
         * @private
         */
        onOk() {
          // TODO: Display the next person to be judged
        },
        /**
         * @description Function to set `leftSwipePressed` to `false` to close modal.
         * @memberof Meet
         * @returns {void}
         * @private
         */
        onCancel() {
          setLeftSwipePressed(false);
        },
      });
    }

  /**
    * Function to open Right Swipe Confirmation modal.
    *
    * @memberof Meet
    * @returns {void}
    */
   function rightSwipe() {
    setRightSwipePressed(true);

    showRightConfirm();
  }
 
   /**
    * Function to open Right Swipe Confirmation modal.
    *
    * @memberof Meet
    * @returns {void}
    */
   function leftSwipe() {
    setLeftSwipePressed(true);
 
     showLeftConfirm();
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

        <h3>Artists in Common</h3>
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
        <h3>Songs in Common</h3>
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
        <Affix offsetBottom={75} >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ marginRight: "5rem" }}>
              <Button
                ghost
                size="large"
                icon={<CloseOutlined style={{ color: "white" }}/>}
                onClick={leftSwipe}
              />
            </div>
            <Button
              ghost
              size="large"
              icon={<CheckOutlined style={{ color: "white" }}/>}
              onClick={rightSwipe}
            />
          </div>
        </Affix>
        </div>
    </>
  );
};

export default Meet;