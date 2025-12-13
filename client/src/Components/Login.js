// src/Components/Login.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Features/UserSlice";

// غيّر اسم الصورة / المسار حسب اللي عندك في المشروع
import clinicImg from "../Images/login.jpg";
import logo from "../Images/images_3.jpg";

const Login = () => {
  // هذا فقط لتغيير شكل الزر (Patient / Doctor / Admin) من الناحية البصرية
  const [roleTab, setRoleTab] = useState("patient"); // patient | doctor | admin

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // نرسل الإيميل والباسورد للباك إند عن طريق ثنك login
      const resultAction = await dispatch(login({ email, password }));

      if (resultAction.error) {
        setErrorMsg("Invalid email or password.");
        setLoading(false);
        return;
      }

      const user = resultAction.payload;
      if (!user) {
        setErrorMsg("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // نتأكد في الداتا بيس أن فيه role مضبوط
      const userRole = user.role || "patient";

      // توجيه حسب نوع الحساب من الداتا بيس
      if (userRole === "admin") {
        navigate("/admin/dashboard"); // صفحة لوحة تحكم الأدمن
      } else if (userRole === "doctor") {
        navigate("/doctor/appoin"); // صفحة مواعيد الدكتور
      } else {
        navigate("/patient/profile"); // المريض يروح للبروفايل
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Login error. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const roleBoxClass = (value) =>
    "login-role-box" + (roleTab === value ? " active" : "");

  return (
    <div className="auth-page login-page">
      <Container className="auth-container">
        <Row className="justify-content-center">
          <Col lg="10">
            <Card className="auth-card shadow-sm border-0">
              <Row className="g-0">
                {/* العمود الأيسر – صورة العيادة مع كرت الديمو */}
                <Col
                  md="6"
                  className="login-left d-none d-md-block position-relative"
                >
                  <img
                    src={clinicImg}
                    alt="Medical clinic"
                    className="login-hero-img"
                  />

                  <div className="login-hero-card shadow">
                    <div className="d-flex align-items-center mb-2">
                      <div className="auth-logo-circle me-2">
                        <img src={logo} alt="Health Guide" />
                      </div>
                      <div>
                        <h6 className="mb-0">Health Guide</h6>
                        <small className="text-muted">
                          Trusted by many patients and healthcare professionals
                          worldwide
                        </small>
                      </div>
                    </div>

                    <div className="login-demo-box mt-2">
                      <div className="fw-semibold small mb-1">
                        Demo Accounts:
                      </div>
                      <ul className="list-unstyled small mb-0">
                        <li>
                          <span className="fw-semibold">Patient:</span>{" "}
                          patient@demo.com / patient123
                        </li>
                        <li>
                          <span className="fw-semibold">Doctor:</span>{" "}
                          doctor@demo.com / doctor123
                        </li>
                        <li>
                          <span className="fw-semibold">Admin:</span>{" "}
                          admin@demo.com / admin123
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>

                {/* العمود الأيمن – فورم اللوق إن مع اختيار الدور (للشكل فقط) */}
                <Col md="6" className="d-flex align-items-center login-right">
                  <CardBody className="w-100 px-4 py-4">
                    <h3 className="auth-title mb-1">Welcome Back</h3>
                    <p className="text-muted small mb-4">
                      Please enter your credentials to sign in
                    </p>

                    {/* اختيار الدور – يؤثر على الشكل فقط */}
                    <Label className="small fw-semibold mb-2">Sign in as</Label>
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      <button
                        type="button"
                        className={roleBoxClass("patient")}
                        onClick={() => setRoleTab("patient")}
                      >
                        <div className="role-icon">👤</div>
                        <div className="role-title">Patient</div>
                        <div className="role-subtitle">Seeking care</div>
                      </button>

                      <button
                        type="button"
                        className={roleBoxClass("doctor")}
                        onClick={() => setRoleTab("doctor")}
                      >
                        <div className="role-icon">🩺</div>
                        <div className="role-title">Doctor</div>
                        <div className="role-subtitle">Healthcare provider</div>
                      </button>

                      <button
                        type="button"
                        className={roleBoxClass("admin")}
                        onClick={() => setRoleTab("admin")}
                      >
                        <div className="role-icon">⚙️</div>
                        <div className="role-title">Admin</div>
                        <div className="role-subtitle">System manager</div>
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="alert alert-danger py-2 small">
                        {errorMsg}
                      </div>
                    )}

                    <Form onSubmit={handleLogin}>
                      <FormGroup className="mb-3">
                        <Label className="small">Email Address</Label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </FormGroup>

                      <FormGroup className="mb-2">
                        <Label className="small">Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </FormGroup>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                          <input
                            id="rememberMe"
                            className="form-check-input"
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                          />
                          <Label
                            className="form-check-label small"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </Label>
                        </div>
                        <button
                          type="button"
                          className="btn btn-link p-0 small"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <Button
                        type="submit"
                        color="primary"
                        className="w-100 auth-submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </Form>

                    <p className="text-center small mt-3 mb-0">
                      Don't have an account?{" "}
                      <Link to="/register">Create Account</Link>
                    </p>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
