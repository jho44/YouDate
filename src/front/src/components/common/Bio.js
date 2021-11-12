import React, { useState } from "react";
import { Descriptions, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "../../App.css";
import EditButton from "./EditButton";

/**
 * EditBioParagraph sub-component used exclusively by BioParagraph sub-component.
 * Used to display the form needed to edit the bio paragraph.
 * This component is rendered when the user needs to edit their bio.
 *
 * @property {string} bioParagraph - The content for the bio paragraph
 * @property {Function} finishEditFunction - The desired onClick
 * function for the finish editing button. In this case, this is the
 * function that brings up the finished editing model.
 * @returns {HTML} Styled div wrapped around input form and buton
 *
 * @package
 * @class
 */
const EditBioParagraph = ({ bioParagraph, finishEditFunction }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Input defaultValue={bioParagraph} />
      <EditButton isEdit={true} editFunction={finishEditFunction} />
    </div>
  );
};

/**
 * NoEditBioParagraph sub-component used exclusively by BioParagraph sub-component.
 * Used to display the bio paragraph and a button to render the form used
 * to edit the bio paragraph.
 *
 * @property {string} bioParagraph - The content for the bio paragraph
 * @property {Function} editFunction - The desired onClick
 * function for the  edit button. In this case, this is the
 * function that changes the state to bring up the editing form.
 * @returns {HTML} Styled div wrapped around bio paragraph and button
 *
 * @package
 * @class
 */
const NoEditBioParagraph = ({ bioParagraph, editFunction }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {bioParagraph}
      <EditButton isEdit={false} editFunction={editFunction} />
    </div>
  );
};

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
    <div style={{ width: "100%"}}>
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
    </div>
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
    <Descriptions style={{ marginBottom: "0px" }}
      size="small"
      title={`${content.name} (${content.pronouns})`}
      labelStyle={{ color: "white" }}
      contentStyle={{ color: "white" }}
      extra={<span>{content.age}</span>}
    >
      <Descriptions.Item label="">
        <BioParagraph
          meet={meet}
          bioParagraph={content.description}
          editBioPressed={editBioPressed}
          editFunction={editBio}
          finishEditFunction={finishedEditBio}
        />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default Bio;
