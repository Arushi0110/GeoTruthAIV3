import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageHero – reusable animated heading matching the Verify page style.
 *
 * Props:
 *  icon      – lucide icon element
 *  words     – array of strings (each word animates in separately)
 *  subtitle  – optional subtitle string
 *  gradient  – tailwind gradient string (default: blue-purple-indigo)
 *  iconGradient – tailwind gradient for icon bg
 */
const PageHero = ({
  icon,
  words = [],
  subtitle,
  gradient = 'from-blue-600 via-purple-600 to-indigo-600',
  iconGradient = 'from-blue-500 via-purple-600 to-indigo-600',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Animated icon */}
      <motion.div
        className={`w-24 h-24 bg-gradient-to-r ${iconGradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl cursor-pointer`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12, rotate: 8, boxShadow: '0 25px 50px -12px rgba(99,102,241,0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
      </motion.div>

      {/* Words sliding in */}
      <div className="flex flex-wrap justify-center items-center gap-x-3 overflow-hidden mb-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            initial={i === 0 ? { x: '-100%', opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={i === 0 ? { x: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, duration: i === 0 ? 0.7 : 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.2 + 0.1, duration: 0.5 }}
          className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default PageHero;
