import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  getSelectedProfile,
  setSelectedProfile,
} from "@/core/lib/token";
import type { UserProfile } from "@/core/types/profile.types";

interface ProfileState {
  activeProfile: UserProfile | null;
}

const initialState: ProfileState = {
  activeProfile: getSelectedProfile(),
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setActiveProfile(state, action: PayloadAction<UserProfile | null>) {
      state.activeProfile = action.payload;
      setSelectedProfile(action.payload);
    },
    clearActiveProfile(state) {
      state.activeProfile = null;
      setSelectedProfile(null);
    },
  },
});

export const { setActiveProfile, clearActiveProfile } = profileSlice.actions;
export default profileSlice.reducer;
