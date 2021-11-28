import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

/**
 * Component for the Not Found page
 *
 * @returns {HTML} Page telling user their path is invalid.
 *
 * @class
 */
const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <Title>404 Page not found</Title>
    </div>
  );
};

export default NotFound;
