
import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import ScoreDisplay from './ScoreDisplay';
import GameControls from './GameControls';
import Countdown from './Countdown';
import GameCompleted from './GameCompleted';
import Leaderboard from './Leaderboard';
import NameEntryForm from './NameEntryForm';
import { Card, Difficulty, GameState } from '../types/game';
import { 
  createDeck, 
  calculateScore, 
  playSound,
  isHighScore,
  saveHighScore,
  getTopScores
} from '../utils/gameUtils';
import { useToast } from "@/hooks/use-toast";

const initialState: GameState = {
  difficulty: 'easy',
  cards: [],
  firstCard: null,
  secondCard: null,
  score: 0,
  timeElapsed: 0,
  gameStatus: 'menu',
  countdownValue: 3,
  streak: 0,
};

const MemoryGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const { toast } = useToast();

  // Initialize game with cards when difficulty changes
  useEffect(() => {
    if (gameState.gameStatus === 'menu') {
      setGameState(prev => ({
        ...prev,
        cards: createDeck(prev.difficulty),
      }));
    }
  }, [gameState.difficulty, gameState.gameStatus]);

  // Timer for gameplay
  useEffect(() => {
    let timerId: number | undefined;
    
    if (gameState.gameStatus === 'playing') {
      timerId = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 100,
        }));
      }, 100);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameState.gameStatus]);

  // Countdown timer
  useEffect(() => {
    let timerId: number | undefined;
    
    if (gameState.gameStatus === 'countdown' && gameState.countdownValue > 0) {
      timerId = window.setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          countdownValue: prev.countdownValue - 1,
        }));
      }, 1000);
    } else if (gameState.gameStatus === 'countdown' && gameState.countdownValue <= 0) {
      startGame();
    }
    
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [gameState.gameStatus, gameState.countdownValue]);

  // Check for game completion
  useEffect(() => {
    const allMatched = gameState.cards.every(card => card.isMatched);
    
    if (gameState.gameStatus === 'playing' && allMatched && gameState.cards.length > 0) {
      handleGameCompletion();
    }
  }, [gameState.cards, gameState.gameStatus]);

  // Check for matched or unmatched cards
  useEffect(() => {
    if (gameState.firstCard && gameState.secondCard) {
      const isMatch = gameState.firstCard.emoji === gameState.secondCard.emoji;
      
      // Briefly delay to allow player to see the second card
      setTimeout(() => {
        if (isMatch) {
          handleMatchedCards();
        } else {
          handleUnmatchedCards();
        }
      }, 1000);
    }
  }, [gameState.firstCard, gameState.secondCard]);

  // Start the game
  const startCountdown = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'countdown',
      countdownValue: 3,
      cards: createDeck(prev.difficulty),
      score: 0,
      timeElapsed: 0,
      streak: 0,
    }));
  };

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
      firstCard: null,
      secondCard: null,
    }));
  }, []);

  // Handle card click
  const handleCardClick = (card: Card) => {
    // Ignore clicks if two cards are already flipped or the game is not in playing state
    if (
      gameState.firstCard && gameState.secondCard ||
      gameState.gameStatus !== 'playing' ||
      card.isFlipped || 
      card.isMatched
    ) {
      return;
    }
    
    playSound('flip');
    
    // Flip the card
    const updatedCards = gameState.cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    
    // Update game state based on whether it's the first or second card
    if (!gameState.firstCard) {
      setGameState(prev => ({
        ...prev,
        cards: updatedCards,
        firstCard: card,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        cards: updatedCards,
        secondCard: card,
      }));
    }
  };

  // Handle matched cards
  const handleMatchedCards = () => {
    playSound('match');
    
    const points = calculateScore(true, gameState.timeElapsed, gameState.streak);
    
    // Update cards to mark as matched
    const updatedCards = gameState.cards.map(card => 
      card.id === gameState.firstCard?.id || card.id === gameState.secondCard?.id
        ? { ...card, isMatched: true }
        : card
    );
    
    setGameState(prev => ({
      ...prev,
      cards: updatedCards,
      firstCard: null,
      secondCard: null,
      score: prev.score + points,
      streak: prev.streak + 1,
    }));
    
    toast({
      title: "Match found!",
      description: `+${points} points`,
    });
  };

  // Handle unmatched cards
  const handleUnmatchedCards = () => {
    playSound('mismatch');
    
    const points = calculateScore(false, gameState.timeElapsed, gameState.streak);
    
    // Flip cards back
    const updatedCards = gameState.cards.map(card => 
      card.id === gameState.firstCard?.id || card.id === gameState.secondCard?.id
        ? { ...card, isFlipped: false }
        : card
    );
    
    setGameState(prev => ({
      ...prev,
      cards: updatedCards,
      firstCard: null,
      secondCard: null,
      score: Math.max(0, prev.score + points), // Don't go below 0
      streak: 0,
    }));
    
    toast({
      title: "No match",
      description: points !== 0 ? `${points} points` : "",
      variant: "destructive",
    });
  };

  // Handle game completion
  const handleGameCompletion = () => {
    playSound('win');
    setGameState(prev => ({
      ...prev,
      gameStatus: 'completed',
    }));
    
    // Check if this is a high score
    if (isHighScore(gameState.score, gameState.difficulty)) {
      setShowNameEntry(true);
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      cards: createDeck(difficulty),
    }));
  };

  // Handle pause game
  const handlePauseGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'paused',
    }));
  };

  // Handle resume game
  const handleResumeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
    }));
  };

  // Handle restart game
  const handleRestartGame = () => {
    startCountdown();
  };

  // Handle exit game
  const handleExitGame = () => {
    setGameState({ ...initialState, difficulty: gameState.difficulty });
  };

  // Handle toggle leaderboard
  const handleToggleLeaderboard = () => {
    setShowLeaderboard(prev => !prev);
  };

  // Handle name entry submission
  const handleNameSubmit = (name: string) => {
    saveHighScore(
      name, 
      gameState.score, 
      Math.floor(gameState.timeElapsed / 1000),
      gameState.difficulty
    );
    setShowNameEntry(false);
    toast({
      title: "High Score Saved!",
      description: `${name}: ${gameState.score} points`,
    });
  };

  // Determine what to render based on game status
  const renderGameContent = () => {
    switch (gameState.gameStatus) {
      case 'menu':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-8 game-title">
              <h1 className="text-4xl md:text-6xl font-bold text-memory-primary">
                Quiet Recall
              </h1>
              <p className="text-lg text-memory-accent mt-2">
                Test your memory with this matching game
              </p>
            </div>
            
            <GameControls
              onDifficultyChange={handleDifficultyChange}
              currentDifficulty={gameState.difficulty}
              onStartGame={startCountdown}
              onExitGame={handleExitGame}
              onPauseGame={handlePauseGame}
              onResumeGame={handleResumeGame}
              onRestartGame={handleRestartGame}
              onToggleLeaderboard={handleToggleLeaderboard}
              gameStatus={gameState.gameStatus}
            />
          </div>
        );
        
      case 'countdown':
        return (
          <Countdown 
            value={gameState.countdownValue} 
            onComplete={startGame} 
          />
        );
        
      case 'playing':
      case 'paused':
        return (
          <div className="flex flex-col w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-memory-primary">Quiet Recall</h1>
            </div>
            
            <ScoreDisplay 
              score={gameState.score} 
              timeElapsed={gameState.timeElapsed}
              highScore={getTopScores(gameState.difficulty)[0]?.score}
            />
            
            <GameControls
              onDifficultyChange={handleDifficultyChange}
              currentDifficulty={gameState.difficulty}
              onStartGame={startCountdown}
              onExitGame={handleExitGame}
              onPauseGame={handlePauseGame}
              onResumeGame={handleResumeGame}
              onRestartGame={handleRestartGame}
              onToggleLeaderboard={handleToggleLeaderboard}
              gameStatus={gameState.gameStatus}
            />
            
            {gameState.gameStatus === 'paused' ? (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-memory-primary">Game Paused</h2>
                <p className="text-memory-accent mt-2">Click Resume to continue</p>
              </div>
            ) : (
              <div className="mt-4">
                <GameBoard
                  cards={gameState.cards}
                  onCardClick={handleCardClick}
                  disabled={!!gameState.firstCard && !!gameState.secondCard}
                  difficulty={gameState.difficulty}
                />
              </div>
            )}
          </div>
        );
        
      case 'completed':
        return (
          <div className="flex flex-col w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-memory-primary">Quiet Recall</h1>
            </div>
            
            <ScoreDisplay 
              score={gameState.score} 
              timeElapsed={gameState.timeElapsed}
            />
            
            <GameControls
              onDifficultyChange={handleDifficultyChange}
              currentDifficulty={gameState.difficulty}
              onStartGame={startCountdown}
              onExitGame={handleExitGame}
              onPauseGame={handlePauseGame}
              onResumeGame={handleResumeGame}
              onRestartGame={handleRestartGame}
              onToggleLeaderboard={handleToggleLeaderboard}
              gameStatus={gameState.gameStatus}
            />
            
            <div className="mt-4">
              <GameBoard
                cards={gameState.cards}
                onCardClick={handleCardClick}
                disabled={true}
                difficulty={gameState.difficulty}
              />
            </div>
            
            <GameCompleted 
              score={gameState.score} 
              time={Math.floor(gameState.timeElapsed / 1000)}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-memory-background">
      {renderGameContent()}
      
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
      
      <NameEntryForm 
        isOpen={showNameEntry} 
        onSubmit={handleNameSubmit}
        score={gameState.score}
      />
    </div>
  );
};

export default MemoryGame;
