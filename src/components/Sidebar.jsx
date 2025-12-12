import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const role = localStorage.getItem("role");  // farmer / store / consumer

  return (
    <div
      className={collapsed ? "sidebar collapsed" : "sidebar expanded"}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <ul>

        {/* FARMER ACCESS */}
        {role === "farmer" && (
          <>
            <li>
              <Link to="/dashboard">
                <span className="icon">📊</span>
                <span className="text">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/predict">
                <span className="icon">🌱</span>
                <span className="text">Predict</span>
              </Link>
            </li>

            <li>
              <Link to="/sensors">
                <span className="icon">📡</span>
                <span className="text">Sensors</span>
              </Link>
            </li>

            <li>
              <Link to="/generateqr">
                <span className="icon">🧾</span>
                <span className="text">Generate QR</span>
              </Link>
            </li>

            <li>
              <Link to="/blockchain">
                <span className="icon">🔗</span>
                <span className="text">Blockchain</span>
              </Link>
            </li>

            <li>
              <Link to="/traceability">
                <span className="icon">🔍</span>
                <span className="text">Traceability</span>
              </Link>
            </li>
          </>
        )}

        {/* STORE OWNER ACCESS */}
        {role === "store" && (
          <>
            <li>
              <Link to="/traceability">
                <span className="icon">🔍</span>
                <span className="text">Trace Product</span>
              </Link>
            </li>

            <li>
              <Link to="/blockchain">
                <span className="icon">🔗</span>
                <span className="text">Blockchain Logs</span>
              </Link>
            </li>
          </>
        )}

        {/* CUSTOMER ACCESS */}
        {role === "consumer" && (
          <>
            <li>
              <Link to="/traceability">
                <span className="icon">🔍</span>
                <span className="text">Scan Product</span>
              </Link>
            </li>
          </>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
