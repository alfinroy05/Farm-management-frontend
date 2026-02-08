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
      {/* LEFT */}
      <div className="navbar-left">
        <h3
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          🌾 AgriChain
        </h3>
      </div>

      {/* CENTER NAV LINKS */}
      <div className="navbar-center">
        <button
          className="nav-btn"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/blockchain")}
        >
          Blockchain
        </button>

        <button
          className="nav-btn"
          onClick={() => navigate("/verify")}
        >
          Verify Batch
        </button>
      </div>

      {/* RIGHT */}
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
