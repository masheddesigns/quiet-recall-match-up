
import React, { useState, useEffect } from 'react';
import { Card } from '../types/game';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
  card: Card;
  onClick: (card: Card) => void;
  disabled: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, disabled }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (card.isFlipped && !card.isMatched) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped, card.isMatched]);

  // Trigger shake animation for unmatched pairs
  useEffect(() => {
    if (!card.isMatched && isFlipping === false && card.isFlipped === false) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [card.isMatched, card.isFlipped, isFlipping]);
  
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full aspect-square memory-card cursor-pointer",
        card.isFlipped ? "flipped" : "",
        isShaking ? "animate-shake" : "",
        "transition-transform duration-300"
      )}
      onClick={handleClick}
    >
      <div className="memory-card-back bg-memory-card text-memory-text flex items-center justify-center rounded-lg shadow-lg text-xl font-bold">
        ?
      </div>
      <div className="memory-card-front bg-white flex items-center justify-center rounded-lg shadow-lg text-3xl">
        {card.emoji}
      </div>
    </div>
  );
};

export default MemoryCard;
