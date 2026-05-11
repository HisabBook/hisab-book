import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants/routePaths';

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

// Create the router using the new data router API
export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.ROOT,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
      },
      {
        path: ROUTE_PATHS.DASHBOARD,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.dashboard' },
      },
      {
        path: ROUTE_PATHS.POS,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <POSPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.pos' },
      },
      {
        path: ROUTE_PATHS.INVENTORY,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <InventoryPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.inventory' },
      },
      {
        path: ROUTE_PATHS.KHATA,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <KhataPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.khata' },
      },
      {
        path: ROUTE_PATHS.ROZNAMCHA,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RoznamchaPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.roznamcha' },
      },
      {
        path: ROUTE_PATHS.REPORTS,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        ),
        handle: { titleKey: 'nav.reports' },
      },
      {
        path: ROUTE_PATHS.SETTINGS,
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
