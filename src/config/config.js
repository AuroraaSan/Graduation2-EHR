// export { default as swaggerConfig } from './swagger.config.js';
import { config } from 'dotenv';

config();

const {
  DB_URI, PORT, JWT_SECRET_KEY, MONGO_URI,
  REFRESH_TOKEN_SECRET_KEY,
  AUTH0_DOMAIN,
  AUTH0_DOMAIN2,
  AUTH0_AUDIENCE,
  CLIENT_ID,
  CLIENT_SECRET,
  PG_DB_URI,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASS,
} = process.env;

export const port = PORT || 3001;
export const jwtSecretKey = JWT_SECRET_KEY;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY;
export const dbUri = DB_URI;
export const mongoUri = MONGO_URI;
// export const awsAccessKey = AWS_ACCESS_KEY_ID;
// export const awsSecretAccessKey = AWS_SECRET_ACCESS_KEY;
// export const awsRegion = AWS_REGION;
// export const bucketName = BUCKET_NAME;
export const prefix = '/api/records';
export const specs = '/docs';

// AUTH0
export const auth0_domain = AUTH0_DOMAIN;
export const auth0_domain2 = AUTH0_DOMAIN2;
export const auth0_audience = AUTH0_AUDIENCE;
export const client_id = CLIENT_ID;
export const client_secret = CLIENT_SECRET;

// Postgres
export const pg_db_uri = PG_DB_URI;

// Redis
export const redisHost = REDIS_HOST;
export const redisPort = REDIS_PORT;
export const redisPass = REDIS_PASS;
