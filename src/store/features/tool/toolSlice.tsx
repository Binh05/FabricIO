import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IToolState {
  name: string | null;
  description: string | null;
  price: number;
  userId: string | null;
  loading: boolean;
}

const initialState: IToolState = {
  name: null,
  description: null,
  price: 0.0,
  userId: null,
  loading: false,
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    setToolState: (state, action) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.price = action.payload.price;
      state.userId = action.payload.userId;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearToolState: (state) => {
      state.name = null;
      state.description = null;
      state.price = 0.0;
      state.userId = null;
      state.loading = false;
    },
  },
});

export const tool = toolSlice.reducer;
export const { setToolState, setLoading, clearToolState } = toolSlice.actions;
