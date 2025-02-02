import _ from 'lodash';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import Surgery from '../../../models/surgeries-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';

const deleteSurgery = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: surgery_id } = req.params;

    const surgery = await Surgery.findOne({ _id: surgery_id }, { patient_id: 1 }).lean();

    if (_.isNil(surgery)) {
      throw new NotFoundError('Surgery', surgery_id);
    }

    if (surgery.patient_id !== patient_id) {
      throw new ForbiddenError();
    }

    await Surgery.deleteOne({ _id: surgery_id });

    return sendSuccess(res, 'Surgery deleted successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(deleteSurgery);
