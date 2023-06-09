import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: null,
  email: null,
  userId: null,
  stateChange: false,
  avatar: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      login: payload.login,
      email: payload.email,
      userId: payload.userId,
      avatar: payload.avatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => initialState,
    updateAvatar: (state, { payload }) => ({
      ...state,
      avatar: payload.avatar,
    }),
  },
});

export const { updateUserProfile, authStateChange, authSignOut, updateAvatar } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
