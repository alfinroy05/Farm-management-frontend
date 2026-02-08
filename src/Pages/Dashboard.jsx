import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [activeBatch, setActiveBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // ==============================
  // Fetch active batch
  // ==============================
  const fetchActiveBatch = () => {
    fetch("http://127.0.0.1:5000/api/batch/current")
      .then(res => res.json())
      .then(data => setActiveBatch(data.current_batch))
      .catch(() => setActiveBatch(null));
  };

  // ==============================
  // Fetch all batches (NORMALIZED)
  // ==============================
  const fetchAllBatches = () => {
    fetch("http://127.0.0.1:5000/api/batch/all")
      .then(res => res.json())
      .then(data => {
        // ✅ Normalize response
        if (Array.isArray(data)) {
          setBatches(data);
        } else if (Array.isArray(data.data)) {
          setBatches(data.data);
        } else {
          setBatches([]);
        }
      })
      .catch(() => setBatches([]));
  };

  // ==============================
  // Fetch latest sensor data (ACTIVE batch)
  // ==============================
  const fetchSensorData = () => {
    fetch("http://127.0.0.1:5000/api/sensors/latest")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setSensorData(null);
          return;
        }

        setSensorData(data);
        generateAlerts(data);

        setChartData(prev =>
          [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              temperature: data.airTemp,
              soilMoisture: data.soilMoisture
            }
          ].slice(-6)
        );
      })
      .catch(() => setSensorData(null));
  };

  // ==============================
  // Initial load
  // ==============================
  useEffect(() => {
    fetchActiveBatch();
    fetchAllBatches();
    fetchSensorData();
  }, []);

  // ==============================
  // Load data for selected batch
  // ==============================
  useEffect(() => {
    if (!selectedBatch) {
      fetchSensorData();
      return;
    }

    fetch(`http://127.0.0.1:5000/api/sensors/batch/${selectedBatch}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          setSensorData(null);
          setChartData([]);
          return;
        }

        const latest = data[data.length - 1];
        const sensor = latest.sensor_data[0];

        setSensorData({
          ...sensor,
          blockchain_tx: latest.blockchain_tx,
          merkle_root: latest.merkle_root
        });

        setChartData(
          data.map((row, index) => ({
            time: index + 1,
            temperature: row.sensor_data[0].airTemp,
            soilMoisture: row.sensor_data[0].soilMoisture
          }))
        );
      })
      .catch(() => {
        setSensorData(null);
        setChartData([]);
      });
  }, [selectedBatch]);

  // ==============================
  // Alerts
  // ==============================
  const generateAlerts = (data) => {
    const warnings = [];

    if (data.soilMoisture < 40) {
      warnings.push("⚠ Soil moisture is low. Irrigation recommended.");
    }
    if (data.airTemp > 35) {
      warnings.push("⚠ High temperature detected. Heat stress possible.");
    }
    if (data.humidity > 80) {
      warnings.push("⚠ High humidity may increase disease risk.");
    }

    setAlerts(warnings);
  };

  // ==============================
  // Create new batch
  // ==============================
  const createNewBatch = () => {
    fetch("http://127.0.0.1:5000/api/batch/create", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        alert(`✅ New Batch Created: ${data.batch_id}`);
        setSelectedBatch("");
        fetchActiveBatch();
        fetchAllBatches();
        setSensorData(null);
        setChartData([]);
      })
      .catch(() => alert("❌ Failed to create batch"));
  };

  // ==============================
  // Finalize batch
  // ==============================
  const finalizeBatch = () => {
    if (!window.confirm("🌾 Finalize this harvest batch?")) return;

    fetch("http://127.0.0.1:5000/api/batch/finalize", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        alert(`🌾 Batch Finalized: ${data.batch_id}`);
        setSelectedBatch("");
        fetchActiveBatch();
        fetchAllBatches();
        setSensorData(null);
        setChartData([]);
      })
      .catch(() => alert("❌ Failed to finalize batch"));
  };

  const isHistorical =
    selectedBatch && selectedBatch !== activeBatch;

  // ==============================
  // UI
  // ==============================
  return (
    <div className="dashboard-bg">
      <div className="container mt-4">

        <div className="text-center">
          <h1 className="dashboard-title">🌾 Farmer Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time Smart Farm Monitoring & Insights
          </p>

          <h5>
            🧺 Active Batch:{" "}
            <span className="text-success">
              {activeBatch || "No Active Batch"}
            </span>
          </h5>

          {/* Batch Selector */}
          <select
            className="form-select w-50 mx-auto mt-2"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">🔄 View Active Batch</option>

            {Array.isArray(batches) &&
              batches.map(b => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_id} ({b.status})
                </option>
              ))}
          </select>

          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={createNewBatch}>
              ➕ Create New Batch
            </button>

            <button
              className="btn btn-danger"
              disabled={!activeBatch}
              onClick={finalizeBatch}
            >
              🌾 Finalize Harvest
            </button>
          </div>
        </div>

        {/* SENSOR CARDS */}
        <div className="row mt-4">
          {[
            ["🌡 Temperature", `${sensorData?.airTemp ?? "--"} °C`],
            ["💧 Soil Moisture", `${sensorData?.soilMoisture ?? "--"} %`],
            ["☁ Humidity", `${sensorData?.humidity ?? "--"} %`],
            ["🔬 Soil pH", sensorData?.soilPH ?? "--"]
          ].map(([label, value], i) => (
            <div className="col-md-4 mt-3" key={i}>
              <div className="sensor-card shadow">
                <h4>{label}</h4>
                <p className="sensor-value">{value}</p>
                <small>{isHistorical ? "Historical" : "Live"}</small>
              </div>
            </div>
          ))}

          <div className="col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🧪 NPK Levels</h4>
              <p className="sensor-value">
                {sensorData?.npk
                  ? `N:${sensorData.npk.N} P:${sensorData.npk.P} K:${sensorData.npk.K}`
                  : "--"}
              </p>
            </div>
          </div>

          <div className="col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🔗 Blockchain TX</h4>
              <p className="sensor-value">
                {sensorData?.blockchain_tx
                  ? sensorData.blockchain_tx.slice(0, 12) + "..."
                  : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="row mt-5">
          {["soilMoisture", "temperature"].map((key, i) => (
            <div className="col-md-6" key={i}>
              <div className="chart-card shadow">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? "#2e7d32" : "#ef6c00"}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* ALERTS */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="alert-card shadow">
              <h5>⚠ Farm Alerts</h5>
              {alerts.length === 0 ? (
                <p>No alerts. Farm conditions are stable.</p>
              ) : (
                <ul>
                  {alerts.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
