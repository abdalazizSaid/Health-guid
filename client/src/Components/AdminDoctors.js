import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

const AdminDoctors = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docSpecialty, setDocSpecialty] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const loadDoctors = async () => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/admin/doctors`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        name: docName,
        email: docEmail,
        password: docPassword,
        phoneNumber: docPhone,
        specialty: docSpecialty,
      };

      const res = await axios.post(`${ENV.SERVER_URL}/admin/doctors`, payload);

      setSuccessMsg("Doctor created successfully.");
      setDocName("");
      setDocEmail("");
      setDocPassword("");
      setDocPhone("");
      setDocSpecialty("");

      await loadDoctors();
    } catch (err) {
      console.error("add doctor front error:", err);
      if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Failed to add doctor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`${ENV.SERVER_URL}/admin/doctors/${id}`);
      await loadDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor");
    }
  };

  return (
    <div className="patient-page">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">Admin Dashboard</h2>
            <p className="patient-subtitle">Manage doctors in the system</p>
          </Col>
        </Row>

        <Row className="gy-4">
          <Col lg={5}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Add Doctor</CardTitle>
                <CardText className="small text-muted mb-3">
                  Create a new doctor account
                </CardText>

                {errorMsg && (
                  <p className="small text-danger mb-2">{errorMsg}</p>
                )}
                {successMsg && (
                  <p className="small text-success mb-2">{successMsg}</p>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label className="label small">Full Name</Label>
                    <Input
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Dr. John Doe"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="label small">Email</Label>
                    <Input
                      type="email"
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      placeholder="doctor@example.com"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="label small">Password</Label>
                    <Input
                      type="password"
                      value={docPassword}
                      onChange={(e) => setDocPassword(e.target.value)}
                      placeholder="Set a password"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="label small">Phone Number</Label>
                    <Input
                      value={docPhone}
                      onChange={(e) => setDocPhone(e.target.value)}
                      placeholder="Doctor phone"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label className="label small">Specialty</Label>
                    <Input
                      value={docSpecialty}
                      onChange={(e) => setDocSpecialty(e.target.value)}
                      placeholder="Cardiology, Dermatology, etc."
                    />
                  </FormGroup>

                  <Button
                    color="primary"
                    className="w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Doctor"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Doctors List</CardTitle>
                <CardText className="small text-muted mb-3">
                  All doctors registered in the system
                </CardText>

                {doctors.length === 0 && (
                  <p className="small mb-0">No doctors found.</p>
                )}

                {doctors.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Specialty</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map((d) => (
                          <tr key={d._id}>
                            <td>{d.name}</td>
                            <td>{d.email}</td>
                            <td>{d.phoneNumber || "-"}</td>
                            <td>{d.specialty || "-"}</td>
                            <td>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(d._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDoctors;
