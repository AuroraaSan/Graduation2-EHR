import React, { useState } from 'react';
import PatientNavbar from '../Navbar/PatientNavbar';

const RequestDataAddition: React.FC = () => {
  const [dataType, setDataType] = useState('');
  const [customDataType, setCustomDataType] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDataType = dataType === 'Other' ? customDataType : dataType;
    console.log({ dataType: finalDataType, issuedDate, description, file });
  };

  const handleRemoveFile = () => {
    setFile(null);
    console.log("File removed");
  };

  return (
    <div>
      <PatientNavbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl text-blue-600 font-bold mb-6">Request Data Addition</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Type <span className="text-red-500">*</span>
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="block w-2/5 p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-300 bg-white text-gray-700"
              required
            >
              <option value="">Select a data type</option>
              <option value="Lab Results">Lab Results</option>
              <option value="Prescription">Prescription</option>
              <option value="Medical History">Medical History</option>
              <option value="Imaging Reports">Imaging Reports</option>
              <option value="Vaccination Records">Vaccination Records</option>
              <option value="Other">Other</option>
            </select>
            {dataType === 'Other' && (
              <input
                type="text"
                value={customDataType}
                onChange={(e) => setCustomDataType(e.target.value)}
                placeholder="Specify data type"
                className="block w-2/5 p-3 mt-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-300 bg-white text-gray-700"
                required
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issued Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
              className="block w-2/5 p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-300 bg-white text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type here (optional)"
              className="block w-2/5 p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-300 bg-white text-gray-700 resize-none h-40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File<span className="text-red-500">*</span></label>
            <div className="mt-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Choose File
              </label>
              {file && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
            
               )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 px-7 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDataAddition;