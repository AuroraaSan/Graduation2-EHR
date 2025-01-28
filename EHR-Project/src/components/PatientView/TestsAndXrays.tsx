import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientNavbar from '../Navbar/PatientNavbar';

const TestsAndXrays: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = 1;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        //const response = await axios.get('#');
        //setResults(response.data);
        const mockData = [
          {
            id: 1,
            date: '25 Dec',
            visitNumber: '452455555845',
            status: 'Completed',
          },
          {
            id: 2,
            date: '25 Dec',
            visitNumber: '452455555846',
            status: 'In Progress',
          },
        ];
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setResults(mockData);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId]);

  const viewDetails = (id: number) => {
    console.log('Viewing details for:', id);
  };

  return (
    <div>
      <PatientNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Results</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-end mb-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sort
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2">Date</th>
                  <th className="border-b py-2">Visit No.</th>
                  <th className="border-b py-2">Status</th>
                  <th className="border-b py-2"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="border-b py-2">{result.date}</td>
                    <td className="border-b py-2">{result.visitNumber}</td>
                    <td
                      className={`border-b py-2 ${
                        result.status === 'Completed'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {result.status}
                    </td>
                    <td className="border-b py-2">
                      <button
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={() => viewDetails(result.id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsAndXrays;