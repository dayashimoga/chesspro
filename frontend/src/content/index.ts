import { foundationsContent } from './00-foundations';
import { tacticsContent } from './01-tactics';
import { calculationContent } from './02-calculation';
import { endgameContent } from './03-endgames';
import { strategyContent } from './04-strategy';
import { openingsContent } from './05-openings';
import { masterGamesContent } from './06-master-games';
import { middlegameContent } from './07-middlegame';
import { advancedContent } from './08-advanced';
import { getEndgamePuzzles, ENDGAME_CATEGORIES } from './puzzle-endgame';
import { GRANDMASTER_GAMES, GRANDMASTER_PLAYERS } from './master-games-grandmaster';

export interface LessonExercise {
  type: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  solution?: string[];
  fen?: string;
}

export interface LessonExample {
  fen: string;
  title: string;
  description: string;
}

// Interactive guided practice step — user must make a specific move
export interface GuidedStep {
  fen: string;
  instruction: string;
  expectedMove: string; // SAN notation
  highlights?: Array<{ square: string; color: string }>;
  arrows?: Array<{ from: string; to: string; color: string }>;
  correctFeedback: string;
  incorrectFeedback: string;
  hints?: string[];
}

// Demo step — animated walkthrough with commentary
export interface DemoStep {
  fen: string;
  move?: string; // SAN move to animate
  commentary: string;
  highlights?: Array<{ square: string; color: string }>;
  arrows?: Array<{ from: string; to: string; color: string }>;
}

// Mastery position — user demonstrates concept via move sequence
export interface MasteryPosition {
  fen: string;
  description: string;
  solution: string[]; // Sequence of SAN moves
  conceptTested: string;
  maxAttempts: number;
}

// Opening tree node for interactive move trainers
export interface OpeningTreeNode {
  move: string;
  fen: string;
  comment?: string;
  isMainLine?: boolean;
}

export interface LessonSubModule {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  theory: string;
  examples?: LessonExample[];
  exercises?: LessonExercise[];
  // Interactive lesson fields
  demoSteps?: DemoStep[];
  guidedSteps?: GuidedStep[];
  masteryPositions?: MasteryPosition[];
  // Opening-specific
  openingTree?: OpeningTreeNode[];
  // Puzzle references
  puzzles?: Array<{ id: string; fen: string; solution: string; theme: string; difficulty: string; explanation: string }>;
}

export interface Course {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: LessonSubModule[];
}

export const ALL_COURSES: Course[] = [
  foundationsContent as Course,
  tacticsContent as Course,
  calculationContent as Course,
  endgameContent as Course,
  strategyContent as Course,
  openingsContent as Course,
  masterGamesContent as Course,
  middlegameContent as Course,
  advancedContent as Course,
];

export {
  foundationsContent,
  tacticsContent,
  calculationContent,
  endgameContent,
  strategyContent,
  openingsContent,
  masterGamesContent,
  middlegameContent,
  advancedContent,
  getEndgamePuzzles,
  ENDGAME_CATEGORIES,
  GRANDMASTER_GAMES,
  GRANDMASTER_PLAYERS,
};

