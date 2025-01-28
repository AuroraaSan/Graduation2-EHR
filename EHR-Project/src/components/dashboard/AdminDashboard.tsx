import React from 'react';
import { NavLink } from 'react-router-dom';
import AdminNavbar from '../Navbar/AdminNavbar'; 

const AdminDashboard: React.FC = () => (
  <div>
    <AdminNavbar />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-14 w-full max-w-3xl">
        <h2 className="text-4xl lg:text-6xl text-center text-blue-700 my-3">
          <span className="block">WELCOME TO THE</span>
          <span className="block">EHR PROJECT!</span>
        </h2>

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0 sm:space-x-4">
          <NavLink
            to="/AddPatient"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
          >
            Add Patients
          </NavLink>
          <NavLink
            to="/Admissions"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
          >
            Admissions & Discharges
          </NavLink>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;