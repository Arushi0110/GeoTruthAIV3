import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Linkedin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-gray-900 text-white border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              GeoTruthAI
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mt-2 max-w-xs text-center md:text-left">
              AI-powered platform to verify news authenticity and combat misinformation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/home" className="hover:text-white transition-all duration-300">Home</Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-all duration-300">Verify News</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="hover:text-white transition-all duration-300">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/analytics" className="hover:text-white transition-all duration-300">Analytics</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-white transition-all duration-300">Profile</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-white transition-all duration-300 text-gray-500 hover:text-gray-300">
                      Login to access Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-white transition-all duration-300 text-gray-500 hover:text-gray-300">
                      Sign up free
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold mb-6">Follow Us</h4>
            <div className="flex space-x-4 justify-center md:justify-end">
              <a
                href="https://www.linkedin.com/in/parul-chaudhary-542418293?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://github.com/Arushi0110"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 GeoTruthAI. All rights reserved.</p>
          <p className="mt-1 text-xs opacity-75">Made with ❤️ for truth</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
