import React from 'react';
import { Allergy } from '../types';

type AllergyFormProps = {
  allergy: Allergy;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => void;
  index: number;
  onDelete?: () => void;
};

const AllergyForm: React.FC<AllergyFormProps> = ({ allergy, onChange, index, onDelete }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor={`allergen_name_${index}`} className="block text-sm font-medium text-gray-700">Allergen Name</label>
        <input
          type="text"
          name="allergen_name"
          id={`allergen_name_${index}`}
          value={allergy.allergen_name}
          onChange={(e) => onChange(e, index)}
          className="block w-full p-3 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          required
        />
      </div>
      <div>
        <label htmlFor={`allergen_type_${index}`} className="block text-sm font-medium text-gray-700">Allergen Type</label>
        <input
          type="text"
          name="allergen_type"
          id={`allergen_type_${index}`}
          value={allergy.allergen_type}
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

export default AllergyForm;