import { Router } from "express";
import { authAccessToken } from "../middleware/auth-middleware.js";
import { createAdmission, getAdmissions, getHospitalDoctors, register } from "../controllers/admin-controller.js";


const router = Router();

router.post('/register', (req, res) => {
    req.body.user.role = 'admin';
    register(req, res);
});
router.get('/admissions', authAccessToken, getAdmissions); // get all hospital ongoing admissions paginated
router.post('/admission', authAccessToken, createAdmission);
router.get('/hospital/:id/doctors', authAccessToken, getHospitalDoctors); // paginated
// router.get('hospital/:id/patients', authAccessToken, getHospitalPatients);
// discharge endpoint

// list patients assigned to doctor
// list of all visits of a patient related to this doctor

export default router;