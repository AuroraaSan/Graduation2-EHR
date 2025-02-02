export type Condition = {
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
};

export type Allergy = {
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
};

export type Medication = {
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

export type Surgery = {
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

export type MedicalRecord = {
  id: string;
  patient_id: string;
  doctor_id: string;
  conditions: Condition[];
  allergies: Allergy[];
  medications: Medication[];
  surgeries: Surgery[];
  blood_type: string;
  weight: number;
  height: number;
  created_at: string;
};