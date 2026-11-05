
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore prediction history from browser storage
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("predictionHistory")) || [];
    } catch {
      return [];
    }
  });

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("predictionHistory", JSON.stringify(history));
  }, [history]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please select a JPG or PNG image.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload a chest X-ray image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed.");
      }

      setResult(data);

      const newRecord = {
        id: `${Date.now()}-${Math.random()}`,
        filename: data.filename,
        prediction: data.prediction,
        confidence: data.confidence,
        pneumonia_probability: data.pneumonia_probability,
        timestamp: new Date().toLocaleString(),
      };

      setHistory((previous) => [newRecord, ...previous].slice(0, 20));

    } catch (err) {
      setError(err.message || "Unable to connect to FastAPI.");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const normalProbability = result
    ? Math.max(0, 100 - result.pneumonia_probability)
    : 0;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <h2>Balaji Krishnamoorthy's MedVision AI</h2>
            <span>Medical Image Intelligence</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI System Online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">AI-POWERED MEDICAL IMAGING</span>
          <h1>Chest X-Ray Analysis</h1>
          <p>
            Upload a chest X-ray image and let our MobileNetV2
            model analyze it for NORMAL or PNEUMONIA classification.
          </p>
        </section>

        <div className="dashboard">
          {/* Upload Section */}
          <section className="panel upload-panel">
            <div className="panel-heading">
              <div>
                <h2>Upload X-Ray</h2>
                <p>Select a chest X-ray image for analysis.</p>
              </div>
              <span className="step">01</span>
            </div>

            <label className="upload-area">
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded chest X-ray"
                  className="preview-image"
                />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">↑</div>
                  <h3>Upload your X-ray image</h3>
                  <p>Click here to browse JPG or PNG files</p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {image && (
              <div className="file-info">
                <span>📄 {image.name}</span>
                <button onClick={resetUpload}>Remove</button>
              </div>
            )}

            <button
              className="predict-button"
              onClick={handlePredict}
              disabled={!image || loading}
            >
              {loading ? "Analyzing X-Ray..." : "Analyze X-Ray →"}
            </button>

            {error && <div className="error">{error}</div>}
          </section>

          {/* Result Section */}
          <section className="panel result-panel">
            <div className="panel-heading">
              <div>
                <h2>Analysis Result</h2>
                <p>Model prediction and probability scores.</p>
              </div>
              <span className="step">02</span>
            </div>

            {!result && !loading && (
              <div className="empty-result">
                <div className="result-icon">◎</div>
                <h3>Awaiting Analysis</h3>
                <p>
                  Upload an X-ray and click Analyze to see
                  the model's prediction.
                </p>
              </div>
            )}

            {loading && (
              <div className="empty-result">
                <div className="loader"></div>
                <h3>Analyzing Image</h3>
                <p>MobileNetV2 is processing your X-ray.</p>
              </div>
            )}

            {result && (
              <div className="prediction-result">
                <span className="result-label">PREDICTED CLASS</span>

                <h1
                  className={
                    result.prediction === "NORMAL"
                      ? "normal"
                      : "pneumonia"
                  }
                >
                  {result.prediction}
                </h1>

                <div className="confidence">
                  <div className="confidence-heading">
                    <span>Prediction confidence</span>
                    <strong>{result.confidence}%</strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="probability-section">
                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Normal probability</span>
                      <strong>{normalProbability.toFixed(2)}%</strong>
                    </div>
                    <div className="progress normal-progress">
                      <div
                        className="progress-fill"
                        style={{ width: `${normalProbability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Pneumonia probability</span>
                      <strong>{result.pneumonia_probability}%</strong>
                    </div>
                    <div className="progress pneumonia-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${result.pneumonia_probability}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button className="reset-button" onClick={resetUpload}>
                  Analyze Another Image
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Prediction History */}
        <section className="panel history-panel">
          <div className="panel-heading">
            <div>
              <h2>Prediction History</h2>
              <p>Your recent image classification results.</p>
            </div>

            <div className="history-actions">
              <span className="history-count">{history.length} records</span>
              {history.length > 0 && (
                <button className="clear-history" onClick={clearHistory}>
                  Clear History
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              No predictions yet. Your analysis history will appear here.
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div className="history-row" key={item.id}>
                  <div className="history-file">
                    <span className="history-file-icon">▧</span>
                    <div>
                      <strong>{item.filename}</strong>
                      <small>{item.timestamp}</small>
                    </div>
                  </div>

                  <span
                    className={`history-result ${
                      item.prediction === "NORMAL"
                        ? "normal-badge"
                        : "pneumonia-badge"
                    }`}
                  >
                    {item.prediction}
                  </span>

                  <strong className="history-confidence">
                    {item.confidence}%
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="disclaimer">
          <strong>Important:</strong> This is an educational AI project,
          not a medical diagnostic tool. Predictions must not replace
          professional medical evaluation.
        </div>
      </main>

      <footer>
        <p>MedVision AI · Powered by FastAPI and MobileNetV2</p>
      </footer>
    </div>
  );
}

export default App;
