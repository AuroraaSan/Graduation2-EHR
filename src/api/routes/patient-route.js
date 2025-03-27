import { Router } from 'express';
import { register, login, logout, verifyEmail, resendEmail, forgotPassword, resetPassword, refreshToken, changePassword, editPatient, deletePatient, getAllHospitals } from '../controllers/patient-controller-index.js';
import { authorizeUser, authAccessToken } from '../middleware/middleware-index.js';

const router = Router();

// AUTH
router.post('/register', (req, res) => {
    req.body.user.role = 'patient';
    register(req, res);
});
router.post('/login', (req, res) => {
    req.body.role = 'patient';
    login(req, res);
});

router.post('/verify-email', verifyEmail);
router.post('/resend-email', resendEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/logout', authAccessToken, logout);

router.get('/check-authentication', authAccessToken, (req, res) => {
    console.log(req.user);
    res.send({authenticated: true});
})

router.get('/check-authorization', authAccessToken, authorizeUser, (req, res) => {
    res.send({authorized: true, role: req.user.role});
})

router.post('/refreshToken', authAccessToken, refreshToken);

// EDIT
router.post('/change-password', authAccessToken, changePassword);
router.put('/edit', authAccessToken, editPatient);

router.delete('/delete', authAccessToken, authorizeUser("delete:user"), deletePatient);

router.get('/hospitals', authAccessToken, authorizeUser('getAllHospitals'), getAllHospitals);

export default router