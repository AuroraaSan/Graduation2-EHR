import _ from 'lodash';
import Condition from '../../../models/conditions-model.js';
import { NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const getAllConditions = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    const conditions = await Condition.find({ patient_id })
      .skip(limit === -1 ? null : skip)
      .limit(limit === -1 ? null : limit)
      .lean();

    if (_.isEmpty(conditions)) {
      throw new NotFoundError('Conditions');
    }

    return sendSuccess(res, conditions);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getAllConditions);
