import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store';

import AppRouter from './routes/AppRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div style={{ padding: '20px' }}>Loading HisabBook Data...</div>
        }
        persistor={persistor}
      >
        <AppRouter />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
