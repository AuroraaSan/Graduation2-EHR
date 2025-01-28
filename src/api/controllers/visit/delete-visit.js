import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const deleteVisit = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: visit_id } = req.params;

    const visit = await Visit.findOne({ _id: visit_id }, { patient_id: 1 }).lean();

    if (_.isNil(visit)) {
      throw new NotFoundError('Visit', visit_id);
    }

    if (visit.patient_id !== patient_id) { throw new ForbiddenError(); }

    await Visit.deleteOne({ _id: visit_id });

    return sendSuccess(res, 'Visit deleted successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(deleteVisit);
