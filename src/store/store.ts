import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { auth } from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { tool } from "./features/tool/toolSlice";

const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth,
  tool,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
