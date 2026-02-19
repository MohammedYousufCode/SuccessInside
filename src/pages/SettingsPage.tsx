import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          ⚙️ Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          👤 Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Email
            </label>
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {user?.email}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              User ID
            </label>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
              {user?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎨 Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Dark Mode
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Toggle between light and dark theme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800 shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          ⚠️ Danger Zone
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Once you log out, you'll need to sign in again to access your habits.
          </p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
          >
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
