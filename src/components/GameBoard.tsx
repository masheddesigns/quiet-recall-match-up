
import React from 'react';
import MemoryCard from './MemoryCard';
import { Card, Difficulty } from '../types/game';
import { getGridSize } from '../utils/gameUtils';

interface GameBoardProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  disabled: boolean;
  difficulty: Difficulty;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  cards, 
  onCardClick, 
  disabled,
  difficulty 
}) => {
  const gridSize = getGridSize(difficulty);
  const gridClass = `game-grid-${gridSize}`;
  
  return (
    <div className={`w-full max-w-3xl mx-auto ${gridClass}`}>
      {cards.map(card => (
        <div key={card.id} className="w-full aspect-square">
          <MemoryCard
            card={card}
            onClick={onCardClick}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
