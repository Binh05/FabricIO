"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "@/lib/axios";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  const persistRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistRef.current = persistStore(storeRef.current);

    injectStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
