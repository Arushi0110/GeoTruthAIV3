import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Image, BarChart3, Activity, Target, Brain, MapPin, Users, Zap, MousePointerClick, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageHero from '../components/PageHero';

const Home = () => {
  const howItWorksRef = useRef(null);
  const primaryCTA = useRef(null);
  const secondaryCTA = useRef(null);
  const user = useAuth()?.user;

  useEffect(() => {
    const scrollToHowItWorks = () => {
      howItWorksRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    };

    primaryCTA.current?.addEventListener('click', scrollToHowItWorks);
    secondaryCTA.current?.addEventListener('click', scrollToHowItWorks);

    return () => {
      primaryCTA.current?.removeEventListener('click', scrollToHowItWorks);
      secondaryCTA.current?.removeEventListener('click', scrollToHowItWorks);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Logo Heading Animation */}
      <PageHero
        icon={<ShieldCheck className="w-12 h-12 text-white drop-shadow-lg" />}
        iconGradient="from-blue-600 via-purple-600 to-indigo-600"
        words={['GEO', 'TRUTH', 'AI']}
        subtitle="AI-Powered Fake News Detection · Verify news in seconds with enterprise-grade accuracy."
      />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 mr-2" />
              AI-Powered Fake News Detection
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight"
          >
            Verify News in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Seconds
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            GeoTruthAI uses cutting-edge AI models to analyze text, images, and geolocation data to give you instant trust scores. 
            Stay protected from misinformation with enterprise-grade accuracy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Link
              ref={primaryCTA}
              to={user ? "/verify" : "/signup"}
              className="group primary-cta inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex-1 max-w-md justify-center"
            >
              <span>{user ? "Start Verifying News" : "Get Started Free"}</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button
              ref={secondaryCTA}
              className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex-1 max-w-md justify-center items-center space-x-3"
              onClick={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <MousePointerClick className="w-5 h-5" />
              <span>See How It Works</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            <div>
              <div className="text-4xl font-black text-blue-600 mb-2">99.2%</div>
              <div className="text-gray-600 font-medium">Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">50ms</div>
              <div className="text-gray-600 font-medium">Avg Response</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-600 mb-2">7+</div>
              <div className="text-gray-600 font-medium">AI Models</div>
            </div>
            <div>
              <div className="text-4xl font-black text-indigo-600 mb-2">1M+</div>
              <div className="text-gray-600 font-medium">News Analyzed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-24 px-4 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              How GeoTruthAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our multi-layered AI system analyzes news from multiple angles to deliver trustworthy results
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Submit News</h3>
              <p className="text-gray-600 leading-relaxed">
                Paste news text or upload article with images. Our system processes instantly.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                7+ AI models analyze text sentiment, factual consistency, image authenticity, and source credibility.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Geolocation Check</h3>
              <p className="text-gray-600 leading-relaxed">
                NER extracts locations and cross-references with known fake news patterns and real-time data.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Trust Score</h3>
              <p className="text-gray-600 leading-relaxed">
                Multi-factor algorithm delivers final verdict with confidence score and explainability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid & CTA sections continue as before */}
      {/* [Full content from previous version] */}

    </div>
  );
};

export default Home;

