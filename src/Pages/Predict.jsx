import React, { useEffect, useState } from 'react';
import "../styles/prediction.css";

const Predict = () => {

  const [sensorData, setSensorData] = useState({
    temperature: "",
    humidity: "",
    soilMoisture: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: ""
  });

  const [prediction, setPrediction] = useState({
    health: "—",
    weather: "—",
    disease: "—"
  });

  // Fetch Sensor Data Automatically
  useEffect(() => {
    fetch("http://localhost:5000/api/sensors/latest")
      .then(response => response.json())
      .then(data => {
        setSensorData(data);

        // After sensor data arrives → Trigger prediction API
        autoPredict(data);
      })
      .catch(err => console.log("Error fetching sensor data:", err));
  }, []);

  // Automatic prediction function
  const autoPredict = (data) => {
    fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        setPrediction({
          health: result.health || "Healthy",
          weather: result.weather || "Low Risk",
          disease: result.disease || "8%"
        });
      })
      .catch(err => console.log("Prediction Error:", err));
  };

  return (
    <div className="predict-bg">
      <div className="container mt-5">

        <div className="row">
          <div className="col col-12">

            <h2 className="text-center predict-title">🌱 Crop Health Prediction</h2>
            <p className="text-center predict-subtitle">AI • IoT • Smart Farming Intelligence</p>

            {/* Prediction Form */}
            <div className="prediction-card p-4 mt-4 shadow">

              <h4 className="section-label mb-3">📡 Sensor Inputs (Auto-Filled)</h4>

              <div className="row">

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Temperature (°C)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.temperature} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Humidity (%)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.humidity} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Soil Moisture (%)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.soilMoisture} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Soil pH</label>
                  <input type="text" className="form-control predict-input" value={sensorData.ph} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Nitrogen (N)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.nitrogen} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Phosphorus (P)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.phosphorus} readOnly />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="predict-label">Potassium (K)</label>
                  <input type="text" className="form-control predict-input" value={sensorData.potassium} readOnly />
                </div>

              </div>

              {/* Predict Button (Optional - Manual Trigger) */}
              <div className="text-center mt-4">
                <button 
                  className="btn btn-success predict-btn"
                  onClick={() => autoPredict(sensorData)}
                >
                  🔍 Re-Predict Crop Health
                </button>
              </div>

            </div>

            {/* Results Section */}
            <div className="row mt-5">

              {/* Crop Health Card */}
              <div className="col-12 col-md-4 mt-3">
                <div className="result-card shadow">
                  <h4 className="result-title">🌿 Crop Health</h4>
                  <p className="result-value">{prediction.health}</p>
                  <p className="result-desc">
                    AI analysis of soil & climate conditions.
                  </p>
                </div>
              </div>

              {/* Weather Impact Card */}
              <div className="col-12 col-md-4 mt-3">
                <div className="result-card shadow">
                  <h4 className="result-title">🌤 Weather Impact</h4>
                  <p className="result-value">{prediction.weather}</p>
                  <p className="result-desc">
                    Risk level based on 72-hour forecast.
                  </p>
                </div>
              </div>

              {/* Disease Prediction Card */}
              <div className="col-12 col-md-4 mt-3">
                <div className="result-card shadow">
                  <h4 className="result-title">🦠 Disease Risk</h4>
                  <p className="result-value">{prediction.disease}</p>
                  <p className="result-desc">
                    Probability of infection based on IoT patterns.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Predict;
