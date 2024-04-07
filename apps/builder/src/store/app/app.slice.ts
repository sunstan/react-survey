import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaticReducerKey } from '@/store/store.state';
import { AppState } from '@/store/app/app.state';
import initialState from './app.default';

const appSlice = createSlice({
  name: StaticReducerKey.APP,
  initialState,
  reducers: {
    resetApp: () => {
      return initialState;
    },
    patchApp: (state, { payload }: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...payload };
    },
  },
});

export default appSlice.reducer;
export const { resetApp, patchApp } = appSlice.actions;
