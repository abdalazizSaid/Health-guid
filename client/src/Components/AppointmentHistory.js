// src/pages/AppointmentHistory.js
import { useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAppointmentsByUser } from "../Features/AppointmentSlice";

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

const AppointmentHistory = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const appointmentState = useSelector((state) => state.appointments);

  const {
    appointments = [],
    isLoading = false,
    isError = false,
    errorMessage = "",
  } = appointmentState || {};

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAppointmentsByUser(user._id));
    }
  }, [user, dispatch]);

  const sortedAppointments = useMemo(() => {
    const list = [...appointments];

    const getDateObj = (app) => {
      const d = app.preferredDate || app.date;
      return d ? new Date(d) : null;
    };

    list.sort((a, b) => {
      const da = getDateObj(a);
      const db = getDateObj(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });

    return list;
  }, [appointments]);

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
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">Appointment History</h2>
            <p className="patient-subtitle">
              All your appointments, past and upcoming, ordered by date
            </p>
          </Col>
        </Row>

        {isLoading && (
          <Row>
            <Col>
              <p className="small">Loading appointments...</p>
            </Col>
          </Row>
        )}

        {isError && (
          <Row>
            <Col>
              <p className="small text-danger">{errorMessage}</p>
            </Col>
          </Row>
        )}

        {!isLoading && !isError && sortedAppointments.length === 0 && (
          <Row>
            <Col>
              <Card className="patient-card">
                <CardBody>
                  <p className="mb-0 small">No appointments found</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="gy-3">
          {sortedAppointments.map((app) => {
            const statusText = app.status || "Scheduled";
            const statusColor = getStatusColor(app.status);

            return (
              <Col md={6} key={app._id}>
                <Card className="patient-card history-card">
                  <CardBody>
                    <div className="d-flex justify-content-between mb-2">
                      <CardTitle tag="h6" className="mb-0">
                        {app.doctor || app.doctorName || "Doctor"}{" "}
                        {app.specialty && (
                          <span className="text-muted">· {app.specialty}</span>
                        )}
                      </CardTitle>
                      <span className="history-date">{formatDate(app)}</span>
                    </div>

                    <p className="small text-muted mb-2 d-flex align-items-center gap-2">
                      <span>Time {formatTime(app)}</span>
                      <Badge color={statusColor} pill>
                        {statusText}
                      </Badge>
                    </p>

                    {app.notes && (
                      <CardText className="small mb-1">
                        <span className="fw-semibold">Patient notes</span>{" "}
                        {app.notes}
                      </CardText>
                    )}

                    {app.doctorNote && (
                      <CardText className="small mb-0">
                        <span className="fw-semibold">Doctor note</span>{" "}
                        {app.doctorNote}
                      </CardText>
                    )}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentHistory;
