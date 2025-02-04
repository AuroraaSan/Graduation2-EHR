import React, { useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/DoctorNavbar';

interface PatientData {
  _id: string;
  patient_id: string;
  medical_conditions: string[];
  allergies: string[];
  medications: string[];
  surgeries: string[];
  visits: string[];
  blood_type: string;
  weight: number;
  height: number;
}

const Emergency: React.FC = () => {
  const [nationalId, setNationalId] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First request to get the patient ID
      const userResponse = await axios.get(`http://localhost:3000/api/user/doctor/patient/${nationalId}`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json'
      }});

      const patientId = userResponse.data.data.patient.id;

      if (!patientId) throw new Error('Patient ID not found');

      console.log('Patient ID:', patientId);

      // Second request to get the patient's medical data
      const medicalResponse = await axios.get(`http://localhost:3001/api/records/patient/medical-records/${patientId}`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json'
      }});

      setPatientData(medicalResponse.data?.data.patient);
    } catch (err) {
      setError('Failed to load patient data. Please try again later.');
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Emergency Patient Data</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter National ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchPatientData}
              disabled={!nationalId || loading}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                nationalId && !loading ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Fetching Data...' : 'Fetch Data'}
            </button>
          </div>

          {error && <div className="text-red-500 mt-4">{error}</div>}

          {patientData && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Patient Details</h3>
              <div className="space-y-2">
                <p><strong>Blood Type:</strong> {patientData.blood_type}</p>
                <p><strong>Weight:</strong> {patientData.weight} kg</p>
                <p><strong>Height:</strong> {patientData.height} cm</p>
                <p><strong>Medical Conditions:</strong> {patientData.medical_conditions.length > 0 ? patientData.medical_conditions.join(', ') : 'None'}</p>
                <p><strong>Allergies:</strong> {patientData.allergies.length > 0 ? patientData.allergies.join(', ') : 'None'}</p>
                <p><strong>Medications:</strong> {patientData.medications.length > 0 ? patientData.medications.join(', ') : 'None'}</p>
                <p><strong>Surgeries:</strong> {patientData.surgeries.length > 0 ? patientData.surgeries.join(', ') : 'None'}</p>
                <p><strong>Visits:</strong> {patientData.visits.length > 0 ? patientData.visits.join(', ') : 'None'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emergency;
