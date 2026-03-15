import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITool {
  id: string | null;
  name: string | null;
  description: string | null;
  price: number;
  userId: string | null;
  loading: boolean;
}

interface InitialToolState {
  tools: ITool[];
  loading: boolean;
}

const initialState: InitialToolState = {
  tools: [],
  loading: false,
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    setToolState: (state, action: PayloadAction<ITool[]>) => {
      state.tools = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearToolState: (state) => {
      state.tools = [];
      state.loading = false;
    },
  },
});

export const tool = toolSlice.reducer;
export const { setToolState, setLoading, clearToolState } = toolSlice.actions;
