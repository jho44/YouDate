import React, { useState, useEffect } from "react";
import { Descriptions, Button, Affix } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "../App.css";
import data from "./fakeData.json";
import Tidbit from "./common/Tidbit";
import QA from "./common/QA";

/**
 * Component for the Meet page
 *
 * @property {boolean} meet - Whether this component is being used for
 * the PROFILE or MEET page
 * @returns {React.Fragment} Profile page, including a user's photo,
 * basic information, favorite artists and songs
 *
 * @class
 */
const Meet = ({ meet }) => {
  /**
   * @typedef {Boolean} likePressed
   * @description (Private) state variable controlling whether the
   * Like Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setLikePressed
   * @param {Boolean} newState - If `false`, Like
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `likePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */
  /**
   * @typedef {Boolean} dislikePressed
   * @description (Private) state variable controlling whether the
   * Dislike Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setDislikePressed
   * @param {Boolean} newState - If `false`, Dislike
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `dislikePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */

  const [likePressed, setLikePressed] = useState(false);
  const [dislikePressed, setDislikePressed] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Function to open Like Confirmation modal.
   *
   * @memberof Meet
   * @returns {void}
   */
  function like() {
    setLikePressed(true);
    // todo: add person to matched page
  }

  /**
   * Function to open Dislike Confirmation modal.
   *
   * @memberof Meet
   * @returns {void}
   */
  function dislike() {
    setDislikePressed(true);
    // todo: display next person
  }
  return (
    <>
      <div className="pic">
        <div
          className="profilePhoto"
          style={{
            backgroundImage: `url('${data.user.img}')`,
            transform: `translateY(${offsetY * 0.25}px)`,
          }}
        />

        <div 
          className="userInfo"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <div className="name">{data.user.name} ({data.user.pronouns})</div>

          <div className="age">{data.user.age}</div>

          <div className="userDescription">{data.user.description.replace(/\\'/g, "'")}</div> 
        </div>
      </div>

      <div className="container">
        <h3>Artists in Common</h3>
        {data.user.artists.map((artist, ind) => (
          <div style={{ display: "flex", alignItems: "center" }} key={ind}>
            <div
              className="photo"
              style={{
                backgroundImage: `url('${artist.img}')`,
                backgroundColor: "grey",
                marginBottom: "1rem",
              }}
            />

            <span style={{ paddingLeft: "1rem" }}>{artist.name}</span>
          </div>
        ))}
        <h3>Songs in Common</h3>
        {data.user.songs.map((song, ind) => (
          <div style={{ display: "flex", alignItems: "center" }} key={ind}>
            <div
              className="photo"
              style={{
                backgroundImage: `url('${song.img}')`,
                backgroundColor: "grey",
                marginBottom: "1rem",
              }}
            />

            <span style={{ paddingLeft: "1rem" }}>
              {song.name} by {song.artist}
            </span>
          </div>
        ))}

        <div className="basic-info column-flex">
          <Tidbit
            imgPath="/LookingIcon.png"
            alt="desired-relationship"
            content={data.user.desiredRelationship}
          />
          <Tidbit
            imgPath="/EducationIcon.png"
            alt="education"
            content={data.user.education}
          />
        </div>

        <div className="QAs">
          {data.user.QAs.map((qa, ind) => (
            <QA Q={qa.Q} A={qa.A} key={ind} />
          ))}
        </div>
        
        <Affix offsetBottom={75}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "5rem" }}>
              <Button
                ghost
                size="large"
                icon={<CloseOutlined style={{ color: "white" }} />}
                onClick={dislike}
                data-testid="left-swipe"
              />
            </div>
            <Button
              ghost
              size="large"
              icon={<CheckOutlined style={{ color: "white" }} />}
              onClick={like}
              data-testid="right-swipe"
            />
          </div>
        </Affix>
      </div>
    </>
  );
};

export default Meet;
