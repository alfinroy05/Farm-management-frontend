import React from 'react';
import '../styles/profile.css'; // make sure this file exists

const Profile = () => {
  return (
    <div className="profile-wrapper">
      <div className="container profile-container p-4">
        
        {/* Page Title */}
        <h2 className="text-center mb-4 profile-title">👤 User Profile</h2>

        <div className="row justify-content-center">

          {/* Profile Card */}
          <div className="col-12 col-md-8">
            <div className="profile-card p-4">

              {/* Avatar Section */}
              <div className="text-center mb-3">
                <div className="avatar-circle">
                  <span className="initials">A</span>
                </div>
                <h4 className="mt-2">Alfin Roy</h4>
                <p className="role-text">Farmer</p>
              </div>

              <hr />

              {/* Profile Details */}
              <div className="profile-info mt-3">
                <p><strong>Email:</strong> alfinroy@example.com</p>
                <p><strong>Location:</strong> Kerala, India</p>
                <p><strong>Farm Size:</strong> 5.2 Acres</p>
                <p><strong>Joined:</strong> January 2025</p>
              </div>

              <hr />

              {/* Actions */}
              <div className="mt-4 text-center">
                <button className="btn btn-primary profile-btn">Edit Profile</button>
                <button className="btn btn-danger ms-3 profile-btn">Logout</button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
