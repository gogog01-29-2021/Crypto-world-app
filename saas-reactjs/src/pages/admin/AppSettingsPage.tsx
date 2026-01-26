import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllSettings } from '../../hooks';
import { EmailSettingsTab } from './settings/EmailSettingsTab';
import { SecuritySettingsTab } from './settings/SecuritySettingsTab';
import { RateLimitSettingsTab } from './settings/RateLimitSettingsTab';
import { FileStorageSettingsTab } from './settings/FileStorageSettingsTab';
import { OAuthSettingsTab } from './settings/OAuthSettingsTab';

type TabType = 'email' | 'security' | 'rate-limits' | 'file-storage' | 'oauth';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'rate-limits', label: 'Rate Limits', icon: '⚡' },
  { id: 'file-storage', label: 'File Storage', icon: '📁' },
  { id: 'oauth', label: 'OAuth', icon: '🔑' },
];

export const AppSettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'email');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: settings, isLoading, error } = useAllSettings();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTabChange = (tabId: TabType) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave this tab?')) {
        setHasUnsavedChanges(false);
        setActiveTab(tabId);
      }
    } else {
      setActiveTab(tabId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <p className="text-red-400">Failed to load settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Application Settings
        </h1>
        <p className="mt-2 text-gray-300">Configure application behavior and integrations</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-xl overflow-hidden">
        <div className="border-b border-blue-500/20">
          <nav className="flex space-x-1 p-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-white border border-blue-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }
                `}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'email' && settings && (
            <EmailSettingsTab
              settings={settings.email}
              onUnsavedChanges={setHasUnsavedChanges}
            />
          )}
          {activeTab === 'security' && settings && (
            <SecuritySettingsTab
              settings={settings.security}
              onUnsavedChanges={setHasUnsavedChanges}
            />
          )}
          {activeTab === 'rate-limits' && settings && (
            <RateLimitSettingsTab
              settings={settings.rateLimits}
              onUnsavedChanges={setHasUnsavedChanges}
            />
          )}
          {activeTab === 'file-storage' && settings && (
            <FileStorageSettingsTab
              settings={settings.fileStorage}
              onUnsavedChanges={setHasUnsavedChanges}
            />
          )}
          {activeTab === 'oauth' && settings && (
            <OAuthSettingsTab
              settings={settings.oauth}
              onUnsavedChanges={setHasUnsavedChanges}
            />
          )}
        </div>
      </div>
    </div>
  );
};

