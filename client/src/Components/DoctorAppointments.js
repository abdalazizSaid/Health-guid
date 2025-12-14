import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Badge,
  Input,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

const DoctorAppointments = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/login");
    }
  }, [user, navigate]);

  const loadAppointments = useCallback(async () => {
    if (!user || user.role !== "doctor") return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get(`${ENV.SERVER_URL}/appointments`, {
        params: {
          doctorId: user._id,
          doctorName: user.name,
        },
      });

      const data = Array.isArray(res.data) ? res.data : [];

      data.sort((a, b) => {
        const d1 = new Date(a.preferredDate);
        const d2 = new Date(b.preferredDate);
        if (d1.getTime() === d2.getTime()) {
          return (a.preferredTime || "").localeCompare(b.preferredTime || "");
        }
        return d1 - d2;
      });

      setAppointments(data);

      const drafts = {};
      data.forEach((appt) => {
        drafts[appt._id] = appt.doctorNote || "";
      });
      setNoteDrafts(drafts);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleNoteChange = (id, value) => {
    setNoteDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${ENV.SERVER_URL}/appointments/${id}/status`, {
        status: newStatus,
        doctorNote: noteDrafts[id] ?? "",
      });

      await loadAppointments();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update appointment.");
    }
  };

  const statusColor = (status) => {
    switch (status) {
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

  return (
    <div className="patient-page">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">My Appointments</h2>
            <p className="patient-subtitle">
              Review, accept or reject appointments and add notes.
            </p>
          </Col>
        </Row>

        {errorMsg && (
          <Row className="mb-3">
            <Col>
              <div className="alert alert-danger small mb-0">{errorMsg}</div>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            {loading && (
              <Card className="patient-card">
                <CardBody>
                  <p className="mb-0 small">Loading appointments...</p>
                </CardBody>
              </Card>
            )}

            {!loading && appointments.length === 0 && (
              <Card className="patient-card">
                <CardBody>
                  <p className="mb-0 small">No appointments found.</p>
                </CardBody>
              </Card>
            )}

            {!loading &&
              appointments.map((appt) => (
                <Card className="patient-card mb-3" key={appt._id}>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <CardTitle tag="h6" className="mb-1">
                          {appt.patientName || "Unknown patient"}
                        </CardTitle>
                        <CardText className="small text-muted mb-1">
                          {appt.patientEmail && (
                            <>Email: {appt.patientEmail} · </>
                          )}
                          {appt.patientPhone && <>Phone: {appt.patientPhone}</>}
                        </CardText>
                      </div>

                      <Badge color={statusColor(appt.status)} pill>
                        {appt.status || "pending"}
                      </Badge>
                    </div>

                    <CardText className="small mb-1">
                      <strong>Date:</strong>{" "}
                      {appt.preferredDate
                        ? new Date(appt.preferredDate).toLocaleDateString()
                        : "-"}{" "}
                      · <strong>Time:</strong> {appt.preferredTime || "-"}
                    </CardText>

                    <CardText className="small mb-1">
                      <strong>Specialty:</strong> {appt.specialty || "-"}
                    </CardText>

                    {appt.reason && (
                      <CardText className="small mb-2">
                        <strong>Reason:</strong> {appt.reason}
                      </CardText>
                    )}

                    {/* Doctor note */}
                    <div className="mb-2">
                      <label className="small mb-1">
                        Doctor note for this appointment
                      </label>
                      <Input
                        type="textarea"
                        rows={2}
                        value={noteDrafts[appt._id] ?? ""}
                        onChange={(e) =>
                          handleNoteChange(appt._id, e.target.value)
                        }
                      />
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      {appt.status !== "accepted" && (
                        <Button
                          size="sm"
                          color="success"
                          onClick={() =>
                            handleUpdateStatus(appt._id, "accepted")
                          }
                        >
                          Accept
                        </Button>
                      )}

                      {appt.status !== "rejected" && (
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() =>
                            handleUpdateStatus(appt._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      )}

                      {appt.status === "accepted" && (
                        <Button
                          size="sm"
                          color="secondary"
                          onClick={() =>
                            handleUpdateStatus(appt._id, "completed")
                          }
                        >
                          Mark as completed
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorAppointments;
