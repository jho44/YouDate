import React, { useState } from "react";
import { Modal, Button, Avatar } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import "../App.css";
import data from "./matchesFakeData.json";

/**
 * Match sub-component used exclusively by Matched component.
 * Displays a match's profile picture, name, and contact info.
 *
 * @property {string} imgPath - path to match's image file
 * @property {string} name - name of match
 * @property {string} contact - contact of match
 * @returns {HTML} Styled div wrapped around said match component.
 *
 * @package
 * @class
 */
const Match = ({ index, imgPath, name, contact }) => {
  /**
   * @typedef {Boolean} deleteMatchPressed
   * @description (Private) state variable controlling whether the
   * Delete Match Confirmation modal should be open.
   * @memberof Match
   */
  /**
   * @typedef {Function} setDeleteMatchPressed
   * @param {Boolean} newState - If `false`, Delete Match
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `deleteMatchPressed` to `newState`
   * @returns {void}
   * @memberof Match
   * @private
   */

  const [deleteMatchPressed, setDeleteMatchPressed] = useState(false);

  /**
   * Function to open Delete Match Confirmation modal. Includes
   * `OnOK()` and `onCancel()`.
   *
   * @returns {void}
   */
  function showConfirm() {
    Modal.confirm({
      centered: true,
      title: "Delete Match",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this match?",
      /**
       * @description Function to actually delete match if user hits "OK"
       * @memberof Match
       * @returns {void}
       * @private
       */
      onOk() {
        // TODO: delete acc
      },
      /**
       * @description Function to set `deleteMatchPressed` to `false` to close modal.
       * @memberof Match
       * @returns {void}
       * @private
       */
      onCancel() {
        setDeleteMatchPressed(false);
      },
    });
  }

  /**
   * Function to open Delete Match Confirmation modal.
   *
   * @memberof Match
   * @returns {void}
   */
  function deleteMatch() {
    setDeleteMatchPressed(true);

    showConfirm();
  }

  return (
    <div data-testid="match"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        marginLeft: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Avatar src={imgPath} size={85} />
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
          <h4>{name}</h4>
          <span>{contact}</span>
        </div>
      </div>
      <div>
        <Button
          ghost
          style={{ border: 0 }}
          size="medium"
          icon={<CloseOutlined style={{ color: "white" }} />}
          onClick={deleteMatch}
          button-testid={`delete-match-${index}`}
        />
      </div>
    </div>
  );
};

/**
 * Component for the Matched page
 *
 * @returns {React.Fragment} Matched page, including all a user's matches,
 * each with a profile pic, name, and contact info.
 *
 * @class
 */
const Matched = () => {
  /**
   * Function to generate all the Match sub-components for a user.
   *
   * @returns {Match}
   */
  let generateList = data.map((item, index) => {
    return (
      <Match
        key={index}
        index={index}
        imgPath={item.img}
        name={item.name}
        contact={item.contact}
      />
    );
  });

  return (
    <div
      className="container"
      style={{ margin: "1rem", marginBottom: "4rem", position: "relative" }}
    >
      <h1 style={{ color: "white" }}>Matches</h1>
      {generateList}
    </div>
  );
};

export default Matched;
