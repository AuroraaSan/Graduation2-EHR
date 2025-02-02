import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useUser } from "../UserContext";
import examinationImage from './examination.png'; // Import the image

const PatientNavbar: React.FC = () => {
  const { user } = useUser();

  // Handle the case when user is null or undefined
  const userName = user ? user.name : 'Guest';

  return (
    <nav className="flex justify-start items-center p-4 border-b border-gray-200">
      <div className="text-blue-600 font-bold text-lg mr-8">EHR PROJECT</div>
      <div className="flex space-x-6">
        <NavLink to="/History" className="text-gray-700 hover:text-blue-600">
          History
        </NavLink>
        <NavLink to="/Hospitals" className="text-gray-700 hover:text-blue-600">
          Hospitals
        </NavLink>
        <NavLink to="/chatbot" className="text-gray-700 hover:text-blue-600">
          Chat
        </NavLink>
      </div>
      <div className="flex items-center space-x-2 ml-auto">
        <FaBell className="text-gray-700 hover:text-blue-600" />
        <span className="text-gray-700">Mariam Ahmed</span>
        <img src={examinationImage} alt="Profile" className="w-10 h-10 rounded-full" />
      </div>
    </nav>
  );
};

export default PatientNavbar;