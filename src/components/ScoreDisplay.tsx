
import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../utils/gameUtils';

interface ScoreDisplayProps {
  score: number;
  timeElapsed: number;
  highScore?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  timeElapsed, 
  highScore 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto my-4 p-4 bg-memory-card bg-opacity-20 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-center">
          <span className="text-sm text-memory-accent">Score</span>
          <span className="text-xl font-bold text-memory-text">{score}</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-memory-text">
          <Clock size={20} className="text-memory-primary" />
          <span className="font-mono text-xl">{formatTime(Math.floor(timeElapsed / 1000))}</span>
        </div>
        
        {highScore !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-sm text-memory-accent">Best</span>
            <span className="text-xl font-bold text-memory-text">{highScore}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
