import _ from 'lodash';
import Allergy from '../../../models/allergies-model.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';

const deleteAllergy = async (req, res) => {
  try {
    const patient_id = req.auth.payload.sub;
    const { id: allergy_id } = req.params;

    const allergy = await Allergy.findOne({ _id: allergy_id }, { patient_id: 1 }).lean();

    if (_.isNil(allergy)) {
      throw new NotFoundError('Allergy', allergy_id);
    }

    if (allergy.patient_id !== patient_id) { throw new ForbiddenError(); }

    await Allergy.deleteOne({ _id: allergy_id });

    return sendSuccess(res, 'Allergy deleted successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(deleteAllergy);
