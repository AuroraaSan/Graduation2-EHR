import _ from 'lodash';
import Medication from '../../../models/medications-model.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { NotFoundError } from '../../../utils/errors.js';

const getAllMedications = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    const medications = await Medication.find({ patient_id })
      .skip(limit === -1 ? null : skip)
      .limit(limit === -1 ? null : limit)
      .lean();

    if (_.isEmpty(medications)) {
      throw new NotFoundError('Medications');
    }

    return sendSuccess(res, medications);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getAllMedications);
