import * as fs from 'fs';
import * as path from 'path';

// Import from the TypeScript files directly
import { ALL_COURSES } from '../frontend/src/content/index';
import { ALL_PUZZLES, PUZZLE_CATEGORIES } from '../frontend/src/content/puzzle-db';
import { ALL_MASTER_GAMES, MASTER_GAME_PLAYERS } from '../frontend/src/content/master-games-db';

// Absolute paths based on this script's location
// We expect this script to run from the root `h:/chessmastery` using npx tsx scripts/export_mobile_data.ts
// Or in Docker using: docker run --rm -v "h:/chessmastery:/app" -w /app node:22-alpine npx tsx scripts/export_mobile_data.ts
const OUT_DIR = path.resolve(process.cwd(), 'android/assets');

function writeJson(filename: string, data: any) {
  const fullPath = path.join(OUT_DIR, filename);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ${fullPath}`);
}

async function exportData() {
  try {
    console.log("Starting Mobile Data Export...");
    
    console.log("Exporting courses...");
    writeJson('university/courses.json', ALL_COURSES);

    console.log("Exporting puzzles...");
    writeJson('puzzles/puzzles.json', ALL_PUZZLES);
    writeJson('puzzles/categories.json', PUZZLE_CATEGORIES);

    console.log("Exporting master games...");
    writeJson('games/master_games.json', ALL_MASTER_GAMES);
    writeJson('games/players.json', MASTER_GAME_PLAYERS);

    console.log("Export complete!");
  } catch (error) {
    console.error("Failed to export data:", error);
    process.exit(1);
  }
}

exportData();
