import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Builder from './components/builder/Builder';

// Placeholder pages (da implementare dopo)
function Projects() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white">My Projects - Coming Soon</h1>
    </div>
  );
}

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

function App() {
  // Mock user data (replace with real auth later)
  const userEmail = 'francesco@chlorophy.ai';
  const isAuthenticated = true; // Replace with real auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <Routes>
        {/* Main App with Sidebar */}
        <Route path="/" element={<MainLayout userEmail={userEmail} />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Main Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="builder" element={<Builder />} />
          <Route path="projects" element={<Projects />} />
          <Route path="templates" element={<Templates />} />
          <Route path="stats" element={<Stats />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;