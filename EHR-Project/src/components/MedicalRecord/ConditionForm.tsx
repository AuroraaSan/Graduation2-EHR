import React from 'react';
import { Condition } from './types';

type ConditionFormProps = {
  condition: Condition;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => void;
  index: number;
  onDelete?: () => void;
};

const ConditionForm: React.FC<ConditionFormProps> = ({ condition, onChange, index, onDelete }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor={`condition_name_${index}`} className="block text-sm font-medium text-gray-700">Condition Name</label>
        <input
          type="text"
          name="condition_name"
          id={`condition_name_${index}`}
          value={condition.condition_name}
          onChange={(e) => onChange(e, index)}
          className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          required
        />
      </div>
      <div>
        <label htmlFor={`diagnosis_date_${index}`} className="block text-sm font-medium text-gray-700">Diagnosis Date</label>
        <input
          type="date"
          name="diagnosis_date"
          id={`diagnosis_date_${index}`}
          value={condition.diagnosis_date}
          onChange={(e) => onChange(e, index)}
          className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          required
        />
      </div>
      {onDelete && (
        <div>
          <button
            type="button"
            className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ConditionForm;