import * as yup from "yup";

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

  heightCm: yup
    .string()
    .matches(/^\d+\.\d+$/, "Value must have a decimal value")
    .required("Height is required...")
    .test("is-decimal", "Value must have a decimal value", (value) => {
      if (!value) return false;
      return /^\d+\.\d+$/.test(value); // Ensures it contains a decimal part
    }),
  weightKg: yup
    .string()
    .matches(/^\d+\.\d+$/, "Value must have a decimal value")
    .required("Weight is required...")
    .test("is-decimal", "Value must have a decimal value", (value) => {
      if (!value) return false;
      return /^\d+\.\d+$/.test(value); // Ensures it contains a decimal part
    }),

  streetAddress: yup.string().nullable(),
  city: yup.string().nullable(),
  stateValue: yup.string().nullable(),
  zipCode: yup
    .string()
    .matches(/^\d+$/, "Value must be a whole number...") // Ensures only whole numbers
    .test("is-integer", "Value must be an integer...", (value) => {
      if (!value) return false; // Ensure it's not empty
      return Number.isInteger(Number(value)); // Ensures it's a valid integer
    })
    .nullable(),

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
