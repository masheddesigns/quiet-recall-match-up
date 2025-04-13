
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy } from 'lucide-react';

interface NameEntryFormProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  score: number;
}

const NameEntryForm: React.FC<NameEntryFormProps> = ({ isOpen, onSubmit, score }) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-memory-background border-memory-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl text-memory-text">
            <Trophy className="h-6 w-6 text-memory-primary mr-2" />
            <span>New High Score: {score}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-memory-text">Enter your name:</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-memory-card text-memory-text border-memory-primary"
              placeholder="Your name"
              required
              maxLength={15}
              autoFocus
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-memory-primary hover:bg-memory-secondary text-white"
            disabled={!name.trim()}
          >
            Save Score
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameEntryForm;
