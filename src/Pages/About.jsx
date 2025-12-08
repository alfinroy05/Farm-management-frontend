import React from 'react'
import "../styles/about.css"; // make sure this file exists

const About = () => {
  return (
    <div className="about-bg">
      <div className="container mt-5">

        <div className="row justify-content-center">
          <div className="col col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">

            <div className="about-card p-4 shadow">

              <h2 className="text-center mb-3 about-title">🌿 About AgriChain</h2>
              <p className="about-subtitle text-center">
                Smart Farming • Blockchain • IoT • Machine Learning
              </p>

              <hr />

              <h4 className="section-title">🚜 What is AgriChain?</h4>
              <p className="about-text">
                AgriChain is a next-generation Smart Farm Management System that integrates 
                <strong> IoT sensors, Machine Learning models, and Blockchain technology </strong>
                to provide farmers, consumers, and store owners with a transparent, intelligent, 
                and secure agricultural ecosystem.
              </p>

              <h4 className="section-title">📡 IoT-Based Smart Monitoring</h4>
              <p className="about-text">
                Real-time IoT sensors continuously track soil moisture, temperature, humidity, 
                pH levels, rainfall, and NPK values. This enables farmers to make accurate and 
                timely decisions to improve crop growth and optimize resources.
              </p>

              <h4 className="section-title">🤖 AI/ML Intelligent Predictions</h4>
              <p className="about-text">
                Our machine learning engine predicts crop health, possible diseases, weather impact,
                irrigation needs, and overall farm conditions. This reduces manual guesswork and 
                maximizes crop yield.
              </p>

              <h4 className="section-title">🔗 Blockchain Traceability & Security</h4>
              <p className="about-text">
                All critical farm data, crop lifecycle events, and supply chain details are stored 
                in a tamper-proof blockchain ledger. Consumers can scan a QR code to verify the 
                authenticity, origin, and quality of the agricultural products.
              </p>

              <h4 className="section-title">🌾 Why AgriChain is Different?</h4>
              <ul className="about-list">
                <li>Real-time IoT-based farm monitoring</li>
                <li>ML-driven crop health and disease predictions</li>
                <li>Secure blockchain-backed data verification</li>
                <li>Full crop traceability from farm to consumer</li>
                <li>Improved trust and transparency in agriculture</li>
              </ul>

              <h4 className="section-title">🎯 Our Mission</h4>
              <p className="about-text">
                To build a smarter, safer, and more transparent agricultural ecosystem using advanced
                technology — empowering farmers, informing consumers, and supporting sustainable farming
                practices.
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default About
