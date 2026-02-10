import React, { useState } from "react";
import "../styles/traceability.css";

const Traceability = () => {
  const [traceData, setTraceData] = useState(null);
  const [batchId, setBatchId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTraceData = async () => {
    if (!batchId) {
      alert("Please enter a Batch ID");
      return;
    }

    setLoading(true);
    setTraceData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/trace/${batchId}`
      );
      const data = await res.json();
      setTraceData(data);
    } catch (err) {
      console.error("Traceability Error:", err);
      alert("Failed to trace batch");
    }

    setLoading(false);
  };

  return (
    <div className="trace-bg">
      <div className="container mt-5">

        <h2 className="text-center trace-title">
          🔎 Blockchain Traceability System
        </h2>
        <p className="text-center trace-subtitle">
          Verify Product Authenticity • Blockchain Powered
        </p>

        {/* INPUT */}
        <div className="trace-input-card p-4 shadow mt-4">
          <h4 className="section-title">📌 Enter Batch ID</h4>

          <input
            type="text"
            className="form-control trace-input"
            placeholder="e.g. BATCH_1770574011"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />

          <div className="text-center mt-3">
            <button
              className="btn btn-success trace-btn"
              onClick={fetchTraceData}
              disabled={loading}
            >
              {loading ? "Tracing..." : "🔍 Trace Product"}
            </button>
          </div>
        </div>

        {/* RESULT */}
        {traceData && (
          <div className="trace-result-card p-4 mt-5 shadow">

            <h4 className="result-title">📦 Traceability Report</h4>

            <div className="mt-3">
              <p><strong>Batch ID:</strong> {traceData.batchId}</p>
              <p><strong>Blockchain TX:</strong> {traceData.blockchainTx}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    traceData.tamperStatus === "NOT TAMPERED"
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {traceData.tamperStatus}
                </span>
              </p>
            </div>

            <hr />

            <h5>🚚 Supply Chain History</h5>
            <ul className="timeline mt-3">
              {traceData.supplyChain.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>

            <hr />

            <div className="auth-status text-center">
              {traceData.verified ? (
                <>
                  <h4 className="text-success">✔ Blockchain Verified</h4>
                  <p>Data integrity confirmed using Merkle Tree & Ethereum</p>
                </>
              ) : (
                <>
                  <h4 className="text-danger">❌ Verification Failed</h4>
                  <p>Data integrity could not be confirmed</p>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Traceability;
