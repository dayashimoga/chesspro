// ChessOS — Adaptive Learning Engine
// Tracks sub-skill ratings, detects weaknesses, generates personalized plans

export interface SubSkillRatings {
  tactical: number;
  strategic: number;
  opening: number;
  middlegame: number;
  endgame: number;
  calculation: number;
  visualization: number;
  patternRecognition: number;
}

export interface PerformanceTrend {
  category: string;
  accuracy7d: number;
  accuracy30d: number;
  trend: 'improving' | 'stable' | 'declining';
  velocity: number; // points per day
}

export interface WeaknessProfile {
  weakAreas: string[];
  strongAreas: string[];
  trends: PerformanceTrend[];
  overallRating: number;
  confidence: number;
}

export interface DailyPlanItem {
  type: 'lesson' | 'puzzle' | 'assessment' | 'review' | 'endgame' | 'opening' | 'masterGame' | 'calculation';
  title: string;
  description: string;
  duration: number; // minutes
  category?: string;
  difficulty?: string;
  targetSkill: keyof SubSkillRatings;
  xpReward: number;
  route: string;
  icon: string;
}

export interface DailyPlan {
  totalMinutes: number;
  items: DailyPlanItem[];
  focusAreas: string[];
  estimatedXP: number;
}

const SKILL_CATEGORIES_MAP: Record<string, keyof SubSkillRatings> = {
  'mate_in_1': 'tactical',
  'mate_in_2': 'tactical',
  'forks': 'tactical',
  'pins': 'tactical',
  'skewers': 'tactical',
  'discovered_attacks': 'tactical',
  'deflection': 'tactical',
  'decoy': 'tactical',
  'sacrifices': 'tactical',
  'overloading': 'tactical',
  'zwischenzug': 'tactical',
  'back_rank': 'tactical',
  'smothered_mates': 'tactical',
  'double_attacks': 'tactical',
  'discovered_checks': 'tactical',
  'double_checks': 'tactical',
  'attraction': 'tactical',
  'clearance': 'tactical',
  'interference': 'tactical',
  'x_ray': 'tactical',
  'mating_nets': 'tactical',
  'endgames': 'endgame',
  'opposition': 'endgame',
  'lucena': 'endgame',
  'philidor': 'endgame',
  'rook_endgames': 'endgame',
  'queen_endgames': 'endgame',
  'strategy': 'strategic',
  'pawn_structures': 'strategic',
  'weak_squares': 'strategic',
  'planning': 'middlegame',
  'calculation': 'calculation',
  'openings': 'opening',
  'blindfold': 'visualization',
};

const DEFAULT_RATINGS: SubSkillRatings = {
  tactical: 800,
  strategic: 800,
  opening: 800,
  middlegame: 800,
  endgame: 800,
  calculation: 800,
  visualization: 800,
  patternRecognition: 800,
};

const STORAGE_KEY = 'chessos_adaptive';

interface AdaptiveData {
  ratings: SubSkillRatings;
  history: Array<{
    category: string;
    skill: keyof SubSkillRatings;
    correct: boolean;
    timestamp: number;
    rating: number;
  }>;
  masteredTopics: string[];
  dailyGoalMinutes: number;
  lastPlanDate: string;
  completedToday: string[];
}

function loadData(): AdaptiveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ratings: { ...DEFAULT_RATINGS, ...parsed.ratings },
        history: parsed.history || [],
        masteredTopics: parsed.masteredTopics || [],
        dailyGoalMinutes: parsed.dailyGoalMinutes || 15,
        lastPlanDate: parsed.lastPlanDate || '',
        completedToday: parsed.completedToday || [],
      };
    }
  } catch { /* noop */ }
  return {
    ratings: { ...DEFAULT_RATINGS },
    history: [],
    masteredTopics: [],
    dailyGoalMinutes: 15,
    lastPlanDate: '',
    completedToday: [],
  };
}

