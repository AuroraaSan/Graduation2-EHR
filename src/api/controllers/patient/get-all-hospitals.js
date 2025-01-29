import Hospital from "../../../models/hospital-model.js";
import { sendError } from "../../../utils/response-handler.js"

export default async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: hospitals } = await Hospital.findAndCountAll({
            attributes: ['id', 'name', 'address', 'phone_number', 'email', 'photo_url'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            raw: true,
        });

        res.send({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            hospitals
        });
    } catch (error) {
        return sendError(res, error);
    }
}