import { AppState } from './app';

export enum StaticReducerKey {
  APP = 'APP',
}

export type StoreState = {
  [StaticReducerKey.APP]: AppState;
};