function saveData(data: AdaptiveData): void {
  // Keep history manageable
  if (data.history.length > 2000) {
    data.history = data.history.slice(-2000);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export class AdaptiveEngine {
  static getSkillCategory(puzzleCategory: string): keyof SubSkillRatings {
    return SKILL_CATEGORIES_MAP[puzzleCategory] || 'tactical';
  }

  static getRatings(): SubSkillRatings {
    return { ...loadData().ratings };
  }

  static getOverallRating(): number {
    const r = loadData().ratings;
    const weights = { tactical: 0.25, strategic: 0.15, opening: 0.12, middlegame: 0.12, endgame: 0.15, calculation: 0.1, visualization: 0.06, patternRecognition: 0.05 };
    let sum = 0;
    for (const [key, weight] of Object.entries(weights)) {
      sum += (r[key as keyof SubSkillRatings] || 800) * weight;
    }
    return Math.round(sum);
  }

  static recordPerformance(category: string, correct: boolean, puzzleRating: number = 800): void {
    const data = loadData();
    const skill = this.getSkillCategory(category);
    const currentRating = data.ratings[skill];
    
    // ELO-inspired rating adjustment
    const expected = 1 / (1 + Math.pow(10, (puzzleRating - currentRating) / 400));
    const actual = correct ? 1 : 0;
    const k = currentRating < 1200 ? 40 : currentRating < 1800 ? 24 : 16;
    const change = Math.round(k * (actual - expected));
    
    data.ratings[skill] = Math.max(100, Math.min(3000, currentRating + change));
    
    data.history.push({
      category,
      skill,
      correct,
      timestamp: Date.now(),
      rating: data.ratings[skill],
    });

    // Check mastery
    const recentForCategory = data.history
      .filter(h => h.category === category)
      .slice(-20);
    if (recentForCategory.length >= 10) {
      const accuracy = recentForCategory.filter(h => h.correct).length / recentForCategory.length;
      if (accuracy >= 0.85 && !data.masteredTopics.includes(category)) {
        data.masteredTopics.push(category);
      }
    }

    saveData(data);
  }

  static analyzeProfile(): WeaknessProfile {
    const data = loadData();
    const now = Date.now();
    const day7 = now - 7 * 86400000;
    const day30 = now - 30 * 86400000;

    const skillNames: (keyof SubSkillRatings)[] = ['tactical', 'strategic', 'opening', 'middlegame', 'endgame', 'calculation', 'visualization', 'patternRecognition'];
    
    const trends: PerformanceTrend[] = [];
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    for (const skill of skillNames) {
      const allForSkill = data.history.filter(h => h.skill === skill);
      const recent7d = allForSkill.filter(h => h.timestamp >= day7);
      const recent30d = allForSkill.filter(h => h.timestamp >= day30);

      const acc7d = recent7d.length > 0 ? recent7d.filter(h => h.correct).length / recent7d.length : 0.5;
      const acc30d = recent30d.length > 0 ? recent30d.filter(h => h.correct).length / recent30d.length : 0.5;

      let trendDir: 'improving' | 'stable' | 'declining' = 'stable';
      const diff = acc7d - acc30d;
      if (diff > 0.05) trendDir = 'improving';
      else if (diff < -0.05) trendDir = 'declining';

      // Calculate velocity from rating changes
      let velocity = 0;
      if (recent7d.length >= 2) {
        const firstRating = recent7d[0].rating;
        const lastRating = recent7d[recent7d.length - 1].rating;
        velocity = Math.round((lastRating - firstRating) / 7);
      }

      trends.push({ category: skill, accuracy7d: acc7d, accuracy30d: acc30d, trend: trendDir, velocity });

      const rating = data.ratings[skill];
      if (rating < 900 || acc30d < 0.4) {
        weakAreas.push(skill);
      } else if (rating >= 1400 && acc30d >= 0.7) {
        strongAreas.push(skill);
      }
    }

    // If no history, add default weak areas
    if (data.history.length < 10) {
      if (!weakAreas.includes('tactical')) weakAreas.push('tactical');
      if (!weakAreas.includes('endgame')) weakAreas.push('endgame');
    }

    return {
      weakAreas,
      strongAreas,
      trends,
      overallRating: this.getOverallRating(),
      confidence: Math.min(1, data.history.length / 100),
    };
  }

  static generateDailyPlan(minutes: number): DailyPlan {
    const data = loadData();
    const profile = this.analyzeProfile();
    const items: DailyPlanItem[] = [];
    let remaining = minutes;

    // Always start with warm-up puzzle
    if (remaining >= 3) {
      items.push({
        type: 'puzzle', title: 'Warm-Up Tactics', description: 'Quick tactical puzzles to sharpen your mind',
        duration: Math.min(3, remaining), category: 'mate_in_1', difficulty: 'beginner',
        targetSkill: 'tactical', xpReward: 10, route: '/puzzles', icon: '🧩',
      });
      remaining -= 3;
    }

    // Focus on weak areas
    for (const weak of profile.weakAreas) {
      if (remaining < 3) break;

      const planItems = this.getPlanItemsForSkill(weak as keyof SubSkillRatings, remaining);
      for (const item of planItems) {
        if (remaining < item.duration) break;
        items.push(item);
        remaining -= item.duration;
      }
    }

    // Add variety if time remains
    if (remaining >= 5) {
      items.push({
        type: 'review', title: 'Spaced Review', description: 'Review previously learned concepts with flashcards',
        duration: Math.min(5, remaining), targetSkill: 'patternRecognition', xpReward: 15,
        route: '/review', icon: '🔄',
      });
      remaining -= Math.min(5, remaining);
    }

    if (remaining >= 5) {
      items.push({
        type: 'masterGame', title: 'Master Game Study', description: 'Study an annotated grandmaster game',
        duration: Math.min(10, remaining), targetSkill: 'strategic', xpReward: 20,
        route: '/master-games', icon: '🏆',
      });
      remaining -= Math.min(10, remaining);
    }

    // Assessment at the end if longer session
    if (minutes >= 15 && remaining >= 3) {
      items.push({
        type: 'assessment', title: 'Daily Assessment', description: 'Test your progress with an adaptive quiz',
        duration: Math.min(5, remaining), targetSkill: 'tactical', xpReward: 25,
        route: '/puzzles', icon: '📝',
      });
    }

    const estimatedXP = items.reduce((sum, item) => sum + item.xpReward, 0);

    // Save preference
    data.dailyGoalMinutes = minutes;
    data.lastPlanDate = new Date().toISOString().split('T')[0];
    saveData(data);

    return {
      totalMinutes: minutes,
      items,
      focusAreas: profile.weakAreas.slice(0, 3),
      estimatedXP,
    };
  }

  private static getPlanItemsForSkill(skill: keyof SubSkillRatings, maxMinutes: number): DailyPlanItem[] {
    const items: DailyPlanItem[] = [];
    const dur = Math.min(8, maxMinutes);

    switch (skill) {
      case 'tactical':
        items.push({
          type: 'lesson', title: 'Tactical Patterns', description: 'Study and practice key tactical motifs',
          duration: Math.min(5, dur), category: 'forks', targetSkill: 'tactical',
          xpReward: 15, route: '/tactics', icon: '⚔️',
        });
        if (dur > 5) items.push({
          type: 'puzzle', title: 'Tactical Puzzles', description: 'Solve tactical puzzles adapted to your level',
          duration: dur - 5, category: 'forks', targetSkill: 'tactical',
          xpReward: 15, route: '/puzzles', icon: '🧩',
        });
        break;
      case 'endgame':
        items.push({
          type: 'endgame', title: 'Endgame Drill', description: 'Practice fundamental endgame techniques',
          duration: dur, category: 'endgames', targetSkill: 'endgame',
          xpReward: 20, route: '/endgame-university', icon: '👑',
        });
        break;
      case 'opening':
        items.push({
          type: 'opening', title: 'Opening Study', description: 'Study and practice opening principles',
          duration: dur, category: 'openings', targetSkill: 'opening',
          xpReward: 15, route: '/opening-university', icon: '🌳',
        });
        break;
      case 'calculation':
        items.push({
          type: 'calculation', title: 'Calculation Training', description: 'Deep visualization and variation practice',
          duration: dur, targetSkill: 'calculation',
          xpReward: 20, route: '/calc-university', icon: '🧠',
        });
        break;
      case 'strategic':
      case 'middlegame':
        items.push({
          type: 'lesson', title: 'Strategic Concepts', description: 'Study positional chess and planning',
          duration: dur, targetSkill: skill,
          xpReward: 15, route: '/middlegame', icon: '📈',
        });
        break;
      case 'visualization':
        items.push({
          type: 'calculation', title: 'Blindfold Training', description: 'Train board visualization without seeing pieces',
          duration: dur, targetSkill: 'visualization',
          xpReward: 20, route: '/blindfold', icon: '🙈',
        });
        break;
      default:
        items.push({
          type: 'puzzle', title: 'Mixed Practice', description: 'Varied puzzles covering multiple themes',
          duration: dur, targetSkill: 'tactical',
          xpReward: 15, route: '/puzzles', icon: '🎯',
        });
    }
    return items;
  }

  static markPlanItemComplete(itemTitle: string): void {
    const data = loadData();
    const today = new Date().toISOString().split('T')[0];
    if (data.lastPlanDate !== today) {
      data.completedToday = [];
      data.lastPlanDate = today;
    }
    if (!data.completedToday.includes(itemTitle)) {
      data.completedToday.push(itemTitle);
    }
    saveData(data);
  }

  static getCompletedToday(): string[] {
    const data = loadData();
    const today = new Date().toISOString().split('T')[0];
    if (data.lastPlanDate !== today) return [];
    return data.completedToday;
  }

  static getDailyGoalMinutes(): number {
    return loadData().dailyGoalMinutes;
  }

  static getMasteredTopics(): string[] {
    return loadData().masteredTopics;
  }

  static isMastered(category: string): boolean {
    return loadData().masteredTopics.includes(category);
  }
}
