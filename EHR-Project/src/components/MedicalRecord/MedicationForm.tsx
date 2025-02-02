import React from 'react';

type Medication = {
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
};

type MedicationFormProps = {
  medication: Medication;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => void;
  index: number;
  onDelete: () => void;
};

const MedicationForm: React.FC<MedicationFormProps> = ({ medication, onChange, index, onDelete }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor={`medication_name_${index}`} className="block text-sm font-medium text-gray-700">Medication Name</label>
        <input
          type="text"
          name="medication_name"
          id={`medication_name_${index}`}
          value={medication.medication_name}
          onChange={(e) => onChange(e, index)}
          className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
        />
      </div>
      {/* Add other fields similarly */}
      <div>
        <button
          type="button"
          className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MedicationForm;