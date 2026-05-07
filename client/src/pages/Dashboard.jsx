import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import {
  Zap, BarChart3, Users, ShieldCheck, ArrowRight, CheckCircle, XCircle,
  AlertCircle, ArrowLeft, TrendingUp, Clock, Eye, Brain
} from 'lucide-react';
import Heatmap from '../components/Heatmap';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  
  // Fallback for neutral/other
  if (score >= 65) return 'from-emerald-500 to-teal-600';
  if (score >= 45) return 'from-amber-400 to-orange-500';
  return 'from-rose-500 to-red-600';
};

const getTrustBar = (score) => {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
};

const PredictionBadge = ({ label }) => {
  const isReal = label === 'REAL';
  const isUncertain = label === 'UNCERTAIN';
  
  if (isUncertain) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-100 text-amber-700">
        <AlertCircle className="w-3 h-3 mr-1" />
        UNCERTAIN
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
      isReal
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-rose-100 text-rose-700'
    }`}>
      {isReal ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
      {label}
    </span>
  );
};

// ─── History Item ──────────────────────────────────────────────────────────────

const HistoryItem = ({ item }) => {
  const rawPrediction = item.bert_prediction ?? item.prediction ?? item.prediction_label;
  const label = getPredictionLabel(rawPrediction);
  const score = Math.round(item.trust_score || 0);
  const gradient = getTrustGradient(score, label);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      {/* Score badge */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
        <span className="text-white text-sm font-black">{score}%</span>
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-blue-700 transition-colors">
          {item.input_text?.slice(0, 80)}…
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {label === 'REAL' ? 'Real' : 'Fake'} · {item.date || 'Invalid Date'}
        </p>
      </div>
      {/* Badge */}
      <PredictionBadge label={label} />
    </div>
  );
};

// ─── Quick-action cards ────────────────────────────────────────────────────────

const QuickCards = () => (
  <div className="grid md:grid-cols-3 gap-5 mb-8">
    {/* New Verification */}
    <Link
      to="/verify"
      className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-teal-300/60 group-hover:shadow-xl transition-all duration-300">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">New Verification</h3>
      <p className="text-sm text-gray-500 group-hover:text-teal-600/70 transition-colors">Analyze another news article</p>
    </Link>

    {/* View Analytics */}
    <Link
      to="/analytics"
      className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-purple-300/60 group-hover:shadow-xl transition-all duration-300">
        <BarChart3 className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">View Analytics</h3>
      <p className="text-sm text-gray-500 group-hover:text-purple-600/70 transition-colors">See overall trends & patterns</p>
    </Link>

    {/* Profile Settings */}
    <Link
      to="/profile"
      className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-orange-300/60 group-hover:shadow-xl transition-all duration-300">
        <Users className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">Profile Settings</h3>
      <p className="text-sm text-gray-500 group-hover:text-orange-600/70 transition-colors">Manage your account</p>
      <span className="mt-4 inline-block px-5 py-2 bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm group-hover:shadow-md">
        Go to Profile
      </span>
    </Link>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [result, setResult] = useState(location.state || null);
  const [history, setHistory] = useState([]);

  const userKey = user?.email ? `analysisHistory_${user.email}` : 'analysisHistory';

  useEffect(() => {
    if (location.state) {
      // Force immediate update of both current result and long-term cache
      setResult(location.state);
      localStorage.setItem('analysis', JSON.stringify(location.state));

      const prev = JSON.parse(localStorage.getItem(userKey) || '[]');
      
      // Save FULL history to localStorage (no slice)
      const updated = [{ ...location.state, date: new Date().toLocaleTimeString() }, ...prev];
      localStorage.setItem(userKey, JSON.stringify(updated));
      
      // But only show 5 on the dashboard
      setHistory(updated.slice(0, 5));
      
      // Clean up the location state
      window.history.replaceState({}, document.title);
    } else {
      const saved = localStorage.getItem('analysis');
      if (saved) {
        try { setResult(JSON.parse(saved)); } catch { /* ignore */ }
      }
      const fullHistory = JSON.parse(localStorage.getItem(userKey) || '[]');
      setHistory(fullHistory.slice(0, 5)); // Show only recent 5 on dashboard
    }
  }, [location.state, userKey]);

  // ─── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!location.state && history.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex flex-col items-center justify-center px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-2xl"
        >
          <ShieldCheck className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 text-center">Welcome to Dashboard</h1>
        <p className="text-gray-500 text-xl max-w-lg text-center mb-10 leading-relaxed">
          Start your first news verification to unlock analytics, history, and insights.
        </p>
        <Link
          to="/verify"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-white font-black text-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Zap className="w-6 h-6" /> Verify First News
        </Link>
      </div>
    );
  }

  // ─── RESULT STATE ──────────────────────────────────────────────────────────
  const safe = result || {};
  const rawPrediction = safe.bert_prediction ?? safe.prediction ?? safe.prediction_label;
  const label = getPredictionLabel(rawPrediction);
  const confidence = safe.bert_confidence != null ? Number(safe.bert_confidence).toFixed(1) : '0';
  const trustScore = Math.max(0, Math.min(100, Number(safe.trust_score ?? 0)));
  const gradient = getTrustGradient(trustScore, label);
  const barColor = getTrustBar(trustScore);
  const isReal = label === 'REAL';

  return (
    <div className="min-h-screen bg-[#F0F4FF] px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="relative mb-6">
          <PageHero
            icon={label === 'UNCERTAIN'
              ? <AlertCircle className="w-12 h-12 text-white drop-shadow-lg" />
              : isReal
                ? <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
                : <XCircle   className="w-12 h-12 text-white drop-shadow-lg" />
            }
            iconGradient={label === 'UNCERTAIN'
              ? 'from-amber-400 via-orange-500 to-yellow-600'
              : isReal ? 'from-emerald-500 via-teal-500 to-blue-500' : 'from-rose-500 via-red-500 to-orange-500'}
            words={['AI', 'Analysis', 'Result']}
            subtitle={!location.state ? "Viewing your most recent verification summary." : "Your news has been processed by 7+ AI models."}
          />
          {!location.state && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 z-20"
            >
              <Clock className="w-3 h-3" /> Most Recent
            </motion.div>
          )}
        </div>

        {/* Trust Score Hero */}
        <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-10 mb-6 shadow-2xl overflow-hidden hover:scale-[1.02] hover:shadow-3xl transition-all duration-300 cursor-default group`}>
          <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 group-hover:bg-white/20 rounded-full blur-2xl transition-all duration-300" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 group-hover:bg-white/20 rounded-full blur-2xl transition-all duration-300" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-2">Overall Trust Score</p>
              <p className="text-8xl font-black text-white leading-none group-hover:scale-105 transition-transform duration-300 origin-left">{Math.round(trustScore)}%</p>
              <div className="w-64 h-3 bg-white/20 rounded-full mt-6 overflow-hidden">
                <div className={`h-full bg-white/80 group-hover:bg-white transition-all duration-1000 ease-out`} style={{ width: `${trustScore}%` }} />
              </div>
            </div>
            <div className="flex-shrink-0 w-24 h-24 rounded-3xl bg-white/20 group-hover:bg-white/30 flex flex-col items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-white/20 group-hover:shadow-xl transition-all duration-300">
              {label === 'UNCERTAIN'
                ? <AlertCircle className="w-12 h-12 text-white mb-1 group-hover:scale-110 transition-transform" />
                : isReal
                  ? <CheckCircle className="w-12 h-12 text-white mb-1 group-hover:scale-110 transition-transform" />
                  : <XCircle className="w-12 h-12 text-white mb-1 group-hover:scale-110 transition-transform" />
              }
              <span className="text-white font-bold text-sm">{label}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Prediction</p>
            </div>
            <p className={`text-2xl font-black ${isReal ? 'text-emerald-600' : 'text-rose-600'}`}>{label}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Confidence</p>
            </div>
            <p className="text-2xl font-black text-orange-500">{confidence}%</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Sources</p>
            </div>
            <p className={`text-2xl font-black ${safe.news_verified ? 'text-emerald-600' : 'text-gray-500'}`}>
              {safe.news_verified ? 'Verified' : 'Unverified'}
            </p>
          </div>
        </div>

        {/* Highlighted Content */}
        <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm mb-6 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="group-hover:text-indigo-700 transition-colors">Highlighted Content Analysis</span>
          </h3>
          <p 
            className="text-gray-700 leading-relaxed bg-slate-50 group-hover:bg-indigo-50/60 rounded-xl p-5 border border-slate-100 group-hover:border-indigo-100 text-sm transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: safe.highlighted_text || safe.input_text }}
          />
        </div>

        {/* AI Explainability & Reasoning */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Top Features */}
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all duration-300">
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
              </div>
              Key Credibility Drivers
            </h3>
            <div className="space-y-3">
              {safe.lime_explanation && safe.lime_explanation.length > 0 ? (
                safe.lime_explanation.map(([word, weight], i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={`font-medium px-2 py-0.5 rounded-md ${weight < 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {word}
                    </span>
                    <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${weight < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.abs(weight) * 100}%`, marginLeft: weight < 0 ? '0' : 'auto' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{(weight * 100).toFixed(1)}%</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No significant markers detected</p>
              )}
            </div>
          </div>

          {/* Diagnostic Breakdown */}
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              Trust Factor Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(safe.diagnostics || {}).map(([key, val], i) => {
                if (key === 'trust' || key === 'final_trust' || key === 'prediction' || key === 'confidence') return null;
                const label = key.replace(/_/g, ' ').replace('Contribution', '').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <div key={i} className="group/item">
                    <div className="flex justify-between text-[10px] mb-1.5">
                      <span className="text-gray-500 font-bold uppercase tracking-tight">{label}</span>
                      <span className="text-gray-900 font-mono font-bold">{Number(val).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                      <div 
                        className={`h-full bg-gradient-to-r ${i % 2 === 0 ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'} rounded-full transition-all duration-1000`} 
                        style={{ width: `${(Number(val) / 0.45)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <QuickCards />

        {/* Recent Analyses */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Analyses</h2>
              <Link 
                to="/analytics" 
                className="text-blue-600 text-sm font-semibold flex items-center gap-1 cursor-pointer hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {history.map((item, i) => <HistoryItem key={i} item={item} />)}
            </div>
          </div>
        )}

        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            Confidence Heatmap
          </h3>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <Heatmap history={history} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
