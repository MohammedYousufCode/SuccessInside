import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/date';

export default function ProfilePage() {
  const { user } = useAuth();
  const { stats } = useUserStats();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);

  const memberSince = user?.created_at ? formatDate(user.created_at) : 'Unknown';
  const daysSinceJoined = user?.created_at 
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      } else if (data) {
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      console.log('Uploading to:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);

      setAvatarUrl(urlData.publicUrl);

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        console.error('Update error:', updateError);
        alert(`Profile update failed: ${updateError.message}`);
        return;
      }

      alert('✅ Profile picture updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('❌ Unexpected error occurred. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!displayName.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          display_name: displayName.trim(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Name update error:', error);
        alert(`Failed to update name: ${error.message}`);
        return;
      }

      setIsEditingName(false);
      alert('✅ Name updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('❌ Error updating name');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          👤 Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your personal habit tracking journey
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with Upload */}
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white dark:border-gray-800"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Upload Button Overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="text-center">
                <span className="text-white text-sm font-bold block">
                  {uploading ? '⏳ Uploading...' : '📷 Upload'}
                </span>
                <span className="text-white text-xs">Click to change</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">✓</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {isEditingName ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="px-4 py-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleNameUpdate}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  {displayName || user?.email?.split('@')[0]}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  title="Edit name"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4 justify-center sm:justify-start">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                📅 Member since {memberSince}
              </span>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                🎯 {daysSinceJoined} days active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Lifetime Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-black">{stats?.total_habits || 0}</div>
            <div className="text-blue-100 text-sm font-semibold mt-1">Total Habits Created</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black">{stats?.total_completions || 0}</div>
            <div className="text-green-100 text-sm font-semibold mt-1">Total Completions</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-black">{stats?.current_streak || 0}</div>
            <div className="text-orange-100 text-sm font-semibold mt-1">Current Streak</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-black">{stats?.longest_streak || 0}</div>
            <div className="text-purple-100 text-sm font-semibold mt-1">Longest Streak Ever</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-3xl font-black">{stats?.active_habits || 0}</div>
            <div className="text-pink-100 text-sm font-semibold mt-1">Active Habits</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-black">
              {stats?.total_habits && stats?.total_completions && daysSinceJoined > 0
                ? Math.round((stats.total_completions / (stats.total_habits * daysSinceJoined)) * 100)
                : 0}%
            </div>
            <div className="text-indigo-100 text-sm font-semibold mt-1">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🏆 Achievements
        </h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">First Habit</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-bold">✓ Unlocked</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-gray-800 opacity-50">
              <div className="text-4xl mb-2 grayscale">🔥</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">7-Day Streak</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">🔒 Locked</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-gray-800 opacity-50">
              <div className="text-4xl mb-2 grayscale">💯</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">100 Completions</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">🔒 Locked</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-100 dark:bg-gray-800 opacity-50">
              <div className="text-4xl mb-2 grayscale">🌟</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">30-Day Warrior</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">🔒 Locked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
