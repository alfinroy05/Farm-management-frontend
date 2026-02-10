import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/verifybatch.css";

const VerifyBatch = () => {
  const { batchId: urlBatchId } = useParams();

  const [batchId, setBatchId] = useState(urlBatchId || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // ✅ SINGLE SOURCE OF TRUTH
  const verifyBatch = async (idToVerify) => {
    if (!idToVerify) {
      setError("Please enter a Batch ID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/trace/${idToVerify}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO-VERIFY when coming from QR
  useEffect(() => {
    if (urlBatchId) {
      verifyBatch(urlBatchId);
    }
  }, [urlBatchId]);

  return (
    <div className="verify-bg">
      <div className="container mt-5">
        <div className="verify-card shadow p-4">

          <h2 className="text-center">🔍 Verify Product Authenticity</h2>
          <p className="text-center text-muted">
            Blockchain-based Tamper Detection
          </p>

          {/* INPUT */}
          <div className="mt-4">
            <label className="form-label">Batch ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BATCH_1769281141"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => verifyBatch(batchId)}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify on Blockchain"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger mt-4 text-center">
              ❌ {error}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="result-box mt-4">

              <h4 className="text-center">
                {result.verified ? "✅ VERIFIED" : "❌ TAMPERED"}
              </h4>

              <hr />

              <p><strong>Batch ID:</strong> {result.batchId}</p>

              <p>
                <strong>Stored Merkle Root:</strong><br />
                <code>{result.merkleRootStored}</code>
              </p>

              <p>
                <strong>Recomputed Merkle Root:</strong><br />
                <code>{result.merkleRootRecomputed}</code>
              </p>

              <p>
                <strong>Tamper Status:</strong>{" "}
                <span
                  className={
                    result.verified ? "text-success" : "text-danger"
                  }
                >
                  {result.tamperStatus}
                </span>
              </p>

              {result.blockchainTx && (
                <p>
                  <strong>Blockchain Transaction:</strong><br />
                  <a
                    href={`https://sepolia.etherscan.io/tx/${result.blockchainTx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Etherscan ↗
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyBatch;
