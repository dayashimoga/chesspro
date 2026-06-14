// ChessOS — Gamification System (XP, Levels, Achievements, Skill Trees)
import { Storage } from './storage.js';

export const ACHIEVEMENTS = [
  { id: 'first_solve', title: 'Tactical Spark', desc: 'Solve your first tactical puzzle.', icon: '⚡' },
  { id: 'streak_3', title: 'Triple Threat', desc: 'Maintain a 3-day study streak.', icon: '🔥' },
  { id: 'lesson_10', title: 'Chess Scholar', desc: 'Complete 10 interactive lessons.', icon: '🎓' },
  { id: 'boss_slayer', title: 'Boss Slayer', desc: 'Defeat one of the historical Chess Boss Bots.', icon: '⚔️' },
  { id: 'grandmaster_mind', title: 'Grandmaster Mind', desc: 'Achieve a puzzle rating of 1800+.', icon: '👑' }
];

export const SKILL_TREE = [
  { id: 'foundations', title: 'Foundations', desc: 'Board coordinates, pieces values, and checkmates.', levelRequired: 1, cost: 0, unlocked: true },
  { id: 'forks_pins', title: 'Forks & Pins', desc: 'Spot and execute double attacks and tactical pins.', levelRequired: 2, cost: 1, unlocked: false },
  { id: 'calc_depth', title: 'Calculation Depth', desc: 'Visualize moves mentally 3 plies ahead.', levelRequired: 3, cost: 2, unlocked: false },
  { id: 'endgame_opposition', title: 'Endgame Opposition', desc: 'Command opposition techniques in K+P endings.', levelRequired: 4, cost: 2, unlocked: false },
  { id: 'strategic_planning', title: 'Positional Strategy', desc: 'Assess pawn structures and weak square complexes.', levelRequired: 5, cost: 3, unlocked: false }
];

export class Gamification {
  // Get current Level and XP progress
  static getPlayerState() {
    const progress = Storage.getProgress();
    const xp = progress.xp || 0;
    
    const xpPerLevel = 250;
    const level = Math.floor(xp / xpPerLevel) + 1;
    const xpInCurrentLevel = xp % xpPerLevel;
    const percent = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

    const unlockedSkills = progress.unlockedSkills || ['foundations'];
    const unlockedAchievements = progress.unlockedAchievements || [];

    return {
      level,
      xp,
      xpInCurrentLevel,
      xpPerLevel,
      percent,
      unlockedSkills,
      unlockedAchievements,
      achievements: ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: unlockedAchievements.includes(a.id)
      })),
      skills: SKILL_TREE.map(s => ({
        ...s,
        unlocked: unlockedSkills.includes(s.id)
      }))
    };
  }

  // Grant XP to the player
  static grantXP(amount, reason = '') {
    const progress = Storage.getProgress();
    progress.xp = (progress.xp || 0) + amount;
    Storage.set('progress', progress);

    this.checkAchievements();
    
    return {
      amount,
      reason,
      state: this.getPlayerState()
    };
  }

  // Unlock a node in the skill tree
  static unlockSkill(skillId) {
    const progress = Storage.getProgress();
    const state = this.getPlayerState();
    const skill = SKILL_TREE.find(s => s.id === skillId);

    if (!skill || skill.levelRequired > state.level) return false;
    
    const unlocked = progress.unlockedSkills || ['foundations'];
    if (!unlocked.includes(skillId)) {
      unlocked.push(skillId);
      progress.unlockedSkills = unlocked;
      Storage.set('progress', progress);
      return true;
    }
    return false;
  }

  // Check and unlock achievements dynamically
  static checkAchievements() {
    const progress = Storage.getProgress();
    const unlocked = progress.unlockedAchievements || [];
    const newUnlocks = [];

    // Rule 1: first solve
    if (progress.puzzlesSolved > 0 && !unlocked.includes('first_solve')) {
      newUnlocks.push('first_solve');
    }

    // Rule 2: streak 3
    if (progress.streak >= 3 && !unlocked.includes('streak_3')) {
      newUnlocks.push('streak_3');
    }

    // Rule 3: lesson 10
    if (progress.completedLessons.length >= 10 && !unlocked.includes('lesson_10')) {
      newUnlocks.push('lesson_10');
    }

    // Rule 4: grandmaster rating
    if (progress.puzzleRating >= 1800 && !unlocked.includes('grandmaster_mind')) {
      newUnlocks.push('grandmaster_mind');
    }

    if (newUnlocks.length > 0) {
      progress.unlockedAchievements = [...unlocked, ...newUnlocks];
      Storage.set('progress', progress);
      
      // Grant bonus XP for achievements!
      progress.xp = (progress.xp || 0) + (newUnlocks.length * 100);
      Storage.set('progress', progress);
    }

    return newUnlocks;
  }
}
export default Gamification;
