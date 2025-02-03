// Only implemented create routes for now
import express from "express";
import {
  createRecord,
  getRecord,
  deleteRecord,
} from "../controllers/record/index.js";
import {
  createVisit,
  getVisit,
  updateVisit,
  deleteVisit,
  getAllVisits,
  getReport,
} from "../controllers/visit/index.js";
import {
  createSurgery,
  getSurgery,
  updateSurgery,
  deleteSurgery,
  getAllSurgeries,
} from "../controllers/surgery/index.js";
import {
  createMedication,
  getMedication,
  updateMedication,
  deleteMedication,
  getAllMedications,
} from "../controllers/medication/index.js";
import {
  createAllergy,
  getAllergy,
  getAllAllergies,
  updateAllergy,
  deleteAllergy,
} from "../controllers/allergy/index.js";
import {
  createCondition,
  getCondition,
  getAllConditions,
  updateCondition,
  deleteCondition,
} from "../controllers/condition/index.js";
import {
  authAccessToken,
  authenticate,
} from "../middleware/auth-middleware.js";
import { authorizeUser } from "../middleware/access-middleware.js";

const router = express.Router();

// ---------------------- Medical Records ---------------------- //
router.post(
  "/medical-records",
  authenticate,
  authorizeUser("createRecord"),
  createRecord
);

router.get(
  "/medical-records/:id",
  authenticate,
  authorizeUser("getRecord"),
  getRecord
);

router.delete("/medical-records/:id", deleteRecord);

// ---------------------- Visit routes ---------------------- //
router.post("/visits", authenticate, authorizeUser("createVisit"), createVisit);

router.get("/visits/:id", authenticate, authorizeUser("getVisit"), getVisit);

router.get(
  "/visits",
  authenticate,
  authorizeUser("getAllVisits"),
  getAllVisits
);

router.put(
  "/visits/:id",
  authenticate,
  authorizeUser("updateVisit"),
  updateVisit
);

router.delete(
  "/visits/:id",
  authenticate,
  authorizeUser("deleteVisit"),
  deleteVisit
);

router.get(
  "/visits/:id/report",
  // authenticate,
  // authorizeUser('getReport'),
  getReport
);

// ---------------------- Surgery routes ---------------------- //
router.post(
  "/surgeries",
  authenticate,
  authorizeUser("createSurgery"),
  createSurgery
);

router.get(
  "/surgeries",
  authenticate,
  authorizeUser("getAllSurgeries"),
  getAllSurgeries
);

router.get(
  "/surgeries/:id",
  authenticate,
  authorizeUser("getSurgery"),
  getSurgery
);

router.put(
  "/surgeries/:id",
  authenticate,
  authorizeUser("updateSurgery"),
  updateSurgery
);

router.delete(
  "/surgeries/:id",
  authenticate,
  authorizeUser("deleteSurgery"),
  deleteSurgery
);

// ---------------------- Medication routes ---------------------- //
router.post(
  "/medications",
  authenticate,
  authorizeUser("createMedication"),
  createMedication
);

router.get(
  "/medications",
  authenticate,
  authorizeUser("getAllMedications"),
  getAllMedications
);

router.get(
  "/medications/:id",
  authenticate,
  authorizeUser("getMedication"),
  getMedication
);

router.put(
  "/medications/:id",
  authenticate,
  authorizeUser("updateMedication"),
  updateMedication
);

router.delete(
  "/medications/:id",
  authenticate,
  authorizeUser("deleteMedication"),
  deleteMedication
);

// ---------------------- Allergy routes ---------------------- //
router.post(
  "/allergies",
  authenticate,
  authorizeUser("createAllergy"),
  createAllergy
);

router.get(
  "/allergies",
  authenticate,
  authorizeUser("getAllAllergies"),
  getAllAllergies
);

router.get(
  "/allergies/:id",
  authenticate,
  authorizeUser("getAllergy"),
  getAllergy
);

router.put(
  "/allergies/:id",
  authenticate,
  authorizeUser("updateAllergy"),
  updateAllergy
);

router.delete(
  "/allergies/:id",
  authenticate,
  authorizeUser("deleteAllergy"),
  deleteAllergy
);

// ---------------------- Medical Conditions routes ---------------------- //
router.post(
  "/conditions",
  authenticate,
  authorizeUser("createCondition"),
  createCondition
);

router.get(
  "/conditions",
  authenticate,
  authorizeUser("getAllConditions"),
  getAllConditions
);

router.get(
  "/conditions/:id",
  authenticate,
  authorizeUser("getCondition"),
  getCondition
);

router.put(
  "/conditions/:id",
  authenticate,
  authorizeUser("updateCondition"),
  updateCondition
);

router.delete(
  "/conditions/:id",
  authenticate,
  authorizeUser("deleteCondition"),
  deleteCondition
);

router.get("/check-authentication", authAccessToken, (req, res) => {
  res.send({ authenticated: true });
});

export default router;
