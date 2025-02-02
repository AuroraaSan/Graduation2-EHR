import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/AdminNavbar';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  email: string;
}

const AddAdmission: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patient_id, setpatient_id] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(5); // Number of doctors per page

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/admin/doctors', { withCredentials: true });
        console.log('API Response:', response.data); // Log the response

        // Ensure response.data.doctors exists before setting it
        if (response.data && response.data.doctors) {
          setDoctors(response.data.doctors);
        } else {
          setError('No doctors found in the response');
        }
      } catch (err) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors ? doctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddPatient = async (doctor_id: string) => {
    if (patient_id) {
      try {
        console.log('Adding patient:', { patient_id, doctor_id });

        const response = await axios.post(
          'http://localhost:3000/api/user/admin/admission',
          {
            patient_id,
            doctor_id,
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          alert('Patient added to doctor successfully');
        } else {
          alert('Failed to add patient to doctor: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error adding patient to doctor:', error);
        alert('Failed to add patient to doctor');
      }
    } else {
      alert('Please enter a Patient ID');
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
          value={patient_id}
          onChange={(e) => setpatient_id(e.target.value)}
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
                <th className="border-b py-2">Doctor Name</th>
                <th className="border-b py-2">Add Patient to Doctor</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="border-b py-2">{doctor.id}</td>
                  <td className="border-b py-2">{doctor.specialization}</td>
                  <td className="border-b py-2">{doctor.full_name}</td>
                  <td className="border-b py-2">
                    <button
                      onClick={() => handleAddPatient(doctor.id)}
                      disabled={!patient_id}
                      className={`px-4 py-2 rounded-lg ${
                        patient_id ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
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
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-700 hover:text-blue-600 disabled:text-gray-300"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-700 hover:text-blue-600 disabled:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmission;