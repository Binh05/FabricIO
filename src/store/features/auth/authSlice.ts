import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface InitialState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface ActionPayload {
  user: User;
  token: string;
}

const initialState: InitialState = {
  user: null,
  token: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<ActionPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearState: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

export const { setAuth, setLoading, clearState } = authSlice.actions;
export const auth = authSlice.reducer;
