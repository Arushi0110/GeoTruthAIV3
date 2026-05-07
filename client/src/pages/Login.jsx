import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';

const Login = ({ showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Safe auth hook - useAuth safe wrapper
  const safeAuth = () => {
    try {
      return useAuth();
    } catch {
      return { login: () => {}, user: null };
    }
  };

  const { login } = safeAuth();
  const users = useUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill all fields');
      if (showNotification) showNotification('error', 'Please fill all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      if (showNotification) showNotification('error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo login - ANY email/password works!
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { getUserByEmail } = users;
      const existingUser = getUserByEmail(email.toLowerCase());

      const token = `fake-jwt-${Date.now()}`;
      
      // ✅ Use REAL details from signup if available
      const userData = existingUser ? {
        ...existingUser,
        token
      } : {
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        token
      };

      login(token, userData);
 
      if (showNotification) {
        showNotification('success', `Welcome ${userData.name}!`);
      }
 
      navigate('/home');
    } catch (err) {
      console.error(err);
      const msg = 'Something went wrong. Please try again.';
      setError(msg);
      if (showNotification) showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.div 
            className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <LogIn className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to your GeoTruthAI account
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center space-x-3"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field focus:ring-2 focus:ring-emerald-500 hover:border-emerald-300 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Password
                </label>
                <Link to="/forgot-password" title="Feature coming soon" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12 focus:ring-2 focus:ring-emerald-500 hover:border-emerald-300 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </>
              )}
            </motion.button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

