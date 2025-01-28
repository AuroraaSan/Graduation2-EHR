import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const API_ENDPOINTS = {
  LOGIN_Doc: "/api/user/doctor/login",
  LOGIN_Patient: "/api/user/patient/login",
  LOGIN_Admin: "/api/user/admin/login",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<string>('doctor');

  const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
  });

  const handleSubmit = async (values: LoginFormInputs) => {
    try {
      console.log("Submitting form with values:", values);
      let response;
  
      if (role === "doctor") {
        response = await api.post(API_ENDPOINTS.LOGIN_Doc, values);
  
        if (response.status === 200 && response.data.data) {
          toast.success("Login successful!");
          navigate("/DoctorDashboard");
        }
      } else if (role === "patient") {
        response = await api.post(API_ENDPOINTS.LOGIN_Patient, values);
  
        if (response.status === 200 && response.data.data) {
          toast.success("Login successful!");
          navigate("/PatientDashboard");
        }
      }else if (role === "admin") {
        response = await api.post(API_ENDPOINTS.LOGIN_Admin, values);
  
        if (response.status === 200 && response.data.data) {
          toast.success("Login successful!");
          navigate("/AdminDashboard");
        }
      }else {
        throw new Error("Invalid role selected.");
      }

      localStorage.setItem("user", JSON.stringify(response.data.data.user));

    } catch (error: any) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else if (error.response.status === 401) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(error.response.data?.message || "Login failed. Please try again.");
        }
      }
    }
  };

  const handleForgotPassword = () => {
    toast.success("Reset link sent to your email.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white shadow-lg shadow-slate-800 rounded-lg">
        <div className="border-4 border-[#415BE7] rounded-lg">
          <div className="p-8 space-y-8">
            <h2 className="text-3xl text-center text-black-900 my-5">Log In To Your Account</h2>
            <div className="flex items-center justify-center space-x-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="text-blue-600">Welcome Back!</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                      placeholder="you@example.com"
                    />
                    <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                      placeholder="********"
                    />
                    <ErrorMessage name="password" component="p" className="text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role:</label>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <NavLink
                      to="#"
                      onClick={handleForgotPassword}
                      className="text-gray-500 hover:text-black"
                    >
                      Forgot Password?
                    </NavLink>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-white bg-[#415BE7] rounded-md hover:bg-[#263380] focus:ring-4 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-700">
                Don't have an account?{" "}
                <NavLink to="/register" className="text-blue-500 hover:text-blue-700">Register</NavLink>
              </span>
            </div>

            {/* React Hot Toast notifications */}
            <Toaster position="top-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
