import React from 'react'
import "../styles/dashboard.css"; // Custom dashboard styling

const Dashboard = () => {
  return (
    <div className="dashboard-bg">

      <div className="container mt-4">

        {/* Header */}
        <div className="row">
          <div className="col col-12 text-center">
            <h1 className="dashboard-title">🌾 Farmer Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time Smart Farm Monitoring & Insights
            </p>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="row mt-4">

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🌡 Temperature</h4>
              <p className="sensor-value">29°C</p>
              <small className="status-good">Normal</small>
            </div>
          </div>

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>💧 Soil Moisture</h4>
              <p className="sensor-value">46%</p>
              <small className="status-warning">Slightly Low</small>
            </div>
          </div>

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>☁ Humidity</h4>
              <p className="sensor-value">71%</p>
              <small className="status-good">Good</small>
            </div>
          </div>

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🔬 Soil pH</h4>
              <p className="sensor-value">6.5</p>
              <small className="status-good">Optimal</small>
            </div>
          </div>

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🧪 NPK Levels</h4>
              <p className="sensor-value">N:40 P:20 K:35</p>
              <small className="status-good">Healthy</small>
            </div>
          </div>

          <div className="col col-12 col-sm-6 col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🌦 Rainfall</h4>
              <p className="sensor-value">3 mm</p>
              <small className="status-info">Light Rain</small>
            </div>
          </div>

        </div>

        {/* Prediction Button */}
        <div className="row mt-5">
          <div className="col col-12 text-center">
            <button className="btn btn-success predict-btn">
              🌱 Get Crop Health Prediction
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mt-5">

          <div className="col col-12 col-md-6 mt-3">
            <div className="chart-card shadow">
              <h5>📈 Moisture Trend</h5>
              <div className="chart-placeholder">Chart Placeholder</div>
            </div>
          </div>

          <div className="col col-12 col-md-6 mt-3">
            <div className="chart-card shadow">
              <h5>📉 Temperature Trend</h5>
              <div className="chart-placeholder">Chart Placeholder</div>
            </div>
          </div>

        </div>

        {/* Alerts */}
        <div className="row mt-5">
          <div className="col col-12">
            <div className="alert-card shadow">
              <h5>⚠ Farm Alerts</h5>
              <ul>
                <li>Soil Moisture is slightly low today.</li>
                <li>Rain expected in 48 hours — irrigation adjustment recommended.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
