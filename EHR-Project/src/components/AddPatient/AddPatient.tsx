import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddPatientData: React.FC = () => {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    user: {
      email: '',
      full_name: '',
      role: 'patient',
      gender: '',
      birth_date: '',
      address: '',
      national_id: '',
      password: '',
      insurance_number: '',
      phone_number: '',
    },
    contact: {
      contact_name: '',
      email: '',
      gender: '',
      relation_to_patient: '',
      address: '',
      national_id: '',
      phone_number: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const section = dataset.section as 'user' | 'contact';

    setPatient((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/patient/register', patient);
      if (response.status === 200 || response.status === 201) {
        toast.success('Patient added successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to add patient.');
      }
    } catch (error) {
      toast.error('An error occurred while adding the patient.');
    }
  };

  const handleBackClick = () => {
    navigate('/AdminDashboard');
  };

return (
  <div className="flex items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-4xl bg-white shadow-lg shadow-slate-800 rounded-lg">
      <div className="border-4 border-[#415BE7] rounded-lg">
        <div className="p-8 space-y-8">
          <h2 className="text-3xl text-center text-black-900 my-5">Add Patient</h2>
          <div className="flex items-center justify-center space-x-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-blue-600">Fill in Patient Details</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Details */}
            <h3 className="text-xl font-bold text-gray-800">User Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  placeholder="Full Name"
                  value={patient.user.full_name}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={patient.user.email}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  placeholder="Gender"
                  value={patient.user.gender}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  id="birth_date"
                  value={patient.user.birth_date}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={patient.user.address}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  name="national_id"
                  id="national_id"
                  placeholder="National ID"
                  value={patient.user.national_id}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                      placeholder="********"
                    />
              </div>
              <div>
                <label htmlFor="insurance_number" className="block text-sm font-medium text-gray-700">Insurance Number</label>
                <input
                  type="text"
                  name="insurance_number"
                  id="insurance_number"
                  placeholder="Insurance Number"
                  value={patient.user.insurance_number}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  placeholder="Phone Number"
                  value={patient.user.phone_number}
                  data-section="user"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
            </div>

            {/* Contact Details */}
            <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  name="contact_name"
                  id="contact_name"
                  placeholder="Contact Name"
                  value={patient.contact.contact_name}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="relation_to_patient" className="block text-sm font-medium text-gray-700">Relation to Patient</label>
                <input
                  type="text"
                  name="relation_to_patient"
                  id="relation_to_patient"
                  placeholder="Relation to Patient"
                  value={patient.contact.relation_to_patient}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  id="contact_email"
                  placeholder="Contact Email"
                  value={patient.contact.email}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="contact_gender" className="block text-sm font-medium text-gray-700">Contact Gender</label>
                <input
                  type="text"
                  name="gender"
                  id="contact_gender"
                  placeholder="Contact Gender"
                  value={patient.contact.gender}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="contact_address" className="block text-sm font-medium text-gray-700">Contact Address</label>
                <input
                  type="text"
                  name="address"
                  id="contact_address"
                  placeholder="Contact Address"
                  value={patient.contact.address}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="contact_national_id" className="block text-sm font-medium text-gray-700">Contact National ID</label>
                <input
                  type="text"
                  name="national_id"
                  id="contact_national_id"
                  placeholder="Contact National ID"
                  value={patient.contact.national_id}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label htmlFor="contact_phone_number" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  id="contact_phone_number"
                  placeholder="Contact Phone"
                  value={patient.contact.phone_number}
                  data-section="contact"
                  onChange={handleChange}
                  className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-gray-200"
                onClick={handleBackClick}
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-[#415BE7] rounded-md hover:bg-[#263380] focus:ring-4 focus:ring-indigo-500"
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
export default AddPatientData;