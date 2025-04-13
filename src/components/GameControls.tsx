
import React from 'react';
import { Button } from "@/components/ui/button";
import { Difficulty } from '../types/game';
import { RefreshCw, Pause, Play, X, Award } from 'lucide-react';

interface GameControlsProps {
  onDifficultyChange: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  onStartGame: () => void;
  onExitGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onRestartGame: () => void;
  onToggleLeaderboard: () => void;
  gameStatus: 'menu' | 'countdown' | 'playing' | 'paused' | 'completed';
}

const GameControls: React.FC<GameControlsProps> = ({
  onDifficultyChange,
  currentDifficulty,
  onStartGame,
  onExitGame,
  onPauseGame,
  onResumeGame,
  onRestartGame,
  onToggleLeaderboard,
  gameStatus
}) => {
  return (
    <div className="w-full">
      {gameStatus === 'menu' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
            <Button
              variant="outline"
              className={`px-4 py-2 ${currentDifficulty === 'easy' 
                ? 'bg-memory-primary text-white' 
                : 'bg-transparent text-memory-text border-memory-primary'
              }`}
              onClick={() => onDifficultyChange('easy')}
            >
              Easy (4×4)
            </Button>
            <Button
              variant="outline"
              className={`px-4 py-2 ${currentDifficulty === 'medium' 
                ? 'bg-memory-primary text-white' 
                : 'bg-transparent text-memory-text border-memory-primary'
              }`}
              onClick={() => onDifficultyChange('medium')}
            >
              Medium (6×6)
            </Button>
            <Button
              variant="outline"
              className={`px-4 py-2 ${currentDifficulty === 'hard' 
                ? 'bg-memory-primary text-white' 
                : 'bg-transparent text-memory-text border-memory-primary'
              }`}
              onClick={() => onDifficultyChange('hard')}
            >
              Hard (8×8)
            </Button>
          </div>
          
          <Button
            className="w-full max-w-sm bg-memory-primary hover:bg-memory-secondary text-white text-lg py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={onStartGame}
          >
            Start Game
          </Button>
          
          <Button
            variant="outline"
            className="bg-transparent border border-memory-primary text-memory-primary"
            onClick={onToggleLeaderboard}
          >
            <Award className="mr-2 h-4 w-4" /> Leaderboard
          </Button>
        </div>
      )}
      
      {(gameStatus === 'playing' || gameStatus === 'paused') && (
        <div className="flex justify-between w-full my-4">
          <Button
            variant="outline"
            className="bg-transparent border border-memory-primary text-memory-primary"
            onClick={onExitGame}
          >
            <X className="mr-2 h-4 w-4" /> Exit
          </Button>
          
          {gameStatus === 'playing' ? (
            <Button
              variant="outline"
              className="bg-transparent border border-memory-primary text-memory-primary"
              onClick={onPauseGame}
            >
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : (
            <Button
              className="bg-memory-primary text-white"
              onClick={onResumeGame}
            >
              <Play className="mr-2 h-4 w-4" /> Resume
            </Button>
          )}
          
          <Button
            variant="outline"
            className="bg-transparent border border-memory-primary text-memory-primary"
            onClick={onRestartGame}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Restart
          </Button>
        </div>
      )}
      
      {gameStatus === 'completed' && (
        <div className="flex flex-col gap-4 items-center w-full mt-6">
          <Button
            className="w-full max-w-sm bg-memory-primary hover:bg-memory-secondary text-white"
            onClick={onRestartGame}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
          
          <Button
            variant="outline"
            className="w-full max-w-sm bg-transparent border border-memory-primary text-memory-primary"
            onClick={onExitGame}
          >
            <X className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
          
          <Button
            variant="outline"
            className="bg-transparent border border-memory-primary text-memory-primary"
            onClick={onToggleLeaderboard}
          >
            <Award className="mr-2 h-4 w-4" /> Leaderboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameControls;
