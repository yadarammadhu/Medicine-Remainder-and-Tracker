import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPills, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaHome, FaChartLine } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaPills className="navbar-icon" />
        <span>MedTrack</span>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaHome /> Home
        </Link>
        
        {token && (
          <Link to="/dashboard" className="nav-link">
            <FaChartLine /> Dashboard
          </Link>
        )}
        
        {!token ? (
          <>
            <Link to="/login" className="nav-link">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/signup" className="nav-link">
              <FaUserPlus /> Signup
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn btn-outline logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;