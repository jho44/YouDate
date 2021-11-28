import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Avatar } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import "../App.css";
import { AuthContext } from "../Context";
import { Person as PersonIcon } from "@mui/icons-material";
import { Typography } from "antd";
import { processUserInfo } from "../helpers";
import MatchInfo from "./common/MatchInfo";

const { Title } = Typography;

/**
 * Match sub-component used exclusively by Matched component.
 * Displays a match's profile picture, name, and contact info.
 *
 * @property {string} imgPath - path to match's image file
 * @property {string} name - name of match
 * @property {string} contact - contact of match
 * @returns {HTML} Styled div wrapped around said match component.
 *
 * @package
 * @class
 */
const Match = ({
  matchList,
  user_id,
  index,
  imgPath,
  name,
  contact,
  setMatchList,
  matchUser,
}) => {
  const {
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof Match
     */
    user,
  } = useContext(AuthContext);

  /**
   * @typedef {Boolean} openModal
   * @description (Private) state variable controlling whether the
   * Display Match Profile modal should be open.
   * @memberof Profile
   */
  /**
   * @typedef {Function} setOpenModal
   * @param {Boolean} newState - If `false`, Display Match Profile 
   * modal should be closed.
   * If `true`, modal should be open.
   * @description Sets `openModal` to `newState`
   * @returns {void}
   * @memberof Profile
   * @private
   */
   const [openModal, setOpenModal] = useState(false);

   const [offsetY, setOffsetY] = useState(0);
   const handleScroll = () => setOffsetY(window.pageYOffset);
   useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  /**
   * Function to open Delete Match Confirmation modal. Includes
   * `OnOK()`.
   *
   * @returns {void}
   */
  function showConfirm() {
    Modal.confirm({
      centered: true,
      title: "Delete Match",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this match?",
      /**
       * @description Function to actually delete match if user hits "OK"
       * @memberof Match
       * @returns {void}
       * @private
       */
      onOk() {
        // DISLIKE this user
        fetch("http://localhost:8000/dislike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid_a: user.user_id,
            userid_b: user_id,
          }),
        })
          .then((data) => data.json())
          .then((statusCode) => {
            if (statusCode !== 200)
              console.error(
                "Failed to create DISLIKE relationship between users"
              );

            // get rid of this user from matchList
            const newList = [...matchList];
            newList.splice(index, 1);

            setMatchList(newList);
          });
      },
    });
  }

  /**
   * Function to open Delete Match Confirmation modal. Includes
   * `OnOK()`.
   *
   * @returns {void}
   */
   function showProfile() {
    setOpenModal(true);
  }

  /**
   * Function to open Delete Match Confirmation modal. Includes
   * `OnOK()`.
   *
   * @returns {void}
   */
   function closeProfile() {
    setOpenModal(false);
  }

  matchUser = processUserInfo(matchUser);
  matchUser.artists_in_common = user.top_artists.filter((artist) =>
    matchUser.top_artists.includes(artist)
  );
  matchUser.songs_in_common = user.top_songs.filter((song) =>
    matchUser.top_songs.includes(song)
  );
  return (
    <div
      data-testid="match"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        marginLeft: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div onClick={showProfile}>
          {imgPath ? (
            <Avatar 
              src={imgPath} 
              size={{ xs: 50, sm: 70, md: 90, lg: 110, xl: 130, xxl: 150 }}
              />
          ) : (
            <Avatar 
              icon={<PersonIcon />}
              size={{ xs: 50, sm: 70, md: 90, lg: 110, xl: 130, xxl: 150 }}
              />
          )}
        </div>
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
          <h4>{name}</h4>
          <span>{contact}</span>
        </div>
      </div>
      <div>
        <Button
          ghost
          style={{ border: 0 }}
          size="medium"
          icon={<CloseOutlined style={{ color: "white" }} />}
          onClick={showConfirm}
          button-testid={`delete-match-${index}`}
        />
      </div>
      <Modal
        visible={openModal}
        footer={[
          <Button key="back" onClick={closeProfile}>
            Close
          </Button>,
        ]}
        style={{
          backgroundColor: 'black'
      }}
      >
        <MatchInfo meet={false} user={matchUser} offsetY={offsetY} />
      </Modal>
    </div>
  );
};

/**
 * Component for the Matched page
 *
 * @returns {React.Fragment} Matched page, including all a user's matches,
 * each with a profile pic, name, and contact info.
 *
 * @class
 */
const Matched = () => {
  const {
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof Matched
     */
    user,
  } = useContext(AuthContext);

  /**
   * @description The list of people the current user's in mutual like with.
   * @typedef {Array} matchList
   * @memberof Matched
   */
  /**
   * @typedef {Function} setMatchList
   * @param {Object} newState - The new list of people the current
   * user's in mutual like with. Used when deleting a match.
   * @returns {void}
   * @memberof Matched
   */
  const [matchList, setMatchList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/getMatched?email=${user.email}`)
      .then((data) => data.json())
      .then((data) => {
        if (data[1] === 200) {
          setMatchList(
            data[0].map((item, index) => {
              return (
                <Match
                  matchList={matchList}
                  setMatchList={handleChange}
                  key={index}
                  index={index}
                  user_id={item.user_id}
                  imgPath={item.pic}
                  name={item.name}
                  contact={item.email}
                  matchUser={item}
                />
              );
            })
          );
        }
      })
      .catch((err) => console.error(err));
  }, [user.email, matchList.length]);

  function handleChange(list) {
    setMatchList(list);
  }

  return (
    <div className="container" style={{ margin: "1rem" }}>
      <h1 style={{ color: "white" }}>Matches</h1>
      {matchList}
      {!matchList.length && (
        <Title level={5} style={{ color: "#dbdbdb", textAlign: "center" }}>
          No matches yet. Let's try to meet more people~
        </Title>
      )}
    </div>
  );
};

export default Matched;
