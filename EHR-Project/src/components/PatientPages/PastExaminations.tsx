import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import PatientNavbar from '../Navbar/PatientNavbar';

interface Examination {
  id: number;
  type: string;
  date: string;
  doctor: string;
}

const PastExaminations: React.FC = () => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [filteredExaminations, setFilteredExaminations] = useState<Examination[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const examinationsPerPage = 10;

  useEffect(() => {
    const fetchExaminations = async () => {
      setLoading(true);
      setError(null);
      try {
        const mockData: Examination[] = [
          { id: 1, type: 'General Checkup', date: '2023-10-01', doctor: 'Dr. Smith' },
        { id: 2, type: 'Blood Test', date: '2023-09-15', doctor: 'Dr. Johnson' },
        { id: 3, type: 'X-Ray', date: '2023-08-20', doctor: 'Dr. Williams' },
        { id: 4, type: 'MRI Scan', date: '2023-07-10', doctor: 'Dr. Brown' },
        { id: 5, type: 'Ultrasound', date: '2023-06-05', doctor: 'Dr. Davis' },
        ];
        /*const response = await axios.get("http://localhost:3001/api/patient/visits", {
          withCredentials: true,
        });*/
        setExaminations(mockData);
        setFilteredExaminations(mockData);
      } catch (error) {
        setError('Failed to fetch examinations.');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExaminations();
  }, []);

  useEffect(() => {
    const filtered = examinations.filter((exam) =>
      exam.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExaminations(filtered);
    setCurrentPage(1);
  }, [searchQuery, examinations]);

  const indexOfLastExamination = currentPage * examinationsPerPage;
  const indexOfFirstExamination = indexOfLastExamination - examinationsPerPage;
  const currentExaminations = filteredExaminations.slice(indexOfFirstExamination, indexOfLastExamination);

  const totalPages = Math.ceil(filteredExaminations.length / examinationsPerPage);

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

  const handleExport = () => {
    const headers = ["ID", "Type", "Date", "Doctor"];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      filteredExaminations
        .map((exam) => `${exam.id},${exam.type},${exam.date},${exam.doctor}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "examinations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <PatientNavbar />
      <div className="p-8">
        <h2 className="text-3xl text-blue-600 mb-6">Past Examinations</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filteredExaminations.length} Examinations
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="text-gray-700 hover:text-blue-600"
              >
                Export
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Request Examination
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search by type or doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b py-2">Examination ID</th>
                <th className="border-b py-2">Examination Type</th>
                <th className="border-b py-2">Date</th>
                <th className="border-b py-2">Doctor Name</th>
                <th className="border-b py-2"></th>
              </tr>
            </thead>
            <tbody>
              {currentExaminations.map((exam) => (
                <tr key={exam.id}>
                  <td className="border-b py-2">{exam.id}</td>
                  <td className="border-b py-2">{exam.type}</td>
                  <td className="border-b py-2">{new Date(exam.date).toLocaleDateString()}</td>
                  <td className="border-b py-2">{exam.doctor}</td>
                  <td className="border-b py-2">
                    <NavLink
                      to="/ExaminationsDetails"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg border border-black hover:bg-green-700"
                    >
                      Explore
                    </NavLink>
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

export default PastExaminations;