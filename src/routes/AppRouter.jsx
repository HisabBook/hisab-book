<<<<<<< HEAD
﻿﻿import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom'; // Import createBrowserRouter
=======
﻿import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants/routePaths';
>>>>>>> origin/main

// ── Layout Wrapper
import MainLayout from '../components/layout/MainLayout.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

// Route-level code splitting
const DashboardPage = lazy(
  () => import('../pages/dashboard/DashboardPage.jsx')
);
const InventoryPage = lazy(
  () => import('../pages/inventory/InventoryPage.jsx')
);
const POSPage = lazy(() => import('../pages/pos/POSPage.jsx'));
const KhataPage = lazy(() => import('../pages/khata/KhataPage.jsx'));
const RoznamchaPage = lazy(
  () => import('../pages/roznamcha/RoznamchaPage.jsx')
);
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage.jsx'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

<<<<<<< HEAD
// Create the router using the new data router API
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // Add a suspense fallback for the entire layout
    errorElement: <NotFoundPage />, // Optional: A top-level error page
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.dashboard' },
      },
      {
        path: 'pos',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <POSPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.pos' },
      },
      {
        path: 'inventory',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <InventoryPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.inventory' },
      },
      {
        path: 'khata',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <KhataPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.khata' },
      },
      {
        path: 'roznamcha',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RoznamchaPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.roznamcha' },
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.reports' },
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.settings' },
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
=======
const AppRouter = () => {
  return (
    // Global fallback while lazy pages are loading
    <Suspense fallback={<LoadingSpinner fullScreen label='Loading page...' />}>
      <Routes>
        <Route path={ROUTE_PATHS.ROOT} element={<MainLayout />}>
          <Route index element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
          {/* Main app routes */}
          <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTE_PATHS.POS} element={<POSPage />} />
          <Route path={ROUTE_PATHS.INVENTORY} element={<InventoryPage />} />
          <Route path={ROUTE_PATHS.KHATA} element={<KhataPage />} />
          <Route path={ROUTE_PATHS.ROZNAMCHA} element={<RoznamchaPage />} />
          <Route path={ROUTE_PATHS.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
          {/* Catch-all route */}
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

>>>>>>> origin/main
