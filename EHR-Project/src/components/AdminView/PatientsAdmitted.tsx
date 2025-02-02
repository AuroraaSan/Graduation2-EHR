import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/AdminNavbar';

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

const AdmittedPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Mock data for patients
        const mockPatients: Patient[] = [
          { id: 'P001', full_name: 'John Doe', email: 'john.doe@example.com', phone_number: '123-456-7890' },
          { id: 'P002', full_name: 'Jane Smith', email: 'jane.smith@example.com', phone_number: '234-567-8901' },
          { id: 'P003', full_name: 'Alice Johnson', email: 'alice.johnson@example.com', phone_number: '345-678-9012' },
          { id: 'P004', full_name: 'Bob Brown', email: 'bob.brown@example.com', phone_number: '456-789-0123' },
          { id: 'P005', full_name: 'Charlie Davis', email: 'charlie.davis@example.com', phone_number: '567-890-1234' },
        ];
        setPatients(mockPatients);
      } catch (err) {
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Admitted Patients</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredPatients.length} Patients
            </span>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Patient ID</th>
                <th className="border-b py-2">Name</th>
                <th className="border-b py-2">E-mail</th>
                <th className="border-b py-2">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="border-b py-2">{patient.id}</td>
                  <td className="border-b py-2">{patient.full_name}</td>
                  <td className="border-b py-2">{patient.email}</td>
                  <td className="border-b py-2">{patient.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmittedPatients;