import { useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientNavbar from '../Navbar/PatientNavbar';

const ExaminationsDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Complains');
  const { id } = useParams();
  const location = useLocation();
  const { type } = location.state || {}; 
  const [data, setData] = useState({
    complains: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get('http://localhost:3001/api/hospitals');
        const mockData = {
          complains: 'Severe recurring headache, lasting from 4 to 7 hours.',
          diagnosis: 'Migraine',
          symptoms: 'Fatigue, mood changes, sensitive to light',
          treatment: 'Anti Emetics',
          notes: 'Patient should have rest for at least 6 hours a day',
        };
        setData(mockData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div>
      <PatientNavbar />
      <div className="p-8">
    <h2 className="text-3xl text-blue-600 mb-6"> A prescription of a Cardiology Examination </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex space-x-4 border-b mb-4">
            {['Complains', 'Diagnosis', 'Symptoms', 'Treatment and Medication', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                {activeTab === 'Complains' && <div>{data.complains}</div>}
                {activeTab === 'Diagnosis' && <div>{data.diagnosis}</div>}
                {activeTab === 'Symptoms' && <div>{data.symptoms}</div>}
                {activeTab === 'Treatment and Medication' && <div>{data.treatment}</div>}
                {activeTab === 'Notes' && <div>{data.notes}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationsDetails;