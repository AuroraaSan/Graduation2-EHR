import { genPostExamReport, genSummary } from '../controllers/ai/ai-index.js';
import { authenticate } from '../middleware/auth-middleware.js';
import express from 'express';
// import { authorizeUser } from '../middleware/access-middleware.js';

const router = express.Router();

router.post('/gen-report/:patient_id', authenticate, genPostExamReport);

router.post('/gen-summary/:patient_id', authenticate, genSummary);

router.get(
  '/auth',
  authenticate,
  (req, res) => {
    res.send({"authenticated": true});
  }
)


export default router;
