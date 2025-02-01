import { Router } from 'express';
import { register, login, logout, verifyEmail, resendEmail, forgotPassword, resetPassword, refreshToken, changePassword, editDoctor, getDoctor, deleteDoctor, viewPatientByNationalId } from '../controllers/doctor-controller-index.js';
import { authorizeUser, authAccessToken } from '../middleware/middleware-index.js';

const router = Router();

// AUTH
router.post('/register', (req, res) => {
    req.body.user.role = 'doctor';
    register(req, res);
});

router.post('/login', (req, res) => {
    req.body.role = 'doctor';
    login(req, res);
});  

router.post('/verify-email', verifyEmail);
router.post('/resend-email', resendEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/logout', authAccessToken, logout);

router.get('/check-authentication', authAccessToken, (req, res) => {
    res.send({authenticated: true});
})

// router.get('/check-authorization', authAccessToken, authorizeUser, (req, res) => {
//     res.send({authorized: true, role: req.user.role});
// })

router.get('/check-authorization', authAccessToken, authorizeUser('doctor'), (req, res) => {
    res.send({ authorized: true, role: req.auth.payload.role });
  });

router.post('/refreshToken', authAccessToken, refreshToken);


// EDIT
router.post('/change-password', authAccessToken, changePassword);
router.patch('/edit', authAccessToken, editDoctor);

router.get('/profile', authAccessToken, getDoctor);
router.delete('/delete', authAccessToken, deleteDoctor);
router.get('/patient/:id', authAccessToken, viewPatientByNationalId);

export default router