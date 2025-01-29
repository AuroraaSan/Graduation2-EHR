import _ from 'lodash';
import Medication from '../../../models/medications-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { validate } from '../../validators/validator.js';
import { updateMedicationSchema } from '../../validators/schemas/medication.js';

const updateMedication = async (req, res) => {
  try {
    validate(updateMedicationSchema);
    const doctor_id = req.auth.payload.sub;

    const { id: medication_id } = req.params;

    const medication = await Medication.findOne({
      _id: medication_id,
    });

    if (_.isNil(medication)) {
      throw new NotFoundError('Medication', medication_id);
    }

    if (medication.prescribing_doctor_id !== doctor_id) {
      throw new ForbiddenError();
    }

    await Medication.updateOne({ _id: medication_id }, { $set: req.body });
    return sendSuccess(res, 'Medication updated successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(updateMedication);
