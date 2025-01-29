// Only implemented create routes for now
import express from 'express';
import {
  createRecord,
  getRecord,
  deleteRecord,
} from '../controllers/record/index.js';
import {
  createVisit,
  getVisit,
  updateVisit,
  deleteVisit,
  getAllVisits,
} from '../controllers/visit/index.js';
import {
  createSurgery,
  getSurgery,
  updateSurgery,
  deleteSurgery,
  getAllSurgeries,
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
import { authorizeUser } from '../middleware/access-middleware.js';

const router = express.Router();

// ---------------------- Medical Records ---------------------- //
router.post(
  '/medical-records',
  authenticate,
  authorizeUser('createRecord'),
  createRecord
);

router.get(
  '/medical-records/:id',
  authenticate,
  authorizeUser('getRecord'),
  getRecord
);

router.delete(
  '/medical-records/:id',
  deleteRecord
);

// ---------------------- Visit routes ---------------------- //
router.post(
  '/visits',
  authenticate,
  authorizeUser('createVisit'),
  createVisit
);

router.get(
  '/visits/:id',
  authenticate,
  authorizeUser('getVisit'),
  getVisit
);

router.get(
  '/visits',
  authenticate,
  authorizeUser('getAllVisits'),
  getAllVisits
);

router.put(
  '/visits/:id',
  authenticate,
  authorizeUser('updateVisit'),
  updateVisit
);

router.delete(
  '/visits/:id',
  authenticate,
  authorizeUser('deleteVisit'),
  deleteVisit
);

// ---------------------- Surgery routes ---------------------- //
router.post(
  '/surgeries',
  authenticate,
  authorizeUser('createSurgery'),
  createSurgery
);

router.get(
  '/surgeries',
  authenticate,
  authorizeUser('getAllSurgeries'),
  getAllSurgeries
);

router.get(
  '/surgeries/:id',
  authenticate,
  authorizeUser('getSurgery'),
  getSurgery
);

router.put(
  '/surgeries/:id',
  authenticate,
  authorizeUser('updateSurgery'),
  updateSurgery
);

router.delete(
  '/surgeries/:id',
  authenticate,
  authorizeUser('deleteSurgery'),
  deleteSurgery
);

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
