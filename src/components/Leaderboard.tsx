
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTopScores } from '../utils/gameUtils';
import { Difficulty, HighScore } from '../types/game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  
  // Get top 5 scores for the selected difficulty
  const scores = getTopScores(selectedDifficulty);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-memory-background border-memory-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl text-memory-text flex items-center gap-2">
            <Trophy className="h-6 w-6 text-memory-primary" />
            <span>Leaderboard</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="w-full"
          onValueChange={(value) => setSelectedDifficulty(value as Difficulty | 'all')}>
          <TabsList className="grid grid-cols-4 bg-memory-card">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedDifficulty} className="mt-4">
            {scores.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-4 text-memory-accent text-sm mb-2">
                  <div>Rank</div>
                  <div>Player</div>
                  <div>Score</div>
                  <div>Time</div>
                </div>
                
                {scores.map((score, index) => (
                  <div key={index} className="grid grid-cols-4 py-2 border-b border-memory-card">
                    <div className="flex items-center">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-400 mr-1" />}
                      {index === 1 && <Trophy className="h-4 w-4 text-gray-400 mr-1" />}
                      {index === 2 && <Trophy className="h-4 w-4 text-amber-700 mr-1" />}
                      {index > 2 && <span>{index + 1}</span>}
                    </div>
                    <div className="truncate">{score.name}</div>
                    <div>{score.score}</div>
                    <div>{Math.floor(score.time / 60)}:{(score.time % 60).toString().padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-memory-text">
                <p>No scores yet!</p>
                <p className="text-sm text-memory-accent mt-2">Be the first to set a high score</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;
