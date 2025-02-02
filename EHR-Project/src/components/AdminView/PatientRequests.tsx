import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Navbar/AdminNavbar';

interface Request {
  reqid: number;
  name: string;
  issuedDate: string;
  description: string;
  dataDate: string;
  status: string;
}

const PatientRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // const response = await axios.get('http://localhost:3001/api/requests');
        const mockData: Request[] = [
          { reqid: 1, name: 'John Doe', issuedDate: '2023-10-01', description: 'Heart Checkup', dataDate: '2023-10-01', status: 'Pending' },
          { reqid: 2, name: 'Jane Smith', issuedDate: '2023-09-15', description: 'Blood Test', dataDate: '2023-09-15', status: 'Accepted' },
          { reqid: 3, name: 'Alice Johnson', issuedDate: '2023-08-20', description: 'X-Ray', dataDate: '2023-08-20', status: 'Rejected' }
        ];
        setRequests(mockData);
        setFilteredRequests(mockData);
      } catch (err) {
        setError('Failed to load requests');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, []);
  useEffect(() => {
    const filtered = requests.filter((request) =>
      request.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchQuery, requests]);

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSend = (reqid: number) => {
    const request = requests.find(req => req.reqid === reqid);
    if (request && request.status === 'Pending') {
      console.log(`Send request with ID: ${reqid}`);
    } else {
      console.log(`Request with ID: ${reqid} cannot be sent for review.`);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Patient Data Addition Requests</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredRequests.length} Requests
            </span>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <button className="text-gray-700 hover:text-blue-600">Filters</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Request ID</th>
                <th className="border-b py-2">Patient Name</th>
                <th className="border-b py-2">Issued Date</th>
                <th className="border-b py-2">Description</th>
                <th className="border-b py-2">Data Date</th>
                <th className="border-b py-2">Status</th>
                <th className="border-b py-2">Send to Review</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request.reqid}>
                  <td className="border-b py-2">{request.reqid}</td>
                  <td className="border-b py-2">{request.name}</td>
                  <td className="border-b py-2">{request.issuedDate}</td>
                  <td className="border-b py-2">{request.description}</td>
                  <td className="border-b py-2">{request.dataDate}</td>
                  <td className={`border-b py-2 ${
                    request.status === 'Accepted' ? 'text-green-500' :
                    request.status === 'Rejected' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {request.status}
                  </td>
                  <td className="border-b py-2">
                    {request.status === 'Pending' && (
                      <button
                        onClick={() => handleSend(request.reqid)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Send to Review
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
                onClick={handlePrevious}
                className="text-gray-700 hover:text-blue-600"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="text-gray-700 hover:text-blue-600"
                disabled={currentPage === totalPages}
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

export default PatientRequests;