import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { UserOutlined, HomeOutlined, MessageOutlined } from "@ant-design/icons";
import "./App.css";

const NavbarBtn = ({ icon, link }) => {
  return (
    <Link to={link}>
      <Button size="large" ghost style={{ border: 0 }} icon={icon} />
    </Link>
  );
};

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
