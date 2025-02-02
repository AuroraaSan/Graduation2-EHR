import { auth } from "express-oauth2-jwt-bearer";
import { auth0_audience, auth0_domain } from "../../config/config.js";

// Middleware to validate JWTs issued by Auth0
export const authAccessToken = auth({
  audience: auth0_audience,
  issuerBaseURL: `https://${auth0_domain}`,
});

export const authenticate = (req, res, next) => {
  authAccessToken(req, res, (err) => {
    if (err) {
      return res.status(401).send({ authenticated: false });
    }
    return next();
  });
};
