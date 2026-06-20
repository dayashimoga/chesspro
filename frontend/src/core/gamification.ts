// ChessOS — Gamification System
// Achievements, daily challenges, rewards, streak tracking, cosmetics

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'tactical' | 'streak' | 'mastery' | 'social' | 'special';
  requirement: (stats: GamificationStats) => boolean;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'puzzles' | 'lessons' | 'time' | 'streak' | 'accuracy';
  target: number;
  xpReward: number;
  current: number;
  completed: boolean;
}

export interface RewardDrop {
  type: 'xp' | 'badge' | 'theme' | 'boardStyle' | 'pieceSet' | 'avatar' | 'title';
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value?: number; // For XP rewards
}

export interface GamificationStats {
  puzzlesSolved: number;
  lessonsCompleted: number;
  totalXP: number;
  level: number;
  streak: number;
  maxStreak: number;
  daysActive: number;
  perfectPuzzleSets: number;
  gamesPlayed: number;
  reviewsCompleted: number;
  achievementsUnlocked: string[];
  dailyChallengesCompleted: number;
  totalTimeMinutes: number;
}

const GAMIFICATION_KEY = 'chessos_gamification';

interface GamificationData {
  stats: GamificationStats;
  unlockedAchievements: string[];
  unlockedCosmetics: string[];
  dailyChallenges: DailyChallenge[];
  dailyChallengeDate: string;
  rewardHistory: Array<{ reward: RewardDrop; date: string }>;
  dailyRewardClaimed: string; // date string of last claim
  streakCalendar: string[]; // Array of date strings
}

const DEFAULT_STATS: GamificationStats = {
  puzzlesSolved: 0,
  lessonsCompleted: 0,
  totalXP: 0,
  level: 1,
  streak: 0,
  maxStreak: 0,
  daysActive: 0,
  perfectPuzzleSets: 0,
  gamesPlayed: 0,
  reviewsCompleted: 0,
  achievementsUnlocked: [],
  dailyChallengesCompleted: 0,
  totalTimeMinutes: 0,
};

function loadGamification(): GamificationData {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        stats: { ...DEFAULT_STATS, ...p.stats },
        unlockedAchievements: p.unlockedAchievements || [],
        unlockedCosmetics: p.unlockedCosmetics || [],
        dailyChallenges: p.dailyChallenges || [],
        dailyChallengeDate: p.dailyChallengeDate || '',
        rewardHistory: p.rewardHistory || [],
        dailyRewardClaimed: p.dailyRewardClaimed || '',
        streakCalendar: p.streakCalendar || [],
      };
    }
  } catch { /* noop */ }
  return {
    stats: { ...DEFAULT_STATS },
    unlockedAchievements: [],
    unlockedCosmetics: [],
    dailyChallenges: [],
    dailyChallengeDate: '',
    rewardHistory: [],
    dailyRewardClaimed: '',
    streakCalendar: [],
  };
}

function saveGamification(data: GamificationData): void {
  // Cap history
  if (data.rewardHistory.length > 200) data.rewardHistory = data.rewardHistory.slice(-200);
  if (data.streakCalendar.length > 365) data.streakCalendar = data.streakCalendar.slice(-365);
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
}

