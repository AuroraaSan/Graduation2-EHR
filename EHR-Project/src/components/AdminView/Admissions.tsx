import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import AdminNavbar from '../Navbar/AdminNavbar';
import { NavLink } from 'react-router-dom';

interface Admission {
  id: string;
  patient_id: string;
  patient_name: string; 
  doctor_id: string;
  createdAt: string;
  updatedAt: string;
  discharge_date: string;
  doctor_name: string;
}

const Admissions: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        // Simulate fetching data from an API
        const response = await axios.get('http://localhost:3000/api/user/admin/admissions', { withCredentials: true });
        setAdmissions(response.data); // Assuming the response data is in the correct format
      } catch (err) {
        setError('Failed to load Admissions');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  const handleDischarge = async (id: string) => {
    try {
      const updatedAdmissions = admissions.map(admission =>
        admission.id === id ? { ...admission, discharge_date: new Date().toLocaleDateString() } : admission
      );
      setAdmissions(updatedAdmissions);
      const updatedAdmission = updatedAdmissions.find(admission => admission.id === id);

      if (!updatedAdmission) {
        throw new Error("Admission not found");
      }

      const response = await axios.put(
        `http://localhost:3000/api/user/admin/patient/${updatedAdmission.patient_id}/discharge`,
        { discharge_date: updatedAdmission.discharge_date },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to update discharge date on the server');
      }

      console.log('Discharge date updated successfully');
    } catch (error) {
      console.error('Error updating discharge date:', error);
    }
  };

  const filteredAdmissions = admissions.filter(admission =>
    admission.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmissions = filteredAdmissions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format to a readable date
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Admissions</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredAdmissions.length} Admissions
            </span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Export
              </button>
              <NavLink to="/AddAdmission">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  + Add new admission
                </button>
              </NavLink>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <button className="ml-2 text-gray-700 hover:text-blue-600">Filters</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">#</th> {/* Changed to show numbering */}
                <th className="border-b py-2">Patient Name</th> {/* Changed to show patient name */}
                <th className="border-b py-2">Date</th>
                <th className="border-b py-2">Discharge Date</th>
                <th className="border-b py-2">Doctor Name</th>
                <th className="border-b py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmissions.map((admission, index) => (
                <tr key={admission.id}>
                  <td className="border-b py-2">{indexOfFirstItem + index + 1}</td> {/* Numbering */}
                  <td className="border-b py-2">{admission.patient_name}</td> {/* Show patient name */}
                  <td className="border-b py-2">{formatDate(admission.createdAt)}</td> {/* Formatted date */}
                  <td className="border-b py-2">
                    {admission.discharge_date ? formatDate(admission.discharge_date) : 'Not Discharged'}
                  </td>
                  <td className="border-b py-2">{admission.doctor_name}</td>
                  <td className="border-b py-2">
                    {!admission.discharge_date && (
                      <button
                        onClick={() => handleDischarge(admission.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Discharge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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

export default Admissions;