import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';


// Create an instance of axios for API requests
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Validation schema for Doctor form
const doctorValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  fullName: Yup.string().required("Full Name is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  gender: Yup.string(),
  birthDate: Yup.date().required("Birth Date is required"),
  address: Yup.string().required("Address is required"),
  nationalId: Yup.string().required("National ID is required"),
  specialization: Yup.string().required("Specialization is required"),
  licenseNumber: Yup.string().required("License Number is required"),
  phoneNumber: Yup.string(),
  yearsOfExperience: Yup.number(),
  hospitalAffiliations: Yup.string(),
});

// Validation schema for Patient form
const patientValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  fullName: Yup.string().required("Full Name is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  gender: Yup.string().required("Gender is required"),
  birthDate: Yup.date().required("Birth Date is required"),
  address: Yup.string().required("Address is required"),
  nationalId: Yup.string().required("National ID is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
});

const Register = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const [role, setRole] = useState("Doctor");
  const navigate = useNavigate();

  // Handle role change
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  // Handle form submission for Doctor
  const handleDoctorSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formElements = event.target as HTMLFormElement;
    const doctorData = {
      email: formElements.email.value,
      fullName: formElements.fullName.value,
      password: formElements.password.value,
      gender: formElements.gender.value,
      birthDate: formElements.birthDate.value,
      address: formElements.address.value,
      nationalId: formElements.nationalId.value,
      specialization: formElements.specialization.value,
      licenseNumber: formElements.licenseNumber.value,
      yearsOfExperience: formElements.yearsOfExperience.value,
      phoneNumber: formElements.phoneNumber.value,
      educationalBackground: formElements.educationalBackground.value,
      hospitalAffiliations: formElements.hospitalAffiliations.value,
    };
    try {
      const response = await api.post("/user/doctor/register", doctorData);

      if (response.status === 200 && response.data.data) {
        toast.success("Doctor registered successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.response.data?.message || "Registration failed. Please try again.");
        }
      }
    }
  };

  // Handle form submission for Patient
  const handlePatientSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formElements = event.target as HTMLFormElement;
    const patientData = {
      email: formElements.email.value,
      fullName: formElements.fullName.value,
      password: formElements.password.value,
      gender: formElements.gender.value,
      birthDate: formElements.birthDate.value,
      address: formElements.address.value,
      nationalId: formElements.nationalId.value,
      insuranceNumber: formElements.insuranceNumber.value,
      phoneNumber: formElements.phoneNumber.value,
    };

    try {
      const response = await api.post("/patient/register", patientData);

      if (response.status === 200 && response.data.data) {
        toast.success("Patient registered successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.response.data?.message || "Registration failed. Please try again.");
        }
      }
    }
  };

  // Render doctor-specific form fields
  const renderDoctorFields = () => (
    <form onSubmit={handleDoctorSubmit}>
      <h2 className="text-xl mb-6 text-center">Add Doctor</h2>
      <input
        type="email"
        name="email"
        placeholder="Email*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full Name*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="password"
        name="password"
        placeholder="Password*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="gender"
        placeholder="Gender"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="date"
        name="birthDate"
        placeholder="Birth Date*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="address"
        placeholder="Address*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="nationalId"
        placeholder="National ID*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="specialization"
        placeholder="Specialization*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="licenseNumber"
        placeholder="License Number*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="yearsOfExperience"
        placeholder="Years of Experience"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="educationalBackground"
        placeholder="Educational Background"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="hospitalAffiliations"
        placeholder="Hospital Affiliations"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Register
        </button>
      </div>
    </form>
  );

  // Render patient-specific form fields
  const renderPatientFields = () => (
    <form onSubmit={handlePatientSubmit}>
      <h2 className="text-xl mb-6 text-center">Add Patient</h2>
      <input
        type="email"
        name="email"
        placeholder="Email*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full Name*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="password"
        name="password"
        placeholder="Password*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="gender"
        placeholder="Gender"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="date"
        name="birthDate"
        placeholder="Birth Date*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="address"
        placeholder="Address*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="nationalId"
        placeholder="National ID*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="insuranceNumber"
        placeholder="Insurance Number"
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number*"
        required
        className="w-full border rounded mb-4 p-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Register
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
        <div className="border-4 border-[#415BE7] rounded-lg p-8 space-y-8">
          <h2 className="text-3xl text-center text-black my-5">Register Your Account</h2>
          <select
            value={role}
            onChange={handleRoleChange}
            className="block w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          >
            <option value="Doctor">Doctor</option>
            <option value="Patient">Patient</option>
          </select>
          {role === "Doctor" ? renderDoctorFields() : renderPatientFields()}
          <Toaster position="top-center" />
        </div>
      </div>
    </div>
  );
};

export default Register;
