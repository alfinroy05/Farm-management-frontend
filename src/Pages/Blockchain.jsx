import React, { useEffect, useState } from 'react';
import "../styles/blockchain.css";

const Blockchain = () => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/blockchain/logs")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.log("Blockchain fetch error:", err));
  }, []);

  return (
    <div className="blockchain-bg">
      <div className="container mt-5">

        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">

            {/* Title */}
            <h2 className="text-center bc-title">🔗 Blockchain Activity Dashboard</h2>
            <p className="text-center bc-subtitle">Transparent • Tamper-Proof • Decentralized</p>

            {/* Blockchain Explanation Card */}
            <div className="bc-info-card p-4 mt-4 shadow">
              <h4 className="mb-2">📘 How this works?</h4>
              <p>
                Every important event in the farm (sensor reading, crop prediction, harvest update, 
                traceability entry) is securely stored on the blockchain. These logs cannot be modified, 
                providing complete transparency and trust for farmers, store owners, and consumers.
              </p>
            </div>

            {/* Logs Table */}
            <div className="bc-table-card p-4 mt-4 shadow">

              <h4 className="mb-3">📄 Recent Blockchain Transactions</h4>

              <div className="table-responsive">
                <table className="table futuristic-table">
                  <thead>
                    <tr>
                      <th>Tx Hash</th>
                      <th>Event</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <tr key={index}>
                          <td className="tx-hash">{log.hash}</td>
                          <td>{log.event}</td>
                          <td>{log.time}</td>
                          <td>
                            <span
                              className={
                                log.status === "Success"
                                  ? "status success"
                                  : "status failed"
                              }
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          Fetching logs...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Refresh Button */}
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary refresh-btn"
                  onClick={() => window.location.reload()}
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
