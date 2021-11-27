import React from "react";
import "../../App.css";

/**
 * SpotifyDataBlock sub-component used by Meet and Profile component.
 * For creating the list of common artists and songs (Meet page), 
 * or top artists and songs (Profile page).
 *
 * @property {Object} user - `ContextProvider` state of logged-in user's info.
 * @property {Object} userContent - The Spotify data to generate components for.
 * Contains artist or song image and name.
 * @returns {HTML} Styled div wrapped around artist or song image and name.
 *
 * @package
 * @class
 */
const SpotifyDataBlock = ({ user, userContent }) => {
  return (
    <>
    {user &&
      userContent.map((content, ind) => (
        <div style={{ display: "flex", alignItems: "center" }} key={ind}>
          <div
            className="photo"
            style={{
              backgroundImage: `url('${content.img}')`,
              backgroundColor: "grey",
              width: 85,
              height: 85,
              marginBottom: "1rem",
            }}
          />

          <span style={{ paddingLeft: "1rem" }}>{content.name}</span>
        </div>
      ))}
    </>
  );
};

export default SpotifyDataBlock;
