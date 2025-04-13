import { Card, Difficulty, HighScore } from "../types/game";

// Emojis for the memory cards
const emojis = [
  "😀", "🎮", "🌟", "🎨", "🎵", "🎪", "🎭", "🚀", 
  "🍕", "🌈", "🏆", "🍦", "🎸", "🎯", "🧠", "🐱",
  "🦄", "🎁", "🌮", "🍔", "🏀", "⚽", "🏄‍♂️", "🎤",
  "🎬", "🎹", "🎨", "🎲", "🍎", "🍓", "🚲", "🎠"
];

// Get grid size based on difficulty
export const getGridSize = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 4;
    case 'medium':
      return 6;
    case 'hard':
      return 8;
    default:
      return 4;
  }
};

// Create a deck of cards based on difficulty
export const createDeck = (difficulty: Difficulty): Card[] => {
  const gridSize = getGridSize(difficulty);
  const pairsCount = (gridSize * gridSize) / 2;
  
  // Get subset of emojis based on the number of pairs needed
  const gameEmojis = emojis.slice(0, pairsCount);
  
  // Create pairs of cards with the same emoji
  const cards: Card[] = [];
  gameEmojis.forEach((emoji, index) => {
    // Create two cards with the same emoji
    cards.push(
      { id: index * 2, emoji, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
    );
  });
  
  // Shuffle the cards
  return shuffleCards(cards);
};

// Shuffle an array of cards using Fisher-Yates algorithm
export const shuffleCards = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate score based on match or mismatch
export const calculateScore = (
  matched: boolean, 
  elapsedTime: number, 
  currentStreak: number
): number => {
  if (matched) {
    // Base score for a match is 10 points
    // Bonus for streak and quick matches
    const timeBonus = Math.max(20 - Math.floor(elapsedTime / 1000), 0);
    const streakBonus = currentStreak * 5;
    return 10 + timeBonus + streakBonus;
  } else {
    // Penalty for mismatches
    return -5;
  }
};

// Format time from seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Save high score to local storage
export const saveHighScore = (
  name: string,
  score: number,
  time: number,
  difficulty: Difficulty
): void => {
  // Get existing high scores
  const highScores = getHighScores();
  
  // Add new high score
  const newHighScore: HighScore = {
    name,
    score,
    time,
    difficulty,
    date: new Date().toISOString(),
  };
  
  // Add new score and sort
  highScores.push(newHighScore);
  highScores.sort((a, b) => b.score - a.score);
  
  // Keep only top scores
  const limitedScores = highScores.slice(0, 25);
  
  // Save back to local storage
  localStorage.setItem('memoryGameHighScores', JSON.stringify(limitedScores));
};

// Get high scores from local storage
export const getHighScores = (): HighScore[] => {
  const scores = localStorage.getItem('memoryGameHighScores');
  return scores ? JSON.parse(scores) : [];
};

// Get top 5 high scores for a specific difficulty
export const getTopScores = (difficulty: Difficulty | 'all'): HighScore[] => {
  const allScores = getHighScores();
  
  // Filter by difficulty if specified
  const filteredScores = difficulty === 'all' 
    ? allScores 
    : allScores.filter(score => score.difficulty === difficulty);
  
  // Return top 5
  return filteredScores.slice(0, 5);
};

// Check if a score is a new high score
export const isHighScore = (
  score: number,
  difficulty: Difficulty
): boolean => {
  const highScores = getHighScores();
  const filteredScores = highScores.filter(hs => hs.difficulty === difficulty);
  
  // If less than 5 scores, it's automatically a high score
  if (filteredScores.length < 5) {
    return true;
  }
  
  // Otherwise, check if the score is higher than the lowest high score
  const lowestHighScore = filteredScores[filteredScores.length - 1];
  return score > lowestHighScore.score;
};

// Play sound effects
export const playSound = (sound: 'match' | 'mismatch' | 'flip' | 'win'): void => {
  // In a real implementation, we would play actual sound files
  // For now we'll just log to the console
  console.log(`Playing ${sound} sound`);
  
  // To implement actual sounds, we would create an Audio object
  // const audio = new Audio(`/sounds/${sound}.mp3`);
  // audio.play().catch(e => console.error('Error playing sound:', e));
};
