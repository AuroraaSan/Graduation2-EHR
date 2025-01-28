import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { validate } from '../../validators/validator.js';
import { updateVisitSchema } from '../../validators/schemas/visit.js';

const updateVisit = async (req, res) => {
  try {
    validate(updateVisitSchema);
    const doctor_id = req.auth.payload.sub;

    const { id: visit_id } = req.params;

    const visit = await Visit.findOne({
      _id: visit_id,
    });

    if (_.isNil(visit)) {
      throw new NotFoundError('Visit', visit_id);
    }

    if (visit.doctor_id !== doctor_id) {
      throw new ForbiddenError();
    }

    await Visit.updateOne({ _id: visit_id }, { $set: req.body });

    return sendSuccess(res, 'Visit updated successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(updateVisit);
