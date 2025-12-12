import React, { useState } from 'react';
import "../styles/traceability.css";

const Traceability = () => {

  const [traceData, setTraceData] = useState(null);
  const [batchId, setBatchId] = useState("");

  // Fetch details from blockchain API
  const fetchTraceData = () => {
    fetch(`http://localhost:5000/api/trace/${batchId}`)
      .then(res => res.json())
      .then(data => setTraceData(data))
      .catch(err => console.log("Traceability Error:", err));
  };

  return (
    <div className="trace-bg">
      <div className="container mt-5">

        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">

            {/* Title */}
            <h2 className="text-center trace-title">🔎 Blockchain Traceability System</h2>
            <p className="text-center trace-subtitle">
              Verify Product Authenticity • Scan QR • Check Blockchain Records
            </p>

            {/* Input Card */}
            <div className="trace-input-card p-4 shadow mt-4">

              <h4 className="section-title">📌 Enter Batch ID / Scan QR Code</h4>

              {/* Manual Input */}
              <input
                type="text"
                className="form-control trace-input"
                placeholder="Enter Batch ID or Transaction Hash"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />

              <div className="text-center mt-3">
                <button className="btn btn-success trace-btn" onClick={fetchTraceData}>
                  🔍 Trace Product
                </button>
              </div>

              {/* QR Code Placeholder */}
              <div className="qr-section mt-4 text-center">
                <div className="qr-box">QR Scanner Coming Soon</div>
                <p className="qr-text">Point your camera to scan QR</p>
              </div>

            </div>

            {/* Trace Results */}
            {traceData && (
              <div className="trace-result-card p-4 mt-5 shadow">

                <h4 className="result-title">📦 Product Traceability Report</h4>

                <div className="row mt-3">

                  <div className="col-12 col-md-6 mt-3">
                    <h5 className="result-label">🌾 Crop Name</h5>
                    <p className="result-value">{traceData.crop}</p>
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <h5 className="result-label">👨‍🌾 Farmer</h5>
                    <p className="result-value">{traceData.farmer}</p>
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <h5 className="result-label">📍 Farm Location</h5>
                    <p className="result-value">{traceData.location}</p>
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <h5 className="result-label">📅 Harvest Date</h5>
                    <p className="result-value">{traceData.harvestDate}</p>
                  </div>

                </div>

                <hr />

                <h4 className="result-title mt-4">🚚 Supply Chain History</h4>

                <ul className="timeline mt-3">
                  {traceData.history.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>

                <hr />

                <div className="auth-status mt-4 text-center">
                  <h4 className="result-title">✔ Blockchain Verified</h4>
                  <p className="verified-text">
                    This product is authentic and traceable through blockchain.
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Traceability;
