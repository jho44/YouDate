import React, { useState } from "react";
import { Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "../../App.css";
import EditButton from "./EditButton";

/**
 * BioParagraph sub-component used exclusively by Bio sub-component.
 * Creates the bio paragraph in Profile and Meet pages.
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @property {string} bioParagraph - The content for the bio paragraph
 * @property {boolean} editBioPressed - The state of the bio paragraph.
 * This determines if it is rendering the pre edit stage or the currently
 * editing stage.
 * @property {Function} editFunction - The function that changes the
 * state to bring up the editing form.
 * @property {Function} finishEditFunction - The function that brings up
 * the finished editing model.
 * @returns {HTML} Styled div wrapped around the bio paragraph
 *
 * @package
 * @class
 */
const BioParagraph = ({
  meet,
  bioParagraph,
  editBioPressed,
  editFunction,
  finishEditFunction,
}) => {
  return (
    <span style={{ width: "100%"}}>
      {meet ? (
        bioParagraph
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
        {editBioPressed ? (
          <>
            <Input defaultValue={bioParagraph} />
            <EditButton isEdit={true} editFunction={finishEditFunction} />
          </>
        ) : (
          <>
            {bioParagraph}
            <EditButton isEdit={false} editFunction={editFunction} />
          </>
        )}
        </div>
      )}
    </span>
  );
};

/**
 * Bio sub-component used by the Meet and Profile component.
 * Used to create the bio part of the profile. This includes
 * the name, age, and a short bio paragraph of each user.
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @property {string} content - The content for the bio
 * @returns {HTML} Styled div wrapped around name, age, and bio.
 *
 * @package
 * @class
 */
const Bio = ({ meet, content }) => {
  /**
   * @typedef {Boolean} editBioPressed
   * @description (Private) state variable controlling whether the
   * edit bio input form should be displayed.
   * @memberof Bio
   */
  /**
   * @typedef {Function} setEditBioPressed
   * @param {Boolean} newState - If `false`, it should display just
   * the bio and an edit button.
   * If `true`, it should display the input form and a check button.
   * @description Sets `editBioPressed` to `newState`
   * @returns {void}
   * @memberof Bio
   * @private
   */

  const [editBioPressed, setEditBioPressed] = useState(false);

  /**
   * Function to open Edit Bio Confirmation modal. Includes
   * `OnOK()` and `onCancel()`.
   *
   * @returns {void}
   */
  function showConfirm() {
    Modal.confirm({
      centered: true,
      title: "Edit Bio",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to edit your bio?",
      /**
       * @description Function to actually edit bio if user hits "OK"
       * @memberof Profile
       * @returns {void}
       * @private
       */
      onOk() {
        // TODO: delete acc
        setEditBioPressed(false);
      },
      /**
       * @description Function to set `editBioPressed` to `false` to close modal.
       * @memberof Profile
       * @returns {void}
       * @private
       */
      onCancel() {
        setEditBioPressed(true);
      },
    });
  }

  /**
   * Function to change the state of the bio paragraph.
   *
   * @memberof Bio
   * @returns {void}
   */
  function editBio() {
    setEditBioPressed(true);
  }

  /**
   * Function to open Edit Bio Confirmation modal.
   *
   * @memberof Bio
   * @returns {void}
   */
  function finishedEditBio() {
    showConfirm();
  }

  return (
    <>
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div 
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: "0px" }}>{content.name}</h1>
          <h3 style={{ margin: "0px", marginLeft: "0.5rem" }}> ({content.pronouns})</h3>
        </div>
        <span>{content.age}</span>
      </div>
      <BioParagraph
          meet={meet}
          bioParagraph={content.description}
          editBioPressed={editBioPressed}
          editFunction={editBio}
          finishEditFunction={finishedEditBio}
        />
    </>
  );
};

export default Bio;
