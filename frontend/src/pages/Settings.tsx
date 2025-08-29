import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Mail,
  Users,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ProjectHub',
    siteDescription: 'MERN Project Enrollment & Allocation System',
    maxApplicationsPerUser: 3,
    autoApproval: false,
    maintenanceMode: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    batchAssignments: true,
    projectDeadlines: true,
    systemAnnouncements: true,
    weeklyReports: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: false,
    passwordMinLength: 6,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 5
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: 'daily',
    logLevel: 'info',
    cacheEnabled: true,
    compressionEnabled: true,
    rateLimiting: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const mockApiKey = 'pk_live_51234567890abcdef1234567890abcdef12345678';

  const handleSaveSettings = async (settingsType: string) => {
    setIsLoading(true);
    try {
      // In real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${settingsType} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data backup completed successfully!');
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreData = async () => {
    if (!window.confirm('Are you sure you want to restore data? This will overwrite current data.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data restored successfully!');
    } catch (error) {
      toast.error('Restore failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cache cleared successfully!');
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access system settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure system preferences, security, and administrative options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'General', icon: SettingsIcon },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'system', label: 'System', icon: Database }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full transition-colors duration-200`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={generalSettings.siteDescription}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Applications Per User
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={generalSettings.maxApplicationsPerUser}
                        onChange={(e) => setGeneralSettings({...generalSettings, maxApplicationsPerUser: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Auto-Approval</h4>
                          <p className="text-sm text-gray-500">Automatically approve applications that meet criteria</p>
                        </div>
                        <button
                          onClick={() => setGeneralSettings({...generalSettings, autoApproval: !generalSettings.autoApproval})}
                          className={`${
                            generalSettings.autoApproval ? 'bg-primary-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              generalSettings.autoApproval ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                          <p className="text-sm text-gray-500">Temporarily disable user access for maintenance</p>
                        </div>
                        <button
                          onClick={() => setGeneralSettings({...generalSettings, maintenanceMode: !generalSettings.maintenanceMode})}
                          className={`${
                            generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              generalSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSaveSettings('General')}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {key === 'emailNotifications' && 'Send notifications via email'}
                              {key === 'applicationUpdates' && 'Notify about application status changes'}
                              {key === 'batchAssignments' && 'Notify about team assignments'}
                              {key === 'projectDeadlines' && 'Remind about upcoming deadlines'}
                              {key === 'systemAnnouncements' && 'Receive system-wide announcements'}
                              {key === 'weeklyReports' && 'Receive weekly progress reports'}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [key]: !value
                            })}
                            className={`${
                              value ? 'bg-primary-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                          >
                            <span
                              className={`${
                                value ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSaveSettings('Notification')}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email Verification Required</h4>
                          <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                        </div>
                        <button
                          onClick={() => setSecuritySettings({...securitySettings, requireEmailVerification: !securitySettings.requireEmailVerification})}
                          className={`${
                            securitySettings.requireEmailVerification ? 'bg-primary-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              securitySettings.requireEmailVerification ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Enable 2FA for enhanced security</p>
                        </div>
                        <button
                          onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                          className={`${
                            securitySettings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* API Key Management */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">API Key Management</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Current API Key</span>
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <code className="text-sm font-mono text-gray-600">
                          {showApiKey ? mockApiKey : '••••••••••••••••••••••••••••••••••••••••••••••••'}
                        </code>
                        <div className="mt-3 flex space-x-2">
                          <button className="text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-1 rounded">
                            Regenerate
                          </button>
                          <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSaveSettings('Security')}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">System Management</h3>
                  
                  <div className="space-y-6">
                    {/* Backup & Restore */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Data Management</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={handleBackupData}
                          disabled={isLoading}
                          className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Download className="h-4 w-4" />
                          <span>Backup Data</span>
                        </button>
                        <button
                          onClick={handleRestoreData}
                          disabled={isLoading}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Restore Data</span>
                        </button>
                        <button
                          onClick={handleClearCache}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Clear Cache</span>
                        </button>
                      </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">System Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Database</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Connected</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">API Server</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Running</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Service</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Active</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">File Storage</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Available</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Settings */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Performance</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={systemSettings.backupFrequency}
                            onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Log Level
                          </label>
                          <select
                            value={systemSettings.logLevel}
                            onChange={(e) => setSystemSettings({...systemSettings, logLevel: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                          </select>
                        </div>

                        <div className="space-y-4">
                          {[
                            { key: 'cacheEnabled', label: 'Enable Caching', desc: 'Improve performance with caching' },
                            { key: 'compressionEnabled', label: 'Enable Compression', desc: 'Compress responses to reduce bandwidth' },
                            { key: 'rateLimiting', label: 'Rate Limiting', desc: 'Limit API requests per user' }
                          ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                                <p className="text-sm text-gray-500">{desc}</p>
                              </div>
                              <button
                                onClick={() => setSystemSettings({
                                  ...systemSettings,
                                  [key]: !systemSettings[key as keyof typeof systemSettings]
                                })}
                                className={`${
                                  systemSettings[key as keyof typeof systemSettings] ? 'bg-primary-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                              >
                                <span
                                  className={`${
                                    systemSettings[key as keyof typeof systemSettings] ? 'translate-x-5' : 'translate-x-0'
                                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleSaveSettings('System')}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;