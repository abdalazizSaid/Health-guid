// src/pages/PatientProfile.js
import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../Features/UserSlice";
import { getAppointmentsByUser } from "../Features/AppointmentSlice";
import Location from "../Components/Location";

// لون البادج حسب حالة الموعد
const getStatusColor = (status) => {
  if (!status) return "secondary";
  switch (status.toLowerCase()) {
    case "accepted":
      return "success";
    case "rejected":
      return "danger";
    case "completed":
      return "primary";
    case "pending":
    default:
      return "secondary";
  }
};

const PatientProfile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const appointmentState = useSelector((state) => state.appointments);

  const {
    appointments = [],
    isLoading: apptLoading = false,
    isError: apptIsError = false,
    errorMessage: apptErrorMsg = "",
  } = appointmentState || {};

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const apptError = apptIsError ? apptErrorMsg : "";

  useEffect(() => {
    if (user && user._id) {
      setProfile(user);
      dispatch(getAppointmentsByUser(user._id));
    }
  }, [user, dispatch]);

  // حساب اقرب موعد وكل المواعيد القادمة مرتبة
  const { nextAppointment, upcomingAppointments } = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return { nextAppointment: null, upcomingAppointments: [] };
    }

    const today = new Date();

    const getDateObj = (app) => {
      const d = app.preferredDate || app.date;
      return d ? new Date(d) : null;
    };

    const sortedFuture = appointments
      .map((app) => ({ app, d: getDateObj(app) }))
      .filter((x) => x.d && x.d >= today)
      .sort((a, b) => {
        if (a.d < b.d) return -1;
        if (a.d > b.d) return 1;
        return 0;
      })
      .map((x) => x.app);

    return {
      nextAppointment: sortedFuture[0] || null,
      upcomingAppointments: sortedFuture,
    };
  }, [appointments]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile || !profile._id) return;

    setProfileError("");
    setProfileSuccess("");

    const updates = {
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      bloodType: profile.bloodType,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      streetAddress: profile.streetAddress,
      city: profile.city,
      state: profile.state,
      zipCode: profile.zipCode,
      emergencyContactName: profile.emergencyContactName,
      emergencyContactPhone: profile.emergencyContactPhone,
      emergencyRelationship: profile.emergencyRelationship,
    };

    try {
      setSaving(true);
      const updated = await dispatch(
        updateProfile({ id: profile._id, updates })
      ).unwrap();

      setProfile(updated);
      setProfileSuccess("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      setProfileError(err?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return null;
  }

  const formatDate = (app) => {
    const dateStr = app.preferredDate || app.date;
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (app) => {
    return app.preferredTime || app.time || "Not set";
  };

  return (
    <div className="patient-page">
      <Container>
        {/* عنوان الصفحة */}
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">Patient Profile</h2>
            <p className="patient-subtitle">
              View and update your personal information, location and
              appointment overview
            </p>
          </Col>
        </Row>

        {/* الكروت الثلاثة فوق فقط */}
        <Row className="gy-4 mb-4">
          {/* معلومات المريض */}
          <Col lg={4}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Patient Information</CardTitle>
                <CardText className="small text-muted mb-3">
                  Basic details from your profile
                </CardText>

                {profileError && (
                  <p className="small text-danger mb-2">{profileError}</p>
                )}
                {profileSuccess && (
                  <p className="small text-success mb-2">{profileSuccess}</p>
                )}

                <Form>
                  {/* الاسم والايميل فقط عرض */}
                  <FormGroup className="mb-2">
                    <Label className="label small">Full Name</Label>
                    <input
                      className="form-control"
                      value={profile.name || ""}
                      disabled
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Email</Label>
                    <input
                      className="form-control"
                      value={profile.email || ""}
                      disabled
                    />
                  </FormGroup>

                  {/* باقي الحقول قابلة للتعديل */}
                  <FormGroup className="mb-2">
                    <Label className="label small">Phone Number</Label>
                    <input
                      name="phoneNumber"
                      className="form-control"
                      value={profile.phoneNumber || ""}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </FormGroup>

                  <Row className="mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <Label className="label small">Date of Birth</Label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={
                            profile.dateOfBirth
                              ? profile.dateOfBirth.slice(0, 10)
                              : ""
                          }
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="label small">Gender</Label>
                        <select
                          name="gender"
                          className="form-select"
                          value={profile.gender || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <FormGroup>
                        <Label className="label small">Blood Type</Label>
                        <select
                          name="bloodType"
                          className="form-select"
                          value={profile.bloodType || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
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
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label className="label small">Height (cm)</Label>
                        <input
                          name="heightCm"
                          className="form-control"
                          value={profile.heightCm || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label className="label small">Weight (kg)</Label>
                        <input
                          name="weightKg"
                          className="form-control"
                          value={profile.weightKg || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-2">
                    <Label className="label small">Street Address</Label>
                    <input
                      name="streetAddress"
                      className="form-control"
                      value={profile.streetAddress || ""}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </FormGroup>

                  <Row className="mb-2">
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">City</Label>
                        <input
                          name="city"
                          className="form-control"
                          value={profile.city || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">State</Label>
                        <input
                          name="state"
                          className="form-control"
                          value={profile.state || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">Zip Code</Label>
                        <input
                          name="zipCode"
                          className="form-control"
                          value={profile.zipCode || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className="mb-2">
                    <Label className="label small">
                      Emergency Contact Name
                    </Label>
                    <input
                      name="emergencyContactName"
                      className="form-control"
                      value={profile.emergencyContactName || ""}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </FormGroup>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label className="label small">
                          Emergency Contact Phone
                        </Label>
                        <input
                          name="emergencyContactPhone"
                          className="form-control"
                          value={profile.emergencyContactPhone || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label className="label small">Relationship</Label>
                        <input
                          name="emergencyRelationship"
                          className="form-control"
                          value={profile.emergencyRelationship || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    {!editing && (
                      <Button
                        size="sm"
                        color="primary"
                        type="button"
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                    {editing && (
                      <>
                        <Button
                          size="sm"
                          color="light"
                          type="button"
                          onClick={() => {
                            setProfile(user);
                            setEditing(false);
                          }}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* كرت الموعد القادم وكل المواعيد القادمة تحته */}
          <Col lg={4}>
            <Card className="patient-card next-appointment-card">
              <CardBody>
                <CardTitle tag="h5">Next Appointment</CardTitle>
                <CardText className="small text-muted mb-3">
                  Your upcoming scheduled visit
                </CardText>

                {apptLoading && <p className="small mb-0">Loading...</p>}
                {apptError && (
                  <p className="small text-danger mb-0">{apptError}</p>
                )}

                {!apptLoading && !apptError && !nextAppointment && (
                  <p className="small mb-0">
                    You have no upcoming appointments
                  </p>
                )}

                {nextAppointment && (
                  <>
                    <div className="next-appointment-details mb-2">
                      <div className="mb-1 d-flex align-items-center gap-2">
                        <span className="label">Date</span>
                        <span className="value">
                          {formatDate(nextAppointment)}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="label">Time</span>
                        <span className="value">
                          {formatTime(nextAppointment)}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="label">Doctor</span>
                        <span className="value">
                          {nextAppointment.doctor ||
                            nextAppointment.doctorName ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="label">Specialty</span>
                        <span className="value">
                          {nextAppointment.specialty || "General"}
                        </span>
                      </div>
                      {nextAppointment.status && (
                        <Badge
                          color={getStatusColor(nextAppointment.status)}
                          pill
                          className="mt-2"
                        >
                          {nextAppointment.status}
                        </Badge>
                      )}
                      {nextAppointment.doctorNote && (
                        <p className="small mt-2 mb-0">
                          <span className="fw-semibold">Doctor note</span>{" "}
                          {nextAppointment.doctorNote}
                        </p>
                      )}
                    </div>

                    {upcomingAppointments.length > 1 && (
                      <>
                        <hr className="my-3" />
                        <p className="small text-muted mb-2">
                          Other upcoming appointments
                        </p>
                        <ul className="list-unstyled mb-0">
                          {upcomingAppointments.slice(1).map((app) => (
                            <li key={app._id} className="small mb-1">
                              <span className="fw-semibold">
                                {formatDate(app)}
                              </span>
                              {" · "}
                              <span>{formatTime(app)}</span>
                              {app.doctor || app.doctorName ? (
                                <>
                                  {" · "}
                                  <span>{app.doctor || app.doctorName}</span>
                                </>
                              ) : null}
                              {app.status && (
                                <>
                                  {" · "}
                                  <span className="text-muted">
                                    {app.status}
                                  </span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* كرت اللوكيشن */}
          <Col lg={4}>
            <Card className="patient-card location-card">
              <CardBody>
                <CardTitle tag="h5">Current Location</CardTitle>
                <CardText className="small text-muted mb-3">
                  Based on your browser location
                </CardText>

                <div className="location-inner">
                  <Location />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientProfile;
