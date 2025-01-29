import _ from 'lodash';
import Allergy from '../../../models/allergies-model.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { NotFoundError } from '../../../utils/errors.js';

const getAllAllergies = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    const allergies = await Allergy.find({ patient_id })
      .skip(limit === -1 ? null : skip)
      .limit(limit === -1 ? null : limit)
      .lean();

    if (_.isEmpty(allergies)) {
      throw new NotFoundError('Allergies');
    }

    return sendSuccess(res, allergies);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getAllAllergies);
