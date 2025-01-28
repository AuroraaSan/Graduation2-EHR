import { ForbiddenError } from '../../utils/errors.js';
import { sendError } from '../../utils/response-handler.js';

/**
 * Middleware to enforce role-based access control (RBAC).
 * @param {string} requiredRole - The role required to access the resource.
 */
// eslint-disable-next-line consistent-return
export const authorizeUser = requiredRole => (req, res, next) => {
  try {
    // Extract the user's role from the token payload
    const { permissions } = req.auth.payload;

    // Check if the user has the required role
    if (!permissions.includes(requiredRole)) {
      throw new ForbiddenError('Forbidden: Insufficient permissions');
    }

    // If authorized, proceed to the next middleware or controller
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Authorization error:', error);
    return sendError(res, error);
  }
};
