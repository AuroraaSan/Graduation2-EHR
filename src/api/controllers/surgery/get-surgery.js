import _ from 'lodash';
import Surgery from '../../../models/surgeries-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const getSurgery = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: surgery_id } = req.params;

    const surgery = await Surgery.findOne({ _id: surgery_id }).lean();

    if (_.isNil(surgery)) {
      throw new NotFoundError('Surgery', surgery_id);
    }

    if (surgery.patient_id !== patient_id) { throw new ForbiddenError(); }

    return sendSuccess(res, surgery);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getSurgery);
