import {
  Action,
  combineReducers,
  configureStore,
  EnhancedStore,
  Middleware,
  Reducer,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import React, { Dispatch } from 'react';
import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue,
  TypedUseSelectorHook,
} from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { Persistor } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';

type CreateReduxStoreParams = {
  key: string;
  version: number;
  whitelist: string[];
  debugMode?: boolean;
  reducers: Record<string, Reducer>;
};

type ReduxStore<T = unknown> = {
  persist: Persistor;
  store: EnhancedStore<T>;
  context: React.Context<ReactReduxContextValue | null>;
  useStore: () => EnhancedStore<T>;
  useSelector: TypedUseSelectorHook<T>;
  useDispatch: () => ThunkDispatch<T & PersistPartial, undefined, UnknownAction> & Dispatch<Action>;
};

export const createReduxStore = <T>({
  key,
  version,
  whitelist,
  debugMode,
  reducers,
}: CreateReduxStoreParams): ReduxStore<T> => {
  const middlewares: Middleware[] = [];

  function migrate(state: any) {
    const storeVersion = state?._persist?.version;
    if (!storeVersion || storeVersion !== version) return Promise.resolve(undefined);
    return Promise.resolve(state);
  }

  const persistConfig = {
    migrate,
    storage,
    version,
    whitelist,
    key: `hmp-${key}`,
  };

  if (debugMode) {
    import('redux-logger').then(({ createLogger }) => {
      const logger = createLogger({ collapsed: true, duration: true });
      middlewares.push(logger);
    });
  }

  const store = configureStore({
    devTools: debugMode,
    reducer: persistReducer<T>(persistConfig, combineReducers(reducers) as Reducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
  });

  const persist = persistStore(store);

  const context = React.createContext<ReactReduxContextValue | null>(null);

  /** --------------------------------------------------------------------------
   * Hooks
   * ------------------------------------------------------------------------ */

  const useStore: () => typeof store = createStoreHook(context);
  const useSelector: TypedUseSelectorHook<T> = createSelectorHook(context);
  const useDispatch: () => typeof store.dispatch = createDispatchHook(context);

  return { store, persist, context, useStore, useDispatch, useSelector };
};

export type { ReduxStore };
