import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import RegisterLayout from './layout/RegisterLayout';
import RegisterApplication from './pages/RegisterApplication';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import { useAuth } from './hook/useAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { checkAuth } = useAuth();

  // Only check auth for protected routes
  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
    };
    verifyAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Student Home */}
        <Route
          path='/student'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <StudentHome setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />

        {/* Protected Register Student */}
        <Route
          path='/student/register/*'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route path='application' element={<RegisterApplication />} />
        </Route>

        {/* Protected Admin */}
        <Route
          path='/admin/:userId'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
