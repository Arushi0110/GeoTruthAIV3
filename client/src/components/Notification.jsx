import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, LogOut } from 'lucide-react';


const Notification = ({ type = 'success', message, onClose }) => {
  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: ShieldCheck,
    logout: LogOut
  };

  const colors = {
    success: 'bg-emerald-500 ring-emerald-400/30',
    error: 'bg-red-500 ring-red-400/30',
    info: 'bg-blue-500 ring-blue-400/30',
    logout: 'bg-orange-500 ring-orange-400/30'
  };

  const Icon = icons[type] || CheckCircle2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className={`fixed top-4 right-4 z-50 max-w-sm w-full mx-4 p-6 rounded-2xl shadow-2xl backdrop-blur-xl border ring-1 ${colors[type]} text-white border-white/20`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 p-1 -mr-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;

