import React, { useEffect, useState } from 'react';
import "../styles/prediction.css";

const Predict = () => {

  const [sensorData, setSensorData] = useState({
    airTemp: "",
    humidity: "",
    soilMoisture: "",
    soilPH: "",          // display value
    soilPHValue: null,   // numeric value for ML
    npk: { N: "", P: "", K: "" }
  });

  const [prediction, setPrediction] = useState({
    crop_health: "—",
    disease_risk: "—",
    advisory: []
  });

  const [confidence, setConfidence] = useState(null);
  const [aiExplanation, setAiExplanation] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // ==============================
  // Fetch all batches
  // ==============================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/batch/all")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBatches(data);
        else if (Array.isArray(data.data)) setBatches(data.data);
      })
      .catch(() => setBatches([]));
  }, []);

  // ==============================
  // Explainable AI + Suggestions
  // ==============================
  const generateAIAnalysis = (data, result) => {
    const explanations = [];
    const suggestions = [];
    let score = 100;

    if (data.soilMoisture < 40) {
      explanations.push("Low soil moisture significantly influenced the ML prediction.");
      suggestions.push("💧 Increase irrigation to restore optimal soil moisture.");
      score -= 20;
    }

    if (data.airTemp > 35) {
      explanations.push("High temperature increased crop heat stress likelihood.");
      suggestions.push("🌤 Irrigate during cooler hours or use shade nets.");
      score -= 15;
    }

    if (data.humidity > 80) {
      explanations.push("High humidity raised disease probability in the ML model.");
      suggestions.push("🦠 Improve ventilation and monitor for fungal infections.");
      score -= 15;
    }

    if (data.soilPHValue < 5.5 || data.soilPHValue > 7.5) {
      explanations.push("Simulated soil pH indicated nutrient imbalance.");
      suggestions.push("🧪 Adjust soil pH using lime or sulfur as recommended.");
      score -= 10;
    }

    if (result.disease_risk === "High") {
      suggestions.push("🚫 Avoid harvesting until disease risk reduces.");
    }

    if (explanations.length === 0) {
      explanations.push("All environmental parameters were within optimal range.");
      suggestions.push("✅ Maintain current farming practices.");
    }

    setConfidence(Math.max(score, 60));
    setAiExplanation(explanations);
    setAiSuggestions(suggestions);
  };

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
        ph: data.soilPHValue,
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

        generateAIAnalysis(data, result);
      })
      .catch(err => console.log("Prediction Error:", err));
  };

  // ==============================
  // Fetch Sensor Data (batch-aware)
  // ==============================
  useEffect(() => {

    // Reset prediction when batch changes
    setPrediction({ crop_health: "—", disease_risk: "—", advisory: [] });
    setConfidence(null);
    setAiExplanation([]);
    setAiSuggestions([]);

    const processSensor = (sensor) => {
      const phValue = sensor.soilPH ?? 6.5;

      const processed = {
        airTemp: sensor.airTemp,
        humidity: sensor.humidity,
        soilMoisture: sensor.soilMoisture,
        soilPH: sensor.soilPH ? sensor.soilPH : "6.5 (Simulated)",
        soilPHValue: phValue,
        npk: sensor.npk || { N: "", P: "", K: "" }
      };

      setSensorData(processed);
      autoPredict(processed);
    };

    if (selectedBatch) {
      fetch(`http://127.0.0.1:5000/api/sensors/batch/${selectedBatch}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            processSensor(data[data.length - 1].sensor_data);
          }
        });
    } else {
      fetch("http://127.0.0.1:5000/api/sensors/latest")
        .then(res => res.json())
        .then(data => {
          if (!data.error) processSensor(data);
        });
    }

  }, [selectedBatch]);

  return (
    <div className="predict-bg">
      <div className="container mt-5">

        <h2 className="text-center predict-title">🌱 AI Crop Health Prediction</h2>
        <p className="text-center predict-subtitle">
          Batch-Aware ML Inference & Explainable AI
        </p>

        {/* Batch Selector */}
        <div className="text-center mt-3">
          <label className="predict-label">🧺 Select Batch</label>
          <select
            className="form-select w-50 mx-auto"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Live / Active Batch</option>
            {batches.map(b => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_id} ({b.status})
              </option>
            ))}
          </select>

          <p className="mt-2">
            <strong>Current Batch:</strong>{" "}
            {selectedBatch || "Live Sensor Data"}
          </p>
        </div>

        {/* Sensor Inputs */}
        <div className="prediction-card p-4 mt-4 shadow">
          <h4 className="section-label mb-3">📡 Sensor Inputs</h4>
          <p className="text-muted">* Soil pH value is simulated</p>

          <div className="row">
            {[
              ["Temperature (°C)", sensorData.airTemp],
              ["Humidity (%)", sensorData.humidity],
              ["Soil Moisture (%)", sensorData.soilMoisture],
              ["Soil pH", sensorData.soilPH]
            ].map(([label, value], i) => (
              <div className="col-md-6 mt-3" key={i}>
                <label className="predict-label">{label}</label>
                <input className="form-control predict-input" value={value} readOnly />
              </div>
            ))}

            {/* ✅ NPK RESTORED */}
            {["N", "P", "K"].map((nutrient, i) => (
              <div className="col-md-4 mt-3" key={i}>
                <label className="predict-label">
                  {nutrient === "N" ? "Nitrogen (N)" :
                   nutrient === "P" ? "Phosphorus (P)" :
                   "Potassium (K)"}
                </label>
                <input
                  className="form-control predict-input"
                  value={sensorData.npk[nutrient]}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="row mt-5">
          {[
            ["🌿 Crop Health", prediction.crop_health],
            ["🦠 Disease Risk", prediction.disease_risk],
            ["📊 Prediction Confidence", confidence ? `${confidence}%` : "—"]
          ].map(([title, value], i) => (
            <div className="col-md-4 mt-3" key={i}>
              <div className="result-card shadow">
                <h4>{title}</h4>
                <p className="result-value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Explainable AI */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="result-card shadow">
              <h4>🧠 AI Explanation</h4>
              <ul className="result-desc">
                {aiExplanation.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="result-card shadow">
              <h4>📋 AI Recommendations</h4>
              <ul className="result-desc">
                {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Backend Advisory */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="result-card shadow">
              <h4>📌 Model Advisory</h4>
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
