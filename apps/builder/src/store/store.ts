import { convertVersionToInt, createReduxStore } from '@react-survey/ui/src';
import { StaticReducerKey, StoreState } from './store.state';
import { DEBUG_MODE } from '@/utils/env';
import { version } from 'package';

// Reducers
import { appReducer } from './app';

const redux = createReduxStore<StoreState>({
  key: 'escape-game',
  debugMode: DEBUG_MODE,
  version: convertVersionToInt(version),
  whitelist: [StaticReducerKey.APP],
  reducers: {
    [StaticReducerKey.APP]: appReducer,
  },
});

export default redux;
