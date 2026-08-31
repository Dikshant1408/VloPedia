export interface Guide {
  slug: string;
  title: string;
  category: "Beginner" | "Economy" | "Map" | "Aim & Settings";
  readTime: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
}

export const guidesDb: Guide[] = [
  {
    slug: "valorant-beginners-guide",
    title: "VALORANT Beginners Guide: Core Mechanics & Strategies",
    category: "Beginner",
    readTime: "6 min read",
    summary: "Master the fundamental rules, shooting mechanics, and agent roles to start winning competitive matches.",
    author: "ValoVault Editorial",
    publishedAt: "August 2026",
    content: `Welcome to VALORANT, a high-stakes, 5v5 tactical hero shooter where precise gunplay meets creative agent abilities. If you are transitioning from traditional shooters or are completely new to the genre, this guide will walk you through the essential mechanics and strategies needed to build a strong foundation.

### 1. The Core Shooting Rule: Stand Still
The single most important mechanic to learn in VALORANT is that **movement accuracy penalty is extremely high**. If you are walking, running, or jumping while firing, your bullets will fly wild. 
*   **Counter-Strafing:** To shoot accurately, you must come to a complete stop. Master the art of moving left (A key), releasing it, and tapping right (D key) briefly to halt your momentum instantly before pulling the trigger.
*   **Crosshair Placement:** Never look at the ground. Always keep your crosshair positioned at head height relative to where an enemy is likely to appear. Slicing corners at head level drastically reduces the adjustment time needed to score a headshot.

### 2. Understanding Agent Roles
VALORANT features a diverse roster of agents, grouped into four distinct roles:
1.  **Duelists (e.g., Jett, Reyna, Raze):** These agents are the spearhead of the team. Their utility is designed for self-sufficiency and entry-fragging, allowing them to create space and secure initial kills.
2.  **Controllers (e.g., Omen, Brimstone, Viper):** Controllers block enemy sightlines and cover choke points with smokes. They are responsible for dictating the flow of the round and securing site entrances.
3.  **Initiators (e.g., Sova, Fade, Breach):** Initiators use their utility to gather intelligence, flush out hidden defenders, and facilitate site executes. They set up their Duelists for success.
4.  **Sentinels (e.g., Killjoy, Cypher, Deadlock):** Sentinels are defensive anchors. They excel at locking down bombsites, trapping flanks, and stalling enemy rushes with utility.

### 3. The Structure of a Round
Each match consists of up to 25 rounds, with the first team to win 13 rounds securing the victory. Halfway through (after 12 rounds), teams swap sides.
*   **Buy Phase (45s):** Purchase weapons, shields, and abilities using credits earned from the previous round. Coordinate with your team to maintain a balanced budget.
*   **Active Phase (100s):** Attackers attempt to plant the Spike at designated bombsites, while Defenders attempt to prevent the plant or defuse the Spike if it is successfully active.
*   **Post-Plant:** Once the Spike is active, the game changes. Attackers must play defensively to guard the Spike (which takes 45 seconds to detonate), while Defenders must retake the site and defuse it (takes 7 seconds, or can be halved to 3.5 seconds).

### 4. Basic Tactical Tips
*   **Communicate Constantly:** Use voice chat or ping systems to report enemy locations, abilities spotted, and coordinate plans.
*   **Listen to Audio Queues:** Sound is a primary source of information in VALORANT. Running, jumping, and reloading make distinct sounds that reveal your location. Walk (Shift key) to move silently when searching for or hiding from enemies.
*   **Manage Your Economy:** Do not buy weapons randomly. Coordinate with your team so everyone buys together ("Full Buy") or saves together ("Eco").`
  },
  {
    slug: "economy-management-mastery",
    title: "VALORANT Economy: Mastering Credits to Win Rounds",
    category: "Economy",
    readTime: "7 min read",
    summary: "Learn how to coordinate team buying, manage loss bonuses, and maximize weapon efficiency to maintain tactical advantage.",
    author: "ValoVault Stats",
    publishedAt: "August 2026",
    content: `In VALORANT, gunplay is only half the battle. Managing your team's economy—the distribution of credits used to purchase weapons, shields, and abilities—is critical to securing victories. Understanding when to buy, when to save, and how credits are earned will prevent your team from being locked out of competitive loadouts.

### 1. The Credit Income System
To manage your budget, you must first know how credits enter your wallet:
*   **Round Win:** +3,000 credits.
*   **Round Loss (Base):** +1,900 credits.
*   **Loss Streak Bonus:** To prevent runaway games, losing consecutive rounds increases your income:
    *   2 consecutive losses: +2,400 credits.
    *   3+ consecutive losses: +2,900 credits.
*   **Kills:** +200 credits per kill.
*   **Spike Plant (Attackers):** +300 credits to the player who plants, plus +300 credits to **every team member** if the Spike is planted (even if the round is lost). Always prioritize planting the Spike!

The maximum amount of credits you can carry is **9,000 credits**. Any additional credits earned are lost.

### 2. Standard Buy Scenarios
Your team should always coordinate purchases so that your firepower is matched. Buying high-tier weapons while your teammates are on cheap pistols is a recipe for disaster.
1.  **Pistol Round (Rounds 1 & 13):** Every player starts with 800 credits. Standard purchases include a Ghost (500) and minor utility, or light shields (400) and a Classic.
2.  **Full Buy:** Buying a premium rifle (Vandal or Phantom at 2,900 credits), Heavy Shield (1,000 credits), and full abilities. This loadout costs approximately 3,900 to 4,500 credits.
3.  **Eco / Save Round:** When your team has low credits (under 2,000 each) and cannot afford a Full Buy. Players should buy nothing or spend minimally (e.g., a Sheriff or Shorty) to ensure they have enough credits for a Full Buy in the *next* round. Aim to keep your "Next Round Minimum Credits" above 3,900.
4.  **Half Buy / Force Buy:** Used when the team is slightly short of a Full Buy but wants to maintain pressure or match the opponent. Players buy SMGs (Spectre/Stinger) or light rifles (Bulldog/Guardian) with light shields.
5.  **Bonus Round:** If you win the pistol round, you will typically buy SMGs or heavy weapons to secure the second round. In the third round, the opponents will have their first Full Buy. The winning team "bonuses"—playing with the weapons saved from round 2 instead of buying new ones. Winning this round is a massive bonus, but even losing it is acceptable as you transition into your own Full Buy.

### 3. Key Economic Strategies
*   **Press Tab to Inspect:** At the start of the buy phase, check the scoreboard. It displays the exact credit amount and the "minimum next round" value for both your team and your opponents.
*   **Buy for Teammates:** If you have excess credits (above 5,000) and a teammate is short, purchase a weapon for them. This keeps the team budget balanced.
*   **Save Weapons (Save/Exit):** If a round is clearly unwinnable (e.g., 1v4 post-plant), run away and save your rifle. Denying the enemy your weapon and keeping a 2,900-credit rifle for the next round is a smart economic play.`
  },
  {
    slug: "ascent-map-tactical-guide",
    title: "Ascent Map Guide: Tactical Strategies & Callouts",
    category: "Map",
    readTime: "8 min read",
    summary: "Understand the tactical layout of Ascent, including mid control protocols, site executions, and defensive setups.",
    author: "ValoVault Strategy",
    publishedAt: "August 2026",
    content: `Ascent is a classic, two-site VALORANT map characterized by a wide, open middle courtyard and interactive doors that can be opened or closed using wall switches. It is highly tactical, requiring coordinated utility usage to secure ground.

### 1. Map Layout & Key Areas
*   **Mid Courtyard:** The central playground of Ascent. Controlling Mid provides attackers with direct paths to B Market (leading to B Site) and A Link (leading to A Site).
*   **A Site (Garden & Heaven):** A site featuring a closing door at A Tree. Heaven provides defenders with a powerful high-ground angle.
*   **B Site (Main, Market, & Lane):** A site with a closing door at B Market. It features a deep entrance chokepoint through B Main and a high lane bordering the site.

### 2. Attack Execution Guide
#### Controlling Mid (The Priority)
Attacking Ascent successfully starts with securing Mid. Without Mid control, attackers are forced through the narrow choke points of B Main and A Main, which are easily stalled by defender utility.
*   **A-Split:** Send two players through A Main and three players through Mid to A Link/Tree. Use smokes to block Mid Cubby and A Heaven. Coordinate the push to pinch defenders on the A site.
*   **B-Split:** Smoke Mid Pizza and B Market. Push through Mid Courtyard into Market while teammates push B Main. Trigger the B Market door switch to lock off rotations.

#### A Site Execute
Smoke A Heaven and A Tree. Use flashes or reconnaissance utility (like Sova's Recon Bolt) to clear under Heaven and behind the green boxes. Run onto site and flip the switch in Garden to close the A Tree door, cutting off direct rotations.

### 3. Defensive Layout & Setup
*   **Mid Retaining Wall:** A defender should hold Mid Courtyard from Mid Market or catwalk, utilizing jump peeks or utility (like Sage walls or Killjoy turrets) to spot early pushes.
*   **Holding A Site:** Play active from Heaven or behind generator. Keep the A Main entrance smoked. If attackers flood A Main, fall back to Garden or Heaven and use the door switch to delay them.
*   **Holding B Site:** A Sentinel (like Killjoy or Cypher) is excellent here. Place traps in B Main to slow rushes. Use B Lane or B Backsite as anchor positions.

### 4. Ideal Agent Compositions
*   **Sova (Initiator):** Sova is incredibly strong on Ascent due to the thin, penetrable walls (paper-thin walls in B Main and A Link). His Recon Bolt can reveal entire sites.
*   **Killjoy (Sentinel):** Her Lockdown ultimate covers almost the entire B Site when placed in B Main, forcing defenders off site during attacks.`
  },
  {
    slug: "aim-training-guide",
    title: "Aim Training & Sensitivity Optimization Guide",
    category: "Aim & Settings",
    readTime: "5 min read",
    summary: "Perfect your mouse sensitivity, master crosshair placement, and implement a consistent warm-up routine to click heads like a pro.",
    author: "ValoVault Coach",
    publishedAt: "August 2026",
    content: `In tactical shooters, precision is paramount. A single millisecond or pixel can decide the outcome of a duel. To climb the competitive ranks in VALORANT, you must optimize your physical settings, master crosshair habits, and practice aim mechanics consistently.

### 1. Finding Your Optimal Sensitivity (eDPI)
Many players make the mistake of playing with a sensitivity that is far too high, making micro-adjustments difficult.
*   **eDPI (Effective Dots Per Inch):** Calculated as your mouse DPI multiplied by your in-game sensitivity.
    *   *Formula:* \`DPI * In-Game Sens = eDPI\`
    *   *Example:* 800 DPI * 0.35 In-Game Sens = 280 eDPI.
*   **The Recommended Range:** Most professional VALORANT players keep their eDPI between **200 and 400**. This low sensitivity forces you to use your arm for large turning motions and your wrist for precise micro-adjustments.
*   **Mouse Acceleration:** Ensure that "Enhance Pointer Precision" is turned off in your Windows settings to keep your physical mouse movements consistent with your in-game reticle.

### 2. Perfecting Crosshair Placement
Raw aiming speed is secondary to intelligent crosshair placement. If your crosshair is already on the enemy's head when they walk around a corner, you don't need to flick.
*   **Visual Guides:** Use the map environment to calibrate your height. Lines on walls, box tops, and doorways are often set at head height.
*   **Slicing the Pie:** When clearing an angle, step out incrementally, checking one narrow segment of the corner at a time. Do not expose yourself to multiple angles simultaneously.

### 3. Daily Warm-up & Training Routine
Spend 15–20 minutes warming up before jumping into competitive matchmaking.
1.  **The Range (Shooting Test):**
    *   *Practice Bots:* Set bots to spawn. Practice counter-strafing back and forth, stopping to headshot a bot, and repeating.
    *   *Flick Test:* Set bot speed to "Medium". Stand in the center and flick to targets as they spawn. Focus on accuracy over speed.
2.  **Deathmatch (1-2 rounds):**
    *   Do not play to win. Turn off your in-game sound and focus entirely on visual tracking, clean crosshair placement, and taking fights without panicked spraying.
3.  **Aim Trainers (Optional):**
    *   Use software like Aim Labs or Kovaak's. Focus on scenarios targeting tracking (following moving targets) and static clicking (clicking stationary circles).

### 4. Recoil Control & Bursting
*   **Tapping (Long Range):** Tap 1–2 bullets and reset. This keeps accuracy at 100%.
*   **Bursting (Medium Range):** Fire 3–5 bullets while pulling down slightly on your mouse to compensate for the vertical recoil climb.
*   **Spraying (Short Range):** If you must spray, remember that after the first 5 bullets, the recoil goes random horizontally. Look at the tracer lines and pull the crosshair in the opposite direction of the bullet sparks.`
  }
];
