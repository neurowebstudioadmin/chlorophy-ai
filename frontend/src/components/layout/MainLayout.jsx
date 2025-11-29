import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import { authService } from '../../services/supabase';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get REAL user email from Supabase
    authService.getCurrentUser()
      .then(user => {
        if (user?.email) {
          setUserEmail(user.email);
        }
      })
      .catch(err => {
        console.error('Error getting user:', err);
      });
  }, []);

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{
        background: chlorophyTheme.colors.gradients.hero,
      }}
    >
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        userEmail={userEmail || 'Loading...'}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}