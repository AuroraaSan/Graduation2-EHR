import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendSuccess } from '../../../utils/response-handler.js';

export default [
  asyncHandler(async (req, res) => {
    const patient_id = req.auth.payload.sub;
    const { id: visit_id } = req.params;

    const visit = await Visit.findOne({ _id: visit_id }).lean();

    if (_.isNil(visit)) {
      throw new NotFoundError('Visit', visit_id);
    }

    if (visit.patient_id !== patient_id) { throw new ForbiddenError(); }

    return sendSuccess(res, visit);
  }),
];
