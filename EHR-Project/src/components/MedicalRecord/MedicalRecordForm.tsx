import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import DoctorNavbar from '../Navbar/DoctorNavbar';
import ConditionForm from './ConditionForm';
import AllergyForm from './AllergyForm';
import MedicationForm from './MedicationForm';
import SurgeryForm from './SurgeryForm';
import { MedicalRecord, Condition, Allergy, Medication, Surgery } from '../types';

const MedicalRecordForm: React.FC = () => {
  const navigate = useNavigate();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>({
    id: '',
    patient_id: '',
    doctor_id: '',
    conditions: [],
    allergies: [],
    medications: [],
    surgeries: [],
    blood_type: '',
    weight: 0,
    height: 0,
    created_at: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'condition' | 'allergy' | 'medication' | 'surgery' | null>(null);

  const handleAddSection = (type: 'condition' | 'allergy' | 'medication' | 'surgery') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Condition | Allergy | Medication | Surgery) => {
    try {
      let endpoint = '';
      switch (modalType) {
        case 'condition':
          endpoint = 'http://localhost:3001/api/records/patient/conditions';
          break;
        case 'allergy':
          endpoint = 'http://localhost:3001/api/records/patient/allergies';
          break;
        case 'medication':
          endpoint = 'http://localhost:3001/api/records/patient/medications';
          break;
        case 'surgery':
          endpoint = 'http://localhost:3001/api/records/patient/surgeries';
          break;
        default:
          throw new Error('Invalid modal type');
      }

      const response = await axios.post(endpoint, data);
      if (response.status === 201) {
        setMedicalRecord((prevState) => ({
          ...prevState,
          [modalType + 's']: [...prevState[modalType + 's'], response.data],
        }));
        toast.success(`${modalType} added successfully!`);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(`Error adding ${modalType}:`, error);
      toast.error(`An error occurred while adding the ${modalType}.`);
    }
  };

  return (
    <div>
      <DoctorNavbar />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white shadow-lg shadow-slate-800 rounded-lg">
          <div className="border-4 border-[#415BE7] rounded-lg">
            <div className="p-8 space-y-8">
              <h2 className="text-3xl text-center text-black-900 my-5">Add Medical Record</h2>
              <form className="space-y-6">
                {/* General Information */}
                <h3 className="text-xl font-bold text-gray-800">General Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700">Patient ID</label>
                    <input
                      type="text"
                      name="patient_id"
                      id="patient_id"
                      value={medicalRecord.patient_id}
                      onChange={(e) => setMedicalRecord({ ...medicalRecord, patient_id: e.target.value })}
                      className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                      required
                    />
                  </div>
                  {/* Add other general fields similarly */}
                </div>

                {/* Conditions */}
                <h3 className="text-xl font-bold text-gray-800">Conditions</h3>
                {medicalRecord.conditions.map((condition, index) => (
                  <ConditionForm
                    key={condition.id}
                    condition={condition}
                    onChange={(e) => handleChange(e, 'conditions', index)}
                    index={index}
                    onDelete={() => handleDelete('conditions', condition.id)}
                  />
                ))}
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
                  onClick={() => handleAddSection('condition')}
                >
                  Add Condition
                </button>

                {/* Allergies */}
                <h3 className="text-xl font-bold text-gray-800">Allergies</h3>
                {medicalRecord.allergies.map((allergy, index) => (
                  <AllergyForm
                    key={allergy.id}
                    allergy={allergy}
                    onChange={(e) => handleChange(e, 'allergies', index)}
                    index={index}
                    onDelete={() => handleDelete('allergies', allergy.id)}
                  />
                ))}
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
                  onClick={() => handleAddSection('allergy')}
                >
                  Add Allergy
                </button>

                {/* Medications */}
                <h3 className="text-xl font-bold text-gray-800">Medications</h3>
                {medicalRecord.medications.map((medication, index) => (
                  <MedicationForm
                    key={medication.id}
                    medication={medication}
                    onChange={(e) => handleChange(e, 'medications', index)}
                    index={index}
                    onDelete={() => handleDelete('medications', medication.id)}
                  />
                ))}
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
                  onClick={() => handleAddSection('medication')}
                >
                  Add Medication
                </button>

                {/* Surgeries */}
                <h3 className="text-xl font-bold text-gray-800">Surgeries</h3>
                {medicalRecord.surgeries.map((surgery, index) => (
                  <SurgeryForm
                    key={surgery.id}
                    surgery={surgery}
                    onChange={(e) => handleChange(e, 'surgeries', index)}
                    index={index}
                    onDelete={() => handleDelete('surgeries', surgery.id)}
                  />
                ))}
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
                  onClick={() => handleAddSection('surgery')}
                >
                  Add Surgery
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding Entries */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add ${modalType}`}>
        {modalType === 'condition' && (
          <ConditionForm
            condition={{
              condition_name: '',
              diagnosis_date: '',
              status: '',
              notes: '',
              treated: false,
              diagnosing_doctor_id: '',
              severity: '',
              last_assessment_date: '',
              expected_duration: '',
              treatment_plan: '',
              related_conditions: [],
            }}
            onChange={(e, index) => {}}
            index={0}
            onDelete={() => {}}
          />
        )}
        {/* Add similar forms for allergies, medications, and surgeries */}
      </Modal>
    </div>
  );
};

export default MedicalRecordForm;