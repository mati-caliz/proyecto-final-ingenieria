import React, { useState } from "react";
import logo from '../Assets/logo.png'
import userIcon from "../Assets/userIcon.png";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          alt="Logo"
          className="navbar-logo"
        />
      </div>
      <div className="navbar-right">
        <div className="dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <img
              src={userIcon}
              alt="User Icon"
              className="user-icon"
            />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="#logout" className="dropdown-item">
                Cerrar Sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
