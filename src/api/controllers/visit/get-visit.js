import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { sendError, sendSuccess } from '../../../utils/response-handler.js';

export const getVisit = async (req, res) => {
    // const { role } = req;
    // const caller_id = req.user.id;
    const { id: visit_id } = req.params;

    const visit = await Visit.findOne({ _id: visit_id }).lean();

    if (_.isNil(visit)) {
      throw new NotFoundError('Visit', visit_id);
    }

    visit.specialization = 'Abousaad';

    // if (role === 'patient') {
    //   if (visit.patient_id !== caller_id) {
    //     throw new ForbiddenError();
    //   }
    // } else if (role === 'doctor') {
    //   if (visit.doctor_id !== caller_id) {
    //     throw new ForbiddenError();
    //   }
    // }

    return sendSuccess(res, visit);
  };
