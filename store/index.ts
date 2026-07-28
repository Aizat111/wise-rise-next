import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
