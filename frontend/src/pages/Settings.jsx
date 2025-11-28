import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Bell, 
  Shield, 
  Key, 
  Link as LinkIcon,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';
import toast, { Toaster } from 'react-hot-toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'Europe/Berlin',
    notifications: {
      email: true,
      push: false,
      updates: true,
    },
    theme: 'dark',
    apiKey: 'sk-chlorophy-••••••••••••••••',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe, color: chlorophyTheme.colors.primary },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: chlorophyTheme.colors.secondary },
    { id: 'security', label: 'Security', icon: Shield, color: '#FF6B9D' },
    { id: 'api', label: 'API Keys', icon: Key, color: chlorophyTheme.colors.accent },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon, color: '#00D9FF' },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      icon: '✅',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.primary,
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
      },
    });
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: chlorophyTheme.fonts.display,
            background: chlorophyTheme.colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Settings
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: '#ffffff80',
            fontFamily: chlorophyTheme.fonts.body,
          }}
        >
          Customize your Chlorophy AI experience
        </p>
      </motion.div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full text-left relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-settings-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `${tab.color}20`,
                      border: `1px solid ${tab.color}40`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div 
                  className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: !isActive ? 'rgba(10, 14, 39, 0.6)' : 'transparent',
                  }}
                >
                  <Icon 
                    size={20} 
                    style={{ 
                      color: isActive ? tab.color : '#ffffff60',
                    }} 
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{
                      color: isActive ? tab.color : '#ffffff80',
                      fontFamily: chlorophyTheme.fonts.body,
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl backdrop-blur-xl p-8"
            style={{
              background: 'rgba(10, 14, 39, 0.8)',
              border: `1px solid ${chlorophyTheme.colors.primary}20`,
            }}
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: chlorophyTheme.colors.primary,
                    fontFamily: chlorophyTheme.fonts.display,
                  }}
                >
                  General Settings
                </h2>

                {/* Language */}
                <div>
                  <label 
                    className="text-sm font-medium mb-2 block"
                    style={{ color: '#ffffff80' }}
                  >
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${chlorophyTheme.colors.primary}20`,
                      color: '#ffffff',
                      fontFamily: chlorophyTheme.fonts.body,
                    }}
                  >
                    <option value="en">English</option>
                    <option value="it">Italiano</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label 
                    className="text-sm font-medium mb-2 block"
                    style={{ color: '#ffffff80' }}
                  >
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${chlorophyTheme.colors.primary}20`,
                      color: '#ffffff',
                      fontFamily: chlorophyTheme.fonts.body,
                    }}
                  >
                    <option value="Europe/Berlin">Europe/Berlin (GMT+1)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label 
                    className="text-sm font-medium mb-3 block"
                    style={{ color: '#ffffff80' }}
                  >
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => setSettings({ ...settings, theme: 'dark' })}
                      className="flex-1 p-4 rounded-xl flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: settings.theme === 'dark' 
                          ? `${chlorophyTheme.colors.primary}20`
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${settings.theme === 'dark' ? chlorophyTheme.colors.primary : '#ffffff20'}`,
                      }}
                    >
                      <Moon size={20} style={{ color: chlorophyTheme.colors.primary }} />
                      <span style={{ color: '#ffffff' }}>Dark</span>
                      {settings.theme === 'dark' && (
                        <Check size={16} style={{ color: chlorophyTheme.colors.primary }} />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => setSettings({ ...settings, theme: 'light' })}
                      className="flex-1 p-4 rounded-xl flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: settings.theme === 'light' 
                          ? `${chlorophyTheme.colors.accent}20`
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${settings.theme === 'light' ? chlorophyTheme.colors.accent : '#ffffff20'}`,
                      }}
                    >
                      <Sun size={20} style={{ color: chlorophyTheme.colors.accent }} />
                      <span style={{ color: '#ffffff' }}>Light</span>
                      {settings.theme === 'light' && (
                        <Check size={16} style={{ color: chlorophyTheme.colors.accent }} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: chlorophyTheme.colors.secondary,
                    fontFamily: chlorophyTheme.fonts.display,
                  }}
                >
                  Notification Preferences
                </h2>

                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'updates', label: 'Product Updates', desc: 'New features and improvements' },
                ].map((item) => (
                  <div 
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${chlorophyTheme.colors.secondary}20`,
                    }}
                  >
                    <div>
                      <p 
                        className="font-medium mb-1"
                        style={{ color: '#ffffff' }}
                      >
                        {item.label}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: '#ffffff60' }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key]}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [item.key]: e.target.checked,
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-14 h-8 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"
                        style={{
                          background: settings.notifications[item.key] 
                            ? chlorophyTheme.colors.secondary 
                            : 'rgba(255, 255, 255, 0.1)',
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: chlorophyTheme.colors.accent,
                    fontFamily: chlorophyTheme.fonts.display,
                  }}
                >
                  API Keys
                </h2>

                <div 
                  className="p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${chlorophyTheme.colors.accent}20`,
                  }}
                >
                  <label 
                    className="text-sm font-medium mb-2 block"
                    style={{ color: '#ffffff80' }}
                  >
                    Your API Key
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={settings.apiKey}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-lg"
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${chlorophyTheme.colors.accent}20`,
                        color: '#ffffff',
                        fontFamily: chlorophyTheme.fonts.code,
                      }}
                    />
                    <motion.button
                      onClick={() => {
                        navigator.clipboard.writeText(settings.apiKey);
                        toast.success('API Key copied!');
                      }}
                      className="px-6 py-3 rounded-lg font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: `${chlorophyTheme.colors.accent}30`,
                        color: chlorophyTheme.colors.accent,
                        border: `1px solid ${chlorophyTheme.colors.accent}40`,
                      }}
                    >
                      Copy
                    </motion.button>
                  </div>
                  <p 
                    className="text-xs mt-3"
                    style={{ color: '#ffffff60' }}
                  >
                    Keep your API key secret. Don't share it in public repositories.
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              className="w-full py-4 rounded-xl font-bold text-lg mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: chlorophyTheme.colors.gradients.primary,
                color: chlorophyTheme.colors.dark,
              }}
            >
              Save Changes
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}