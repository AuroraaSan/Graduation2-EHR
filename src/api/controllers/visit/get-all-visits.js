import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { getUserFromRedis } from '../../../utils/redis-fetch.js';

export const getAllVisits = async (req, res, next) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    let visits;
    visits = await Visit.find({ patient_id })
      .skip(limit === -1 ? null : skip)
      .limit(limit === -1 ? null : limit)
      .lean();

    if (_.isEmpty(visits)) {
      throw new NotFoundError('Visits');
    }

    visits = await Promise.all(visits.map(async aVisit => {
      const doctor = await getUserFromRedis(aVisit.doctor_id);

      return {
        ...aVisit,
        doctor_name: doctor.full_name,
        specialization: doctor.specialization,
        hospital_affiliations: doctor.hospital_affiliations,
      };
    }));

    return sendSuccess(res, visits);
  } catch (error) {
    return sendError(res, error);
  }
};