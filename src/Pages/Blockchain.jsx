import React, { useEffect, useState } from "react";
import "../styles/blockchain.css";

const Blockchain = () => {
  const [logs, setLogs] = useState([]);
  const [verifying, setVerifying] = useState(null);

  // -------------------------------
  // Fetch blockchain logs
  // -------------------------------
  const fetchLogs = () => {
    fetch("http://localhost:5000/api/blockchain/logs")
      .then((res) => res.json())
      .then((data) => {
        // backend returns ARRAY
        const formatted = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          status: "Not Verified",
        }));
        setLogs(formatted);
      })
      .catch((err) => console.log("Blockchain fetch error:", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // -------------------------------
  // Verify a batch
  // -------------------------------
  const verifyBatch = async (batchId, index) => {
    setVerifying(index);

    try {
      const res = await fetch(
        `http://localhost:5000/api/blockchain/verify/${batchId}`
      );
      const data = await res.json();

      setLogs((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                status: data.verified ? "Verified" : "Tampered",
              }
            : item
        )
      );
    } catch (err) {
      console.log("Verification error:", err);
    }

    setVerifying(null);
  };

  // -------------------------------
  // Helper: Safe tx hash
  // -------------------------------
  const formatTxHash = (hash) => {
    if (!hash) return "";
    return hash.startsWith("0x") ? hash : "0x" + hash;
  };

  return (
    <div className="blockchain-bg">
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">

            {/* Title */}
            <h2 className="text-center bc-title">
              🔗 Blockchain Activity Dashboard
            </h2>
            <p className="text-center bc-subtitle">
              Transparent • Tamper-Proof • Decentralized
            </p>

            {/* Explanation */}
            <div className="bc-info-card p-4 mt-4 shadow">
              <h4 className="mb-2">📘 How this works?</h4>
              <p>
                Agricultural data is stored off-chain for scalability, while
                cryptographic proofs (Merkle roots) are immutably stored on the
                Ethereum blockchain. Any tampering is detected by cryptographic
                re-verification.
              </p>
            </div>

            {/* Logs Table */}
            <div className="bc-table-card p-4 mt-4 shadow">
              <h4 className="mb-3">📄 Blockchain Batch Logs</h4>

              <div className="table-responsive">
                <table className="table futuristic-table">
                  <thead>
                    <tr>
                      <th>Batch ID</th>
                      <th>Tx Hash</th>
                      <th>Timestamp</th>
                      <th>Verification</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log, index) => {
                        const txHash = formatTxHash(log.tx_hash);

                        return (
                          <tr key={index}>
                            <td>{log.batch_id}</td>

                            <td className="tx-hash">
                              {txHash ? (
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {txHash.slice(0, 12)}...
                                </a>
                              ) : (
                                "--"
                              )}
                            </td>

                            <td>
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleString()
                                : "--"}
                            </td>

                            <td>
                              <span
                                className={
                                  log.status === "Verified"
                                    ? "status success"
                                    : log.status === "Tampered"
                                    ? "status failed"
                                    : "status pending"
                                }
                              >
                                {log.status}
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn btn-sm btn-success"
                                disabled={verifying === index}
                                onClick={() =>
                                  verifyBatch(log.batch_id, index)
                                }
                              >
                                {verifying === index
                                  ? "Verifying..."
                                  : "Verify"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No blockchain batches found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Refresh */}
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary refresh-btn"
                  onClick={fetchLogs}
                >
                  🔄 Refresh Blockchain Logs
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
