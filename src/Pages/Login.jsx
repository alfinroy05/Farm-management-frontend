import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select your role");
      return;
    }

    // You can add backend API authentication here if needed.
    // For now, we store login data locally for role-based routing.
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);

    // Redirect based on role ↓
    if (role === "farmer") navigate("/dashboard");
    else if (role === "store") navigate("/traceability");
    else if (role === "consumer") navigate("/traceability");
  };

  return (
    <div className="login-bg">

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row w-100">

          <div className="col col-12 col-sm-10 col-md-8 col-lg-5 mx-auto">

            <div className="login-card shadow-lg p-4">

              <h2 className="text-center mb-3 title-text">🌿 AgriChain</h2>
              <p className="text-center subtitle-text">Smart Farming • Blockchain • AI Insights</p>

              <form onSubmit={handleLogin}>

                {/* Role Section */}
                <div className="mb-3">
                  <label className="form-label futuristic-label">Select Role</label>
                  <select
                    className="form-select futuristic-input"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Choose your role</option>
                    <option value="farmer">👨‍🌾 Farmer</option>
                    <option value="consumer">🛒 Consumer</option>
                    <option value="store">🏪 Store Owner</option>
                  </select>
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label futuristic-label">Email</label>
                  <input
                    type="email"
                    className="form-control futuristic-input"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label futuristic-label">Password</label>
                  <input
                    type="password"
                    className="form-control futuristic-input"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Login Button */}
                <div className="d-grid mt-4">
                  <button className="btn btn-success login-btn">
                    Login to Dashboard
                  </button>
                </div>

              </form>

              <p className="text-center mt-3 register-text">
                New user? <a href="#" className="register-link">Create Account</a>
              </p>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
