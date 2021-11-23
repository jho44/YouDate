import React from "react";
import "../../App.css";

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
const Tidbit = ({ Component, content }) => {
  return (
    <div
      style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
    >
      <Component
        style={{ fontSize: "2.5vw", marginRight: "0.1rem", color: "white" }}
      />
      <span>{content}</span>
    </div>
  );
};

export default Tidbit;
