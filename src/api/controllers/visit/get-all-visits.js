import _ from 'lodash';
import Visit from '../../../models/visits-model.js';
import { NotFoundError } from '../../../utils/errors.js';
import { sendError, sendSuccess } from '../../../utils/response-handler.js';
import { getUserFromRedis } from '../../../utils/redis-fetch.js';

export const getAllVisits = async (req, res, next) => {
  try {
    const user_id = req.auth.payload.sub;
    const { limit = -1, skip = 0 } = req.query;

    const patient = await getUserFromRedis(user_id);
    const { role } = patient;

    let visits;

    if (role === 'patient') {
      visits = await Visit.find({ patient_id: user_id })
        .skip(limit === -1 ? null : skip)
        .limit(limit === -1 ? null : limit)
        .lean();
    } else {
      visits = await Visit.find({ doctor_id: user_id })
        .skip(limit === -1 ? null : skip)
        .limit(limit === -1 ? null : limit)
        .lean();
    }

    if (_.isEmpty(visits)) {
      throw new NotFoundError('Visits');
    }

    const doctor = await getUserFromRedis(visits[0].doctor_id);

    visits = await Promise.all(visits.map(async aVisit => ({
      ...aVisit,
      patient: {
        id: patient.id,
        full_name: patient.full_name,
      },
      doctor: {
        id: doctor.id,
        full_name: doctor.full_name,
        specialization: doctor.specialization,
        hospital_affiliations: doctor.hospital_affiliations,
      },
    })));

    return sendSuccess(res, visits);
  } catch (error) {
    return next(error);
  }
};