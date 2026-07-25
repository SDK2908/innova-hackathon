import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/upload.css";
import { uploadCSV } from "../services/api";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.name.endsWith(".csv")) {
      setSelectedFile(file);
      setMessage("");
    } else {
      setSelectedFile(null);
      setMessage("Please upload only CSV files.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a CSV file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Generate a unique user ID for this upload
      const userId = crypto.randomUUID();

      // Upload CSV to backend
      const response = await uploadCSV(selectedFile, userId);

      // Save userId for dashboard requests
      localStorage.setItem("userId", response.userId);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>Subscription Leak Detector</h1>

        <p>
          Upload your transaction CSV to detect hidden subscriptions,
          recurring payments, and subscription leaks.
        </p>

        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          <h2>📂 Upload CSV File</h2>

          <p>
            {selectedFile
              ? selectedFile.name
              : "Click here to browse your CSV file"}
          </p>

          <input
            type="file"
            accept=".csv"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {selectedFile && (
          <div className="selected-file">
            ✅ {selectedFile.name}
          </div>
        )}

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing Transactions..." : "Analyze Transactions"}
        </button>
      </div>
    </div>
  );
}

export default Upload;