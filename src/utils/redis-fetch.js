import { redisClient } from '../loaders/redis-loader.js';

export const getUserFromRedis = async userId => {
  const user = await redisClient.hGet(`user:${userId}`, 'user');
  return JSON.parse(user);
};

export const VerifyAdmissionStatus = async (patientId, doctorId) => {
  const exists = await redisClient.sIsMember('admissions', `admission:${patientId}:${doctorId}`);

  return exists;
};
