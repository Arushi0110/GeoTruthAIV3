import React from 'react';
import { motion } from 'framer-motion';

const TrustTimeline = ({ result }) => {
  const timelineSteps = [
    { label: 'Text Analysis', score: 85, color: 'blue' },
    { label: 'Word Attribution', score: 32, color: 'red' },
    { label: 'Source Check', score: 65, color: 'orange' },
    { label: 'Image Verify', score: 22, color: 'purple' },
    { label: 'Final Score', score: result.trust_score, color: result.trust_score < 50 ? 'red' : 'emerald' }
  ];

  // ✅ Safe Tailwind color mapping
  const colorMap = {
    blue: 'bg-blue-500 text-blue-300',
    red: 'bg-red-500 text-red-300',
    orange: 'bg-orange-500 text-orange-300',
    purple: 'bg-purple-500 text-purple-300',
    emerald: 'bg-emerald-500 text-emerald-300'
  };

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <h4 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <span>Trust Timeline</span>
      </h4>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const colors = colorMap[step.color] || colorMap.blue;

          return (
            <motion.div 
              key={step.label}
              className="group flex items-center space-x-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-2 h-2 bg-white rounded-full shadow-lg" />

              <div className="flex-1">
                <div className="font-semibold text-white">{step.label}</div>

                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-2 bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.score}%` }}
                      transition={{ duration: 1, delay: index * 0.2 + 2 }}
                    />
                  </div>
                  <span className={`${colors.split(' ')[1]} font-mono font-bold`}>
                    {step.score}%
                  </span>
                </div>
              </div>

              <div className={`font-bold text-sm px-3 py-1 rounded-lg ${colors.split(' ')[0]} bg-opacity-20`}>
                {step.score < 50 ? '⚠️' : '✅'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TrustTimeline;