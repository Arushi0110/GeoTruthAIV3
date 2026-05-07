import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, ShieldCheck, AlertCircle, Activity, Clock, BarChart3 } from 'lucide-react';


const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API
    setTimeout(() => {
      setStats({
        total: 1247,
        fake: 342,
        real: 905,
        avgTrust: 78.4,
        trend: [
          { name: 'Jan', fake: 45, real: 120 },
          { name: 'Feb', fake: 38, real: 135 },
          { name: 'Mar', fake: 52, real: 118 },
          { name: 'Apr', fake: 47, real: 130 },
          { name: 'May', fake: 61, real: 112 }
        ],
        sources: [
          { name: 'Social Media', value: 45 },
          { name: 'News Sites', value: 30 },
          { name: 'Blogs', value: 15 },
          { name: 'Other', value: 10 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="mb-12 cursor-pointer group"
        >
          <div className="flex items-center mb-4 group-hover:text-blue-600 transition-colors duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mr-4 group-hover:scale-110 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analytics Center
            </h1>
          </div>
          <motion.p 
            className="text-2xl text-gray-600 max-w-2xl group-hover:text-gray-700 transition-colors"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            Real-time insights across all verifications
          </motion.p>
        </motion.div>


        {/* KPI Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          <motion.div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all" whileHover={{ y: -8 }}>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg mr-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Total Verifications</h3>
                <p className="text-emerald-600 text-sm font-semibold">Today</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">{stats.total}</div>
          </motion.div>

          <motion.div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all" whileHover={{ y: -8 }}>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg mr-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Fake News Detected</h3>
                <p className="text-orange-600 text-sm font-semibold">This Week</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">{stats.fake}</div>
          </motion.div>

          <motion.div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all" whileHover={{ y: -8 }}>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg mr-4">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Active Users</h3>
                <p className="text-blue-600 text-sm font-semibold">Monthly</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">{stats.real}</div>
          </motion.div>

          <motion.div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all" whileHover={{ y: -8 }}>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg mr-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Avg Trust Score</h3>
                <p className="text-purple-600 text-sm font-semibold">All Time</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">{stats.avgTrust.toFixed(1)}%</div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <h3 className="font-bold text-2xl mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3" />
              Verification Trend
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.trend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fake" fill="#ef4444" name="Fake" />
                <Bar dataKey="real" fill="#10b981" name="Real" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <h3 className="font-bold text-2xl mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3" />
              Source Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.sources}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {stats.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center mb-6">
              <Clock className="w-12 h-12 bg-green-500 text-white rounded-2xl p-3 mr-4" />
              <div>
                <h4 className="font-bold text-xl">Response Time</h4>
                <p className="text-green-600 text-lg font-semibold">Avg 2.1s</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">99.9%</div>
            <p className="text-sm text-gray-500 mt-2">Uptime</p>
          </motion.div>

          <motion.div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center mb-6">
              <ShieldCheck className="w-12 h-12 bg-blue-500 text-white rounded-2xl p-3 mr-4" />
              <div>
                <h4 className="font-bold text-xl">Model Accuracy</h4>
                <p className="text-blue-600 text-lg font-semibold">BERT 96.8%</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">97.3%</div>
            <p className="text-sm text-gray-500 mt-2">Overall</p>
          </motion.div>

          <motion.div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center mb-6">
              <TrendingUp className="w-12 h-12 bg-purple-500 text-white rounded-2xl p-3 mr-4" />
              <div>
                <h4 className="font-bold text-xl">Growth</h4>
                <p className="text-purple-600 text-lg font-semibold">+23% MoM</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900">1.2K</div>
            <p className="text-sm text-gray-500 mt-2">New Users</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Admin;

