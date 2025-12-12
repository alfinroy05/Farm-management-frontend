import React from "react";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const email = localStorage.getItem("email") || "User";

  return (
    <nav className="navbar-main shadow-sm">
      <div className="navbar-left">
        <h3 className="navbar-logo">AgriChain</h3>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">👤 {email}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
