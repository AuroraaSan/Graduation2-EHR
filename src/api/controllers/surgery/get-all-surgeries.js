import _ from 'lodash';
import Surgery from '../../../models/surgeries-model.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { NotFoundError } from '../../../utils/errors.js';

const getAllSurgeries = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    const surgeries = await Surgery.find({ patient_id })
      .skip(limit === -1 ? null : skip)
      .limit(limit === -1 ? null : limit)
      .lean();

    if (_.isEmpty(surgeries)) {
      throw new NotFoundError('Surgeries');
    }

    return sendSuccess(res, surgeries);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getAllSurgeries);
