import { Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/login/Login";
import Register from "./components/register/register";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LandingPage from "./components/LandingPage/LandingPage"; // Import the new LandingPage component
import Callback from "./components/Callback"; // Import the new Callback component
import { useUser } from "./components/UserContext"; // Import the useUser hook
import NotAuthorized from "./components/NotAuthorized";
//Admin
import Patients from "./components/AddPatient/Patients";
import AddPatient from "./components/AddPatient/AddPatient";
import PatientsAdmitted from "./components/AdminView/PatientsAdmitted";
import DoctorsAdmitted from "./components/AdminView/DoctorsAdmitted";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Admissions from "./components/AdminView/Admissions";
import AddAdmission from "./components/AdminView/AddAdmission";
import PatientRequests from "./components/AdminView/PatientRequests";

//Doctor 
import AddPatientdata from "./components/AddPatient/AddPatient";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import AiHistory from "./components/History/AiHistory";
import PatientTable from "./components/DoctorView/PatientTable";
import Emergency from "./components/DoctorView/Emergency";
//Patient
import PatientDashboard from "./components/dashboard/PatientDashboard";
import PastExaminations from "./components/PatientPages/PastExaminations";
import TestsAndXrays from "./components/PatientPages/TestsAndXrays"
import RequestAddition from "./components/PatientPages/RequestAddition"
import ExaminationsDetails from "./components/PatientPages/ExaminationsDetails"
import History from "./components/PatientPages/History"
import Hospitals from "./components/PatientPages/Hospitals"
import MedicalRecordForm from "./components/MedicalRecord/MedicalRecordForm";
import XRayUploader from "./components/Xray/Xray";
import Chatbot from "./components/chatbot/chatbot";

function App() {
  const {user} = useUser(); // Get the user and setUser from the UserContext

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route path="/callback" element={<Callback />} /> {/* Add the callback route */}
      <Route path="/login" element={<LoginForm />} />
      {/* <Route path="/logout" element={<LogoutForm />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<div>Page Not Found</div>} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/*Admin*/}
      <Route path="/DoctorsAdmitted" element={<DoctorsAdmitted />} />
      <Route path="/PatientsAdmitted" element={<PatientsAdmitted />} />
      <Route path="/PatientRequests" element={<PatientRequests />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/Admissions" element={<Admissions />} />
      <Route path="/AddAdmission" element={<AddAdmission />} />
      <Route path="/AddPatient" element={<PrivateRoute element={<AddPatientdata />} allowedRoles={['doctor', 'admin']} />} />
      <Route path="/Emergency" element={<PrivateRoute element={<Emergency />} allowedRoles={['doctor', 'admin']} />} />

      {/*Doctor*/}
      <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/add-patient" element={<AddPatient />} />
      <Route path="/patient-table" element={<PatientTable />} />
      <Route path="/AiHistory" element={<AiHistory />} />
      <Route path="/MedicalForm" element={<MedicalRecordForm />} />
      <Route path="/Xray" element={<XRayUploader />} />
      <Route path="/chatbot" element={<Chatbot />} />



      {/*Patient*/}
      <Route path="/PatientDashboard" element={<PatientDashboard />} />
      <Route path="/PastExaminations" element={<PrivateRoute element={<PastExaminations />} allowedRoles={['patient']} />} />
      <Route path="/TestsAndXrays" element={<PrivateRoute element={<TestsAndXrays />} allowedRoles={['doctor', 'patient']} />} />
      <Route path="/RequestAddition" element={<PrivateRoute element={<RequestAddition />} allowedRoles={['patient']} />} />
      <Route path="/ExaminationsDetails" element={<PrivateRoute element={<ExaminationsDetails />} allowedRoles={['patient']} />} />
      <Route path="/History" element={<PrivateRoute element={<History />} allowedRoles={['patient']} />} />
      <Route path="/Hospitals" element={<PrivateRoute element={<Hospitals />} allowedRoles={['patient']} />} />

    </Routes>
  );
}

export default App;
