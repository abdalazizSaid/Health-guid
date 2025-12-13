// src/pages/Register.js
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerStep1Schema } from "../Validations/UserValidations";

const Register = () => {
  const navigate = useNavigate();

  // نفس ستايل الكود القديم useState لكل حقل
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // react-hook-form + yupResolver مثل الكود القديم
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerStep1Schema),
  });

  // نفس فكرة onSubmit القديمة لكن هنا يشيك الايميل ثم يوديك للصفحة الثانية
  const onSubmit = async (data) => {
    setServerError("");
    setEmailError("");

    try {
      setLoading(true);

      const res = await axios.post(`${ENV.SERVER_URL}/checkEmail`, {
        email: data.email,
      });

      if (res.data.exists) {
        setEmailError("This email is already registered.");
        return;
      }

      const step1Data = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      };

      // ننقل بيانات الخطوة الاولى للصفحة الثانية
      navigate("/register/details", { state: { step1Data } });
    } catch (err) {
      setServerError("Server error while checking email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="register-card p-4 p-md-5">
              <h2 className="mb-1 text-center">Create Your Account</h2>
              <p className="text-muted small text-center mb-4">
                Join us to start managing your health journey
              </p>

              <div className="register-stepper mb-4">
                <div className="step active">
                  <span className="step-circle">1</span>
                  <span>Account details</span>
                </div>
                <div className="step">
                  <span className="step-circle">2</span>
                  <span>Profile info</span>
                </div>
              </div>

              {serverError && (
                <p className="text-danger small mb-2">{serverError}</p>
              )}
              {emailError && (
                <p className="text-danger small mb-2">{emailError}</p>
              )}

              <p className="small text-muted mb-3">
                Account type <span className="fw-semibold">Patient</span>
              </p>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="gy-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Full Name *</Label>
                      <input
                        type="text"
                        id="fullName"
                        className="form-control"
                        placeholder="Enter your full name..."
                        {...register("fullName", {
                          onChange: (e) => setFullName(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.fullName?.message}
                      </p>
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Phone Number *</Label>
                      <input
                        type="text"
                        id="phoneNumber"
                        className="form-control"
                        placeholder="Enter your phone number..."
                        {...register("phoneNumber", {
                          onChange: (e) => setPhoneNumber(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.phoneNumber?.message}
                      </p>
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Email Address *</Label>
                      <input
                        type="text"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email..."
                        {...register("email", {
                          onChange: (e) => setEmail(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.email?.message}
                      </p>
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Password *</Label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter your password..."
                        {...register("password", {
                          onChange: (e) => setPassword(e.target.value),
                        })}
                      />

                      <p className="error text-danger small mb-0">
                        {errors.password?.message}
                      </p>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex align-items-center gap-2 my-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="form-check-input"
                    style={{ width: 16, height: 16 }}
                    {...register("agreeTerms")}
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="small mb-0 form-check-label"
                  >
                    I agree to the{" "}
                    <button type="button" className="link-inline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="link-inline">
                      Privacy Policy
                    </button>
                  </label>
                </div>
                <p className="error text-danger small mb-2">
                  {errors.agreeTerms?.message}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="small">
                    Already have an account
                    <Link to="/login" className="ms-1">
                      Sign In
                    </Link>
                  </div>
                  <Button
                    color="primary"
                    className="px-4"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Checking..." : "Continue"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
