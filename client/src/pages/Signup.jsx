import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, AlertTriangle, User, Mail, Lock, Phone, Globe, Image as ImageIcon, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';
import TermsModal from '../components/TermsModal';
import API from '../services/api';

const Signup = ({ showNotification }) => {
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const users = useUsers();

  const countries = ['USA', 'India', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill all required fields');
      if (showNotification) showNotification('error', 'Please fill all required fields');
      return;
    }

    const { checkUserExists, getUserByEmail } = users;

    const existingEmail = getUserByEmail(email.toLowerCase());
    const userExists = checkUserExists(email.toLowerCase(), phone);
    
    if (userExists) {
      let msg = 'Cannot create account: ';
      if (existingEmail) {
        msg += 'Email already registered. Please sign in instead.';
      } else if (phone) {
        msg += 'Phone number already registered. Use different details or sign in.';
      } else {
        msg += 'User already exists. Please sign in.';
      }
      setError(msg);
      if (showNotification) showNotification('error', msg);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // 🔁 Simulate API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const token = `fake-jwt-${Date.now()}`;

      // ✅ Preserve ALL user data
      const userData = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        phone,
        country,
        profileImgName: profileImg ? profileImg.name : null,
        createdAt: new Date().toISOString(),
      };

      const { saveUser } = users;
      saveUser(userData);

      login(token, userData);

      // 📧 Send professional welcome email notification
      try {
        await API.post('/auth/notify-signup', { 
          email: userData.email, 
          name: userData.name 
        });
      } catch (err) {
        console.warn('Email notification skipped (server offline)');
      }

      if (showNotification) {
        showNotification('success', 'Account created! Please sign in 📧');
      }

      navigate('/login'); 
    } catch (err) {
      console.error(err);
      setError('Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImgChange = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <motion.div 
              className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring" }}
            >
              <UserPlus className="w-12 h-12 text-emerald-600" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent cursor-default"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Join GeoTruthAI
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Create your account to start verifying news
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 hover:shadow-2xl transition-all duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center space-x-3 animate-pulse"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <User className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12 focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-12 focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <Globe className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field focus:ring-4 focus:ring-blue-200/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <ImageIcon className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  Profile Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImgChange}
                  className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-4 focus:ring-blue-200/50 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 transition-all duration-300 group-hover:shadow-md"
                />
                {profileImg && (
                  <motion.p 
                    className="text-sm text-green-600 mt-1 hover:text-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Image selected: {profileImg.name}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 hover:scale-110 transition-all duration-200 cursor-pointer"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700 leading-tight">
                    I agree to the{' '}
                    <span 
                      className="text-blue-600 hover:text-blue-700 hover:underline decoration-blue-600 decoration-2 cursor-pointer font-semibold transition-all duration-300 hover:shadow-md inline-block"
                      onClick={() => setTermsModalOpen(true)}
                    >
                      Terms & Conditions
                    </span>
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading || !termsAccepted}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(6, 78, 59, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white font-black py-5 px-8 rounded-3xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6" />
                    <span>Create Account</span>
                  </>
                )}
              </motion.button>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-all duration-300 hover:translate-y-[-1px]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </>
  );
};

export default Signup;

