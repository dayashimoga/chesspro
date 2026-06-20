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
}

export interface LessonExample {
  fen: string;
  title: string;
  description: string;
}

export interface LessonSubModule {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  theory: string;
  examples?: LessonExample[];
  exercises?: LessonExercise[];
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

