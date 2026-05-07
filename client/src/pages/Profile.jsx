import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, User, ShieldCheck, BarChart3, Edit3, Save,
  Lock, Check, AlertTriangle, X, Camera, Mail,
  Phone, Globe, Star, TrendingUp, XCircle, Trash2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';
import PageHero from '../components/PageHero';
import API from '../services/api';

// ── Trust badge config ──────────────────────────────────────────────────────
const getTrustBadge = (score) => {
  if (score >= 80) return { label: 'Reliable', emoji: '🛡️', gradient: 'from-emerald-400 to-teal-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 50) return { label: 'Neutral',  emoji: '⚖️', gradient: 'from-amber-400 to-orange-500', text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   };
  return               { label: 'Suspicious', emoji: '⚠️', gradient: 'from-rose-400 to-red-500',     text: 'text-rose-700',   bg: 'bg-rose-50',    border: 'border-rose-200'    };
};

// ── Stat card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, gradient, hoverBorder, hoverBg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${hoverBorder} ${hoverBg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group`}
  >
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </motion.div>
);

// ── Input field ─────────────────────────────────────────────────────────────
const Field = ({ label, icon, value, onChange, type = 'text', disabled = false, placeholder }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-600 mb-1.5">{label}</label>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${disabled ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'} transition-all duration-200`}>
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-300 disabled:text-gray-400"
      />
    </div>
  </div>
);

