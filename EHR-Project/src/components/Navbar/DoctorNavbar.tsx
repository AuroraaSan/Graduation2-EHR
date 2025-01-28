import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

// Doctor Navbar Component
const DoctorNavbar: React.FC = () => (
  <nav className="flex justify-start items-center p-4 border-b border-gray-200">
    <NavLink to="/PatientDashboard" className="text-blue-600 font-bold text-lg mr-8">
      EHR PROJECT
    </NavLink>
    <div className="flex space-x-6">
      <NavLink to="#" className="text-gray-700 hover:text-blue-600">
        Patients
      </NavLink>
      <NavLink to="#" className="text-gray-700 hover:text-blue-600">
        Generate History
      </NavLink>
      <NavLink to="#" className="text-gray-700 hover:text-blue-600">
        Create new medical record
      </NavLink>
      <NavLink to="#" className="text-gray-700 hover:text-blue-600">
        Lab Results
      </NavLink>
    </div>
    <div className="flex items-center space-x-4 ml-auto">
      <FaBell className="text-gray-700 hover:text-blue-600 cursor-pointer" />
      <span className="text-gray-700">username</span>
      <img
        src="profile-placeholder.png"
        alt="User Profile"
        className="w-7 h-7 rounded-full"
      />
    </div>
  </nav>
);

export default DoctorNavbar;