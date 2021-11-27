import React, { useState, useEffect, useContext, useCallback } from "react";
import "../../App.css";
import { AuthContext } from "../../Context";

/**
 * SpotifyDataBlock sub-component used by Meet and Profile component.
 * For creating the list of common artists and songs (Meet page),
 * or top artists and songs (Profile page).
 *
 * @param {Object} user - `ContextProvider` state of logged-in user's info.
 * @param {Object} userContent - The Spotify data to generate components for.
 * Contains artist or song image and name.
 * @param {String} type - Type of display we'd like to display. Either `artist` or `track`.
 * @returns {HTML} Styled div wrapped around artist or song image and name.
 *
 * @package
 * @class
 */
const SpotifyDataBlock = ({ user, userContent, type }) => {
  const {
    /**
     * `ContextProvider` state of logged-in user's access and refresh tokens.
     * @type {Object}
     * @memberof SpotifyDataBlock
     */
    tokens,
  } = useContext(AuthContext);

  /**
   * @description An array of Objects containing a song/artist's image URL and name, returned by Spotify's API.
   * @typedef {Object} content
   * @memberof SpotifyDataBlock
   */
  /**
   * @typedef {Function} setContent
   * @param {Array} newState - The newly processed array of Objects containing a song/artist's image URL and name.
   * @description Sets `content` to `newState`.
   * @returns {void}
   * @memberof SpotifyDataBlock
   */
  const [content, setContent] = useState([]);

  /**
   * Function to get artists' or songs' images.
   *
   * @returns {React.Fragment} - Containing list of display components for songs' and artists' images and names.
   */
  const getContent = useCallback(async () => {
    const urls = await Promise.all(
      userContent.map(async (thing) => {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${type}:${thing}&type=${type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokens.accessToken,
            },
          }
        );
        const js = await response.json();
        let urlTry;
        try {
          if (type === "artist") urlTry = await js.artists.items[0].images[0].url;
          else urlTry = await js.tracks.items[0].album.images[0].url;
        } catch (e) {
          urlTry = null;
        }

        const item = await {
          name: thing,
          img: await urlTry,
        };
        return await item;
      })
    );
    setContent(urls);
  }, [tokens, type, userContent]);

  useEffect(() => {
    getContent();
  }, [getContent]);
  
  return (
    <>
      {user &&
        content.map((content, ind) => (
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
