import React from 'react';
import { NavLink } from 'react-router-dom';
import PatientNavbar from '../Navbar/PatientNavbar';

const PatientDashboard: React.FC = () => (
  <div>
    <PatientNavbar />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-14 w-full max-w-3xl">
        <h2 className="text-4xl lg:text-6xl text-center text-blue-700 my-3">
          <span className="block">WELCOME TO OUR</span>
          <span className="block">EHR PROJECT!</span>
        </h2>

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0 sm:space-x-4">
          <NavLink 
            to="/PastExaminations"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"> Past Examinations
          </NavLink>
          <NavLink
            to="#"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"> Schedule A Visit
          </NavLink>
          <NavLink
            to="/RequestAddition"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"> Request Data Addition
          </NavLink>
          <NavLink
            to="/TestsAndXrays"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"> Medical Tests And X-Rays
          </NavLink>
          <NavLink
            to="/PatientsAdmitted"
            className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"> Patients
          </NavLink>
        </div>
      </div>
    </div>
  </div>
);

export default PatientDashboard;
