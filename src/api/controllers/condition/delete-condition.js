import _ from 'lodash';
import Condition from '../../../models/conditions-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const deleteCondition = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: condition_id } = req.params;

    const condition = await Condition.findOne({ _id: condition_id });

    if (_.isNil(condition)) {
      throw new NotFoundError('Condition', condition_id);
    }

    if (condition.patient_id !== patient_id) { throw new ForbiddenError(); }

    await condition.deleteOne({ _id: condition_id });

    return sendSuccess(res, 'Condition deleted successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(deleteCondition);
