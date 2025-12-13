// server/Models/UserModel.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // patient أو doctor أو admin
  role: {
    type: String,
    default: "patient",
  },

  phoneNumber: {
    type: String,
  },

  // تخصص الدكتور عشان يطلع في الحجز
  specialty: {
    type: String,
  },

  // بيانات المريض
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  bloodType: {
    type: String,
  },
  heightCm: {
    type: Number,
  },
  weightKg: {
    type: Number,
  },

  streetAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },

  emergencyContactName: {
    type: String,
  },
  emergencyContactPhone: {
    type: String,
  },
  emergencyRelationship: {
    type: String,
  },
});

const UserModel = mongoose.model("userinfos", UserSchema);

export default UserModel;
