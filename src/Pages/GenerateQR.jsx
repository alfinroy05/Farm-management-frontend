import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";  // Correct import

import "../styles/generateqr.css";

const GenerateQR = () => {
  const [form, setForm] = useState({
    cropName: "",
    variety: "",
    harvestDate: "",
    location: "",
    farmerName: "",
  });

  const [batchId, setBatchId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isGenerated, setGenerated] = useState(false);

  // Handle input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit to blockchain + generate QR
  const generateQR = () => {
    fetch("http://localhost:5000/api/harvest/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setBatchId(data.batchId); // Unique ID for QR
        setTxHash(data.txHash);   // Blockchain transaction
        setGenerated(true);
      })
      .catch((err) => console.log("QR Generate Error:", err));
  };

  return (
    <div className="qr-bg">
      <div className="container mt-5">
        <div className="row">
          <div className="col col-12 col-md-10 col-lg-8 mx-auto">

            <h2 className="text-center qr-title">🌾 Generate QR Code for Harvest</h2>
            <p className="text-center qr-subtitle">
              Secure • Tamper-Proof • Blockchain Verified
            </p>

            {/* HARVEST FORM */}
            <div className="qr-card p-4 shadow">
              <h4 className="section-title">📋 Harvest Details</h4>

              <div className="row mt-3">
                <div className="col-12 col-md-6">
                  <label className="qr-label">Crop Name</label>
                  <input
                    type="text"
                    className="form-control qr-input"
                    name="cropName"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="qr-label">Variety</label>
                  <input
                    type="text"
                    className="form-control qr-input"
                    name="variety"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="qr-label">Harvest Date</label>
                  <input
                    type="date"
                    className="form-control qr-input"
                    name="harvestDate"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6 mt-3">
                  <label className="qr-label">Farm Location</label>
                  <input
                    type="text"
                    className="form-control qr-input"
                    name="location"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mt-3">
                  <label className="qr-label">Farmer Name</label>
                  <input
                    type="text"
                    className="form-control qr-input"
                    name="farmerName"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-success qr-btn" onClick={generateQR}>
                  🧾 Generate QR Code
                </button>
              </div>
            </div>

            {/* QR RESULT SECTION */}
            {isGenerated && (
              <div className="qr-result-card p-4 shadow mt-5">
                <h3 className="text-center result-title">🎉 QR Code Generated</h3>

                <div className="text-center mt-4">
                  {/* USE QRCodeSVG INSTEAD OF QRCode */}
                  <QRCodeSVG 
                    value={batchId}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <div className="mt-4">
                  <h5 className="qr-detail">Batch ID:</h5>
                  <p className="qr-value">{batchId}</p>

                  <h5 className="qr-detail">Blockchain Tx Hash:</h5>
                  <p className="qr-value">{txHash}</p>
                </div>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary download-btn"
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
                        link.download = `${batchId}.png`;
                        link.href = pngFile;
                        link.click();
                      };

                      img.src = "data:image/svg+xml;base64," + btoa(svgData);
                    }}
                  >
                    ⬇ Download QR Code
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
