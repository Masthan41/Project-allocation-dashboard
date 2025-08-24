import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Award,
  Code,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills || [],
    experience: user?.profile?.experience || ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        experience: user.profile?.experience || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        phone: profileData.phone,
        bio: profileData.bio,
        skills: profileData.skills,
        experience: profileData.experience
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        experience: user.profile?.experience || ''
      });
    }
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and showcase your skills
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-primary-100">{user?.email}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role === 'admin' ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{profileData.name}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{profileData.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            placeholder="Enter your phone number"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">
                            {profileData.phone || 'Not provided'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          rows={4}
                          placeholder="Tell us about yourself, your interests, and goals..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {profileData.bio || 'No bio provided yet.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Account Type</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role === 'admin' ? 'Administrator' : 'Student'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Member Since</span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {user?.currentBatch && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Current Batch</span>
                        </div>
                        <span className="text-sm text-gray-900">Assigned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills and Experience */}
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                  
                  {isEditing && (
                    <div className="mb-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a skill (e.g., React, Python, UI/UX)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          onClick={addSkill}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-primary-600 hover:text-primary-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        {isEditing ? 'Add your skills to showcase your expertise' : 'No skills added yet'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.experience}
                      onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      rows={6}
                      placeholder="Describe your relevant experience, projects, internships, or any other background that showcases your abilities..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {profileData.experience || 'No experience information provided yet.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {profileData.skills.length}
                      </div>
                      <div className="text-sm text-primary-700">Skills</div>
                    </div>
                    <div className="bg-secondary-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary-600">
                        {user?.currentBatch ? '1' : '0'}
                      </div>
                      <div className="text-sm text-secondary-700">Active Batch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;