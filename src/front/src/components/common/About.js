import React from "react";
import { Person as PersonIcon } from "@mui/icons-material";
import "../../App.css";

/**
 * About sub-component used by Meet and Profile component.
 * Used to create the about section
 * (name, pronouns, age, picture, etc) of an user.
 *
 * @property {Object} user - User object
 * @property {Number} offsetY - offset of Y used for formatting calcuations
 * @returns {HTML} Styled div wrapped around the name, pronouns,
 * age, an picture of an user.
 *
 * @package
 * @class
 */
const About = ({ user, offsetY }) => {
  return (
    <>
      <div className="pic">
        {user.pic ? (
          <div
            className="profilePhoto"
            style={{
              backgroundImage: `url('${user.pic}')`,
              transform: `translateY(${offsetY * 0.2}px)`,
            }}
          />
        ) : (
          <div
            className="profilePhoto"
            style={{
              transform: `translateY(${offsetY * 0.2}px)`,
              padding: 0,
              border: "solid white",
            }}
          >
            <PersonIcon
              style={{ height: "100%", width: "100%", color: "white" }}
            />
          </div>
        )}

        <div
          className="userInfo"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <div className="nameAndAge">
            <div className="name">{user.name}</div>
            <div className="age">{user.age}</div>
          </div>

          <div className="pronouns">({user.pronouns})</div>

          <div className="userDescription">
            {user.description && user.description.replace(/\\'/g, "'")}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
