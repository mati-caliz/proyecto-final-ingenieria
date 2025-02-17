import React, { useState } from "react";
import logo from '../assets/logo.png'
import userIcon from "../assets/userIcon.png";
import "./Navbar.css";
import {clearUser} from '../../redux/redux/features/users/userSlice';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../../redux/redux/hooks';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    dispatch(clearUser());
    navigate('/');
  }

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
              <button onClick={(event) => handleLogout(event)} className="dropdown-item">
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
