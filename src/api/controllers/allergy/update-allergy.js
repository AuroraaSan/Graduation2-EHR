import _ from 'lodash';
import Allergy from '../../../models/allergies-model.js';
import { asyncHandler, sendError, sendSuccess } from '../../../utils/response-handler.js';
import { validate } from '../../validators/validator.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { updateAllergySchema } from '../../validators/schemas/allergy.js';

const updateAllergy = async (req, res) => {
  try {
    validate(updateAllergySchema);
    const doctor_id = req.auth.payload.sub;

    const { id: allergy_id } = req.params;

    const allergy = await Allergy.findOne({
      _id: allergy_id,
    }).lean();

    if (_.isNil(allergy)) {
      throw new NotFoundError('Allergy', allergy_id);
    }

    if (allergy.diagnosing_doctor_id !== doctor_id) {
      throw new ForbiddenError();
    }

    await Allergy.updateOne({ _id: allergy_id }, { $set: req.body });

    return sendSuccess(res, 'Allergy updated successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(updateAllergy);
