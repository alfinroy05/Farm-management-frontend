import React from 'react'
import "../styles/login.css";  // ✅ Correct lowercase file name

const Login = () => {
  return (
    <div className="login-bg">

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row w-100">
          
          <div className="col col-12 col-sm-10 col-md-8 col-lg-5 mx-auto">

            <div className="login-card shadow-lg p-4">

              <h2 className="text-center mb-3 title-text">🌿 AgriChain</h2>
              <p className="text-center subtitle-text">Smart Farming • Blockchain • AI Insights</p>

              <form>

                {/* Role Section */}
                <div className="mb-3">
                  <label className="form-label futuristic-label">Select Role</label>
                  <select className="form-select futuristic-input">
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
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label futuristic-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control futuristic-input" 
                    placeholder="Enter your password"
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
  )
}

export default Login
