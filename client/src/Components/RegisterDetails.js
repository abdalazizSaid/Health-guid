// src/pages/RegisterDetails.js
import {
  Button,
  Col,
  Row,
  Container,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Features/UserSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerStep2Schema } from "../Validations/UserValidations";

const RegisterDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const step1Data = location.state?.step1Data;

  useEffect(() => {
    if (!step1Data) {
      navigate("/register");
    }
  }, [step1Data, navigate]);

  // useState لكل حقل مثل الكود القديم
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerStep2Schema),
  });

  const onSubmit = async (data) => {
    setServerError("");

    const payload = {
      // step 1
      name: step1Data.fullName,
      email: step1Data.email,
      password: step1Data.password,
      role: "patient",
      phoneNumber: step1Data.phoneNumber,

      // step 2
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodType: data.bloodType,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.stateValue,
      zipCode: data.zipCode,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      emergencyRelationship: data.emergencyRelationship,
    };

    try {
      setLoading(true);
      await dispatch(registerUser(payload)).unwrap();
      navigate("/login");
    } catch (err) {
      setServerError("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!step1Data) return null;

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="register-card p-4 p-md-5">
              <h2 className="mb-1 text-center">
                Complete Your Patient Profile
              </h2>
              <p className="text-muted small text-center mb-4">
                Please provide detailed information for better service
              </p>

              <div className="register-stepper mb-4">
                <div className="step">
                  <span className="step-circle">1</span>
                  <span>Account details</span>
                </div>
                <div className="step active">
                  <span className="step-circle">2</span>
                  <span>Profile info</span>
                </div>
              </div>

              {serverError && (
                <p className="text-danger small mb-2">{serverError}</p>
              )}

              {/* بيانات الخطوة الاولى للعرض فقط */}
              <div className="mb-4">
                <h6 className="small text-uppercase text-muted mb-2">
                  Account overview
                </h6>
                <Row className="gy-2">
                  <Col md={6}>
                    <Label className="small mb-1">Full Name</Label>
                    <input
                      className="form-control"
                      value={step1Data.fullName}
                      disabled
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="small mb-1">Email</Label>
                    <input
                      className="form-control"
                      value={step1Data.email}
                      disabled
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="small mb-1">Phone Number</Label>
                    <input
                      className="form-control"
                      value={step1Data.phoneNumber}
                      disabled
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="small mb-1">Account Type</Label>
                    <input className="form-control" value="Patient" disabled />
                  </Col>
                </Row>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <h6 className="small text-uppercase text-muted mb-2">
                  Personal Information
                </h6>
                <Row className="gy-3 mb-3">
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Date of Birth *</Label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        className="form-control"
                        {...register("dateOfBirth", {
                          onChange: (e) => setDateOfBirth(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.dateOfBirth?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Gender *</Label>
                      <select
                        id="gender"
                        className="form-select"
                        {...register("gender", {
                          onChange: (e) => setGender(e.target.value),
                        })}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <p className="error text-danger small mb-0">
                        {errors.gender?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Blood Type *</Label>
                      <select
                        id="bloodType"
                        className="form-select"
                        {...register("bloodType", {
                          onChange: (e) => setBloodType(e.target.value),
                        })}
                      >
                        <option value="">Select type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      <p className="error text-danger small mb-0">
                        {errors.bloodType?.message}
                      </p>
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Height cm</Label>
                      <input
                        type="number"
                        id="heightCm"
                        className="form-control"
                        {...register("heightCm", {
                          onChange: (e) => setHeightCm(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.heightCm?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="small mb-1">Weight kg</Label>
                      <input
                        type="number"
                        id="weightKg"
                        className="form-control"
                        {...register("weightKg", {
                          onChange: (e) => setWeightKg(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.weightKg?.message}
                      </p>
                    </FormGroup>
                  </Col>
                </Row>

                <h6 className="small text-uppercase text-muted mb-2">
                  Address Information
                </h6>
                <Row className="gy-3 mb-3">
                  <Col md={12}>
                    <FormGroup>
                      <Label className="small mb-1">Street Address</Label>
                      <input
                        type="text"
                        id="streetAddress"
                        className="form-control"
                        {...register("streetAddress", {
                          onChange: (e) => setStreetAddress(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.streetAddress?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">City</Label>
                      <input
                        type="text"
                        id="city"
                        className="form-control"
                        {...register("city", {
                          onChange: (e) => setCity(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.city?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">State</Label>
                      <input
                        type="text"
                        id="stateValue"
                        className="form-control"
                        {...register("stateValue", {
                          onChange: (e) => setStateValue(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.stateValue?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Zip Code</Label>
                      <input
                        type="text"
                        id="zipCode"
                        className="form-control"
                        {...register("zipCode", {
                          onChange: (e) => setZipCode(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.zipCode?.message}
                      </p>
                    </FormGroup>
                  </Col>
                </Row>

                <h6 className="small text-uppercase text-muted mb-2">
                  Emergency Contact
                </h6>
                <Row className="gy-3 mb-3">
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Contact Name</Label>
                      <input
                        type="text"
                        id="emergencyContactName"
                        className="form-control"
                        {...register("emergencyContactName", {
                          onChange: (e) =>
                            setEmergencyContactName(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.emergencyContactName?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Contact Phone</Label>
                      <input
                        type="text"
                        id="emergencyContactPhone"
                        className="form-control"
                        {...register("emergencyContactPhone", {
                          onChange: (e) =>
                            setEmergencyContactPhone(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.emergencyContactPhone?.message}
                      </p>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label className="small mb-1">Relationship</Label>
                      <input
                        type="text"
                        id="emergencyRelationship"
                        className="form-control"
                        {...register("emergencyRelationship", {
                          onChange: (e) =>
                            setEmergencyRelationship(e.target.value),
                        })}
                      />
                      <p className="error text-danger small mb-0">
                        {errors.emergencyRelationship?.message}
                      </p>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    type="button"
                    outline
                    disabled={loading}
                    onClick={() =>
                      navigate("/register", { state: { step1Data } })
                    }
                  >
                    Back
                  </Button>
                  <Button
                    color="primary"
                    className="px-4"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </div>

                <div className="small text-center mt-3">
                  Already have an account
                  <Link to="/login" className="ms-1">
                    Sign In
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterDetails;
