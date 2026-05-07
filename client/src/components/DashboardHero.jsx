import React from 'react';
import { motion } from 'framer-motion';
import RiskMeter from './RiskMeter';
import { ShieldCheck, Image } from 'lucide-react';

const DashboardHero = ({ result }) => {
  // ✅ FIX: prevent crash if result is undefined
  if (!result) return null;

  const trustScore = result?.trust_score ?? 0;
  const isFake = trustScore < 50;

  const bertPrediction =
    result?.bert_prediction ? result.bert_prediction.toUpperCase() : 'N/A';

  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-8 md:p-12 border border-white/10 backdrop-blur-xl shadow-2xl min-h-[400px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {isFake && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse border-4 border-red-500/50 rounded-3xl"
          animate={{ 
            rotate: [0, -1, 1, -1, 0],
            scale: [1, 1.02, 1, 1.02, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-8 leading-tight"
            >
              Trust Score
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4 mb-4">

                <div className={`w-4 h-4 rounded-full ${isFake ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />

                <span className={`text-4xl font-black ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                  {Number(trustScore).toFixed(1)}%
                </span>

                <motion.span
                  key={result?.trust_level}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-6 py-3 rounded-full font-bold text-lg ${
                    isFake
                      ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                  }`}
                >
                  {result?.trust_level || 'Unknown'}
                </motion.span>

              </div>
            </motion.div>

            {/* BOTTOM STATS */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-gray-300">
                    {bertPrediction}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  BERT Prediction
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Image 
                    className={
                      result?.image_verification?.is_suspicious
                        ? 'w-6 h-6 text-orange-400'
                        : 'w-6 h-6 text-green-400'
                    } 
                  />
                  <span className={
                    result?.image_verification?.is_suspicious
                      ? 'font-semibold text-orange-300'
                      : 'font-semibold text-green-300'
                  }>
                    {result?.image_verification?.is_suspicious
                      ? 'Suspicious'
                      : 'Authentic'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Image Analysis
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <RiskMeter trustScore={trustScore} />
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHero;