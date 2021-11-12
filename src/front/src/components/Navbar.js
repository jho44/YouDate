import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { UserOutlined, HomeOutlined, MessageOutlined } from "@ant-design/icons";
import "../App.css";

/**
 * Button used exclusively by the Navbar.
 *
 * @returns {HTML} `<Link />` with `link`'s `href` wrapped around icon
 * button with `icon` as the icon.
 *
 * @package
 * @class
 */
const NavbarBtn = ({ icon, link }) => {
  return (
    <Link to={link}>
      <Button size="large" ghost style={{ border: 0 }} icon={icon} />
    </Link>
  );
};

/**
 * Navbar Component that clings to the bottom of the screen on every
 * page. Takes no props.
 *
 * @returns {HTML} Styled div containing 3 buttons, each of which
 * lead to a different page of our app.
 *
 * @class
 */
const Navbar = () => {
  return (
    <div
      style={{
        backgroundColor: "#E8BFFB",
        position: "fixed",
        bottom: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "4rem",
      }}
    >
      <NavbarBtn icon={<HomeOutlined />} link="/" />
      <NavbarBtn icon={<MessageOutlined />} link="/matched" />
      <NavbarBtn icon={<UserOutlined />} link="/profile" />
    </div>
  );
};

export default Navbar;
