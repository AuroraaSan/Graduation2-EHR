import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DoctorNavbar from '../Navbar/DoctorNavbar';

const AiHistory: React.FC = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [responseData, setResponseData] = useState<any>(null); // Store the entire response
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateHistory = async () => {
    if (!patientId) {
      toast.error("Please enter a valid Patient ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/records/ai/gen-summary/${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debugging: Log the API response

        if (data) {
          setResponseData(data); // Store the entire response
          toast.success("History generated successfully!");
        } else {
          toast.error("No data found in the response");
        }
      } else {
        toast.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("An error occurred while fetching history");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DoctorNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl lg:text-6xl text-center text-blue-700 my-5">
            <span className="block">Generate Summary for Patient History</span>
          </h2>

          {/* Input field and button for generating history */}
          <div className="mt-8">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleGenerateHistory}
                  disabled={isLoading}
                  className="p-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isLoading ? 'Generating...' : 'Generate History'}
                </button>
              </div>
            </div>

            {/* Display the entire API response */}
            {responseData && (
              <div className="mt-8">
                <h3 className="text-2xl text-blue-700 mb-4">API Response</h3>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(responseData.medical_history, null, 2)} {/* Pretty-print JSON */}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* React Hot Toast notifications */}
          <Toaster position="top-center" />
        </div>
      </div>
    </div>
  );
};

export default AiHistory;