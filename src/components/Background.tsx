import React from 'react';
import { motion } from 'motion/react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F8FAFC]">
      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-orange-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[30%] right-[15%] w-[35%] h-[35%] bg-orange-400/8 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Moving Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, #F97316 1px, transparent 1px), linear-gradient(to bottom, #F97316 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      
      {/* Floating Ambient Orange Particles */}
      <div className="absolute inset-0">
        {[...Array(24)].map((_, i) => {
          const startX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : 1200;
          const startY = typeof window !== 'undefined' ? Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1 : 600;
          const startOpacity = 0.2 + Math.random() * 0.5;
          return (
            <motion.div
              key={i}
              initial={{ 
                x: startX, 
                y: startY,
                opacity: startOpacity
              }}
              animate={{ 
                y: -50,
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 9 + 6, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-1.5 h-1.5 bg-orange-500/80 shadow-[0_0_6px_rgba(249,115,22,0.6)] rounded-full"
            />
          );
        })}
      </div>

      {/* Subtle Light Edge Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(241, 245, 249, 0.4) 100%)'
        }}
      />
      
      {/* Scanline & Grain */}
      <div className="scanline" />
      <div className="grain" />
    </div>
  );
};

