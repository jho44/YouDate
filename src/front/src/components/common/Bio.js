import React, { useState } from "react";
import { Typography } from "antd";
import "../../App.css";
import EditIcon from "./EditIcon";

const { Paragraph } = Typography;

/**
 * Bio sub-component used by the Meet and Profile component.
 * Used to create the bio part of the profile. This includes
 * the short bio paragraph of each user.
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @property {string} bioParagraph - The content for the bio paragraph
 * @returns {HTML} Styled div wrapped around the bio paragraph.
 *
 * @package
 * @class
 */
const Bio = ({ meet, bioParagraph }) => {
  /**
   * @typedef {String} editBio
   * @description (Private) state variable with the value of the
   * bio paragraph.
   * @memberof Bio
   */
  /**
   * @typedef {Function} setEditBio
   * @param {String} newState - Changes editBio to the newState value.
   * Changes the bio paragraph displayed on the screen.
   * @description Sets `editBioPressed` to `newState`
   * @returns {void}
   * @memberof Bio
   * @private
   */

  const [editBio, setEditBio] = useState(bioParagraph);

  return (
    <span style={{ width: "100%" }}>
      {meet ? (
        bioParagraph
      ) : (
        <Paragraph
          className="edit-page"
          style={{ margin: "0px", color: "white", width: "100%" }}
          editable={{ icon: <EditIcon />, onChange: setEditBio }}
          type="secondary"
        >
          {editBio}
        </Paragraph>
      )}
    </span>
  );
};

export default Bio;
