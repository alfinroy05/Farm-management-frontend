import React, { useEffect, useState } from "react";
import "../styles/sensors.css";

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

const Sensors = () => {

  const [sensorData, setSensorData] = useState(null);

  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [tempGraphData, setTempGraphData] = useState([]);
  const [moistureGraphData, setMoistureGraphData] = useState([]);

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
      .then(data => setBatches(Array.isArray(data) ? data : data.data || []))
      .catch(() => setBatches([]));
  };

  // ==============================
  // Fetch LIVE sensor data
  // ==============================
  const fetchLiveSensorData = () => {
    fetch("http://127.0.0.1:5000/api/sensors/latest")
      .then(res => res.json())
      .then(data => {
        if (data.error) return;

        setSensorData(data);

        const time = new Date().toLocaleTimeString();

        setTempGraphData(prev =>
          [...prev, { time, value: data.airTemp }].slice(-6)
        );

        setMoistureGraphData(prev =>
          [...prev, { time, value: data.soilMoisture }].slice(-6)
        );
      })
      .catch(() => setSensorData(null));
  };

  // ==============================
  // Fetch BATCH sensor data
  // ==============================
  const fetchBatchSensorData = (batchId) => {
    fetch(`http://127.0.0.1:5000/api/sensors/batch/${batchId}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          setSensorData(null);
          setTempGraphData([]);
          setMoistureGraphData([]);
          return;
        }

        const latest = data[data.length - 1].sensor_data;
        setSensorData(latest);

        setTempGraphData(
          data.map((row, i) => ({
            time: i + 1,
            value: row.sensor_data.airTemp
          }))
        );

        setMoistureGraphData(
          data.map((row, i) => ({
            time: i + 1,
            value: row.sensor_data.soilMoisture
          }))
        );
      })
      .catch(() => {
        setSensorData(null);
        setTempGraphData([]);
        setMoistureGraphData([]);
      });
  };

  // ==============================
  // Initial load
  // ==============================
  useEffect(() => {
    fetchActiveBatch();
    fetchAllBatches();
    fetchLiveSensorData();
  }, []);

  // ==============================
  // Auto-refresh every 1 minute
  // ==============================
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedBatch) {
        fetchBatchSensorData(selectedBatch);
      } else {
        fetchLiveSensorData();
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [selectedBatch]);

  // ==============================
  // On batch change (immediate fetch)
  // ==============================
  useEffect(() => {
    if (!selectedBatch) {
      fetchLiveSensorData();
    } else {
      fetchBatchSensorData(selectedBatch);
    }
  }, [selectedBatch]);

  const isHistorical =
    selectedBatch && selectedBatch !== activeBatch;

  return (
    <div className="sensors-bg">
      <div className="container mt-4">

        <h2 className="text-center sensors-title">
          🚜 Smart Farm IoT Dashboard
        </h2>

        <p className="text-center sensors-subtitle">
          {isHistorical ? "Historical Batch Data" : "Live Monitoring (Auto Refresh: 1 min)"}
        </p>

        {/* Batch Selector */}
        <select
          className="form-select w-50 mx-auto mt-3"
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

        {/* SENSOR CARDS */}
        <div className="row mt-4">
          {[
            ["🌡 Temperature", `${sensorData?.airTemp ?? "--"} °C`],
            ["💧 Soil Moisture", `${sensorData?.soilMoisture ?? "--"} %`],
            ["☁ Humidity", `${sensorData?.humidity ?? "--"} %`],
            ["🔬 Soil pH", sensorData?.soilPH ?? "--"],
            [
              "🧪 NPK",
              sensorData?.npk
                ? `N:${sensorData.npk.N} P:${sensorData.npk.P} K:${sensorData.npk.K}`
                : "--"
            ]
          ].map(([label, value], i) => (
            <div className="col-md-4 mt-3" key={i}>
              <div className="sensor-card glow">
                <h4>{label}</h4>
                <p className="sensor-value">{value}</p>
                <small>{isHistorical ? "Historical" : "Live"}</small>
              </div>
            </div>
          ))}
        </div>

        {/* GRAPHS */}
        <div className="row mt-5">

          <div className="col-md-6">
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

          <div className="col-md-6">
            <div className="graph-card">
              <h4>📉 Soil Moisture Trend</h4>
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

      </div>
    </div>
  );
};

export default Sensors;
