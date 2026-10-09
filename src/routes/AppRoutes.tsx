import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { ExpensePage } from '../pages/ExpensePage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import NotFoundRedirect from './NotFoundRedirect';
import HomePage from '../pages/Home';
import AddPage from '../pages/Add';
import HistoryPage from '../pages/History';
import AnalyticsPage from '../pages/Analytics';
import SettingPage from '../pages/Setting';
import CommonLayout from '../layouts/CommonLayout';
import { paths } from '../constants/pageMeta';
import AppFrame from '../layouts/AppFrame';

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path={paths.LANDING} element={<LandingPage />} />
      <Route path={paths.LOGIN} element={<LoginPage />} />
      <Route path={paths.SIGN_UP} element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppFrame />}>
          {/* 상단 헤더 + Bottom Nav 있음 */}
          <Route element={<CommonLayout />}>
            <Route path={paths.HOME} element={<HomePage />} />
            <Route path={paths.ADD} element={<AddPage />} />
            <Route path={paths.HISTORY} element={<HistoryPage />} />
            <Route path={paths.ANALYTICS} element={<AnalyticsPage />} />
            <Route path={paths.SETTING} element={<SettingPage />} />
          </Route>

          {/* 상단 헤더 + Bottom Nav 없음 */}
          <Route></Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  </BrowserRouter>
);
