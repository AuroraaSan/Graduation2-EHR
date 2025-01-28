import React, { useState, useEffect } from 'react';
import AdminNavbar from '../Navbar/AdminNavbar';
import { NavLink } from 'react-router-dom';

interface Admission {
  id: number;
  patient_id: string;
  doctor_id: string;
  created_at: string;
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

  // Mock data for admissions
  const mockAdmissions: Admission[] = [
    { id: 1, patient_id: 'John Doe',doctor_id:"", created_at: "2023/10/01", discharge_date: '', doctor_name: 'Dr. Smith' },
    { id: 2, patient_id: 'Jane Doe',doctor_id:"", created_at: '2023-10-02', discharge_date: '2023-10-05', doctor_name: 'Dr. Johnson' },
    { id: 3, patient_id: 'Alice Smith',doctor_id:"", created_at: '2023-10-03', discharge_date: '', doctor_name: 'Dr. Brown' },
    { id: 4, patient_id: 'Bob Johnson',doctor_id:"", created_at: '2023-10-04', discharge_date: '', doctor_name: 'Dr. White' },
    { id: 5, patient_id: 'Charlie Brown',doctor_id:"", created_at: '2023-10-05', discharge_date: '2023-10-07', doctor_name: 'Dr. Green' },
    { id: 6, patient_id: 'David Wilson',doctor_id:"", created_at: '2023-10-06', discharge_date: '', doctor_name: 'Dr. Black' },
    { id: 7, patient_id: 'Eva Green',doctor_id:"", created_at: '2023-10-07', discharge_date: '', doctor_name: 'Dr. Blue' },
    { id: 8, patient_id: 'Frank White',doctor_id:"", created_at: '2023-10-08', discharge_date: '2023-10-10', doctor_name: 'Dr. Red' },
    { id: 9, patient_id: 'Grace Black',doctor_id:"", created_at: '2023-10-09', discharge_date: '', doctor_name: 'Dr. Yellow' },
    { id: 10, patient_id: 'Hank Blue',doctor_id:"", created_at: '2023-10-10', discharge_date: '', doctor_name: 'Dr. Purple' },
  ];
  

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setAdmissions(mockAdmissions);
      setLoading(false);
    }, 1000); // Simulate a 1-second delay
  }, []);

  const handleDischarge = (id: number) => {
    setAdmissions(admissions.map(admission =>
      admission.id === id ? { ...admission, dischargeDate: new Date().toLocaleDateString() } : admission
    ));
  };

  const filteredAdmissions = admissions.filter(admission =>
    admission.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmissions = filteredAdmissions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);

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
              <NavLink to="/AddAdmissions">
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
                <th className="border-b py-2">Admission ID</th>
                <th className="border-b py-2">Patient Name</th>
                <th className="border-b py-2">Date</th>
                <th className="border-b py-2">Discharge Date</th>
                <th className="border-b py-2">Doctor Name</th>
                <th className="border-b py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmissions.map((admission) => (
                <tr key={admission.id}>
                  <td className="border-b py-2">{admission.id}</td>
                  <td className="border-b py-2">{admission.patient_id}</td>
                  <td className="border-b py-2">{admission.created_at}</td>
                  <td className="border-b py-2">
                    {admission.discharge_date || 'Not Discharged'}
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