// Achievement definitions
const ALL_ACHIEVEMENTS: Achievement[] = [
  // Learning achievements
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first lesson', icon: '🌟', category: 'learning', requirement: s => s.lessonsCompleted >= 1, xpReward: 25, rarity: 'common' },
  { id: 'bookworm', title: 'Bookworm', description: 'Complete 10 lessons', icon: '📚', category: 'learning', requirement: s => s.lessonsCompleted >= 10, xpReward: 100, rarity: 'uncommon' },
  { id: 'scholar', title: 'Scholar', description: 'Complete 25 lessons', icon: '🎓', category: 'learning', requirement: s => s.lessonsCompleted >= 25, xpReward: 250, rarity: 'rare' },
  { id: 'professor', title: 'Professor', description: 'Complete 50 lessons', icon: '🏛️', category: 'learning', requirement: s => s.lessonsCompleted >= 50, xpReward: 500, rarity: 'epic' },
  { id: 'grandmaster-scholar', title: 'Grandmaster Scholar', description: 'Complete 100 lessons', icon: '👨‍🏫', category: 'learning', requirement: s => s.lessonsCompleted >= 100, xpReward: 1000, rarity: 'legendary' },

  // Tactical achievements
  { id: 'tactician-i', title: 'Tactician I', description: 'Solve 10 puzzles', icon: '🎯', category: 'tactical', requirement: s => s.puzzlesSolved >= 10, xpReward: 50, rarity: 'common' },
  { id: 'tactician-ii', title: 'Tactician II', description: 'Solve 50 puzzles', icon: '⚔️', category: 'tactical', requirement: s => s.puzzlesSolved >= 50, xpReward: 150, rarity: 'uncommon' },
  { id: 'tactician-iii', title: 'Tactician III', description: 'Solve 200 puzzles', icon: '🗡️', category: 'tactical', requirement: s => s.puzzlesSolved >= 200, xpReward: 400, rarity: 'rare' },
  { id: 'tactical-master', title: 'Tactical Master', description: 'Solve 500 puzzles', icon: '🔥', category: 'tactical', requirement: s => s.puzzlesSolved >= 500, xpReward: 750, rarity: 'epic' },
  { id: 'tactical-legend', title: 'Tactical Legend', description: 'Solve 1000 puzzles', icon: '💎', category: 'tactical', requirement: s => s.puzzlesSolved >= 1000, xpReward: 2000, rarity: 'legendary' },
  { id: 'perfect-set', title: 'Perfect Set', description: 'Solve 5 puzzles in a row without errors', icon: '✨', category: 'tactical', requirement: s => s.perfectPuzzleSets >= 1, xpReward: 100, rarity: 'uncommon' },
  { id: 'sharpshooter', title: 'Sharpshooter', description: 'Achieve 10 perfect puzzle sets', icon: '🎖️', category: 'tactical', requirement: s => s.perfectPuzzleSets >= 10, xpReward: 300, rarity: 'rare' },

  // Streak achievements
  { id: 'day-one', title: 'Day One', description: 'Start your chess journey', icon: '🌱', category: 'streak', requirement: s => s.daysActive >= 1, xpReward: 10, rarity: 'common' },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '📅', category: 'streak', requirement: s => s.streak >= 7, xpReward: 100, rarity: 'uncommon' },
  { id: 'month-master', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '🗓️', category: 'streak', requirement: s => s.streak >= 30, xpReward: 500, rarity: 'rare' },
  { id: 'quarter-champion', title: 'Quarter Champion', description: 'Maintain a 90-day streak', icon: '🏆', category: 'streak', requirement: s => s.streak >= 90, xpReward: 1000, rarity: 'epic' },
  { id: 'year-legend', title: 'Year Legend', description: 'Maintain a 365-day streak', icon: '👑', category: 'streak', requirement: s => s.streak >= 365, xpReward: 5000, rarity: 'legendary' },

  // Mastery achievements
  { id: 'calculated-risk', title: 'Calculated Risk', description: 'Reach 1000 puzzle rating', icon: '🧠', category: 'mastery', requirement: s => s.totalXP >= 500, xpReward: 100, rarity: 'uncommon' },
  { id: 'rising-star', title: 'Rising Star', description: 'Reach Level 5', icon: '⭐', category: 'mastery', requirement: s => s.level >= 5, xpReward: 200, rarity: 'uncommon' },
  { id: 'expert-player', title: 'Expert Player', description: 'Reach Level 10', icon: '🌟', category: 'mastery', requirement: s => s.level >= 10, xpReward: 500, rarity: 'rare' },
  { id: 'master-class', title: 'Master Class', description: 'Reach Level 25', icon: '💫', category: 'mastery', requirement: s => s.level >= 25, xpReward: 1500, rarity: 'epic' },
  { id: 'grandmaster', title: 'Grandmaster', description: 'Reach Level 50', icon: '♚', category: 'mastery', requirement: s => s.level >= 50, xpReward: 5000, rarity: 'legendary' },

  // Special achievements
  { id: 'memory-master', title: 'Memory Master', description: 'Complete 20 spaced reviews', icon: '🃏', category: 'special', requirement: s => s.reviewsCompleted >= 20, xpReward: 200, rarity: 'uncommon' },
  { id: 'time-traveler', title: 'Time Traveler', description: 'Spend 10 hours learning', icon: '⏰', category: 'special', requirement: s => s.totalTimeMinutes >= 600, xpReward: 300, rarity: 'rare' },
  { id: 'challenge-hunter', title: 'Challenge Hunter', description: 'Complete 10 daily challenges', icon: '🎪', category: 'special', requirement: s => s.dailyChallengesCompleted >= 10, xpReward: 250, rarity: 'uncommon' },
  { id: 'overachiever', title: 'Overachiever', description: 'Complete 50 daily challenges', icon: '🏅', category: 'special', requirement: s => s.dailyChallengesCompleted >= 50, xpReward: 750, rarity: 'rare' },
  { id: 'battle-hardened', title: 'Battle Hardened', description: 'Play 25 games vs AI', icon: '🤖', category: 'special', requirement: s => s.gamesPlayed >= 25, xpReward: 300, rarity: 'uncommon' },
];

