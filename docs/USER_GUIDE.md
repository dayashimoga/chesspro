# User Guide — ChessOS Pro

Welcome to the ChessOS Pro user handbook! This manual walks you through the core workflows of each platform user role.

---

## 1. Student Workflows

### 1.1 Solving Guided Puzzles
1. Click **Tactical Solver** in the sidebar.
2. Select a puzzle theme from the dropdown menu (e.g. Forks, Pins).
3. The **Guided solver panel** will activate:
   - **Step 1:** Compare king safeties. Click White, Black, or Equal.
   - **Step 2:** Select the matching tactical motifs.
   - **Step 3:** Type the coordinate square of the overloaded defender (e.g., `f6`) or `None`.
   - **Step 4:** Play up to 3 candidate moves on the board.
   - **Step 5-6:** Play the forced calculation lines and defend against the opponent's responses.
   - **Step 7:** Awarded XP popup appears, and the **Variation tree** opens to let you explore side-lines.

### 1.2 Training labs
- **Calculation Trainer:** Click **Calculation Lab**. Click "Start Exercise". Memorize the board layout before pieces fade, and calculate the ply moves.
- **Blindfold Trainer:** Click **Blindfold Lab**. Review the text moves log and enter your candidate move in the text box.

---

## 2. Coach Workflows
- **Review Progress:** Open the analytics dash to see student accuracy lists.
- **Review Weaknesses:** Check which specific motifs (e.g., back-rank mates or overloaded pieces) a student struggles with.

---

## 3. Administrator Workflows
- **Bot Configuration:** Adjust difficulty levels and openings portfolios for historical master sparring bots.
- **Backups:** Generate daily D1 snapshots via wrangler CLI commands.
