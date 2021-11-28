import React from "react";
import "../../App.css";
import { Person as PersonIcon } from "@mui/icons-material"; // placeholder for now

/**
 * Tidbit sub-component used by Meet and Profile component.
 * For things like a user's desired relationship type or education.
 *
 * @property {Component} Component - Icon Component corresponding to
 * some user's tidbit.
 * @property {string} content - words for this Tidbit
 * @returns {HTML} Styled div wrapped around icon `img` and `span`
 * for `content`
 *
 * @package
 * @class
 */
const Tidbit = ({ Component = PersonIcon, content }) => {
  return (
    <div
      style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
    >
      <Component
        style={{ fontSize: "2rem", marginRight: "0.5rem", color: "white" }}
      />
      <span>{content}</span>
    </div>
  );
};

export default Tidbit;
