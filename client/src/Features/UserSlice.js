import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

// register(step1 + step2)
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const body = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        bloodType: userData.bloodType,
        heightCm: userData.heightCm,
        weightKg: userData.weightKg,
        streetAddress: userData.streetAddress,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        emergencyContactName: userData.emergencyContactName,
        emergencyContactPhone: userData.emergencyContactPhone,
        emergencyRelationship: userData.emergencyRelationship,
      };

      const response = await axios.post(`${ENV.SERVER_URL}/registerUser`, body);
      const user = response.data.user;
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Registration failed" }
      );
    }
  }
);

// login
export const login = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/login`, {
        email: userData.email,
        password: userData.password,
      });

      const user = response.data.user;
      return user;
    } catch (error) {
      const errorMessage = "Invalid credentials";
      alert(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  }
);

// logout
export const logout = createAsyncThunk("users/logout", async () => {
  try {
    await axios.post(`${ENV.SERVER_URL}/logout`);
  } catch (error) {}
});

// update PatientProfile
export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ENV.SERVER_URL}/users/${id}`,
        updates
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Update profile failed" }
      );
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload || {};
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.error || "Registration failed";
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.error || "Login failed";
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {};
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.error || "Update profile failed";
      });
  },
});

export default userSlice.reducer;
