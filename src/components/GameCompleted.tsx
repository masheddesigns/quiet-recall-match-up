
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface GameCompletedProps {
  score: number;
  time: number;
  onAnimationComplete?: () => void;
}

const GameCompleted: React.FC<GameCompletedProps> = ({ 
  score, 
  time,
  onAnimationComplete 
}) => {
  useEffect(() => {
    // When component mounts, trigger animation complete after 2 seconds
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);
  
  // Format time
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-memory-background/80 backdrop-blur-md">
      <motion.div 
        className="flex flex-col items-center justify-center bg-memory-card p-8 rounded-xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Sparkles className="h-16 w-16 text-yellow-400 mb-4" />
        
        <h2 className="text-3xl font-bold text-white mb-2">Game Completed!</h2>
        
        <motion.div 
          className="text-5xl font-bold text-memory-primary my-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {score}
        </motion.div>
        
        <div className="text-memory-accent">
          Time: {formattedTime}
        </div>
        
        <Confetti />
      </motion.div>
    </div>
  );
};

// Create confetti animation
const Confetti = () => {
  // Generate random colors for confetti pieces
  const colors = ['#9b87f5', '#7E69AB', '#D6BCFA', '#ffffff', '#8B5CF6'];
  
  // Generate random confetti pieces
  const pieces = Array.from({ length: 50 }, (_, i) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 2;
    const size = 5 + Math.random() * 10;
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-sm"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          top: -20,
          left: `${x}%`,
        }}
        initial={{ y: -20 }}
        animate={{ y: '100vh', rotate: 360 }}
        transition={{
          duration,
          delay,
          ease: "linear",
        }}
      />
    );
  });
  
  return <>{pieces}</>;
};

export default GameCompleted;
