import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  // المريض مرتبط بجدول المستخدمين userinfos
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

  // التخصص القادم من ملف الدكاترة
  specialty: {
    type: String,
    required: true,
  },

  // اسم الدكتور
  doctor: String,

  // لو حاب تربطه بالدكتور في نفس جدول المستخدمين
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
    default: "pending", // pending او accepted او rejected او completed
  },

  doctorNote: String,
});

const AppointmentModel = mongoose.model("appointments", AppointmentSchema);

export default AppointmentModel;
