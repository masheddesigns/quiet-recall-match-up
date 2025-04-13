
import React, { useEffect } from 'react';

interface CountdownProps {
  value: number;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ value, onComplete }) => {
  useEffect(() => {
    if (value <= 0) {
      onComplete();
    }
  }, [value, onComplete]);
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="countdown text-memory-primary font-bold">
        {value > 0 ? value : 'Go!'}
      </div>
    </div>
  );
};

export default Countdown;
