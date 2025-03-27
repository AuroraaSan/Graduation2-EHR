import Patient from "../../../models/patient-model.js";
import _ from "lodash";
import { sendError, sendSuccess } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const { id: national_id } = req.params;
        const patient = await Patient.findOne({ national_id });
        
        if (_.isNil(patient)) {
            return sendError(res, "Patient not found!", 404);
        }

        sendSuccess(res, "Patient data fetched successfully!", { patient });
    } catch (error) {
        return sendError(res, error);
    }
}