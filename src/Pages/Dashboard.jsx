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

  // ✅ Tamper status (already working)
  const [tamperStatus, setTamperStatus] = useState(null);

  // ✅ NEW: ML Insight (safe add-on)
  const [mlInsight, setMlInsight] = useState(null);

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
  // Fetch all batches
  // ==============================
  const fetchAllBatches = () => {
    fetch("http://127.0.0.1:5000/api/batch/all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBatches(data);
        else if (Array.isArray(data.data)) setBatches(data.data);
        else setBatches([]);
      })
      .catch(() => setBatches([]));
  };
  // ==============================
  // AI-based Suggestions
  // ==============================
  const getAISuggestions = (ml) => {
    if (!ml) return [];

    const suggestions = [];

    if (ml.crop_health === "Poor" || ml.crop_health === "Moderate") {
      suggestions.push("🌱 Improve soil nutrition and irrigation scheduling.");
    }

    if (ml.disease_risk === "High") {
      suggestions.push("🦠 Apply preventive disease control measures.");
      suggestions.push("🚫 Avoid harvesting until risk reduces.");
    }

    if (ml.disease_risk === "Medium") {
      suggestions.push("🔍 Monitor crop health closely for next 48 hours.");
    }

    if (ml.crop_health === "Healthy" && ml.disease_risk === "Low") {
      suggestions.push("✅ No immediate action required. Maintain current practices.");
    }

    return suggestions;
  };


  // ==============================
  // Fetch ML Prediction (SAFE)
  // ==============================
  const fetchMLPrediction = (data) => {
    if (!data) return;

    fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        airTemp: data.airTemp,
        soilMoisture: data.soilMoisture,
        humidity: data.humidity
      })
    })
      .then(res => res.json())
      .then(result => {
        if (!result || result.error) {
          setMlInsight(null);
          return;
        }
        setMlInsight(result);
      })
      .catch(() => setMlInsight(null));
  };

  // ==============================
  // Fetch latest sensor data
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
        generateAlerts(data);     // ✅ Threshold logic untouched
        fetchMLPrediction(data); // ✅ ML added safely

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
  // Fetch tamper status
  // ==============================
  const fetchTamperStatus = (batchId) => {
    fetch(`http://127.0.0.1:5000/api/trace/${batchId}`)
      .then(res => res.json())
      .then(data => {
        setTamperStatus(data.tamperStatus || "UNKNOWN");
      })
      .catch(() => setTamperStatus("UNKNOWN"));
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
      setTamperStatus(null);
      setMlInsight(null);
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
        const sensor = latest.sensor_data;

        setSensorData({
          ...sensor,
          blockchain_tx: latest.blockchain_tx,
          merkle_root: latest.merkle_root
        });

        fetchMLPrediction(sensor);

        setChartData(
          data.map((row, index) => ({
            time: index + 1,
            temperature: row.sensor_data.airTemp,
            soilMoisture: row.sensor_data.soilMoisture
          }))
        );
      })
      .catch(() => {
        setSensorData(null);
        setChartData([]);
      });

    fetchTamperStatus(selectedBatch);
  }, [selectedBatch]);

  // ==============================
  // Alerts (threshold-based)
  // ==============================
  const generateAlerts = (data) => {
    const warnings = [];

    if (data.soilMoisture < 40)
      warnings.push("⚠ Soil moisture is low. Irrigation recommended.");
    if (data.airTemp > 35)
      warnings.push("⚠ High temperature detected. Heat stress possible.");
    if (data.humidity > 80)
      warnings.push("⚠ High humidity may increase disease risk.");

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
        setMlInsight(null);
      })
      .catch(() => alert("❌ Failed to create batch"));
  };

  // ==============================
  // Finalize batch
  // ==============================
  const finalizeBatch = () => {
    if (!selectedBatch) {
      alert("❌ Please select a batch to finalize");
      return;
    }

    if (!window.confirm(`🌾 Finalize batch ${selectedBatch}?`)) return;

    fetch("http://127.0.0.1:5000/api/batch/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_id: selectedBatch })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("❌ " + data.error);
          return;
        }

        alert(`🌾 Batch Finalized: ${data.batch_id}`);
        setSelectedBatch("");
        fetchActiveBatch();
        fetchAllBatches();
        setSensorData(null);
        setChartData([]);
        setTamperStatus(null);
        setMlInsight(null);
      })
      .catch(() => alert("❌ Failed to finalize batch"));
  };

  const isHistorical = selectedBatch && selectedBatch !== activeBatch;

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

          <select
            className="form-select w-50 mx-auto mt-2"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">🔄 View Active Batch</option>
            {batches.map(b => (
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
              disabled={!selectedBatch}
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
            ["☁ Humidity", `${sensorData?.humidity ?? "--"} %`]
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
              <h4>🔗 Blockchain TX</h4>
              <p className="sensor-value">
                {sensorData?.blockchain_tx
                  ? sensorData.blockchain_tx.slice(0, 12) + "..."
                  : "--"}
              </p>
            </div>
          </div>

          <div className="col-md-4 mt-3">
            <div className="sensor-card shadow">
              <h4>🛡 Integrity Status</h4>
              <p
                className="sensor-value"
                style={{
                  color:
                    tamperStatus === "NOT TAMPERED"
                      ? "green"
                      : tamperStatus === "TAMPERED"
                        ? "red"
                        : "gray"
                }}
              >
                {tamperStatus ?? "--"}
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
        {/* ALERTS */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="alert-card shadow">
              <h5>⚠ Farm Alerts & AI Suggestions</h5>

              {/* Threshold Alerts */}
              {alerts.length === 0 ? (
                <p>✅ No critical threshold alerts.</p>
              ) : (
                <ul>
                  {alerts.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}

              <hr />

              {/* AI/ML Suggestions */}
              <h6>🤖 AI Recommendations</h6>
              {mlInsight ? (
                <ul>
                  {getAISuggestions(mlInsight).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p>AI analysis unavailable. Using rule-based monitoring.</p>
              )}
            </div>
          </div>
        </div>


        {/* 🤖 ML INSIGHTS */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="alert-card shadow">
              <h5>🤖 AI Crop & Disease Insight</h5>
              {!mlInsight ? (
                <p>ML analysis not available. Using threshold-based monitoring.</p>
              ) : (
                <ul>
                  {mlInsight.crop_health && (
                    <li>🌱 Crop Health: <strong>{mlInsight.crop_health}</strong></li>
                  )}
                  {mlInsight.disease_risk && (
                    <li>🦠 Disease Risk: <strong>{mlInsight.disease_risk}</strong></li>
                  )}
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
