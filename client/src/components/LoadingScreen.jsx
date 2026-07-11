import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500); // smooth exit
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#150D14] flex flex-col items-center justify-center text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center space-y-6 max-w-md px-6">
            {/* Shimmering Diamond Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              <div className="w-24 h-24 border border-brand-gold/20 rounded-full flex items-center justify-center relative bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(197,155,39,0.15)] animate-pulse">
                <Logo className="h-12 w-auto text-brand-gold relative z-10" />
              </div>
              <div className="absolute inset-0 bg-brand-gold/10 blur-xl rounded-full scale-125 animate-pulse"></div>
            </motion.div>

            {/* Title */}
            <div className="space-y-1.5">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl tracking-[0.25em] font-light uppercase text-white font-serif"
              >
                NAZARA DIAMONDS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-light"
              >
                Ethical Luxury Solitaires
              </motion.p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mx-auto rounded-full mt-4">
              <motion.div
                className="absolute left-0 top-0 h-full bg-brand-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Percent Text */}
            <motion.span
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-[10px] font-mono text-brand-gold/70 tracking-widest block"
            >
              {Math.min(progress, 100)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
