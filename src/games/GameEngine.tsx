import React from 'react';
import { GameGenreId, DifficultyLevel } from '../lib/types';
import { TreasureHunt } from './TreasureHunt';
import { JungleRunner } from './JungleRunner';
import { SuperPlatformer } from './SuperPlatformer';
import { DinoEscape } from './DinoEscape';
import { SpaceMission } from './SpaceMission';
import { PuzzleMaster } from './PuzzleMaster';
import { CastleDefender } from './CastleDefender';
import { MemoryQuest } from './MemoryQuest';

interface GameEngineProps {
  genreId: GameGenreId;
  difficulty: DifficultyLevel;
  targetGoal: number;
  onWin: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  genreId,
  difficulty,
  targetGoal,
  onWin
}) => {
  switch (genreId) {
    case 'treasure_hunt':
      return <TreasureHunt difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'jungle_runner':
      return <JungleRunner difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'super_platformer':
      return <SuperPlatformer difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'dino_escape':
      return <DinoEscape difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'space_mission':
      return <SpaceMission difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'puzzle_master':
      return <PuzzleMaster difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'castle_defender':
      return <CastleDefender difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    case 'memory_quest':
      return <MemoryQuest difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
    default:
      return <TreasureHunt difficulty={difficulty} targetGoal={targetGoal} onWin={onWin} />;
  }
};
