import { StaticReducerKey, StoreState } from '@/store/store.state';
import { AppState } from './app.state';

class AppSelectors {
  static state = (store: StoreState): AppState => {
    return store[StaticReducerKey.APP];
  };
}

export default AppSelectors;
