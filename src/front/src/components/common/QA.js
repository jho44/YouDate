import React from "react";
import "../../App.css";

/**
 * QA sub-component used by Meet and Profile component.
 * User specified question and answer pairs.
 *
 * @property {string} Q - question about the user
 * @property {string} A - user's answer to that question
 * @returns {HTML} Styled div wrapped around said `Q` and `A`.
 *
 * @package
 * @class
 */
const QA = ({ Q, A }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4>{Q}</h4>
      <span>{A}</span>
    </div>
  );
};

export default QA;
