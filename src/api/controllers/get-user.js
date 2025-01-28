import { redisClient } from '../../loaders/redis-loader.js';
import * as utils from '../../utils/utils-index.js';

export const getUser = async (req, res) => {
    try {
        // const user = req.user;
        console.log("req:", req.auth)
        const user = await redisClient.hGet(`user:${req.auth.payload.sub}`, "user");
        // Send success response
        console.log("user:", JSON.parse(user));
        return utils.sendSuccess(res, 'Fetched user data successfully!', { user: JSON.parse(user) });
    } catch (error) {
        console.error('Error in get-user controller:', error);
        return utils.sendError(res, error);
   }
};