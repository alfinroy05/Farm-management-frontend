import React, { useEffect, useState } from 'react';
import "../styles/sensors.css";

// Recharts imports
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const Sensors = () => {

  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    soilMoisture: "--",
    ph: "--",
    nitrogen: "--",
    phosphorus: "--",
    potassium: "--",
    rainfall: "--"
  });

  // Dummy graph data (replace with backend graph data later)
  const tempGraphData = [
    { time: "1h", value: 26 },
    { time: "2h", value: 27 },
    { time: "3h", value: 29 },
    { time: "4h", value: 28 },
    { time: "5h", value: 30 }
  ];

  const moistureGraphData = [
    { time: "1h", value: 45 },
    { time: "2h", value: 47 },
    { time: "3h", value: 50 },
    { time: "4h", value: 48 },
    { time: "5h", value: 46 }
  ];

  // Fetch sensor data automatically
  useEffect(() => {
    fetch("http://localhost:5000/api/sensors/latest")
      .then(res => res.json())
      .then(data => setSensorData(data))
      .catch(err => console.log("Error:", err));
  }, []);

  return (
    <div className="sensors-bg">
      <div className="container mt-4">

        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">

            {/* Title */}
            <h2 className="text-center sensors-title">🚜 Smart Farm IoT Dashboard</h2>
            <p className="text-center sensors-subtitle">
              Real-time Monitoring • Futuristic Analytics • Smart Decisions
            </p>

            {/* Sensor Cards */}
            <div className="row mt-4">

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>🌡 Temperature</h4>
                  <p className="sensor-value">{sensorData.temperature}°C</p>
                  <div className="mini-bar temp-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>💧 Soil Moisture</h4>
                  <p className="sensor-value">{sensorData.soilMoisture}%</p>
                  <div className="mini-bar moisture-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>☁ Humidity</h4>
                  <p className="sensor-value">{sensorData.humidity}%</p>
                  <div className="mini-bar humidity-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>🔬 Soil pH</h4>
                  <p className="sensor-value">{sensorData.ph}</p>
                  <div className="mini-bar ph-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>🧪 Nitrogen (N)</h4>
                  <p className="sensor-value">{sensorData.nitrogen}</p>
                  <div className="mini-bar n-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>🧬 Phosphorus (P)</h4>
                  <p className="sensor-value">{sensorData.phosphorus}</p>
                  <div className="mini-bar p-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>⚗ Potassium (K)</h4>
                  <p className="sensor-value">{sensorData.potassium}</p>
                  <div className="mini-bar k-bar"></div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 mt-3">
                <div className="sensor-card glow">
                  <h4>🌧 Rainfall</h4>
                  <p className="sensor-value">{sensorData.rainfall} mm</p>
                  <div className="mini-bar rain-bar"></div>
                </div>
              </div>

            </div>

            {/* REAL GRAPHS WITH RECHARTS */}
            <div className="row mt-5">

              {/* Temperature Graph */}
              <div className="col-12 col-md-6 mt-3">
                <div className="graph-card">
                  <h4>📈 Temperature Trend</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={tempGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ff7043" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Moisture Graph */}
              <div className="col-12 col-md-6 mt-3">
                <div className="graph-card">
                  <h4>📉 Moisture Trend</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={moistureGraphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#29b6f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Refresh Button */}
            <div className="text-center mt-4">
              <button
                className="btn btn-primary refresh-btn"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Live Data
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Sensors;
