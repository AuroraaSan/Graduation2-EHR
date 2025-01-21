import Admission from "../../../models/admission-model.js";

export default async (req, res) => {
    try {
        const admissions = await Admission.find();
        res.status(200).send(admissions);
    } catch (error) {
        return utils.sendError(res, error);
    }
};