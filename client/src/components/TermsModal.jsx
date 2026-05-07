import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Lock, Eye } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
  const termsContent = `# GeoTruthAI Terms & Conditions

**Effective Date: January 1, 2025**

Welcome to GeoTruthAI. By accessing or using our service, you agree to be bound by these Terms.

## 1. Service Description
GeoTruthAI provides AI-powered news verification using NLP, computer vision, and geolocation analysis. We analyze text, images, and metadata to provide trust scores.

## 2. User Responsibilities
- Provide accurate information for analysis
- Use service for lawful purposes only
- Do not reverse engineer or scrape our AI models
- Respect rate limits (50 analyses/day for free users)

## 3. Data Privacy
- News content analyzed temporarily (24h retention)
- IP address and device info logged for abuse prevention
- No personal data stored without explicit consent
- GDPR compliant - EU users have data deletion rights

## 4. Intellectual Property
- AI models and algorithms © 2025 GeoTruthAI
- Analysis results licensed for personal use only
- Commercial use requires Enterprise license

## 5. Accuracy Disclaimer
AI analysis is probabilistic (96.8% accuracy on test data). False positives/negatives possible. Not legal advice.

## 6. Limitation of Liability
GeoTruthAI not liable for:
- Inaccurate predictions
- Third-party content decisions
- Lost profits or consequential damages

Liability capped at $100 USD.

## 7. Termination
We may suspend access for:
- Abuse or spam
- Violation of terms
- Non-payment (Premium plans)

## 8. Changes to Terms
We may update terms with 30 days notice via email/app notification.

## 9. Governing Law
Disputes governed by Delaware law, USA.

## 10. Contact
support@geotruth.ai | help.geotruth.ai

**Last Updated: Jan 1, 2025**`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden border border-white/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
                  <p className="text-gray-600">GeoTruthAI Legal Agreement</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>
          </div>

          <div className="p-8 overflow-y-auto max-h-[70vh]">
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-6 rounded-2xl border font-mono text-gray-800 overflow-auto max-h-96">
                {termsContent}
              </pre>
            </div>
          </div>

          <div className="p-8 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Your data is secure • GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-sm font-semibold transition-all border"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                onClick={onClose}
              >
                <Eye className="w-4 h-4" />
                <span>I've Read</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsModal;

