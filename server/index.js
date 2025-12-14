import mongoose from "mongoose";
import cors from "cors";
import express from "express";

import UserModel from "./Models/UserModel.js";
import AppointmentModel from "./Models/AppointmentModel.js";

import bcrypt from "bcrypt";
import * as ENV from "./config.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ENV.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?appName=PostITCluster`;

mongoose
  .connect(connectString)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================= AI Symptom Assistant ================= */

let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

app.post("/ai/symptoms", async (req, res) => {
  try {
    if (!openaiClient) {
      return res.status(503).json({
        error:
          "AI assistant is currently disabled. OPENAI_API_KEY is not configured on the server.",
      });
    }

    const { symptoms, previousMessages } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: "Symptoms text is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a cautious health information assistant. " +
          "You are not a doctor and you do NOT provide diagnosis or treatment plans. " +
          "You give general information and suggest questions the user can ask their doctor. " +
          "Always remind them to contact a healthcare professional or emergency services for serious or urgent symptoms.",
      },
    ];

    if (Array.isArray(previousMessages)) {
      previousMessages.forEach((m) => {
        if (!m.role || !m.content) return;
        messages.push({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        });
      });
    }

    messages.push({
      role: "user",
      content: symptoms,
    });

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
    });

    const replyText =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a response right now. Please try again later.";

    return res.json({ reply: replyText });
  } catch (err) {
    console.error("AI symptoms error:", err.response?.data || err.message);
    return res.status(500).json({ error: "AI assistant error" });
  }
});

/* ---------------------- USER APIS ---------------------- */

// check email before step 2
app.post("/checkEmail", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("checkEmail error:", error);
    return res
      .status(500)
      .json({ error: "Server error while checking email." });
  }
});

// registration
app.post("/registerUser", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      specialty,
      dateOfBirth,
      gender,
      bloodType,
      heightCm,
      weightKg,
      streetAddress,
      city,
      state,
      zipCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyRelationship,
    } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Email already registered", code: "EMAIL_EXISTS" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedpassword,
      role: role || "patient",
      phoneNumber,
      specialty,
      dateOfBirth,
      gender,
      bloodType,
      heightCm,
      weightKg,
      streetAddress,
      city,
      state,
      zipCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyRelationship,
    });

    await user.save();
    res.status(201).json({ user, msg: "Added." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// update profile
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "phoneNumber",
      "dateOfBirth",
      "gender",
      "bloodType",
      "heightCm",
      "weightKg",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyRelationship",
      "specialty",
    ];

    const updateFields = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const user = await UserModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("update user error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

/* ---------------------- DOCTORS APIS  ---------------------- */

app.post("/doctors", async (req, res) => {
  try {
    const { name, email, password, specialty, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Email already registered", code: "EMAIL_EXISTS" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const doctor = new UserModel({
      name,
      email,
      password: hashedpassword,
      role: "doctor",
      phoneNumber,
      specialty,
    });

    await doctor.save();
    return res.status(201).json({ doctor, msg: "Doctor created" });
  } catch (error) {
    console.error("create doctor error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

// get Doctors
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await UserModel.find({ role: "doctor" }).select(
      "_id name email specialty phoneNumber"
    );
    return res.json(doctors);
  } catch (error) {
    console.error("get doctors error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

/* ---------------------- APPOINTMENTS APIS ---------------------- */

// book appointment
app.post("/appointments", async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      patientEmail,
      patientPhone,
      patientGender,
      patientDateOfBirth,
      specialty,
      doctor,
      doctorId,
      preferredDate,
      preferredTime,
      reason,
      contactMethod,
      notes,
    } = req.body;

    if (
      !patientId ||
      !specialty ||
      !preferredDate ||
      !preferredTime ||
      !reason ||
      !contactMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appointment = new AppointmentModel({
      patient: patientId,
      patientName,
      patientEmail,
      patientPhone,
      patientGender,
      patientDateOfBirth,
      specialty,
      doctor,
      doctorId,
      preferredDate,
      preferredTime,
      reason,
      contactMethod,
      notes,
      status: "pending",
    });

    await appointment.save();
    return res.status(201).json({ appointment, msg: "Appointment booked" });
  } catch (error) {
    console.error("appointments error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

// get appointments
app.get("/appointments", async (req, res) => {
  try {
    const { userId, doctorId } = req.query;

    const query = {};
    if (userId) {
      query.patient = userId;
    }
    if (doctorId) {
      query.doctorId = doctorId;
    }

    const appointments = await AppointmentModel.find(query).sort({
      preferredDate: 1,
      preferredTime: 1,
    });

    return res.json(appointments);
  } catch (error) {
    console.error("get appointments error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

// doctor update status + note
app.put("/appointments/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, doctorNote } = req.body;

    const allowedStatus = ["pending", "accepted", "rejected", "completed"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (doctorNote !== undefined) updateFields.doctorNote = doctorNote;

    const appointment = await AppointmentModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json({ appointment });
  } catch (error) {
    console.error("update appointment status error:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

/* ---------------------- ADMIN DOCTORS APIS ---------------------- */

// list all doctors
app.get("/admin/doctors", async (req, res) => {
  try {
    const doctors = await UserModel.find({ role: "doctor" }).sort({
      createdAt: -1,
    });
    return res.json(doctors);
  } catch (error) {
    console.error("get doctors error:", error);
    return res.status(500).json({ error: "Failed to load doctors" });
  }
});

// add new doctor (admin)
app.post("/admin/doctors", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, specialty } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const doctor = new UserModel({
      name,
      email,
      password: hashed,
      phoneNumber,
      specialty,
      role: "doctor",
    });

    await doctor.save();
    return res.status(201).json({ doctor, msg: "Doctor created" });
  } catch (error) {
    console.error("add doctor error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res
      .status(500)
      .json({ error: error.message || "Failed to add doctor" });
  }
});

// delete doctor
app.delete("/admin/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await UserModel.findOneAndDelete({ _id: id, role: "doctor" });
    if (!doc) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.json({ msg: "Doctor deleted", doctor: doc });
  } catch (error) {
    console.error("delete doctor error:", error);
    return res.status(500).json({ error: "Failed to delete doctor" });
  }
});

const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
