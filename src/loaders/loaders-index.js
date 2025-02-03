import expressLoader from "./express-loader.js";
import mongooseLoader from "./mongoose-loader.js";
import { redisClient } from "./redis-loader.js";

export default async (app) => {
  await mongooseLoader();
  await redisClient.connect().then(() => console.log("Redis Connected"));
  expressLoader(app);
};
