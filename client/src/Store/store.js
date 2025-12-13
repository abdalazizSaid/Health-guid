// src/app/store.js أو src/store/store.js حسب مشروعك
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import postReducer from "../Features/PostSlice";
import appointmentReducer from "../Features/AppointmentSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "reduxstore",
  storage,
};

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postReducer,
  appointments: appointmentReducer, // اضفها هنا
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistore = persistStore(store);

export { store, persistore };
