import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

// ICONS: change an icon here and it changes everywhere on this page
const UserIcon = User;
const EmailIcon = Mail;
const PasswordIcon = Lock;
const SecurityIcon = ShieldCheck;

const inputClass =
  'w-full pl-11 pr-4 py-3 text-sm text-slate-700 bg-white border-2 border-[#eeeaf5] rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-[#b9a7e0] transition-colors';

const ProfilePage = () => {
  const { user } = useAuth(); // CHECK: your AuthContext gives "user"

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      // CHECK: the function name in authService.js
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.error || error.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Profile Settings
      </h1>

      {/* User information */}
      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-[#e6dcf5] to-[#d8ebf5] px-8 py-5">
          <h2 className="text-lg font-semibold text-slate-800">User Information</h2>
        </div>

        <div className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Username
            </label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a73c2]" />
              <input
                type="text"
                value={user?.username || ''}
                readOnly
                className={`${inputClass} bg-[#faf8fd] cursor-not-allowed`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <EmailIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a73c2]" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className={`${inputClass} bg-[#faf8fd] cursor-not-allowed`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-3xl border border-[#ece6f6] shadow-xl shadow-[#e6dcf5]/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#d9f0e3] to-[#d8ebf5] px-8 py-5 flex items-center gap-3">
          <SecurityIcon size={20} className="text-[#3f7a5b]" />
          <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <PasswordIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a73c2]" />
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <PasswordIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a73c2]" />
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <PasswordIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a73c2]" />
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                placeholder="Type the new password again"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#a994d6] rounded-xl shadow-md shadow-[#e6dcf5] hover:bg-[#9a84cc] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;