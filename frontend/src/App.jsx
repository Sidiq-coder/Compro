import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { Layout } from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import { HomePage, ContactPage, NotFoundPage, LoginPage, DashboardPage, UserManagementPage, DepartmentPage, DivisionPage, FinancePage, ProductPage, ProductDetailPage, ArticleManagementPage, EventManagementPage } from './pages';
import { ROUTES } from './constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes without layout */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          {/* Protected routes without layout */}
          <Route path={ROUTES.DASHBOARD} element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.USERS} element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.DEPARTMENT} element={
            <ProtectedRoute>
              <DepartmentPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.DIVISI} element={
            <ProtectedRoute>
              <DivisionPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.KEUANGAN} element={
            <ProtectedRoute>
              <FinancePage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.PRODUK} element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.PRODUCT_DETAIL} element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ARTICLES} element={
            <ProtectedRoute>
              <ArticleManagementPage />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.EVENTS} element={
            <ProtectedRoute>
              <EventManagementPage />
            </ProtectedRoute>
          } />
          
          {/* Public routes with layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
