import { useState } from "react";
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
import axios from "axios";
import * as ENV from "../config";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = symptoms.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${ENV.SERVER_URL}/ai/symptoms`, {
        symptoms: trimmed,
        previousMessages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const reply =
        res.data?.reply || "Sorry, I could not generate a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      setSymptoms("");
    } catch (err) {
      console.error(err);
      setError(
        "There was a problem talking to the AI assistant. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-page">
      <Container>
        <Row className="mb-4">
          <Col md={8}>
            <h2 className="patient-title">Describe your symptoms</h2>
            <p className="patient-subtitle">
              Tell us what you are experiencing and the AI assistant will give
              you general information and questions to discuss with your doctor.
            </p>
            <p className="text-muted small">
              This assistant does not provide medical diagnosis or emergency
              advice. Always contact a healthcare professional for serious
              symptoms.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mb-4">
          <Col md={8} lg={7}>
            <Card className="symptom-card">
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label className="fw-semibold">
                      What symptoms are you experiencing
                    </Label>
                    <Input
                      type="textarea"
                      rows="4"
                      placeholder="Example I have a headache and fever for two days"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </FormGroup>

                  {error && <p className="small text-danger mb-2">{error}</p>}

                  <Button
                    type="submit"
                    color="primary"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Symptoms"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {messages.length > 0 && (
          <Row className="justify-content-center">
            <Col md={8} lg={7}>
              <Card className="symptom-chat-card">
                <CardBody>
                  <h5 className="mb-3">AI Conversation</h5>
                  <div className="symptom-chat-box">
                    {messages.map((m, index) => (
                      <div
                        key={index}
                        className={
                          "symptom-message " +
                          (m.role === "user"
                            ? "symptom-message-user"
                            : "symptom-message-ai")
                        }
                      >
                        <strong className="d-block mb-1">
                          {m.role === "user" ? "You" : "AI Assistant"}
                        </strong>
                        <span>{m.content}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default SymptomChecker;
