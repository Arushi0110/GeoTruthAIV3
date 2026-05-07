import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, ShieldCheck, XCircle, CheckCircle,
  Zap, Clock, ArrowRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/PageHero';

const getPredictionLabel = (raw) => {
  const p = typeof raw === 'string' ? raw.toLowerCase().trim() : raw;
  if (p === 'fake' || p === 0 || p === '0') return 'FAKE';
  if (p === 'real' || p === 1 || p === '1') return 'REAL';
  if (p === 'uncertain') return 'UNCERTAIN';
  return raw ? String(raw).toUpperCase() : 'N/A';
};

const getTrustGradient = (score, label) => {
  if (label === 'REAL') return 'from-emerald-500 to-teal-600'; // Real news (Green)
  if (label === 'FAKE') return 'from-rose-500 to-red-600'; // Fake news (Red)
  
  // Fallback
  if (score >= 65) return 'from-emerald-500 to-teal-600';
  if (score >= 45) return 'from-amber-400 to-orange-500';
  return 'from-rose-500 to-red-600';
};

const Analytics = () => {
  const { user } = useAuth();
  const userKey = user?.email ? `analysisHistory_${user.email}` : 'analysisHistory';
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(userKey) || '[]');
    setHistory(stored);
  }, [userKey]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total = history.length;
  const realCount = history.filter(h => getPredictionLabel(h.bert_prediction ?? h.prediction) === 'REAL').length;
  const fakeCount = total - realCount;
  const avgTrust = total
    ? Math.round(history.reduce((s, h) => s + Number(h.trust_score || 0), 0) / total)
    : 0;
  const avgConf = total
    ? (history.reduce((s, h) => s + Number(h.bert_confidence || 0), 0) / total).toFixed(1)
    : '0';

  // ── Empty state ────────────────────────────────────────────────────────────
  if (total === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex flex-col items-center justify-center px-4 py-20">
        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-3 text-center">No Analytics Yet</h1>
        <p className="text-gray-500 text-lg max-w-md text-center mb-8">
          Run your first news verification to start seeing trends, scores, and insights here.
        </p>
        <Link
          to="/verify"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Zap className="w-5 h-5" /> Verify First News
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <PageHero
          icon={<BarChart3 className="w-12 h-12 text-white drop-shadow-lg" />}
          iconGradient="from-violet-500 via-purple-600 to-indigo-600"
          words={['Your', 'Analytics']}
          subtitle="A live breakdown of all your news verifications — scores, trends, and history."
        />

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Verified', value: total, icon: <Activity className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100 group-hover:bg-blue-200', border: 'hover:border-blue-200 hover:bg-blue-50/40' },
            { label: 'Avg Trust Score', value: `${avgTrust}%`, icon: <ShieldCheck className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100 group-hover:bg-purple-200', border: 'hover:border-purple-200 hover:bg-purple-50/40' },
            { label: 'Real News', value: realCount, icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-100 group-hover:bg-emerald-200', border: 'hover:border-emerald-200 hover:bg-emerald-50/40' },
            { label: 'Fake News', value: fakeCount, icon: <XCircle className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-100 group-hover:bg-rose-200', border: 'hover:border-rose-200 hover:bg-rose-50/40' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${stat.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group`}
            >
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3 transition-colors`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Real vs Fake visual bar */}
        <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm mb-8 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            Real vs Fake Distribution
          </h2>
          <div className="flex rounded-xl overflow-hidden h-8 bg-gray-100">
            {realCount > 0 && (
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
                style={{ width: `${(realCount / total) * 100}%` }}
              >
                {Math.round((realCount / total) * 100)}% Real
              </div>
            )}
            {fakeCount > 0 && (
              <div
                className="bg-gradient-to-r from-rose-400 to-red-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
                style={{ width: `${(fakeCount / total) * 100}%` }}
              >
                {Math.round((fakeCount / total) * 100)}% Fake
              </div>
            )}
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>{realCount} Real</span>
            <span className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>{fakeCount} Fake</span>
            <span className="flex items-center gap-2 text-gray-600"><span className="w-3 h-3 rounded-full bg-purple-400 inline-block"></span>Avg Confidence: {avgConf}%</span>
          </div>
        </div>

        {/* History list */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Verification History
            </h2>
            <span className="text-sm text-gray-400">{total} total</span>
          </div>
          <div className="space-y-3">
            {history.map((item, i) => {
              const label = getPredictionLabel(item.bert_prediction ?? item.prediction);
              const score = Math.round(item.trust_score || 0);
              const gradient = getTrustGradient(score, label);
              const isReal = label === 'REAL';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-default"
                >
                  {/* Score badge */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-white text-sm font-black">{score}%</span>
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-blue-700 transition-colors">
                      {item.input_text?.slice(0, 90)}…
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Confidence: {Number(item.bert_confidence || 0).toFixed(1)}% · {item.date || 'Invalid Date'}
                    </p>
                  </div>
                  {/* Badge */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide flex-shrink-0 ${
                    isReal ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isReal ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
