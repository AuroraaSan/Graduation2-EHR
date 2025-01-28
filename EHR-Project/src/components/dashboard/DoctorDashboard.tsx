import React from 'react';
import { Toaster } from "react-hot-toast";
import { NavLink } from 'react-router-dom';
import DoctorNavbar from '../Navbar/DoctorNavbar';

const DoctorDashboard: React.FC = () => (
  <div>
  <DoctorNavbar />
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-3xl">
      <h2 className="text-4xl lg:text-6xl text-center text-blue-700 my-5">
        <span className="block">Welcome to</span>
        <span className="block">Electronic Health Record System</span>
      </h2>

      <div className="mt-4 text-center flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0 sm:space-x-4">
        <NavLink 
          to="/AddPatient"
          className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
        >
          Add Patient
        </NavLink>
        <NavLink
          to="/AiHistory"
          className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
        >
          Generate History Summary
        </NavLink>
        <NavLink
          to="#"
          className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
        >
          Add New Examination
        </NavLink>
      </div>

      {/* React Hot Toast notifications */}
      <Toaster position="top-center" />
    </div>
  </div>
  </div>
);

export default DoctorDashboard;
