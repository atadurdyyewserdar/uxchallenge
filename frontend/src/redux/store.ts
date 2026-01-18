import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createBlacklistFilter } from "redux-persist-transform-filter";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import type { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const saveSubsetBlacklistFilter = createBlacklistFilter("auth", ["error"]);

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
  transforms: [saveSubsetBlacklistFilter],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);

export default store;
