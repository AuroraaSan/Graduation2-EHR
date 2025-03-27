export { default as swaggerConfig } from './swagger.config.js'
import { config } from 'dotenv';
config();

//NOTE: If you are running the project in an instance, you should store these secret keys in its configuration settings.
// This type of storing secret information is only experimental and for the purpose of local running.

const {
    DB_URI,
    PORT,
    JWT_ACCESS_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY,
    JWT_RESET_SECRET_KEY,
    APP_MAIL,
    APP_MAIL_KEY,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASS,
    AUTH0_DOMAIN,
    AUTH0_DOMAIN2,
    AUTH0_AUDIENCE,
    CLIENT_ID,
    CLIENT_SECRET
 } = process.env

export const port = PORT || 3000;
export const dbUri = DB_URI;
export const prefix = '/api/user';
export const specs = "/docs";
export const app_mail = APP_MAIL
export const app_mail_key = APP_MAIL_KEY

// JWT KEYS
export const jwtSecretKey = JWT_ACCESS_SECRET_KEY
export const refreshTokenSecretKey = JWT_REFRESH_SECRET_KEY
export const resetSecretKey = JWT_RESET_SECRET_KEY

// REDIS
export const redisHost = REDIS_HOST
export const redisPort = REDIS_PORT
export const redisPass = REDIS_PASS

// AUTH0
export const auth0_domain = AUTH0_DOMAIN
export const auth0_domain2 = AUTH0_DOMAIN2
export const auth0_audience = AUTH0_AUDIENCE
export const client_id = CLIENT_ID
export const client_secret = CLIENT_SECRET