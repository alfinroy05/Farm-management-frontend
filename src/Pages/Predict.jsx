import React, { useEffect, useState } from 'react';
import "../styles/prediction.css";

const Predict = () => {

  const [sensorData, setSensorData] = useState({
    airTemp: "",
    humidity: "",
    soilMoisture: "",
    soilPH: "",
    npk: { N: "", P: "", K: "" }
  });

  const [prediction, setPrediction] = useState({
    crop_health: "—",
    disease_risk: "—",
    advisory: []
  });

  // ==============================
  // Fetch Sensor Data Automatically
  // ==============================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sensors/latest")
      .then(res => res.json())
      .then(data => {
        if (data.error) return;

        setSensorData({
          airTemp: data.airTemp,
          humidity: data.humidity,
          soilMoisture: data.soilMoisture,
          soilPH: data.soilPH,
          npk: data.npk || { N: "", P: "", K: "" }
        });

        autoPredict(data); // trigger prediction with fresh data
      })
      .catch(err => console.log("Error fetching sensor data:", err));
  }, []);

  // ==============================
  // Trigger ML Prediction
  // ==============================
  const autoPredict = (data) => {
    fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: data.airTemp,
        humidity: data.humidity,
        soilMoisture: data.soilMoisture,
        ph: data.soilPH,
        nitrogen: data.npk?.N,
        phosphorus: data.npk?.P,
        potassium: data.npk?.K
      })
    })
      .then(res => res.json())
      .then(result => {
        setPrediction({
          crop_health: result.crop_health,
          disease_risk: result.disease_risk,
          advisory: result.advisory || []
        });
      })
      .catch(err => console.log("Prediction Error:", err));
  };

  return (
    <div className="predict-bg">
      <div className="container mt-5">

        <h2 className="text-center predict-title">🌱 Crop Health Prediction</h2>
        <p className="text-center predict-subtitle">
          AI • IoT • Smart Farming Intelligence
        </p>

        {/* Sensor Inputs */}
        <div className="prediction-card p-4 mt-4 shadow">

          <h4 className="section-label mb-3">📡 Sensor Inputs (Auto-Filled)</h4>

          <div className="row">

            <div className="col-md-6 mt-3">
              <label className="predict-label">Temperature (°C)</label>
              <input className="form-control predict-input" value={sensorData.airTemp} readOnly />
            </div>

            <div className="col-md-6 mt-3">
              <label className="predict-label">Humidity (%)</label>
              <input className="form-control predict-input" value={sensorData.humidity} readOnly />
            </div>

            <div className="col-md-6 mt-3">
              <label className="predict-label">Soil Moisture (%)</label>
              <input className="form-control predict-input" value={sensorData.soilMoisture} readOnly />
            </div>

            <div className="col-md-6 mt-3">
              <label className="predict-label">Soil pH</label>
              <input className="form-control predict-input" value={sensorData.soilPH} readOnly />
            </div>

            <div className="col-md-4 mt-3">
              <label className="predict-label">Nitrogen (N)</label>
              <input className="form-control predict-input" value={sensorData.npk.N} readOnly />
            </div>

            <div className="col-md-4 mt-3">
              <label className="predict-label">Phosphorus (P)</label>
              <input className="form-control predict-input" value={sensorData.npk.P} readOnly />
            </div>

            <div className="col-md-4 mt-3">
              <label className="predict-label">Potassium (K)</label>
              <input className="form-control predict-input" value={sensorData.npk.K} readOnly />
            </div>

          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-success predict-btn"
              onClick={() => autoPredict(sensorData)}
            >
              🔍 Re-Predict Crop Health
            </button>
          </div>

        </div>

        {/* Results */}
        <div className="row mt-5">

          <div className="col-md-4 mt-3">
            <div className="result-card shadow">
              <h4 className="result-title">🌿 Crop Health</h4>
              <p className="result-value">{prediction.crop_health}</p>
            </div>
          </div>

          <div className="col-md-4 mt-3">
            <div className="result-card shadow">
              <h4 className="result-title">🦠 Disease Risk</h4>
              <p className="result-value">{prediction.disease_risk}</p>
            </div>
          </div>

          <div className="col-md-4 mt-3">
            <div className="result-card shadow">
              <h4 className="result-title">📋 Advisory</h4>
              <ul className="result-desc">
                {prediction.advisory.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Predict;
