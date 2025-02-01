// AUTH
export { register } from './register.js'
export { login } from './login.js'
export { default as logout } from './doctor/logout.js'
export { default as verifyEmail } from './doctor/verify-email.js'
export { default as resendEmail } from './doctor/resend-email-code.js'
export { forgotPassword } from './doctor/forgot-password.js'
export { default as resetPassword } from './doctor/reset-password.js'
export { default as refreshToken } from './doctor/refresh-accessToken.js'
// EDIT
export { default as changePassword } from './doctor/change-password.js'
export { default as editDoctor } from './doctor/edit-doctor.js'

// OTHER
export { default as getDoctor } from './doctor/get-doctor.js'
export { default as deleteDoctor } from './doctor/delete-doctor.js'
export { default as viewPatientByNationalId } from './doctor/view-patient.js'