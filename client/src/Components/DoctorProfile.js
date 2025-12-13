// src/pages/DoctorProfile.js
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
  Input,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

const DoctorProfile = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState("");
  const [updatingApptId, setUpdatingApptId] = useState(null);
  const [notesDraft, setNotesDraft] = useState({});

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/login");
      return;
    }
    setProfile(user);
  }, [user, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setApptLoading(true);
        setApptError("");

        const res = await axios.get(`${ENV.SERVER_URL}/appointments`, {
          params: { doctorId: user?._id },
        });

        setAppointments(res.data || []);
      } catch (err) {
        console.error(err);
        setApptError("Failed to load appointments");
      } finally {
        setApptLoading(false);
      }
    };

    if (user && user._id) {
      fetchAppointments();
    }
  }, [user]);

  const now = new Date();

  const { upcoming, past } = useMemo(() => {
    const upcomingArr = [];
    const pastArr = [];

    appointments.forEach((app) => {
      const d = new Date(
        `${app.preferredDate}T${app.preferredTime || "00:00"}`
      );
      if (d >= now) {
        upcomingArr.push(app);
      } else {
        pastArr.push(app);
      }
    });

    upcomingArr.sort((a, b) => {
      const da = new Date(`${a.preferredDate}T${a.preferredTime || "00:00"}`);
      const db = new Date(`${b.preferredDate}T${b.preferredTime || "00:00"}`);
      return da - db;
    });

    pastArr.sort((a, b) => {
      const da = new Date(`${a.preferredDate}T${a.preferredTime || "00:00"}`);
      const db = new Date(`${b.preferredDate}T${b.preferredTime || "00:00"}`);
      return db - da;
    });

    return { upcoming: upcomingArr, past: pastArr };
  }, [appointments, now]);

  const statusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "accepted":
        return "success";
      case "rejected":
        return "danger";
      case "completed":
        return "secondary";
      default:
        return "warning";
    }
  };

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

    const payload = {
      phoneNumber: profile.phoneNumber,
      streetAddress: profile.streetAddress,
      city: profile.city,
      state: profile.state,
      zipCode: profile.zipCode,
    };

    try {
      setSavingProfile(true);
      const res = await axios.put(
        `${ENV.SERVER_URL}/users/${profile._id}`,
        payload
      );
      const updatedUser = res.data.user || res.data;
      setProfile(updatedUser);
      setProfileSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setProfileError("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleNoteChange = (id, value) => {
    setNotesDraft((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveAppointment = async (id) => {
    try {
      setUpdatingApptId(id);
      setApptError("");

      const app = appointments.find((a) => a._id === id);
      if (!app) return;

      const res = await axios.put(
        `${ENV.SERVER_URL}/appointments/${id}/status`,
        {
          status: app.status || "pending",
          doctorNote:
            notesDraft[id] !== undefined
              ? notesDraft[id]
              : app.doctorNote || "",
        }
      );

      const updated = res.data.appointment || res.data;

      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
    } catch (err) {
      console.error(err);
      setApptError("Failed to update appointment");
    } finally {
      setUpdatingApptId(null);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="patient-page">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">Doctor Profile</h2>
            <p className="patient-subtitle">
              Manage your personal information and view your appointments
            </p>
          </Col>
        </Row>

        <Row className="gy-4 mb-4">
          <Col lg={5}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Personal Information</CardTitle>
                <CardText className="small text-muted mb-3">
                  Basic details for your account
                </CardText>

                {profileError && (
                  <p className="small text-danger mb-2">{profileError}</p>
                )}
                {profileSuccess && (
                  <p className="small text-success mb-2">{profileSuccess}</p>
                )}

                <Form>
                  <FormGroup className="mb-2">
                    <Label className="label small">Full Name</Label>
                    <Input value={profile.name || ""} disabled />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Email</Label>
                    <Input value={profile.email || ""} disabled />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Role</Label>
                    <Input value={profile.role || "doctor"} disabled />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Specialty</Label>
                    <Input value={profile.specialty || ""} disabled />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      value={profile.phoneNumber || ""}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Street Address</Label>
                    <Input
                      name="streetAddress"
                      value={profile.streetAddress || ""}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </FormGroup>

                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">City</Label>
                        <Input
                          name="city"
                          value={profile.city || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">State</Label>
                        <Input
                          name="state"
                          value={profile.state || ""}
                          onChange={handleProfileChange}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label className="label small">Zip Code</Label>
                        <Input
                          name="zipCode"
                          value={profile.zipCode || ""}
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
                          disabled={savingProfile}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                        >
                          {savingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Your Appointments</CardTitle>
                <CardText className="small text-muted mb-3">
                  Review and update appointment status for your patients
                </CardText>

                {apptLoading && (
                  <p className="small mb-2">Loading appointments...</p>
                )}
                {apptError && (
                  <p className="small text-danger mb-2">{apptError}</p>
                )}

                {!apptLoading && appointments.length === 0 && !apptError && (
                  <p className="small mb-0">No appointments found.</p>
                )}

                {upcoming.length > 0 && (
                  <>
                    <h6 className="mt-2 mb-2">Upcoming</h6>
                    {upcoming.map((app) => (
                      <div
                        key={app._id}
                        className="doctor-appt-item mb-3 p-2 border rounded"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div>
                            <strong>{app.patientName || "Patient"}</strong>
                            <div className="small text-muted">
                              {app.reason || ""}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="small">
                              {new Date(app.preferredDate).toLocaleDateString()}{" "}
                              · {app.preferredTime}
                            </div>
                            <Badge
                              color={statusColor(app.status)}
                              pill
                              className="mt-1"
                            >
                              {app.status || "pending"}
                            </Badge>
                          </div>
                        </div>

                        <div className="small mb-1">
                          <strong>Contact</strong> {app.contactMethod} ·{" "}
                          {app.patientEmail}
                        </div>

                        <Row className="align-items-center">
                          <Col md={4} className="mb-2">
                            <Label className="small mb-1">Status</Label>
                            <Input
                              type="select"
                              value={app.status || "pending"}
                              onChange={(e) =>
                                handleStatusChange(app._id, e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                              <option value="completed">Completed</option>
                            </Input>
                          </Col>
                          <Col md={8} className="mb-2">
                            <Label className="small mb-1">Doctor Notes</Label>
                            <Input
                              type="textarea"
                              rows="2"
                              value={
                                notesDraft[app._id] ?? app.doctorNote ?? ""
                              }
                              onChange={(e) =>
                                handleNoteChange(app._id, e.target.value)
                              }
                            />
                          </Col>
                        </Row>

                        <div className="text-end mt-1">
                          <Button
                            size="sm"
                            color="primary"
                            onClick={() => handleSaveAppointment(app._id)}
                            disabled={updatingApptId === app._id}
                          >
                            {updatingApptId === app._id ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {past.length > 0 && (
                  <>
                    <h6 className="mt-3 mb-2">Past</h6>
                    {past.map((app) => (
                      <div
                        key={app._id}
                        className="doctor-appt-item mb-3 p-2 border rounded"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div>
                            <strong>{app.patientName || "Patient"}</strong>
                            <div className="small text-muted">
                              {app.reason || ""}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="small">
                              {new Date(app.preferredDate).toLocaleDateString()}{" "}
                              · {app.preferredTime}
                            </div>
                            <Badge
                              color={statusColor(app.status)}
                              pill
                              className="mt-1"
                            >
                              {app.status || "completed"}
                            </Badge>
                          </div>
                        </div>

                        {app.doctorNote && (
                          <div className="small text-muted">
                            Doctor note {app.doctorNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorProfile;
