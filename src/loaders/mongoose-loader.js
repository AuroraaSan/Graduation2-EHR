/* eslint-disable no-console */
import mongoose from 'mongoose';
import { mongoUri } from '../config/config.js';

export default async () => {
  mongoose.connect(mongoUri, {})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
};
