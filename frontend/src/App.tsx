import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import PrivateRoute from './components/routing/PrivateRoute';

// Ленивая загрузка страниц
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const AddTransactionPage = lazy(() => import('./pages/AddTransactionPage'));
const EditTransactionPage = lazy(() => import('./pages/EditTransactionPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Защищенные маршруты */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
              <Route path="/transactions/add" element={<PrivateRoute><AddTransactionPage /></PrivateRoute>} />
              <Route path="/transactions/:id/edit" element={<PrivateRoute><EditTransactionPage /></PrivateRoute>} />
              <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              
              {/* Страница 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
