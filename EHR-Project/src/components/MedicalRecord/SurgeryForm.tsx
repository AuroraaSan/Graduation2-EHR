import React from 'react';

type Surgery = {
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
};

type SurgeryFormProps = {
  surgery: Surgery;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => void;
  index: number;
  onDelete: () => void;
};

const SurgeryForm: React.FC<SurgeryFormProps> = ({ surgery, onChange, index, onDelete }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor={`type_${index}`} className="block text-sm font-medium text-gray-700">Type</label>
        <input
          type="text"
          name="type"
          id={`type_${index}`}
          value={surgery.type}
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

export default SurgeryForm;