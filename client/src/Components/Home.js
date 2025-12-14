import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppointmentModal from "./AppointmentModal";
import heroImg from "../Images/images.jpg";
import quickImg from "../Images/images.png";

const Home = () => {
  const [showAppointment, setShowAppointment] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user);

  const openAppointment = () => setShowAppointment(true);
  const closeAppointment = () => setShowAppointment(false);

  const goToSymptomChecker = () => navigate("/symptom-checker");

  const goToRegister = () => {
    if (user && user.email) {
      return;
    }
    navigate("/register");
  };

  return (
    <>
      <div className="home-hero-wrapper">
        <Container>
          <Row className="align-items-center gy-4">
            <Col md={6}>
              <h1 className="hero-title">Your Smart Health Guide</h1>
              <p className="hero-subtitle">
                Get instant symptom analysis, book appointments with healthcare
                professionals, and manage your health journey in one place
              </p>
            </Col>
            <Col md={6}>
              <div className="hero-image-card">
                <img src={heroImg} alt="Doctor and patient" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <section className="why-section">
        <Container>
          <div className="text-center mb-4">
            <h2 className="section-heading">Why Choose Health Guide</h2>
            <p className="section-subtitle">
              Experience the future of healthcare with our comprehensive
              platform designed for your wellbeing
            </p>
          </div>

          <Row className="gy-4">
            <Col md={4}>
              <Card className="feature-card">
                <CardBody>
                  <div className="feature-icon">🤖</div>
                  <h5>AI Powered Analysis</h5>
                  <p>
                    Describe your symptoms and get instant AI driven health
                    insights
                  </p>
                  <Button
                    color="light"
                    className="btn-outline-primary w-100"
                    onClick={goToSymptomChecker}
                  >
                    Try Symptom Checker
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <CardBody>
                  <div className="feature-icon">📅</div>
                  <h5>Easy Booking</h5>
                  <p>
                    Schedule appointments with qualified doctors in a few clicks
                  </p>
                  <Button
                    color="light"
                    className="btn-outline-primary w-100"
                    onClick={openAppointment}
                  >
                    Book Appointment
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <CardBody>
                  <div className="feature-icon">🔒</div>
                  <h5>Secure and Private</h5>
                  <p>
                    Your health data is protected with industry standard
                    security
                  </p>
                  <Button
                    color="light"
                    className="btn-outline-primary w-100"
                    onClick={goToRegister}
                  >
                    Create Account
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="quick-booking-section">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <Card className="quick-booking-card">
                <CardBody>
                  <div className="quick-header">
                    <span className="quick-pill">Quick Booking</span>
                    <h4>Book Your Appointment</h4>
                    <p>
                      Schedule a consultation with experienced healthcare
                      professionals at the time that works best for you
                    </p>
                  </div>

                  <ul className="quick-list">
                    <li>Choose from many qualified doctors</li>
                    <li>Flexible time slots available</li>
                    <li>Instant confirmation</li>
                  </ul>

                  <Button color="primary" onClick={openAppointment}>
                    Book Appointment Now
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col lg={5}>
              <div className="quick-image-card">
                <img src={quickImg} alt="Doctors discussing scan" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section">
        <Container>
          <div className="cta-card">
            <h3 className="mb-2">Ready to Take Control of Your Health</h3>
            <p className="mb-4">
              Join thousands of users who trust Health Guide for their
              healthcare needs
            </p>
            <Button color="light" className="cta-btn" onClick={goToRegister}>
              Create Free Account
            </Button>
          </div>
        </Container>
      </section>

      <AppointmentModal isOpen={showAppointment} toggle={closeAppointment} />
    </>
  );
};

export default Home;
