import { Routes, Route, Navigate } from 'react-router-dom';

// ── Layout Wrapper
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import InventoryPage from '../pages/inventory/InventoryPage.jsx';
import POSPage from '../pages/pos/POSPage.jsx';
import KhataPage from '../pages/khata/KhataPage.jsx';
import RoznamchaPage from '../pages/roznamcha/RoznamchaPage.jsx';
import ReportsPage from '../pages/reports/ReportsPage.jsx';
import SettingsPage from '../pages/settings/SettingsPage.jsx';
const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Navigate to='/dashboard' replace />} />

        {/* ── Main Pages */}
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='pos' element={<POSPage />} />
        <Route path='inventory' element={<InventoryPage />} />
        <Route path='khata' element={<KhataPage />} />
        <Route path='roznamcha' element={<RoznamchaPage />} />
        <Route path='reports' element={<ReportsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        {/* ── 404 Fallback: any unknown route → Dashboard ── */}
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
