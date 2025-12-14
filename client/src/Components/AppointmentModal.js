import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import * as ENV from "../config";

const AppointmentModal = ({ isOpen, toggle, onBooked }) => {
  const user = useSelector((state) => state.users.user);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [reason, setReason] = useState("");
  const [contactMethod, setContactMethod] = useState("Email");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedDoctor = doctors.find((d) => d._id === doctorId);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setDoctorsError("");
        const res = await axios.get(`${ENV.SERVER_URL}/doctors`);
        setDoctors(res.data || []);
      } catch (err) {
        console.error(err);
        setDoctorsError("Failed to load doctors list");
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (isOpen) {
      fetchDoctors();
      setDoctorId("");
      setPreferredDate("");
      setPreferredTime("");
      setReason("");
      setContactMethod("Email");
      setNotes("");
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const doc = doctors.find((d) => d._id === doctorId);

    if (!doc) {
      setErrorMsg("Please select a doctor");
      return;
    }
    if (!preferredDate || !preferredTime || !reason.trim()) {
      setErrorMsg("Please fill date, time and reason for visit");
      return;
    }

    const payload = {
      patientId: user?._id,
      patientName: user?.name,
      patientEmail: user?.email,
      patientPhone: user?.phoneNumber,
      patientGender: user?.gender,
      patientDateOfBirth: user?.dateOfBirth,
      specialty: doc.specialty || "",
      doctor: doc.name,
      doctorId: doc._id,
      preferredDate,
      preferredTime,
      reason,
      contactMethod,
      notes,
    };

    try {
      setSaving(true);
      const res = await axios.post(`${ENV.SERVER_URL}/appointments`, payload);

      if (onBooked) {
        onBooked(res.data.appointment || res.data);
      }

      toggle();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to book appointment, please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="border-0">
        Book New Appointment
      </ModalHeader>
      <ModalBody className="pt-0">
        <Form onSubmit={handleSubmit} className="appointment-form">
          <h6 className="section-title">Patient Information</h6>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Full Name</Label>
                <Input value={user?.name || ""} disabled />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Date of Birth</Label>
                <Input
                  value={user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ""}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Gender</Label>
                <Input value={user?.gender || ""} disabled />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input value={user?.phoneNumber || ""} disabled />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled />
              </FormGroup>
            </Col>
          </Row>

          <h6 className="section-title mt-3">Appointment Details</h6>

          {doctorsError && (
            <p className="text-danger small mb-2">{doctorsError}</p>
          )}
          {errorMsg && <p className="text-danger small mb-2">{errorMsg}</p>}

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Select Doctor</Label>
                <Input
                  type="select"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option value="">
                    {loadingDoctors ? "Loading doctors..." : "Choose doctor"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} {d.specialty ? `(${d.specialty})` : ""}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Medical Specialty</Label>
                <Input
                  value={selectedDoctor?.specialty || ""}
                  disabled
                  placeholder="Doctor specialty will appear here"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Preferred Date</Label>
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Preferred Time</Label>
                <Input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Primary Reason for Visit</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Headache, follow up, new symptoms..."
            />
          </FormGroup>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Preferred Contact Method</Label>
                <Input
                  type="select"
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                >
                  <option>Email</option>
                  <option>Phone</option>
                  <option>SMS</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Additional Notes</Label>
            <Input
              type="textarea"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra info for the doctor"
            />
          </FormGroup>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button type="button" color="light" onClick={toggle}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={saving}>
              {saving ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AppointmentModal;
