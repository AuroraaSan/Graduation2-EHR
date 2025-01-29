import _ from 'lodash';
import Condition from '../../../models/conditions-model.js';
import { validate } from '../../validators/validator.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { updateConditionSchema } from '../../validators/schemas/condition.js';

const updateCondition = async (req, res) => {
  try {
    validate(updateConditionSchema);
    const doctor_id = req.auth.payload.sub;

    const { id: condition_id } = req.params;

    const condition = await Condition.findOne({
      _id: condition_id,
    });

    if (_.isNil(condition)) {
      throw new NotFoundError('Condition', condition_id);
    }

    if (condition.diagnosing_doctor_id !== doctor_id) {
      throw new ForbiddenError();
    }

    await Condition.updateOne({ _id: condition_id }, { $set: req.body });

    return sendSuccess(res, 'Condition updated successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(updateCondition);
