import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store';
import MainLayout from './components/layout/MainLayout';
import AppRouter from './routes/AppRouter';
import './index.css'; // Using the more general index.css for global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div style={{ padding: '20px' }}>Loading HisabBook Data...</div>
        }
        persistor={persistor}
      >
        <MainLayout>
          <AppRouter />
        </MainLayout>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
