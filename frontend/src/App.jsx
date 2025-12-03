import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import MyProjects from './pages/MyProjects';
import Builder from './components/builder/Builder';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ComingSoon from './components/ComingSoon';
import { authService } from './services/supabase';

// Placeholder pages
function Templates() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white">Templates - Coming Soon</h1>
    </div>
  );
}

function Stats() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white">Usage & Stats - Coming Soon</h1>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E27' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem('chlorophy_unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  // If not unlocked, show Coming Soon for everything
  if (!isUnlocked) {
    return <ComingSoon onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="builder" element={<Builder />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="templates" element={<Templates />} />
          <Route path="stats" element={<Stats />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;