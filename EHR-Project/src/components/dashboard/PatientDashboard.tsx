import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import PatientNavbar from '../Navbar/PatientNavbar';
import Chatbot from '../chatbot/chatbot';
import { BsChatDotsFill } from "react-icons/bs"; 


const PatientDashboard: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

return(
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
        
        </div>
      </div>
    </div>
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

export default PatientDashboard;
