import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";

import Header from "./Components/Header";
import Home from "./Components/Home";
import SymptomChecker from "./Components/SymptomChecker";
import Login from "./Components/Login";
import Register from "./Components/Register";
import PatientProfile from "./Components/PatientProfile";
import RegisterDetails from "./Components/RegisterDetails";
import AppointmentHistory from "./Components/AppointmentHistory";
import AdminDashboard from "./Components/AdminDashboard";
import DoctorAppointments from "./Components/DoctorAppointments";
import DoctorProfile from "./Components/DoctorProfile";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="app-main">
        <Container fluid className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/details" element={<RegisterDetails />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/appointments" element={<AppointmentHistory />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="/doctor/appoin" element={<DoctorAppointments />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
