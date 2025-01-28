import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/AdminNavbar';

interface Doctor {
  patien_id: string;
  doctor_id:string;
}

const AddPatientToDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patientId, setPatientId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (doctorId: string) => {
    if (patientId) {
      console.log(`Adding patient ${patientId} to doctor ${doctorId}`);
      // Implement the logic to add the patient to the doctor
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Patient ID:</h2>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-6 w-full"
        />
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredDoctors.length} Doctors
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Doctor ID</th>
                <th className="border-b py-2">Examination Type</th>
                <th className="border-b py-2">Date</th>
                <th className="border-b py-2">Doctor Name</th>
                <th className="border-b py-2">Add Patient to Doctor</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="border-b py-2">{doctor.id}</td>
                  <td className="border-b py-2">{doctor.examinationType}</td>
                  <td className="border-b py-2">{doctor.date}</td>
                  <td className="border-b py-2">{doctor.name}</td>
                  <td className="border-b py-2">
                    <button
                      onClick={() => handleAddPatient(doctor.id)}
                      disabled={!patientId}
                      className={`px-4 py-2 rounded-lg ${
                        patientId ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span>Page 1 of 10</span>
            <div className="flex space-x-2">
              <button className="text-gray-700 hover:text-blue-600">Previous</button>
              <button className="text-gray-700 hover:text-blue-600">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientToDoctor;
