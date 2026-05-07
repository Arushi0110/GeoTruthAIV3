import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, UploadCloud, CheckCircle2, Zap, Brain, MapPin, Image as ImageIcon, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const UploadNews = ({ showNotification }) => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl('');
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageUrl('');
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!text.trim()) {
    if (showNotification) {
      showNotification('error', 'Please enter news text');
    }
    return;
  }

  setLoading(true);

  try {
    let response;

    if (imageFile) {
      const verifyFormData = new FormData();
      verifyFormData.append('text', text);
      verifyFormData.append('userId', user?.email || 'anonymous');
      verifyFormData.append('image_file', imageFile);

      response = await API.post('/verify', verifyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      // Route through backend even if no file
      response = await API.post('/verify', {
        text: text,
        image_url: imageUrl || '', // empty allowed
        userId: user?.email || 'anonymous',
      });
    }

    const resultData = {
      ...response.data,
      timestamp: Date.now() // Unique key to force update
    };

    setResult(resultData);
    navigate('/dashboard', { state: resultData });

  } catch (error) {
    console.error(error);
    alert('Verification failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 glass-card p-12 rounded-3xl shadow-2xl"
        >
          <motion.div 
            className="w-28 h-28 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ShieldCheck className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>

          <motion.div className="flex justify-center mb-6 overflow-hidden">
            <motion.span 
              className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent inline-block"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Verify
            </motion.span>
            <motion.span 
              className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent inline-block ml-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              News
            </motion.span>
            <motion.span 
              className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent inline-block ml-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Instantly
            </motion.span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            Our AI analyzes text patterns, image authenticity, and geolocation data in seconds.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
            News Content
          </h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-6 border-0 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 shadow-inner text-lg font-medium placeholder-gray-500 resize-vertical min-h-[150px]"
            placeholder="Paste headline or full article here... Our AI will detect manipulation patterns instantly"
            required
          />
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <ImageIcon className="w-6 h-6 text-blue-600 mr-3" />
            Supporting Image
            <Globe className="w-5 h-5 text-blue-400 ml-2" />
          </h3>
          
          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="input-field !rounded-2xl !p-5 !text-lg"
              placeholder="https://example.com/news-image.jpg"
            />
          </div>

          {/* Upload Dropzone */}
          <div
            className={`relative border-2 border-dashed p-16 rounded-3xl text-center transition-all duration-500 cursor-pointer group hover:border-blue-400 hover:shadow-2xl ${
              dragOver 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 scale-105 shadow-2xl ring-4 ring-blue-200/50' 
                : 'border-gray-200 bg-white/50 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <UploadCloud className={`w-20 h-20 mx-auto mb-6 transition-all group-hover:scale-110 ${
              dragOver ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <motion.p 
              animate={{ scale: dragOver ? 1.05 : 1 }}
              className={`text-2xl font-bold mb-2 transition-all ${
                dragOver ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {dragOver ? 'Drop your image here!' : 'Drag & drop image'}
            </motion.p>
            <p className="text-lg text-gray-500 group-hover:text-gray-600 mb-4">
              or <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer underline">browse files</span>
            </p>
            <p className="text-sm text-gray-400">PNG, JPG, WebP up to 10MB</p>
          </div>

          {/* Preview */}
          {preview && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl border-4 border-emerald-200 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Image Ready
                </h4>
                <button
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <img 
                src={preview}
                alt="Preview"
                className="w-full h-80 rounded-2xl object-cover shadow-xl border-2 border-white"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Analysis Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 text-emerald-600 mr-3" />
            What You'll Get
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div className="text-center p-6 bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-md border">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-xl mb-2">Trust Score</h4>
              <p className="text-gray-600">0-100% authenticity rating</p>
            </motion.div>
            <motion.div className="text-center p-6 bg-gradient-to-b from-white to-emerald-50 rounded-2xl shadow-md border">
              <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-xl mb-2">Geo Analysis</h4>
              <p className="text-gray-600">Location verification</p>
            </motion.div>
            <motion.div className="text-center p-6 bg-gradient-to-b from-white to-purple-50 rounded-2xl shadow-md border">
              <Activity className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="font-bold text-xl mb-2">Explainability</h4>
              <p className="text-gray-600">Why we think it's real/fake</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white font-black py-8 px-8 rounded-3xl text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center space-x-4 mx-auto max-w-md"
          >
            {loading ? (
              <>
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-2xl animate-spin" />
                <span>AI Analyzing Your News...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-10 h-10" />
                <span>Verify Authenticity Now</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default UploadNews;

