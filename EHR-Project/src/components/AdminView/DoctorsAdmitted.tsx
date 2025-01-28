import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/AdminNavbar';

interface Doctor {
  id: number;
  full_name: string;
  specialization: string;
  email:string;
}

const AdmittedDoctors: React.FC = () => {
  const [Doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/admin/doctors', {withCredentials: true});
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load Doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /*const filteredDoctors = Doctors.filter(Doctor =>
    Doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );*/

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Admitted Doctors</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">

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
                <th className="border-b py-2">Doctor ID</th>
                <th className="border-b py-2">Name</th>
                <th className="border-b py-2">Admission Date</th>
                <th className="border-b py-2">Doctor Name</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmittedDoctors;