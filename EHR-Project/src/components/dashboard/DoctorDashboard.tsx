import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { BsChatDotsFill } from "react-icons/bs"; 
import DoctorNavbar from "../Navbar/DoctorNavbar";
import Chatbot from "../chatbot/chatbot";
const DoctorDashboard: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
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
            <NavLink
                        to="/Emergency"
                        className="text-lg lg:text-xl text-gray-700 hover:text-blue-500"
                      >
                        Emergencies
            </NavLink>
          </div>
          

          {/* React Hot Toast notifications */}
          <Toaster position="top-center" />
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <BsChatDotsFill size={24} />
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 bg-white w-96 h-96 p-4 shadow-xl rounded-xl border border-gray-300">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
