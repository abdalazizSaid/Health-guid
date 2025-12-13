import * as yup from "yup";

export const userSchemaValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Not valid email format")
    .required("Email is required"),
  password: yup.string().min(4).max(20).required("Password is required"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords Don't Match")
    .required(),
});

export const registerStep1Schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .email("Not valid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the Terms of Service"),
});

export const registerStep2Schema = yup.object().shape({
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  bloodType: yup.string().required("Blood type is required"),

  heightCm: yup.number().nullable(),
  weightKg: yup.number().nullable(),

  streetAddress: yup.string().nullable(),
  city: yup.string().nullable(),
  stateValue: yup.string().nullable(),
  zipCode: yup.string().nullable(),

  emergencyContactName: yup.string().nullable(),
  emergencyContactPhone: yup.string().nullable(),
  emergencyRelationship: yup.string().nullable(),
});

// Appointment booking validation
export const appointmentSchema = yup.object().shape({
  specialty: yup.string().required("Medical specialty is required"),
  preferredDate: yup.string().required("Preferred date is required"),
  preferredTime: yup.string().required("Preferred time is required"),
  reason: yup.string().required("Primary reason for visit is required"),
  contactMethod: yup.string().required("Preferred contact method is required"),
  doctor: yup.string().nullable(),
  notes: yup.string().nullable(),
});
