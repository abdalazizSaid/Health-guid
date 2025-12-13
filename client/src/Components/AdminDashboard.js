// src/pages/AdminDashboard.js
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

const AdminDashboard = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    specialty: "",
  });

  // فقط الادمن يقدر يدخل
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchDoctors();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${ENV.SERVER_URL}/admin/doctors`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${ENV.SERVER_URL}/admin/doctors`, form);
      const newDoc = res.data.doctor;

      setDoctors((prev) => [newDoc, ...prev]);
      setForm({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        specialty: "",
      });
      setSuccess("Doctor created successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add doctor");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor")) return;

    try {
      await axios.delete(`${ENV.SERVER_URL}/admin/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete doctor");
    }
  };

  return (
    <div className="admin-page">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="patient-title">Admin Dashboard</h2>
            <p className="patient-subtitle">Manage doctors in the system</p>
          </Col>
        </Row>

        <Row className="gy-4">
          {/* كارد إضافة دكتور */}
          <Col lg={4}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Add Doctor</CardTitle>
                <p className="small text-muted mb-3">
                  Create a new doctor account
                </p>

                {error && <p className="small text-danger">{error}</p>}
                {success && <p className="small text-success">{success}</p>}

                <Form onSubmit={handleAddDoctor}>
                  <FormGroup className="mb-2">
                    <Label className="label small">Full Name</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. John Doe"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="doctor@example.com"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Set login password"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <Label className="label small">Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      placeholder="Doctor phone"
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label className="label small">Specialty</Label>
                    <Input
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      placeholder="Cardiology, Dermatology, etc."
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    color="primary"
                    className="w-100"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Add Doctor"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="patient-card">
              <CardBody>
                <CardTitle tag="h5">Doctors List</CardTitle>
                <p className="small text-muted mb-3">
                  All doctors registered in the system
                </p>

                {loading && <p className="small mb-0">Loading...</p>}

                {!loading && doctors.length === 0 && (
                  <p className="small mb-0">No doctors found</p>
                )}

                {!loading && doctors.length > 0 && (
                  <Table responsive bordered hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Specialty</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc._id}>
                          <td>{doc.name}</td>
                          <td>{doc.email}</td>
                          <td>{doc.phoneNumber || "-"}</td>
                          <td>{doc.specialty || "-"}</td>
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteDoctor(doc._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
