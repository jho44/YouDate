import React, { useState } from "react";
import { Typography } from "antd";
import "../../App.css";
import EditIcon from "./EditIcon";

const { Title } = Typography;

/**
 * NameAndPronouns sub-component used by the Meet and Profile component.
 * Used to create the name and pronouns part of the profile. This includes
 * the name, age, and pronouns of each user.
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @property {string} content - The content for the name and pronouns.
 * @returns {HTML} Styled div wrapped around name, age, and pronouns.
 *
 * @package
 * @class
 */
const NameAndPronouns = ({ meet, content }) => {
  /**
   * @typedef {Boolean} editName
   * @description (Private) state variable with the value
   * of the name field.
   * @memberof NameAndPronouns
   */
  /**
   * @typedef {Function} setEditName
   * @param {Boolean} newState - Changes editName to the newState value.
   * Changes the name displayed on the screen.
   * @description Sets `editName` to `newState`
   * @returns {void}
   * @memberof Bio
   * @private
   */
  /**
   * @typedef {Boolean} editPronouns
   * @description (Private) state variable with the value
   * of the pronouns field.
   * @memberof Bio
   */
  /**
   * @typedef {Function} setEditPronouns
   * @param {Boolean} newState - Changes editPronouns to the newState value.
   * Changes the pronouns displayed on the screen.
   * @description Sets `editPronouns` to `newState`
   * @returns {void}
   * @memberof Bio
   * @private
   */

  const [editName, setEditName] = useState(content.name);
  const [editPronouns, setEditPronouns] = useState(content.pronouns);

  return (
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
        {meet ? (
          <>
            <Title
              level={3}
              className="edit-page"
              style={{ margin: "0px", color: "white" }}
              type="secondary"
            >
              {content.name}
            </Title>
            <Title
              level={5}
              className="edit-page"
              style={{ margin: "0px", marginLeft: "0.5rem", color: "white" }}
              type="secondary"
            >
              ({content.pronouns})
            </Title>
          </>
        ) : (
          <>
            <Title
              level={3}
              className="edit-page"
              style={{ margin: "0px", color: "white" }}
              editable={{ icon: <EditIcon />, onChange: setEditName }}
              type="secondary"
            >
              {editName}
            </Title>
            <Title
              level={5}
              className="edit-page"
              style={{ margin: "0px", marginLeft: "0.5rem", color: "white" }}
              editable={{ icon: <EditIcon />, onChange: setEditPronouns }}
              type="secondary"
            >
              ({editPronouns})
            </Title>
          </>
        )}
      </div>
      <span>{content.age}</span>
    </div>
  );
};

export default NameAndPronouns;
