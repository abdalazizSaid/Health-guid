import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  // userinfos
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
    required: true,
  },

  patientName: String,
  patientEmail: String,
  patientPhone: String,
  patientGender: String,
  patientDateOfBirth: Date,

  specialty: {
    type: String,
    required: true,
  },

  doctor: String,

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfos",
  },

  preferredDate: {
    type: Date,
    required: true,
  },

  preferredTime: {
    type: String,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  contactMethod: {
    type: String,
    required: true,
  },

  notes: String,

  status: {
    type: String,
    default: "pending", // pending / accepted / rejected / completed
  },

  doctorNote: String,
});

const AppointmentModel = mongoose.model("appointments", AppointmentSchema);

export default AppointmentModel;
