import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage.jsx'));
const InventoryPage = lazy(() => import('../pages/inventory/InventoryPage.jsx'));
const POSPage = lazy(() => import('../pages/pos/POSPage.jsx'));
const KhataPage = lazy(() => import('../pages/khata/KhataPage.jsx'));
const RoznamchaPage = lazy(() => import('../pages/roznamcha/RoznamchaPage.jsx'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen label='Loading page...' />}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Navigate to='/dashboard' replace />} />

          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='pos' element={<POSPage />} />
          <Route path='inventory' element={<InventoryPage />} />
          <Route path='khata' element={<KhataPage />} />
          <Route path='roznamcha' element={<RoznamchaPage />} />
          <Route path='reports' element={<ReportsPage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
