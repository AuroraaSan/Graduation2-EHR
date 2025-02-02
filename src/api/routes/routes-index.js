import { Router } from 'express';
import record from './record-route.js';
import aiRouter from './ai-routes.js';

const router = Router();

router.use('/patient', record);
router.use('/ai', aiRouter);


router.get('/check', (req, res) => {
  res.send('API is working properly');
});


export default router;
