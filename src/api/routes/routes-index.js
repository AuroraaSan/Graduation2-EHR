import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { specs, swaggerConfig } from '../../config/config.js';
import patientRouter from './patient-route.js';
import doctorRouter from './doctor-route.js';
import adminRouter from './admin-route.js';
import { createHospital } from '../controllers/hospital-controller.js';

const router = Router();

const specDoc = swaggerJsdoc(swaggerConfig);

router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.post('/hospital', createHospital);

// Patient Routes
router.use('/patient', patientRouter);

// Doctor Routes
router.use('/doctor', doctorRouter);

// Admin Routes
router.use('/admin', adminRouter);

router.get('/test-error', (req, res, next) => {
    const error = new Error('Test Error');
    next(error);
})

export default router;