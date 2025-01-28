// Only implemented create routes for now
import express from 'express';
import {
  createRecord,
  getRecord,
  // updateRecord,
  deleteRecord,
} from '../controllers/record/index.js';
import {
  createVisit,
  // getAllVisits,
  getVisit,
  // updateVisit,
  // deleteVisit,
  getAllVisits,
} from '../controllers/visit/index.js';
import {
  createSurgery,
  // getSurgery,
  // updateSurgery,
  // deleteSurgery,
  // getAllSurgeries,
} from '../controllers/surgery/index.js';
import {
  createMedication,
  // getMedication,
  // updateMedication,
  // deleteMedication,
  // getAllMedications
} from '../controllers/medication/index.js';
import {
  createAllergy,
  // getAllergy,
  // getAllAllergies,
  // updateAllergy,
  // deleteAllergy
} from '../controllers/allergy/index.js';
import {
  createCondition,
  // getCondition,
  // getAllConditions,
  // updateCondition,
  // deleteCondition
} from '../controllers/condition/index.js';
import { authAccessToken, authenticate } from '../middleware/auth-middleware.js';
// import { authorizeUser } from '../middleware/access-middleware.js';

const router = express.Router();

// ---------------------- Medical Records ---------------------- //
router.post(
  '/medical-records',
  authenticate,
  // authorizeUser('createRecord'),
  createRecord
);

router.get(
  '/medical-records/:id',
  // authorize(RecordAuthorization.getRecord),
  getRecord
);

// router.put('/medical-records/:id', updateRecord);

router.delete(
  '/medical-records/:id',
  deleteRecord
);

// ---------------------- Visit routes ---------------------- //
router.post(
  '/visits',
  authenticate,
  // authorize(RecordAuthorization.createVisit),
  createVisit
);

router.get(
  '/visits/:id',
  // authorize(RecordAuthorization.getVisit),
  getVisit
);

router.get(
  '/visits',
  authenticate,
  // authorize(RecordAuthorization.getAllVisits),
  getAllVisits
);

// router.put('/visits/:id', updateVisit);
// router.delete('/visits/:id', deleteVisit);

// ---------------------- Surgery routes ---------------------- //
router.post(
  '/surgeries',
  // authorize(RecordAuthorization.createSurgery),
  createSurgery
);

// router.get('/surgeries', getAllSurgeries);
// router.get('/surgeries/:id', getSurgery);
// router.put('/surgeries/:id', updateSurgery);
// router.delete('/surgeries/:id', deleteSurgery);

// ---------------------- Medication routes ---------------------- //
router.post(
  '/medications',
  createMedication
);

// router.get('/medications', getAllMedications);
// router.get('/medications/:id', getMedication);
// router.put('/medications/:id', updateMedication);
// router.delete('/medications/:id', deleteMedication);

// ---------------------- Allergy routes ---------------------- //
router.post(
  '/allergies',
  createAllergy
);

// router.get('/allergies', getAllAllergies);
// router.get('/allergies/:id', getAllergy);
// router.put('/allergies/:id', updateAllergy);
// router.delete('/allergies/:id', deleteAllergy);

// ---------------------- Medical Conditions routes ---------------------- //
router.post(
  '/conditions',
  createCondition
);

router.get(
  '/check-authentication',
  authAccessToken,
  (req, res) => {
    res.send({ authenticated: true });
  }
);

// router.get('/conditions', getAllConditions);
// router.get('/conditions/:id', getCondition);
// router.put('/conditions/:id', updateCondition);
// router.delete('/conditions/:id', deleteCondition);

export default router;
