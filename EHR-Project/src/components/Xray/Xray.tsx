import { useState } from "react";
import axios from "axios";
import DoctorNavbar from "../Navbar/DoctorNavbar";

const XRayUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePatientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatientId(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientId) return;

    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("patient_id", patientId);

    try {
      const response = await axios.post("http://127.0.0.1:8000/classify-xray/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, 
      });

      setResult(response.data.classification || "No classification result found.");
      console.log(response);
    } catch (error) {
      setResult("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DoctorNavbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload X-ray Image</h2>

        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={handlePatientIdChange}
          className="mb-4 w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full border p-2 rounded"
        />

        {preview && (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover mb-4 rounded-md border" />
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || !patientId || loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Classify X-ray"}
        </button>

        {result && <p className="mt-4 p-3 bg-gray-100 border rounded">{result}</p>}
      </div>
    </div>
    </div>
  );
};

export default XRayUploader;