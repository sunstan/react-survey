import { PersistGate } from 'redux-persist/integration/react';
import { persist, store, context } from '@/store';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';

// Styles
import '@/assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store} context={context}>
    <PersistGate persistor={persist} loading={null}>
      <App />
    </PersistGate>
  </Provider>,
);
