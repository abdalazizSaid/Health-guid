import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  appointments: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

/* ================= Thunks ================= */

// new appoint
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.SERVER_URL}/appointments`,
        appointmentData
      );

      return response.data.appointment || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to create appointment" }
      );
    }
  }
);

// get patient appoint
export const getAppointmentsByUser = createAsyncThunk(
  "appointments/getAppointmentsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/appointments`, {
        params: { userId },
      });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to load appointments" }
      );
    }
  }
);

// get doctor appoint
export const getAppointmentsByDoctor = createAsyncThunk(
  "appointments/getAppointmentsByDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/appointments`, {
        params: { doctorId },
      });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to load doctor appointments" }
      );
    }
  }
);

// update appoint
export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async ({ id, status, doctorNote }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ENV.SERVER_URL}/appointments/${id}/status`,
        { status, doctorNote }
      );

      return response.data.appointment || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to update appointment" }
      );
    }
  }
);

/* ================= Slice ================= */

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* createAppointment */
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.error || "Failed to create appointment";
      })

      /* getAppointmentsByUser */
      .addCase(getAppointmentsByUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getAppointmentsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload || [];
      })
      .addCase(getAppointmentsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.error || "Failed to load appointments";
      })

      /* getAppointmentsByDoctor */
      .addCase(getAppointmentsByDoctor.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getAppointmentsByDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload || [];
      })
      .addCase(getAppointmentsByDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.error || "Failed to load doctor appointments";
      })

      /* updateAppointmentStatus */
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const idx = state.appointments.findIndex((a) => a._id === updated._id);
        if (idx !== -1) {
          state.appointments[idx] = updated;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.error || "Failed to update appointment";
      });
  },
});

export default appointmentSlice.reducer;