// Possible reward drops
const REWARD_POOL: RewardDrop[] = [
  { type: 'xp', name: '50 XP Bonus', icon: '💎', rarity: 'common', value: 50 },
  { type: 'xp', name: '100 XP Bonus', icon: '💎', rarity: 'uncommon', value: 100 },
  { type: 'xp', name: '250 XP Jackpot', icon: '🌟', rarity: 'rare', value: 250 },
  { type: 'badge', name: 'Tactical Eye', icon: '👁️', rarity: 'common' },
  { type: 'badge', name: 'Pawn Storm', icon: '⚡', rarity: 'uncommon' },
  { type: 'badge', name: 'Castle Guard', icon: '🏰', rarity: 'common' },
  { type: 'badge', name: 'Knight Rider', icon: '🐴', rarity: 'uncommon' },
  { type: 'badge', name: 'Bishop Pair', icon: '⛪', rarity: 'rare' },
  { type: 'badge', name: 'Queen Sacrifice', icon: '👑', rarity: 'epic' },
  { type: 'theme', name: 'Forest Green Theme', icon: '🌲', rarity: 'uncommon' },
  { type: 'theme', name: 'Ocean Blue Theme', icon: '🌊', rarity: 'uncommon' },
  { type: 'theme', name: 'Sunset Theme', icon: '🌅', rarity: 'rare' },
  { type: 'theme', name: 'Royal Purple Theme', icon: '💜', rarity: 'rare' },
  { type: 'theme', name: 'Golden Tournament Theme', icon: '🏆', rarity: 'epic' },
  { type: 'boardStyle', name: 'Wooden Board', icon: '🪵', rarity: 'common' },
  { type: 'boardStyle', name: 'Marble Board', icon: '🏛️', rarity: 'uncommon' },
  { type: 'boardStyle', name: 'Tournament Board', icon: '♟️', rarity: 'rare' },
  { type: 'boardStyle', name: 'Crystal Board', icon: '💎', rarity: 'epic' },
  { type: 'pieceSet', name: 'Neo Pieces', icon: '🆕', rarity: 'common' },
  { type: 'pieceSet', name: 'Alpha Pieces', icon: '🅰️', rarity: 'uncommon' },
  { type: 'pieceSet', name: 'Staunton Gold', icon: '🥇', rarity: 'rare' },
  { type: 'avatar', name: 'Chess Knight Avatar', icon: '🐴', rarity: 'common' },
  { type: 'avatar', name: 'Chess King Avatar', icon: '♚', rarity: 'uncommon' },
  { type: 'avatar', name: 'GM Avatar', icon: '🎩', rarity: 'rare' },
  { type: 'avatar', name: 'Magnus Avatar', icon: '🏆', rarity: 'legendary' },
  { type: 'title', name: 'Apprentice', icon: '📜', rarity: 'common' },
  { type: 'title', name: 'Candidate', icon: '📋', rarity: 'uncommon' },
  { type: 'title', name: 'Master', icon: '🎖️', rarity: 'rare' },
  { type: 'title', name: 'Grandmaster', icon: '👑', rarity: 'legendary' },
];

