import React from "react";
import { Person as PersonIcon } from "@mui/icons-material";
import "../../App.css";

/**
 * About sub-component used by Meet and Profile component.
 * Used to create the about section
 * (name, pronouns, age, picture, etc) of an user.
 *
 * @property {Boolean} isOffsetY - determines if there is an offsetY
 * @property {Object} user - User object
 * @property {Number} offsetY - offset of Y used for formatting calcuations
 * @returns {HTML} Styled div wrapped around the name, pronouns,
 * age, an picture of an user.
 *
 * @package
 * @class
 */
const About = ({ isOffsetY, user, offsetY }) => {
  let profilePicStyle = {
    backgroundImage: `url('${user.pic}')`,
  };
  let profileIconStyle = {
    padding: 0,
    border: "solid white",
  };
  let userInfoStyle = {};
  if (isOffsetY) {
    profilePicStyle = {
      backgroundImage: `url('${user.pic}')`,
      transform: `translateY(${offsetY * 0.2}px)`,
    };
    profileIconStyle = {
      transform: `translateY(${offsetY * 0.2}px)`,
      padding: 0,
      border: "solid white",
    };
    userInfoStyle = { transform: `translateY(${offsetY * 0.3}px)` };
  }

  return (
    <>
      <div className="pic">
        {user.pic ? (
          <div className="profilePhoto" style={profilePicStyle} />
        ) : (
          <div className="profilePhoto" style={profileIconStyle}>
            <PersonIcon
              style={{ height: "100%", width: "100%", color: "white" }}
            />
          </div>
        )}

        <div className="userInfo" style={userInfoStyle}>
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
