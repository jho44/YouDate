import React from "react";
import { Button } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import "../../App.css";

/**
 * EditButton sub-component used by Bio component.
 * Used to determine the proper icon for editing or 
 * finished editing.
 *
 * @property {boolean} isEdit - Whether this component should 
 * display the edit or check icon
 * @property {Function} editFunction - The function that changes the
 * state to bring up the editing form.
 * @returns {HTML} Styled button with the desired onClick function.
 *
 * @package
 * @class
 */
const EditButton = ({ isEdit, editFunction }) => {
  return (
    <Button
      ghost
      style={{ border: 0 }}
      size="medium"
      icon={
        isEdit ? (
          <CheckOutlined style={{ color: "white" }} />
        ) : (
          <EditOutlined style={{ color: "white" }} />
        )
      }
      onClick={editFunction}
    />
  );
};

export default EditButton;
