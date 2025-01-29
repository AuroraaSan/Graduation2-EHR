import _ from 'lodash';
import Condition from '../../../models/conditions-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const getCondition = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: condition_id } = req.params;

    const condition = await Condition.findOne({ _id: condition_id }).lean();

    if (_.isNil(condition)) {
      throw new NotFoundError('Condition', condition_id);
    }

    if (condition.patient_id !== patient_id) { throw new ForbiddenError(); }

    return sendSuccess(res, condition);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getCondition);
