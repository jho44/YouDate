import React from "react";
import { Descriptions } from "antd";
import "./App.css";
import data from "./fakeData.json";

const Tidbit = ({ imgPath, alt, content }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <img
        src={imgPath}
        alt={alt}
        style={{ weight: "1.5rem", paddingRight: "1rem" }}
      />
      <span>{content}</span>
    </div>
  );
};

const QA = ({ Q, A }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h4>{Q}</h4>
      <span>{A}</span>
    </div>
  );
};

const Profile = ({ match }) => {
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

        <h3>Favorite Artists</h3>
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
        <h3>Favorite Songs</h3>
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
      </div>
    </>
  );
};

export default Profile;
