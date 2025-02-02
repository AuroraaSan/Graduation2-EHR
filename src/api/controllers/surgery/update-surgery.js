import _ from 'lodash';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { validate } from '../../validators/validator.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import Surgery from '../../../models/surgeries-model.js';
import { updateSurgerySchema } from '../../validators/schemas/surgery.js';

const updateSurgery = async (req, res) => {
  try {
    validate(updateSurgerySchema);
    const doctor_id = req.auth.payload.sub;

    const { id: surgery_id } = req.params;

    const surgery = await Surgery.findOne({
      _id: surgery_id,
    });

    if (_.isNil(surgery)) {
      throw new NotFoundError('Surgery', surgery_id);
    }

    if (surgery.surgeon_id !== doctor_id) {
      throw new ForbiddenError();
    }

    await Surgery.updateOne({ _id: surgery_id }, { $set: req.body });

    return sendSuccess(res, 'Surgery updated successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(updateSurgery);
