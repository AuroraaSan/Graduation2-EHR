import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { prefix } from '../config/config.js';
import { jwtSecretKey } from '../config/config.js';
import routes from '../api/routes/routes-index.js';
import { errorMiddleware } from '../api/middleware/middleware-index.js';
import passport from '../config/passport.js';
import * as utils from '../utils/utils-index.js'; 
import cookieParser from 'cookie-parser';
// import rateLimiter from '../api/middleware/rate-limiter.js';

export default (app) => {
  // Global error handling for uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Exit process on an uncaught exception
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });

  // Ensure JWT secret key is defined, otherwise exit
  if (!jwtSecretKey) {
    console.error('JWT secret key is not defined');
    process.exit(1);
  }

  // Essential middleware setup
  app.enable('trust proxy');
  app.use(cors({
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
    credentials: true,
    accessControlAllowOrigin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  app.use(express.static('public'));
  app.disable('x-powered-by');
  app.disable('etag');

  // Custom rate limiter middleware
  // app.use(rateLimiter);
  
  // Use password authentication middleware
  app.use(passport.initialize()); 

  // Set API routes
  app.use(prefix, routes);

  // Health check route
  app.get('/', (_req, res) => {
    return res.status(200).json({
      message: 'Project is successfully working...',
    }).end();
  });

  // Catch-all for unsupported routes
  app.use((req, res, next) => {
    const error = new utils.BaseError('Endpoint not found', 404);
    next(error);
  });

  // Centralized error handling middleware
  app.use(errorMiddleware);
};
