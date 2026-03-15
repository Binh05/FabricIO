import { RootState } from "./store";

export const authSelector = (state: RootState) => state.auth;
export const toolSelector = (state: RootState) => state.tool;
