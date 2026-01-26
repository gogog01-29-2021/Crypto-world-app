import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { queryClient, TOAST_CONFIG } from './config';

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

// Lazy-loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));

// Admin Pages (lazy-loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const UserDetailPage = lazy(() => import('./pages/admin/UserDetailPage').then(m => ({ default: m.UserDetailPage })));
const UserEditPage = lazy(() => import('./pages/admin/UserEditPage').then(m => ({ default: m.UserEditPage })));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage').then(m => ({ default: m.AdminProfilePage })));
const AdminSessionsPage = lazy(() => import('./pages/admin/AdminSessionsPage').then(m => ({ default: m.AdminSessionsPage })));
const AppSettingsPage = lazy(() => import('./pages/admin/AppSettingsPage').then(m => ({ default: m.AppSettingsPage })));

// User Pages (lazy-loaded)
const UserDashboard = lazy(() => import('./pages/users/UserDashboard').then(m => ({ default: m.UserDashboard })));
const ProfilePage = lazy(() => import('./pages/users/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ChangePasswordPage = lazy(() => import('./pages/users/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));

// OAuth Callback
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage').then(m => ({ default: m.OAuthCallbackPage })));

// Component to handle role-based redirects after login
const AuthRedirect = () => {
  const { isAuthenticated, isAdminUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

                {/* Protected Routes - Redirect based on role */}
                <Route path="/auth-redirect" element={<AuthRedirect />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagementPage />} />
                      <Route path="users/:id" element={<UserDetailPage />} />
                      <Route path="users/:id/edit" element={<UserEditPage />} />
                      <Route path="profile" element={<AdminProfilePage />} />
                      <Route path="sessions" element={<AdminSessionsPage />} />
                      <Route path="settings" element={<AppSettingsPage />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <Routes>
                      <Route path="dashboard" element={<UserDashboard />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="change-password" element={<ChangePasswordPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </UserLayout>
                </ProtectedRoute>
              }
            />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster position={TOAST_CONFIG.position} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