// ── Main ────────────────────────────────────────────────────────────────────
const Profile = () => {
  const [localUser, setLocalUser]     = useState(null);
  const [editing, setEditing]         = useState(false);
  const [editedUser, setEditedUser]   = useState(null);
  const [changePwMode, setChangePwMode] = useState(false);
  const [pwData, setPwData]           = useState({ currentPw: '', newPw: '', confirmNewPw: '' });
  const [pwError, setPwError]         = useState('');
  const [pwSuccess, setPwSuccess]     = useState(false);
  const [stats, setStats]             = useState({ verifications: 0, trustScore: 0, fakeDetected: 0, realDetected: 0 });
  const navigate                      = useNavigate();
  const { user: authUser, logout }    = useAuth();

  useEffect(() => {
    if (!authUser) { navigate('/login'); return; }
    setLocalUser(authUser);
    setEditedUser(authUser);

    try {
      const key     = authUser.email ? `analysisHistory_${authUser.email}` : 'analysisHistory';
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      const scores  = history.map(h => Number(h.trust_score ?? 0)).filter(n => n >= 0);
      const avg     = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const fake    = history.filter(h => {
        const bp = (h.bert_prediction ?? h.prediction ?? '').toString().toLowerCase();
        return bp === 'fake' || bp === '0';
      }).length;
      setStats({ verifications: history.length, trustScore: avg, fakeDetected: fake, realDetected: history.length - fake });
    } catch { /* silently ignore */ }
  }, [authUser, navigate]);

  const users = useUsers();

  const handleEditToggle = () => {
    if (editing) {
      setLocalUser(editedUser);
      localStorage.setItem('user', JSON.stringify(editedUser));
      
      // ✅ Sync with users database
      if (users && users.saveUser) {
        users.saveUser(editedUser);
      }
    }
    setEditing(prev => !prev);
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();
    setPwError('');
    if (pwData.newPw.length < 6)               { setPwError('Password must be at least 6 characters.'); return; }
    if (pwData.newPw !== pwData.confirmNewPw)   { setPwError('Passwords do not match.'); return; }
    setPwSuccess(true);
    setTimeout(() => { setChangePwMode(false); setPwSuccess(false); setPwData({ currentPw: '', newPw: '', confirmNewPw: '' }); }, 1800);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleResetAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL your verification history and logout. Continue?')) {
      localStorage.clear();
      logout();
      navigate('/signup');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('🚨 PERMANENT ACTION: Delete your account and all data? This cannot be undone.')) {
      try {
        const userEmail = localUser.email;
        
        // 1. Try server deletion
        try {
          await API.post('/auth/delete-account', { email: userEmail });
        } catch (err) {
          console.warn('Server deletion skipped (offline mode)');
        }
        
        // 2. Local "Owners DB" deletion (UsersContext)
        if (users && users.deleteUser) {
          users.deleteUser(userEmail);
        }
        
        // 3. Cleanup local state
        const historyKey = `analysisHistory_${userEmail}`;
        localStorage.removeItem(historyKey);
        localStorage.removeItem('analysis');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        logout();
        navigate('/signup');
        alert('Your account and all associated data have been permanently deleted.');
      } catch (err) {
        console.error(err);
        alert('Failed to complete deletion. Please try again.');
      }
    }
  };

  if (!localUser) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg font-medium">Loading profile…</div>
      </div>
    );
  }

  const badge = getTrustBadge(stats.trustScore);
  const initials = localUser.name ? localUser.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-[#F0F4FF] px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Page Heading ── */}
        <PageHero
          icon={<User className="w-12 h-12 text-white drop-shadow-lg" />}
          iconGradient="from-blue-500 via-purple-600 to-indigo-600"
          words={['My', 'Profile']}
          subtitle="Manage your account, trust badge, and security settings."
        />

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <span className="text-white text-3xl font-black">{initials}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-2">
                  <input
                    value={editedUser?.name || ''}
                    onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="text-2xl font-black text-gray-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none w-full"
                    placeholder="Your name"
                  />
                  <input
                    value={editedUser?.email || ''}
                    onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="text-base text-gray-500 bg-transparent border-b-2 border-gray-200 focus:border-blue-400 outline-none w-full"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-gray-900">{localUser.name || 'User'}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">{localUser.email}</p>
                  <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                    {badge.emoji} {badge.label} Analyst
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all"
              >
                {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {editing ? 'Save' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold border border-rose-200 hover:border-rose-300 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Two-col: Trust badge + Account info ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-3xl p-8 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${badge.border} group`}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Trust Badge
            </h3>
            <div className={`bg-gradient-to-br ${badge.gradient} rounded-2xl p-8 text-center text-white relative overflow-hidden`}>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <p className="text-5xl mb-3">{badge.emoji}</p>
              <p className="text-2xl font-black">{badge.label}</p>
              <p className="text-5xl font-black mt-2">{stats.trustScore}%</p>
              <p className="text-white/80 text-sm mt-2">Trust Score</p>
            </div>
            {/* Progress */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Suspicious</span><span>Reliable</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${badge.gradient} transition-all duration-1000`}
                  style={{ width: `${stats.trustScore}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="group-hover:text-blue-700 transition-colors">Account Info</span>
            </h3>
            <div className="space-y-4">
              <Field label="Full Name"  icon={<User className="w-4 h-4" />}  value={localUser.name  || ''}  disabled placeholder="Your name" />
              <Field label="Email"      icon={<Mail className="w-4 h-4" />}  value={localUser.email || ''}  disabled placeholder="your@email.com" />
              <Field label="Phone"      icon={<Phone className="w-4 h-4" />} value={localUser.phone || ''}  disabled placeholder="Not set" />
              <Field label="Country"    icon={<Globe className="w-4 h-4" />} value={localUser.country || ''} disabled placeholder="Not set" />
            </div>
          </motion.div>
        </div>

        {/* ── Change Password ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:border-purple-200 hover:bg-purple-50/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <span className="group-hover:text-purple-700 transition-colors">Security</span>
            </h3>
            <button
              onClick={() => setChangePwMode(p => !p)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                changePwMode
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-105'
              }`}
            >
              {changePwMode ? <><X className="w-4 h-4" /> Cancel</> : <><Lock className="w-4 h-4" /> Change Password</>}
            </button>
          </div>

          <AnimatePresence>
            {changePwMode && (
              <motion.form
                id="password-form"
                key="pw-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePwSubmit}
                className="mt-6 space-y-4 overflow-hidden"
              >
                <Field label="Current Password" icon={<Lock className="w-4 h-4" />} type="password"
                  value={pwData.currentPw} onChange={e => setPwData({...pwData, currentPw: e.target.value})} placeholder="••••••••" />
                <Field label="New Password"     icon={<Lock className="w-4 h-4" />} type="password"
                  value={pwData.newPw}     onChange={e => setPwData({...pwData, newPw: e.target.value})}     placeholder="Min 6 characters" />
                <Field label="Confirm Password" icon={<Lock className="w-4 h-4" />} type="password"
                  value={pwData.confirmNewPw} onChange={e => setPwData({...pwData, confirmNewPw: e.target.value})} placeholder="Repeat new password" />

                {pwError   && <p className="text-rose-500 text-sm font-medium">{pwError}</p>}
                {pwSuccess && <p className="text-emerald-500 text-sm font-medium">✅ Password updated successfully!</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Danger Zone ── */}
        <div className="space-y-4">
          {/* Clear History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 rounded-3xl p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Clear History
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Erase all your verification logs and analysis history. Your account and profile settings will be preserved.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your verification history? This cannot be undone.')) {
                    const key = authUser.email ? `analysisHistory_${authUser.email}` : 'analysisHistory';
                    localStorage.removeItem(key);
                    localStorage.removeItem('analysis');
                    window.location.reload();
                  }
                }}
                className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Clear All Data
              </button>
            </div>
          </motion.div>

          {/* Delete Account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-rose-50 rounded-3xl p-8 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Delete Account
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Permanently erase your account and all verification data from our database. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-red-500/40 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Delete My Account
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
