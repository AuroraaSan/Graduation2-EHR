import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../UserContext'; // Adjust the import path as needed

const LandingPage: React.FC = () => {
  const { user, logout } = useUser(); // Destructure user and logout from useUser

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Welcome to EHR Project</h1>
        <p className="text-xl mb-8">Your trusted electronic health record system</p>

        {/* Display username and logout button if authenticated */}
        {user && (
          <div className="mb-8">
            <p className="text-lg">Welcome, {user.name}!</p>
            <button
              onClick={logout} // Use the logout function from UserContext
              className="mt-4 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}

        {/* Show login and register buttons if not authenticated */}
        {!user && (
          <div className="space-x-4">
            <NavLink
              to="/login"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;