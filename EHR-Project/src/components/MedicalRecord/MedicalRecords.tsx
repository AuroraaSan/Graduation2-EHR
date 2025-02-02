import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DoctorNavbar from '../Navbar/DoctorNavbar';

type MedicalRecord = {
  id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
};

const MedicalRecords: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch medical records from the backend
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/patient/medical-records/');
        if (response.status === 200) {
          setMedicalRecords(response.data);
        } else {
          toast.error('Failed to fetch medical records.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching medical records.');
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleViewDetails = (recordId: string) => {
    // Redirect to the details page
    navigate(`/medical-records/${recordId}`);
  };

  return (
    <div>
    <DoctorNavbar />
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="p-8 space-y-8">
          <h2 className="text-3xl text-center text-black-900 my-5">Medical Records</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">Medical Record ID</th>
                <th className="p-3 border border-gray-300">Patient ID</th>
                <th className="p-3 border border-gray-300">Doctor</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300 text-center">{record.id}</td>
                  <td className="p-3 border border-gray-300 text-center">{record.patient_id}</td>
                  <td className="p-3 border border-gray-300 text-center">{record.doctor_id}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      type="button"
                      className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
                      onClick={() => handleViewDetails(record.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MedicalRecords;