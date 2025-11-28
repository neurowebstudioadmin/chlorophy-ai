import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

export default function MainLayout({ userEmail }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        userEmail={userEmail}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}