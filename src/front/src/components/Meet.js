import React, { useState } from "react";
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
   * @typedef {Boolean} rightSwipePressed
   * @description (Private) state variable controlling whether the
   * Match Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setRightSwipePressed
   * @param {Boolean} newState - If `false`, Match
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `rightSwipePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */
  /**
   * @typedef {Boolean} leftSwipePressed
   * @description (Private) state variable controlling whether the
   * Not Match Confirmation modal should be open.
   * @memberof Meet
   */
  /**
   * @typedef {Function} setLeftSwipePressed
   * @param {Boolean} newState - If `false`, Not Match
   * Confirmation modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `leftSwipePressed` to `newState`
   * @returns {void}
   * @memberof Meet
   * @private
   */

  const [rightSwipePressed, setRightSwipePressed] = useState(false);
  const [leftSwipePressed, setLeftSwipePressed] = useState(false);

  /**
   * Function to open Right Swipe Confirmation modal.
   *
   * @memberof Meet
   * @returns {void}
   */
  function rightSwipe() {
    setRightSwipePressed(true);
    // todo: add person to matched page
  }

  /**
   * Function to open Right Swipe Confirmation modal.
   *
   * @memberof Meet
   * @returns {void}
   */
  function leftSwipe() {
    setLeftSwipePressed(true);
    // todo: display next person
  }
  return (
    <>
      <div
        className="photo"
        style={{ backgroundImage: `url('${data.user.img}')` }}
      />

      <div className="container">
        <Descriptions
          title={`${data.user.name} (${data.user.pronouns})`}
          labelStyle={{ color: "white" }}
          contentStyle={{ color: "white" }}
          extra={<span>{data.user.age}</span>}
        >
          <Descriptions.Item label="">
            {data.user.description}
          </Descriptions.Item>
        </Descriptions>

        <h3>Artists in Common</h3>
        {data.user.artists.map((artist, ind) => (
          <div style={{ display: "flex", alignItems: "center" }} key={ind}>
            <div
              className="photo"
              style={{
                backgroundImage: `url('${artist.img}')`,
                backgroundColor: "grey",
                width: 85,
                height: 85,
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
                width: 85,
                height: 85,
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

        {data.user.QAs.map((qa, ind) => (
          <QA Q={qa.Q} A={qa.A} key={ind} />
        ))}
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
                onClick={leftSwipe}
                data-testid="left-swipe"
              />
            </div>
            <Button
              ghost
              size="large"
              icon={<CheckOutlined style={{ color: "white" }} />}
              onClick={rightSwipe}
              data-testid="right-swipe"
            />
          </div>
        </Affix>
      </div>
    </>
  );
};

export default Meet;
