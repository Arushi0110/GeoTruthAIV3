import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const RiskMeter = ({ trustScore = 0 }) => {
  const safeScore = Number(trustScore) || 0;

  const riskLevel =
    safeScore >= 75 ? 'low' :
    safeScore >= 50 ? 'medium' :
    safeScore >= 25 ? 'high' : 'critical';

  const meterVariants = {
    low: {
      stroke: ['#10b981', '#059669'],
      bg: '#d1fae5',
      icon: ShieldCheck,
      colorClass: 'text-emerald-400'
    },
    medium: {
      stroke: ['#f59e0b', '#d97706'],
      bg: '#fef3c7',
      icon: Zap,
      colorClass: 'text-amber-400'
    },
    high: {
      stroke: ['#f97316', '#ea580c'],
      bg: '#fed7aa',
      icon: AlertTriangle,
      colorClass: 'text-orange-400'
    },
    critical: {
      stroke: ['#ef4444', '#dc2626'],
      bg: '#fecaca',
      icon: AlertTriangle,
      colorClass: 'text-red-400'
    }
  };

  const config = meterVariants[riskLevel];
  const Icon = config.icon;

  return (
    <motion.div
      className="w-full p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div className="text-center mb-8">

        <motion.div
          className="w-24 h-24 mx-auto mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`w-24 h-24 ${config.colorClass} drop-shadow-lg`} />
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Risk Level: {riskLevel.toUpperCase()}
        </h3>

        <div className="text-4xl font-black text-gray-200">
          {safeScore.toFixed(0)}%
        </div>
      </div>

      {/* GAUGE */}
      <div className="relative flex justify-center">

        <svg className="w-64 h-32 transform -rotate-90" viewBox="0 0 32 32">

          {/* background circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#1f2937"
            strokeWidth="2"
            fill="transparent"
          />

          {/* progress circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="88"
            strokeDashoffset={88 - (safeScore / 100) * 88}
          />

          {/* gradient inside svg */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.stroke[0]} />
              <stop offset="100%" stopColor={config.stroke[1]} />
            </linearGradient>
          </defs>

        </svg>
      </div>

      {/* DESCRIPTION */}
      <motion.p
        className="text-center mt-6 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {riskLevel === 'low' && 'Highly credible news source'}
        {riskLevel === 'medium' && 'Moderate risk - verify sources'}
        {riskLevel === 'high' && 'High risk - multiple red flags'}
        {riskLevel === 'critical' && 'Critical risk - likely fake news'}
      </motion.p>
    </motion.div>
  );
};

export default RiskMeter;