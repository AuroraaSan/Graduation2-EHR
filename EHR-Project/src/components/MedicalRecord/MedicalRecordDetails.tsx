import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PatientNavbar from '../Navbar/PatientNavbar';


type MedicalRecord = {
  id: string;
  patient_id: string;
  doctor_id: string;
  conditions: Array<{
    condition_name: string;
    diagnosis_date: string;
    status: string;
    notes: string;
    treated: boolean;
    diagnosing_doctor_id: string;
    severity: string;
    last_assessment_date: string;
    expected_duration: string;
    treatment_plan: string;
    related_conditions: string[];
  }>;
  allergies: Array<{
    allergen_name: string;
    allergen_type: string;
    reaction: string;
    severity: string;
    diagnosing_doctor: string;
    diagnosis_date: string;
    onset_date: string;
    last_occurrence: string;
    treatment_plan: string;
    emergency_instructions: string;
    medications_to_avoid: string[];
    status: string;
    verification_status: string;
    notes: string;
  }>;
  medications: Array<{
    medication_name: string;
    dosage: string;
    frequency: string;
    start_date: string;
    end_date: string;
    prescribing_doctor: string;
    condition: string;
    route_of_administration: string;
    side_effects: string[];
    contraindications: string[];
    refills_remaining: number;
    pharmacy_notes: string;
    prescription_id: string;
    status: string;
    discontinuation_reason: string;
    last_refill_date: string;
    next_refill_date: string;
  }>;
  surgeries: Array<{
    type: string;
    procedure_date: string;
    hospital: string;
    surgeon_id: string;
    assistant_surgeon_ids: string[];
    anesthesiologist_id: string;
    pre_op_diagnosis: string;
    post_op_diagnosis: string;
    complications: string[];
    estimated_blood_loss: string;
    duration: string;
    recovery_notes: string;
    post_op_instructions: string;
    follow_up_date: string;
    surgical_notes: string;
    pathology_report: string;
    anesthesia_type: string;
    status: string;
    cancellation_reason: string;
    emergency: boolean;
  }>;
  blood_type: string;
  weight: number;
  height: number;
  created_at: string;
};

const MedicalRecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/patient/medical-records/${id}`);
        if (response.status === 200) {
          setMedicalRecord(response.data);
        } else {
          toast.error('Failed to fetch medical record details.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching medical record details.');
      }
    };

    fetchMedicalRecord();
  }, [id]);

  if (!medicalRecord) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <PatientNavbar />
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="p-8 space-y-8">
          <h2 className="text-3xl text-center text-black-900 my-5">Medical Record Details</h2>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <p className="mt-1">{medicalRecord.patient_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                <p className="mt-1">{medicalRecord.blood_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <p className="mt-1">{medicalRecord.weight}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <p className="mt-1">{medicalRecord.height}</p>
              </div>
            </div>

            {/* Display Conditions */}
            <h3 className="text-xl font-bold text-gray-800">Conditions</h3>
            {medicalRecord.conditions.map((condition, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition Name</label>
                  <p className="mt-1">{condition.condition_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis Date</label>
                  <p className="mt-1">{condition.diagnosis_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">{condition.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1">{condition.notes}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            ))}

            {/* Display Allergies */}
            <h3 className="text-xl font-bold text-gray-800">Allergies</h3>
            {medicalRecord.allergies.map((allergy, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergen Name</label>
                  <p className="mt-1">{allergy.allergen_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergen Type</label>
                  <p className="mt-1">{allergy.allergen_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reaction</label>
                  <p className="mt-1">{allergy.reaction}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <p className="mt-1">{allergy.severity}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            ))}

            {/* Display Medications */}
            <h3 className="text-xl font-bold text-gray-800">Medications</h3>
            {medicalRecord.medications.map((medication, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medication Name</label>
                  <p className="mt-1">{medication.medication_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <p className="mt-1">{medication.dosage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <p className="mt-1">{medication.frequency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1">{medication.start_date}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            ))}

            {/* Display Surgeries */}
            <h3 className="text-xl font-bold text-gray-800">Surgeries</h3>
            {medicalRecord.surgeries.map((surgery, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1">{surgery.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Procedure Date</label>
                  <p className="mt-1">{surgery.procedure_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital</label>
                  <p className="mt-1">{surgery.hospital}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Surgeon ID</label>
                  <p className="mt-1">{surgery.surgeon_id}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              className="px-4 py-2 text-white bg-[#415BE7] rounded-md hover:bg-[#263380]"
              onClick={() => navigate('/medical-records')}
            >
              Back to Records
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default MedicalRecordDetails;