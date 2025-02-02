import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientNavbar from '../Navbar/PatientNavbar';

interface Hospital {  
  id: string; 
  name: string;
  address: string;
  phone_number: string;  
  email: string;
  photo_url: string;
}

const Hospitals: React.FC = () => {  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/patient/hospitals',{withCredentials: true});
        console.log(response.data);
        setHospitals(response.data.hospitals);  
      } catch (err) {
        setError('Failed to load hospitals');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <PatientNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">List of Hospitals</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredHospitals.length} Hospitals
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
                <th className="border-b py-2">Hospital Name</th>
                <th className="border-b py-2">Address</th>
                <th className="border-b py-2">Phone Number</th>
                <th className="border-b py-2">Email</th>
                <th className="border-b py-2">Photo</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.id}>
                  <td className="border-b py-2">{hospital.name}</td>
                  <td className="border-b py-2">{hospital.address}</td>
                  <td className="border-b py-2">{hospital.phone_number}</td>  {/* Updated to match backend */}
                  <td className="border-b py-2">{hospital.email}</td>
                  <td className="border-b py-2">
                    <img src={hospital} alt="hospital" className="w-20 h-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;