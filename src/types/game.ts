
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  difficulty: Difficulty;
  cards: Card[];
  firstCard: Card | null;
  secondCard: Card | null;
  score: number;
  timeElapsed: number;
  gameStatus: 'menu' | 'countdown' | 'playing' | 'paused' | 'completed';
  countdownValue: number;
  streak: number;
}

export interface HighScore {
  name: string;
  score: number;
  time: number;
  difficulty: Difficulty;
  date: string;
}
