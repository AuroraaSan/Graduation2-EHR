import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientNavbar from '../Navbar/PatientNavbar';

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Allergies');
  const [data, setData] = useState({
    Allergies: '',
    Chronic_conditions: '',
    Surgeries: '',
    Current_medications: '',
    Immunizations: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData = {
          Allergies: 'Patient has a history of headaches.',
          Chronic_conditions: 'Migraine',
          Surgeries: 'Headache, nausea, light sensitivity',
          Current_medications: 'Prescribed pain relievers and rest',
          Immunizations: 'Patient advised to avoid stress',
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
        <h2 className="text-3xl text-blue-600 mb-6">History details</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex space-x-4 border-b mb-4">
            {['Allergies', 'Chronic conditions', 'Surgeries', 'Current medications', 'Immunizations'].map
            ((tab) => (
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
                {activeTab === 'Allergies' && <div>{data.Allergies}</div>}
                {activeTab === 'Chronic conditions' && <div>{data.Chronic_conditions}</div>}
                {activeTab === 'Surgeries' && <div>{data.Surgeries}</div>}
                {activeTab === 'Current medications' && <div>{data.Current_medications}</div>}
                {activeTab === 'Immunizations' && <div>{data.Immunizations}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;