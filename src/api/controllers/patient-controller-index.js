// AUTH
export { register } from './register.js'
export { login } from './login.js'
export { default as logout } from './patient/logout.js'
export { default as verifyEmail } from './patient/verify-email.js'
export { default as resendEmail } from './patient/resend-email-code.js'
export { forgotPassword } from './forgot-password.js'
export { default as resetPassword } from './patient/reset-password.js'
export { default as refreshToken } from './patient/refresh-accessToken.js'
// // EDIT
export { changePassword } from './change-password.js'
export { default as editPatient } from './patient/edit-patient.js'

// // OTHER
export { getUser } from './get-user.js'
export { default as deletePatient } from './patient/delete-patient.js'
export { default as getAllHospitals } from './patient/get-all-hospitals.js'