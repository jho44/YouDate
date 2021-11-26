import React from "react";
import { EditOutlined } from "@ant-design/icons";
import "../../App.css";

/**
 * EditIcon sub-component used by Meet and Profile components.
 * Used to produce the white edit icon.
 *
 * @returns {HTML} Styled edit icon.
 *
 * @package
 * @class
 */
const EditIcon = () => {
  return <EditOutlined style={{ color: "white" }} />;
};

export default EditIcon;
