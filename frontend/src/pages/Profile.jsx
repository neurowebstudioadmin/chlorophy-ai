import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Upload, Save, X } from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';
import toast, { Toaster } from 'react-hot-toast';
import { authService, profileService } from '../services/supabase';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    avatar_url: null,
  });
  const [originalProfile, setOriginalProfile] = useState({});

  // Load user and profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        toast.error('Not authenticated');
        return;
      }
      
      setUser(currentUser);
      
      // Get profile from database
      const userProfile = await profileService.getProfile(currentUser.id);
      
      if (userProfile) {
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } else {
        // No profile yet, set defaults
        const defaultProfile = {
          name: currentUser.email?.split('@')[0] || '',
          bio: '',
          location: '',
          avatar_url: null,
        };
        setProfile(defaultProfile);
        setOriginalProfile(defaultProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large! Max 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      toast.loading('Uploading avatar...');
      
      // Upload to Supabase Storage
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      
      // Update profile with new avatar URL
      setProfile({ ...profile, avatar_url: avatarUrl });
      
      toast.dismiss();
      toast.success('Avatar uploaded!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      toast.dismiss();
      toast.error('Failed to upload avatar');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save to database
      await profileService.upsertProfile(user.id, {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        avatar_url: profile.avatar_url,
      });
      
      setOriginalProfile(profile);
      setIsEditing(false);
      
      toast.success('Profile updated successfully!', {
        icon: '✅',
        style: {
          background: chlorophyTheme.colors.dark,
          color: chlorophyTheme.colors.primary,
          border: `1px solid ${chlorophyTheme.colors.primary}40`,
        },
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  // Format join date
  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
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
          Profile Settings
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: '#ffffff80',
            fontFamily: chlorophyTheme.fonts.body,
          }}
        >
          Manage your account information
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl backdrop-blur-xl overflow-hidden"
        style={{
          background: 'rgba(10, 14, 39, 0.8)',
          border: `1px solid ${chlorophyTheme.colors.primary}20`,
        }}
      >
        {/* Cover Image */}
          <div 
        className="h-24 relative"
         style={{
         background: chlorophyTheme.colors.gradients.primary,
        }}
      >
          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            {!isEditing ? (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg backdrop-blur-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(10, 14, 39, 0.8)',
                  color: chlorophyTheme.colors.primary,
                  border: `1px solid ${chlorophyTheme.colors.primary}40`,
                }}
              >
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg backdrop-blur-xl font-medium flex items-center gap-2"
                  whileHover={{ scale: saving ? 1 : 1.05 }}
                  whileTap={{ scale: saving ? 1 : 0.95 }}
                  style={{
                    background: saving ? 'rgba(255, 255, 255, 0.1)' : chlorophyTheme.colors.primary,
                    color: saving ? '#ffffff60' : chlorophyTheme.colors.dark,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg backdrop-blur-xl font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255, 71, 87, 0.2)',
                    color: '#FF4757',
                    border: '1px solid #FF475740',
                  }}
                >
                  <X size={16} />
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end gap-6 -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-2xl flex items-center justify-center border-4 overflow-hidden"
                style={{
                  background: profile.avatar_url 
                    ? `url(${profile.avatar_url}) center/cover`
                    : chlorophyTheme.colors.gradients.primary,
                  borderColor: chlorophyTheme.colors.dark,
                }}
              >
                {!profile.avatar_url && (
                  <User size={48} style={{ color: chlorophyTheme.colors.dark }} />
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <motion.div
                    className="p-3 rounded-full cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: chlorophyTheme.colors.primary,
                    }}
                  >
                    <Upload size={20} style={{ color: chlorophyTheme.colors.dark }} />
                  </motion.div>
                </label>
              )}
            </div>

            {/* Name & Email */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                  className="text-3xl font-bold mb-2 w-full px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${chlorophyTheme.colors.primary}20`,
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.display,
                  }}
                />
              ) : (
                <h2 
                  className="text-3xl font-bold mb-2"
                  style={{
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.display,
                  }}
                >
                  {profile.name || 'No name set'}
                </h2>
              )}
              <p 
                className="text-lg flex items-center gap-2"
                style={{ color: '#ffffff60' }}
              >
                <Mail size={18} />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Bio */}
            <div>
              <label 
                className="text-sm font-medium mb-2 block"
                style={{ color: '#ffffff80' }}
              >
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${chlorophyTheme.colors.primary}20`,
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.body,
                    resize: 'none',
                  }}
                />
              ) : (
                <p 
                  className="text-sm"
                  style={{ color: '#ffffff' }}
                >
                  {profile.bio || 'No bio yet'}
                </p>
              )}
            </div>

            {/* Location & Join Date */}
            <div className="space-y-4">
              <div>
                <label 
                  className="text-sm font-medium mb-2 block"
                  style={{ color: '#ffffff80' }}
                >
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${chlorophyTheme.colors.primary}20`,
                      color: '#ffffff',
                      fontFamily: chlorophyTheme.fonts.body,
                    }}
                  />
                ) : (
                  <p 
                    className="text-sm flex items-center gap-2"
                    style={{ color: '#ffffff' }}
                  >
                    <MapPin size={16} style={{ color: chlorophyTheme.colors.primary }} />
                    {profile.location || 'No location set'}
                  </p>
                )}
              </div>

              <div>
                <label 
                  className="text-sm font-medium mb-2 block"
                  style={{ color: '#ffffff80' }}
                >
                  Member Since
                </label>
                <p 
                  className="text-sm flex items-center gap-2"
                  style={{ color: '#ffffff' }}
                >
                  <Calendar size={16} style={{ color: chlorophyTheme.colors.accent }} />
                  {joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}