import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const AdminNavbar: React.FC = () => (
  <nav className="flex justify-start items-center p-4 border-b border-gray-200">
    <NavLink to="/AdminDashboard" className="text-blue-600 font-bold text-lg mr-8">
      EHR PROJECT
    </NavLink>
    <div className="flex space-x-6">
      <NavLink to="/PatientsAdmitted" className="text-gray-700 hover:text-blue-600">
        Patients Admitted
      </NavLink>
      <NavLink to="/DoctorsAdmitted" className="text-gray-700 hover:text-blue-600">
        Doctors Admitted
      </NavLink>
      <NavLink to="/Admissions" className="text-gray-700 hover:text-blue-600">
        Admissions and Discharges
      </NavLink>
    </div>
    <div className="flex items-center space-x-4 ml-auto">
      <FaBell className="text-gray-700 hover:text-blue-600 cursor-pointer" />
      <span className="text-gray-700">Admin</span>
      <img
        src="profile-placeholder.png"
        alt="User Profile"
        className="w-7 h-7 rounded-full"
      />
    </div>
  </nav>
);

export default AdminNavbar;