import _ from 'lodash';
import Medication from '../../../models/medications-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const getMedication = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: medication_id } = req.params;

    const medication = await Medication.findOne({ _id: medication_id }).lean();

    if (_.isNil(medication)) {
      throw new NotFoundError('Medication', medication_id);
    }

    if (medication.patient_id !== patient_id) {
      throw new ForbiddenError();
    }

    return sendSuccess(res, medication);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getMedication);