export class Gamification {
  static getStats(): GamificationStats {
    return { ...loadGamification().stats };
  }

  static getAllAchievements(): Array<Achievement & { unlocked: boolean }> {
    const data = loadGamification();
    return ALL_ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: data.unlockedAchievements.includes(a.id),
    }));
  }

  static getUnlockedCount(): number {
    return loadGamification().unlockedAchievements.length;
  }

  static getTotalAchievementCount(): number {
    return ALL_ACHIEVEMENTS.length;
  }

  static incrementStat(stat: keyof GamificationStats, amount: number = 1): string[] {
    const data = loadGamification();
    const currentVal = data.stats[stat];
    if (typeof currentVal === 'number') {
      (data.stats as any)[stat] = currentVal + amount;
    }

    // Check for newly unlocked achievements
    const newlyUnlocked: string[] = [];
    for (const achievement of ALL_ACHIEVEMENTS) {
      if (!data.unlockedAchievements.includes(achievement.id) && achievement.requirement(data.stats)) {
        data.unlockedAchievements.push(achievement.id);
        data.stats.achievementsUnlocked = [...data.unlockedAchievements];
        newlyUnlocked.push(achievement.id);
      }
    }

    saveGamification(data);
    return newlyUnlocked;
  }

  static syncStats(xp: number, level: number, streak: number, completedLessons: number): void {
    const data = loadGamification();
    data.stats.totalXP = xp;
    data.stats.level = level;
    data.stats.streak = streak;
    data.stats.maxStreak = Math.max(data.stats.maxStreak, streak);
    data.stats.lessonsCompleted = Math.max(data.stats.lessonsCompleted, completedLessons);
    saveGamification(data);
  }

  // Daily Challenges
  static getDailyChallenges(): DailyChallenge[] {
    const data = loadGamification();
    const today = new Date().toISOString().split('T')[0];

    if (data.dailyChallengeDate !== today || data.dailyChallenges.length === 0) {
      // Generate new daily challenges
      data.dailyChallenges = this.generateDailyChallenges();
      data.dailyChallengeDate = today;
      saveGamification(data);
    }

    return data.dailyChallenges;
  }

  private static generateDailyChallenges(): DailyChallenge[] {
    const dayOfWeek = new Date().getDay();
    const challenges: DailyChallenge[] = [
      {
        id: `dc-puzzles-${Date.now()}`,
        title: 'Puzzle Rush',
        description: `Solve ${5 + dayOfWeek} tactical puzzles today`,
        icon: '🧩',
        type: 'puzzles',
        target: 5 + dayOfWeek,
        xpReward: 30 + dayOfWeek * 5,
        current: 0,
        completed: false,
      },
      {
        id: `dc-lesson-${Date.now()}`,
        title: 'Knowledge Seeker',
        description: 'Complete 1 lesson or lab exercise',
        icon: '📖',
        type: 'lessons',
        target: 1,
        xpReward: 25,
        current: 0,
        completed: false,
      },
      {
        id: `dc-time-${Date.now()}`,
        title: 'Dedicated Practice',
        description: 'Spend at least 10 minutes training',
        icon: '⏱️',
        type: 'time',
        target: 10,
        xpReward: 20,
        current: 0,
        completed: false,
      },
    ];

    // Add bonus challenge on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      challenges.push({
        id: `dc-weekend-${Date.now()}`,
        title: 'Weekend Warrior',
        description: 'Solve 15 puzzles with 80% accuracy',
        icon: '🏆',
        type: 'accuracy',
        target: 80,
        xpReward: 75,
        current: 0,
        completed: false,
      });
    }

    return challenges;
  }

  static updateChallengeProgress(type: 'puzzles' | 'lessons' | 'time' | 'streak' | 'accuracy', value: number): string[] {
    const data = loadGamification();
    const today = new Date().toISOString().split('T')[0];
    if (data.dailyChallengeDate !== today) return [];

    const newlyCompleted: string[] = [];

    for (const challenge of data.dailyChallenges) {
      if (challenge.completed || challenge.type !== type) continue;
      challenge.current = Math.min(challenge.target, challenge.current + value);
      if (challenge.current >= challenge.target) {
        challenge.completed = true;
        data.stats.dailyChallengesCompleted++;
        newlyCompleted.push(challenge.id);
      }
    }

    saveGamification(data);
    return newlyCompleted;
  }

  // Daily Rewards
  static canClaimDailyReward(): boolean {
    const data = loadGamification();
    const today = new Date().toISOString().split('T')[0];
    return data.dailyRewardClaimed !== today;
  }

  static claimDailyReward(): RewardDrop {
    const data = loadGamification();
    const today = new Date().toISOString().split('T')[0];

    // Streak bonus affects rarity chances
    const streakBonus = Math.min(data.stats.streak * 2, 30); // Max 30% boost

    // Roll for rarity
    const roll = Math.random() * 100;
    let rarity: RewardDrop['rarity'];
    if (roll < 1 + streakBonus * 0.1) rarity = 'legendary';
    else if (roll < 5 + streakBonus * 0.3) rarity = 'epic';
    else if (roll < 20 + streakBonus * 0.5) rarity = 'rare';
    else if (roll < 50 + streakBonus) rarity = 'uncommon';
    else rarity = 'common';

    const pool = REWARD_POOL.filter(r => r.rarity === rarity);
    const reward = pool[Math.floor(Math.random() * pool.length)] || REWARD_POOL[0];

    data.dailyRewardClaimed = today;
    data.rewardHistory.push({ reward, date: today });

    if (reward.type !== 'xp') {
      const cosmeticId = `${reward.type}:${reward.name}`;
      if (!data.unlockedCosmetics.includes(cosmeticId)) {
        data.unlockedCosmetics.push(cosmeticId);
      }
    }

    // Track streak day
    if (!data.streakCalendar.includes(today)) {
      data.streakCalendar.push(today);
    }

    saveGamification(data);
    return reward;
  }

  static getRewardHistory(): Array<{ reward: RewardDrop; date: string }> {
    return loadGamification().rewardHistory;
  }

  static getUnlockedCosmetics(): string[] {
    return loadGamification().unlockedCosmetics;
  }

  static getStreakCalendar(): string[] {
    return loadGamification().streakCalendar;
  }

  // Rarity color helpers
  static getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#94a3b8';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  }

  static getRarityGlow(rarity: string): string {
    switch (rarity) {
      case 'common': return '0 0 10px rgba(148,163,184,0.2)';
      case 'uncommon': return '0 0 15px rgba(16,185,129,0.3)';
      case 'rare': return '0 0 20px rgba(59,130,246,0.4)';
      case 'epic': return '0 0 25px rgba(139,92,246,0.5)';
      case 'legendary': return '0 0 30px rgba(245,158,11,0.6)';
      default: return 'none';
    }
  }
}
