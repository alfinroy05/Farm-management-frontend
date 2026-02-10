import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/generateqr.css";

const GenerateQR = () => {
  const [finalizedBatches, setFinalizedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [qrValue, setQrValue] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // ==============================
  // Fetch finalized batches
  // ==============================
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/batch/finalized`)
      .then(res => res.json())
      .then(data => setFinalizedBatches(data))
      .catch(() => setFinalizedBatches([]));
  }, []);

  // ==============================
  // Generate QR
  // ==============================
  const generateQR = () => {
    if (!selectedBatch) {
      alert("❌ Please select a finalized batch");
      return;
    }

    const verifyUrl = `${API_BASE_URL}/verify/${selectedBatch}`;
    setQrValue(verifyUrl);
  };

  return (
    <div className="qr-bg">
      <div className="container mt-5">
        <div className="col-md-8 mx-auto">

          <h2 className="text-center qr-title">🌾 Generate QR Code</h2>
          <p className="text-center qr-subtitle">
            Blockchain Verified • Tamper-Proof
          </p>

          {/* SELECT BATCH */}
          <div className="qr-card p-4 shadow">
            <h4 className="section-title">📦 Select Finalized Batch</h4>

            <select
              className="form-select mt-3"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">-- Select Batch --</option>
              {finalizedBatches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_id}
                </option>
              ))}
            </select>

            <div className="text-center mt-4">
              <button className="btn btn-success qr-btn" onClick={generateQR}>
                🔗 Generate QR Code
              </button>
            </div>
          </div>

          {/* QR DISPLAY */}
          {qrValue && (
            <div className="qr-result-card p-4 shadow mt-5 text-center">
              <h3 className="result-title">✅ QR Code Ready</h3>

              <QRCodeSVG value={qrValue} size={200} />

              <p className="mt-3">
                <strong>Verification URL:</strong><br />
                {qrValue}
              </p>

              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  const svg = document.querySelector("svg");
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  const img = new Image();

                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.download = `${selectedBatch}.png`;
                    link.href = pngFile;
                    link.click();
                  };

                  img.src = "data:image/svg+xml;base64," + btoa(svgData);
                }}
              >
                ⬇ Download QR
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
