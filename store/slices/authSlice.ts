import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  persistAuthSession,
  setStoredUser,
  type StoredAuthUser,
} from "@/core/lib/token";
import type { ILoginResponse } from "@/core/types/auth.types";

interface AuthState {
  user: StoredAuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: getAccessToken(),
  isAuthenticated: Boolean(getAccessToken()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<StoredAuthUser | null>) {
      state.user = action.payload;
      setStoredUser(action.payload);
      if (action.payload) {
        state.isAuthenticated = true;
      }
    },

    setAuthSession(
      state,
      action: PayloadAction<
        Pick<ILoginResponse, "token"> & {
          user?: StoredAuthUser | null;
        }
      >,
    ) {
      const { token, user } = action.payload;
      persistAuthSession({ token, user });
      state.accessToken = token;
      state.isAuthenticated = Boolean(token);
      if (user) {
        state.user = user;
      }
    },

    logout(state) {
      clearAuthSession();
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAuthSession, logout } = authSlice.actions;

export default authSlice.reducer;
