import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidesPath = path.join(__dirname, "../src/data/guides-database.json");
const guides = JSON.parse(fs.readFileSync(guidesPath, "utf-8"));

const enrichedPart2 = {
  "best-crosshair-settings": `In tactical first-person shooters, your crosshair is your primary physical connection to the game world. An oversized, distracting, or dynamically wobbling reticle obscures enemy heads at distance, clutters your screen during spray transfers, and introduces unnecessary cognitive delay when trying to line up precision headshots. In VALORANT, where the time-to-kill is under 200 milliseconds and a single rifle headshot is instantly lethal, optimizing your reticle for visual clarity is one of the quickest mechanical upgrades you can make.

### Core Crosshair Principles for Competitive Play
Before testing specific pro player configurations, every competitive player should internalize four essential rules:
* **Disable Movement & Firing Error:** Always toggle Movement Error and Firing Error to **OFF** on your primary aiming reticle. Dynamic crosshairs bloom and expand wildly while moving or spraying. While helpful during your first 2 hours of learning gun inaccuracy, in ranked play this visual expansion merely creates distraction and delays your counter-strafe timing.
* **Color Psychology & Environmental Contrast:** Your crosshair must never blend into background geometry. 
  * **Cyan / Sky Blue (#00FFFF):** Universally regarded as the best color for VALORANT. Cyan provides extreme contrast against the terracotta brickwork of Bind, the sandy stone of Ascent, the warm orange tones of Sunset, and the lush green flora of Lotus.
  * **Green / Lime (#00FF00):** Exceptional against dark corridors and night-time lighting (such as Pearl or Split).
  * **White (#FFFFFF) with 1px Black Outlines:** The absolute cleanest aesthetic. The black outline guarantees visibility against bright skyboxes (like Icebox or Breeze snow) and dark corners alike.
  * **Avoid Red (#FF0000):** Red crosshairs blend directly into enemy outline shaders and disappear against the brick surfaces of Ascent and Bind.
* **The Center Dot Trade-Off:** Center dots are exceptional for clean pistol rounds and Guardian/Sheriff tapping because they focus your optical attention on a single pixel. However, at extreme ranges (45+ meters on Breeze or Icebox), a center dot larger than 2 pixels can physically cover the enemy player's head, making micro-adjustments difficult.

### Top VCT Champions Crosshair Profiles & Codes

#### 1. TenZ (The Universal Competitive Standard — Cyan 1-4-2-2)
* **Import Code:** \`0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0;S;c;4;o;1\`
* **Configuration:** Primary Color: Cyan | Outlines: Off | Center Dot: Off | Inner Lines: 1 / 4 / 2 / 2.
* **Tactical Breakdown:** This is the most popular crosshair in competitive history. The 2-pixel center gap creates a neat "window" that perfectly frames an enemy head between 15 and 30 meters, while the thin 1-pixel line thickness ensures zero visual obstruction.

#### 2. Demon1 (VCT Champions MVP — Minimalist White Dot)
* **Import Code:** \`0;s;1;P;o;1;d;1;m;1;0b;0;1b;0\`
* **Configuration:** Primary Color: White | Outlines: On (Opacity 1, Thickness 1) | Center Dot: On (Size 2) | Inner Lines: Off.
* **Tactical Breakdown:** Demon1 utilized this exact pixel dot during his historic 2023 Champions run. It eliminates all peripheral lines, forcing your brain to place the exact center point directly on the enemy's nose. Ideal for high-discipline tap-shooters and Vandal purists.

#### 3. Aspas (Lethal Duelist Plus-Sign — 1-4-2-0 Green)
* **Import Code:** \`0;P;c;1;h;0;0l;4;0o;0;0a;1;0f;0;1b;0\`
* **Configuration:** Primary Color: Green | Outlines: Off | Center Dot: Off | Inner Lines: 1 / 4 / 2 / 0 (Zero Center Gap).
* **Tactical Breakdown:** With zero center gap, Aspas's crosshair forms a tight, solid cross. It is outstanding for rapid tracking aim, high-speed flicking, and aggressive Jett/Raze entry entries where you need to track moving targets during air movement.

#### 4. Boaster (Fnatic IGL Clean Box — 1-2-1-3 Green)
* **Import Code:** \`0;s;1;P;c;1;o;1;d;0;0b;0;1b;1;1t;1;1l;2;1v;2;1g;1;1o;1;1a;1;1m;0;1f;0\`
* **Configuration:** Compact hollow box with subtle outlines.
* **Tactical Breakdown:** Hollow box crosshairs allow you to place the enemy's head inside the box like a viewfinder. Many players find this reduces eye fatigue over long multi-game tournament days.

### Step-by-Step In-Game Calibration Routine
1. Load into **The Range** and approach the shooting range control panel.
2. Set bots to **Practice Mode** and walk backward to the 30-meter line marker on the floor.
3. Aim your reticle at a bot's head. If the inner lines extend beyond the bot's ears, your **Inner Line Length** is too high—reduce it to 3 or 4.
4. If your crosshair completely obscures the bot's facial features, increase your **Inner Line Offset** to 2 or 3 to open up a central visual window.
5. Practice 50 elimination bots focusing on smooth micro-adjustments before jumping into ranked.`,

  "how-to-rank-up-from-gold": `Gold is universally recognized as the most punishing and congested rank bracket in VALORANT. Players in Gold frequently possess decent raw mechanical flick aim, but find themselves trapped in a perpetual 50% win-rate loop. The reason is simple: Gold players treat VALORANT like an aim-trainer deathmatch rather than an asymmetric tactical game of probabilities, positioning, and round management. To break through into Platinum, Diamond, and Ascendant, you must systematically eliminate four fundamental leaks in your game.

### Leak 1: The "Auto-Crouch Spray" Addiction
In Gold lobbies, nearly 90% of players have an ingrained muscle-memory reflex: the split second they see an enemy on their screen, their pinky finger immediately slams the **Left Ctrl (Crouch)** key and they commit to a 20-bullet spray.
* **Why This Keeps You Hardstuck:** 
  1. Once you crouch, your horizontal movement drops to zero. You are a completely stationary target with zero evasion.
  2. Gold players naturally have sub-optimal crosshair placement—they frequently aim at upper-chest or neck level. When you crouch, you pull your own head directly down into their inaccurate spray!
  3. You eliminate your ability to counter-strafe or reset into cover if your first two bullets miss.
* **The Cure:** Unbind your Crouch key completely in your game settings for 5 Deathmatch games. Force yourself to shoot 2-round bursts with the Vandal, take a horizontal step, and shoot another 2-round burst. This single mechanical adjustment will instantly win you 30% more duels.

### Leak 2: Autopilot Crosshair Placement & Corner Slicing
Gold players often believe their aim is good because they can hit flashy flicks in Aim Lab. However, flicking is merely an emergency compensation mechanism for bad crosshair placement:
* **The "Hugging The Wall" Trap:** When approaching a corner, amateur players glue their reticle to the edge of the wall. When an enemy swings out, the enemy is already 2 feet past your crosshair before your optical nerve can signal your finger to click.
* **The Pro Angle:** Hold your crosshair **one to two model-widths away from the corner** at exact head height. Give yourself buffer space to account for human reaction latency (roughly 180–220ms). When an enemy wide-swings, they will walk directly into your pre-aimed crosshair.

### Leak 3: Dying With 800+ Credits of Unused Utility
Inspect the end-of-round scoreboard in any Gold match, and you will notice players dying with full abilities:
* Initiators dying with both recon darts and flashes in their inventory.
* Controllers holding onto smokes while their teammates get picked on site entries.
* **The Rule of Proactive Utility:** If you are playing an agent like Fade, Sova, Skye, or Omen, your job is to contest space in the first 15 seconds of the round. Use your utility early to gather information or deny enemy pushes. If an ability burns an enemy flash or reveals their absence, it has achieved full tactical value. Dying with unused utility is equivalent to burning credits in spawn.

### Leak 4: Playing the Post-Plant Backwards
Once the Spike is planted on attack, the strategic objective of the round completely flips. You are no longer attackers—you are now defenders protecting a 45-second bomb timer.
* **The Gold Mistake:** The moment the Spike is planted, Gold players get hungry for kills. They push into enemy spawn, hunt eco frags, and die in isolated 1v1 engagements, turning an easy 4v2 into a lost 1v2.
* **The Radiant Protocol:** Fall back into crossfires. Pair up with a teammate so that whenever an enemy attempts to defuse, they are forced to expose their back to one of you. Play off the defuse sound cue: the first tap requires 3.5 seconds for half and 7.0 seconds for full defuse. Let the clock do the work.

### 5. The Warm-Up Routine That Actually Works
Never launch straight into a ranked game cold:
1. **The Range (5 minutes):** 50 Practice bots with Sheriff focusing on smooth, deliberate headshots (no panic clicking).
2. **Deathmatch (10 minutes):** Play one Deathmatch with sound muted. Playing without audio forces you to rely 100% on visual crosshair placement and predictive pre-aiming rather than sound-whoring footsteps.
3. **Queue Ranked:** Limit yourself to maximum 3 to 4 competitive games per session to maintain peak mental focus.`,

  "how-to-play-abyss-map-guide": `Abyss represents a historic evolution in VALORANT map design as the game's first competitive arena completely stripped of boundary safety barriers.botched satchel jumps, errant knockbacks, and careless backpedaling result in instant death from falling into the dark void below. Beyond its lethal drop hazards, Abyss features multi-layered vertical routing, destructible wooden trapdoors, and long-range sniper sightlines that reward deliberate map control.

### 1. Understanding Environmental Hazards & Jump Mechanics
The defining feature of Abyss is that the void is an active combat element:
* **The A Site Void Bridge:** Spanning across the center of A Site is an open wooden bridge flanked on both sides by open air. Knockback abilities—such as Raze Blast Packs, Astra Gravity Wells, and Breach Rolling Thunder ultimates—will physically throw players into the void for instant un-revivable kills.
* **The High-Risk A Main Jump Shortcut:** Attackers pushing A Main can air-strafe across the open void directly onto the site bridge. This cuts rotation time by 4 seconds and bypasses common defensive choke angles, but requires precise jump timing.
* **Fall Damage & Footstep Audio:** Several elevated drops (such as dropping from A Tower or B Nest) deal up to 30 fall damage unless cushioned by abilities or caught on intermediate ledges.

### 2. S-Tier Agent Composition on Abyss

#### A. Astra / Omen (Controllers)
Due to Abyss's colossal footprint and long rotation distances, Controllers with limited range (like Brimstone) struggle severely. Astra and Omen reign supreme:
* Astra can place stars globally across both sites and Mid from anywhere on the map. Her **Gravity Well** placed near the void bridge pulls enemies off the edge to their deaths.
* Omen's 30-second regenerating Dark Cover smokes provide continuous vision denial down the massive B Danger and A Main corridors.

#### B. Sova (Initiator)
Abyss possesses completely open skyboxes with zero invisible ceiling barriers. Sova can launch high-trajectory Recon Bolts from Defender Spawn that land cleanly on A Main or B Lobby, scanning enemy execute pathways before attackers even cross the choke.

#### C. Jett (Duelist)
With unpredictable verticality and narrow void pathways, Jett's **Tailwind** dash and **Updraft** glide mechanics make her the safest Duelist on the map. If she misjudges an edge or gets forced into a void drop, she can hover and dash back onto solid geometry.

#### D. Cypher (Sentinel)
Cypher's Trapwires are lethal on Abyss because corridors flanking the void offer attackers zero horizontal room to maneuver around them. An enemy caught in an ankle-height wire along the narrow B Danger walkway is a stationary, helpless target.

### 3. Step-by-Step Strategic Playbook

#### Attacking A Site
* Never 5-man rush through A Main. Default with 1 player pressuring Mid Catwalk, 1 holding A Danger, and 3 preparing the A Main execute.
* Smoke off **A Tower (Heaven)** and **A Link**.
* Clear the backsite pillars with Sova Shock Darts or molotovs before crossing the void bridge.
* Plant the Spike behind the solid stone center monument to shield the planter from A Tower sniper fire.

#### Defending B Site
* B Site is an anchor's dream. Position a Sentinel (Cypher or Killjoy) on B Site with utility covering B Danger and B Main.
* Have your second defender play from elevated **B Nest** with an Outlaw or Operator. B Nest gives you a direct downward sightline into B Main while shielding your lower body with hard stone cover.
* If attackers overwhelm the choke, immediately concede site and play for retake through B Tower with coordinated flashes.`,

  "how-to-master-clove-controller": `Introduced in Episode 8, Clove disrupted the Controller meta by directly fixing the single biggest psychological hurdle in competitive ranked: the fear of dying early as a smoke player. Traditional controllers like Brimstone or Viper must play passively behind their team because their death eliminates all smokes for the remainder of the round. Clove reverses this dynamic, empowering players with duelist-tier survivability, aggressive self-buffs, and the revolutionary ability to deploy tactical smokes from beyond the grave.

### 1. Ability Breakdown & Hidden Mechanics

#### Ruse (Tactical Smokes)
* **Mechanic:** Press your smoke key to open a tactical overhead circular map. Clove can deploy up to two dense smokes with a 30-second recharge timer.
* **The Post-Mortem Superpower:** The true power of Ruse is that **it can be cast after you die**. If you die on bombsite entry or in an early defense trade, your ghost retains access to your smoke map within a circular radius of your death location.
* **Critical Positioning Rule:** Because your post-mortem smoke range is anchored to your corpse, **never die deep in your own spawn**. Always push forward to contest chokepoints or site perimeters so your death location covers both bombsites and key retake routes.

#### Pick-Me-Up (Overheal & Combat Haste)
* **Mechanic:** Damaging or killing an opponent activates a prompt to immediately absorb their vitality.
* **Combat Effect:** Grants up to **100 temporary health** (overhealing up to a hard cap of 150 HP, functionally restoring full heavy shields) and a **15% movement speed boost** for 10 seconds.
* **Strategic Usage:** Use Pick-Me-Up immediately after winning an opening 1v1 duel to aggressively swing the second enemy player before they can trade you. The temporary speed boost also breaks enemy crosshair tracking during re-peeks.

#### Meddle (Decay Orb)
* **Mechanic:** Throw an entropic mineral fragment that detonates after a brief windup, applying a devastating **90 HP decay debuff** to all players caught within the blast radius.
* **Lethal Combos:** Enemies afflicted with Meddle drop to 10 to 60 HP. A single bullet from a Ghost, Phantom, or Classic will kill them instantly. Pair Meddle with teammate utility (such as Raze Paint Shells, Sova Shock Darts, or a simple Phantom spray through smoke) to wipe out clustered enemy rushes.

#### Not Dead Yet (Ultimate — Self-Resurrection)
* **Mechanic:** Upon taking fatal damage, activate your ultimate within 2 seconds to resurrect on the spot in an invulnerable, intangible ethereal state.
* **The Survival Condition:** You have exactly **12 seconds** to secure an elimination or a damaging assist. If you fail to earn a kill/assist before the timer expires, you instantly perish.
* **When NOT to Resurrect:** Do not panic-activate Not Dead Yet if you died in an open crossfire surrounded by three enemies. They will simply surround your respawn marker, wait out your ethereal invulnerability, and eliminate you the moment you materialize. Only use it when you have hard cover nearby to fall back to.

### 2. Ranked Playstyle & Playbook
* **Attack Philosophy:** Play as the second player out of the choke behind your Duelist. Drop smokes on Heaven and Spawn, throw Meddle onto backsite default, and trade your entry fragger. If you die in the trade, you still drop post-mortem smokes for the Spike plant!
* **Defense Philosophy:** Play forward in high-impact choke areas (such as Split B Heaven or Ascent A Main). Fight aggressively for opening duels. If you score a pick, pop Pick-Me-Up and fall back. If you die, use your corpse to smoke off the choke for your rotating teammates.`,

  "vyse-sentinel-guide-setups": `Vyse entered the protocol as a formidable metallic Sentinel capable of bending liquid metal into indestructible barriers, blinding flash traps, and battlefield-wide weapon suppression. Unlike passive Sentinels who merely alert their team to flanks, Vyse actively isolates attacking players into unwinnable duels and strips enemies of their high-cost primary weapons.

### 1. Liquid Metal Utility Deep-Dive

#### Arc Rose (The Blind Trap)
* **Mechanic:** Target a wall surface to place a concealed metallic rose. You can target through solid walls to place it on the reverse side. Press activate to detonate a blinding flash.
* **The Stealth Factor:** Unlike Skye or Breach flashes that produce loud incoming projectile sounds, Arc Rose emits zero audio cue until the moment it detonates. Position Arc Rose on the back side of doorway arches (such as Ascent B Main or Bind Hookah) to pop-flash enemies the second they step onto site.

#### Shear (The Isolator Wall)
* **Mechanic:** Place a hidden metallic filament across floor chokepoints. When an enemy steps over it, an indestructible, bulletproof metal wall erupts from the floor behind them after a brief delay.
* **The "Divide and Conquer" Trap:** Shear does NOT block the first player—it allows the enemy entry fragger to cross, and then slams shut directly behind them! This physically cuts off the entry fragger from their support teammates, trapping them in an isolated 1v1 against you with zero possibility of being traded.

#### Razorvine (The Area Denial Thorns)
* **Mechanic:** Launch metal nest canisters that embed in the ground. Activating them deploys a wide nest of razor-sharp thorns that slow players and deal continuous laceration damage when moving through them.
* **Setup Synergy:** Stack Razorvine directly in front of your Shear trap. When the lead enemy gets trapped on your side of the wall, they are simultaneously slowed and damaged by Razorvine, turning them into a free elimination.

#### Steel Garden (Ultimate — Weapon Disarmament)
* **Mechanic:** Wind up a metallic bramble that erupts through the ground across an enormous 30-meter radius.
* **The Jamming Debuff:** Any enemy caught in the radius has their **primary weapon physically jammed for 8 full seconds**. They are forcefully swapped to their secondary sidearm or melee.
* **Winning Full-Buy Rounds:** In rounds where enemies hold Vandals, Phantoms, or Operators, casting Steel Garden forces them onto Classics and Ghosts. Your team can simply swing with full-auto rifles for an uncontested site retake or execute.

### 2. Map-Specific Defensive Setups
* **Ascent B Site:** Place Shear across the inner B Main entrance. Place Arc Rose on the Pillar facing B Choke. Hide Razorvine on the lane. The moment attackers rush, pop Arc Rose, trigger Razorvine, and watch Shear trap the first two attackers inside your kill zone.
* **Bind A Site:** Place Shear across the A Short teleporter exit. Position Arc Rose high on U-Hall. When enemies push out of Short, the wall isolates them while your U-Hall flash blinds their entire approach.`,

  "iso-duelist-guide-1v1-arena": `Iso is the ultimate tactical dueling specialist in VALORANT—an operative engineered to bypass the chaotic crossfires of 5v5 teamfights and force pure, mechanical aim duels. With energy shielding that absorbs lethal single-hit damage and a pocket dimension that drags opponents into isolated 1v1 arenas, mastering Iso requires fearless confidence in your first-shot headshot precision.

### 1. In-Depth Ability Breakdown

#### Double Tap (Energy Shield)
* **Mechanic:** Activate a focus timer. While active, securing a kill or damaging an enemy that subsequently dies spawns a floating energy orb above their corpse. Shooting this orb grants Iso an **indestructible energy shield**.
* **The Damage Negation Rule:** Iso's shield absorbs **any single instance of damage**, regardless of magnitude! A Vandal headshot (160 damage), an Operator chest shot (150 damage), or even a direct hit from a Raze Showstopper rocket launcher is reduced to exactly **0 damage**.
* **Dueling Value:** Entering an engagement with Double Tap active mathematically guarantees you a second chance. If both you and an enemy Vandal user click each other's heads at the exact same millisecond, you survive with 100% health while they die.

#### Contingency (Prismatic Bulletproof Wall)
* **Mechanic:** Push forward an indestructible, moving bulletproof energy barrier that travels along the floor in a straight trajectory.
* **Space Creation:** Contingency cannot be broken by bullets, Operator shots, or Odin spam. Use it to safely cross wide sniper alleys (like Breeze Mid, Ascent Mid Courtyard, or Icebox B Lane) or to push narrow chokepoints like Bind Hookah without exposing your body to defensive crossfires.

#### Undercut (Molecular Fragile Beam)
* **Mechanic:** Fire a molecular bolt through solid geometry and walls that applies the **Fragile** status debuff to all players in its path for 4 seconds.
* **Damage Multiplication:** Fragile doubles all incoming damage. An enemy afflicted with Fragile takes 80 damage from a single Vandal body shot and 150 damage from a Sheriff shot, allowing you to tear through full-armor defenders effortlessly.

#### Kill Contract (Ultimate — The Interdimensional Arena)
* **Mechanic:** Cast an expansive column of energy that pulls you and the first enemy hit into an interdimensional battle arena.
* **Arena Rules:** Inside the arena, all external abilities are locked. You spawn with two protective barricades, while the enemy spawns with one. A countdown timer begins immediately; if neither player dies before the timer expires, **both players are instantly eliminated**.
* **Target Priority:** Use Kill Contract to neutralize high-value enemy anchors. If the enemy team has an Operator Jett locking down A Site or a Killjoy defending B with full traps, hitting them with Kill Contract removes them from the round, giving your team a free bombsite execute.

### 2. Pro Competitive Tips for Iso
* Always shoot your Double Tap orb immediately after every kill, even if you must flick your mouse vertically. Preserving your shield is worth the 0.2-second pause.
* Combine Undercut with teammate damage utility. Tossing Undercut through Ascent B Main wall followed by a Sova Shock Dart deals 150+ lethal damage to anyone hiding in the corner.`,

  "outlaw-sniper-rifle-guide": `Introduced as VALORANT's first post-launch primary weapon, the $2,400 Outlaw disrupted the competitive round economy by fundamentally punishing the popular "Light Shields meta." Positioned squarely between the lightweight Marshal ($950) and the devastating Operator ($4,700), the Outlaw is a specialized break-action precision rifle designed to dismantle eco and half-buy rounds.

### 1. Detailed Ballistic Specifications

| Target Zone | Damage (All Ranges 0–50m) | Armor Impact Against Light Shields (125 HP) | Armor Impact Against Heavy Shields (150 HP) |
| :--- | :--- | :--- | :--- |
| **Headshot** | **238 Damage** | Lethal 1-Shot Kill | Lethal 1-Shot Kill |
| **Bodyshot** | **140 Damage** | **LETHAL 1-SHOT KILL (Instant Death!)** | Survives with 10 HP remaining |
| **Legshot** | **119 Damage** | Survives with 6 HP | Survives with 31 HP |

### 2. The Weapon's Strategic Superpower: 140 Body Damage
To understand the Outlaw's power, consider competitive purchasing patterns:
* In high-ELO and professional play, players frequently purchase **Light Shields ($250)** instead of Heavy Shields ($400) to save $150 per round, giving them a maximum health pool of **125 HP**.
* An Outlaw body shot deals **140 damage**. Against an enemy wearing Light Shields, **you do not need to aim for the head**. Simply placing your crosshair on their torso or shoulder yields an instantaneous one-hit kill!
* Furthermore, in rounds where enemies take even 10 damage from a stray bullet, fall damage, or chip utility (like a Brimstone stim burn or Viper decay), an Outlaw body shot kills full-armor opponents instantly.

### 3. The Dual-Barrel Cadence & Scope Mechanics
* **Semi-Automatic Firing:** Unlike the bolt-action Marshal or Operator, the Outlaw houses two chambers and can fire both rounds back-to-back at **2.75 rounds per second** without un-scoping. If your first shot hits an enemy for 140 and they survive with Heavy Shields, you can instantly double-tap the second round within 0.36 seconds to finish them off.
* **The Reload Trap (Crucial Mechanic!):** The Outlaw uses a break-action dual cartridge mechanism:
  * **Partial Reload (1 Bullet Fired):** Takes only **1.25 seconds**.
  * **Full Empty Reload (Both Bullets Fired):** Takes a massive **3.80 seconds**, leaving you completely defenseless for nearly four full seconds!
  * **The Pro Rule:** Always reload immediately after firing your first shot whenever you are in safe cover. Never empty both barrels unless you are in an emergency kill-or-be-killed situation.

### 4. Economic Situational Matrix
* **Buy the Outlaw on Round 2 (After Winning Pistol):** The enemy team will almost certainly buy Light Shields or zero armor. The Outlaw is a 100% guaranteed 1-shot body kill against every single player on the enemy team!
* **Buy on Defense Half-Buys ($3,000 Credits):** Pair the Outlaw with Light Shields. You can anchor long sightlines (Ascent Mid, Breeze A Long, Sunset B Alley) and delete enemy Duelists before they enter your bombsite.`,

  "valorant-movement-guide": `In tactical first-person shooters, movement and gun accuracy are inextricably linked. Many players spend hundreds of hours training their mouse aim in third-party software, yet struggle to climb past Silver or Gold because their keyboard mechanics are sloppy. In VALORANT, you cannot fire rifles accurately while your character model retains horizontal momentum. Mastering counter-strafing, dead-zoning, silent bunny hopping, and jiggle-peeking is the true mechanical foundation of high-rank gameplay.

### 1. Counter-Strafing: The Mechanical Truth
In VALORANT, firing a rifle while moving results in severe, randomized bullet bloom. To achieve 100% first-bullet laser accuracy, your movement speed must drop below **25% of maximum velocity**:
* **The Physics:** If you are strafing to the right by holding **D**, simply releasing the key allows your character model to coast to a natural stop over roughly 0.22 seconds.
* **The Counter-Strafe:** Instead of letting go of D and coasting, you release D and **instantly tap A (the opposite direction key)** once. This active counter-input immediately cancels your character's forward momentum, bringing your velocity to zero in under 0.08 seconds.
* **The Payoff:** Counter-strafing allows you to shoot with pinpoint accuracy **0.14 seconds faster** than an opponent who simply releases their key. In a duel where TTK is 0.18 seconds, that 0.14-second advantage is the difference between victory and defeat.

### 2. Dead-Zoning: Moving While Shooting Accurately
Dead-zoning is an advanced mechanical technique heavily utilized by Radiant Duelists:
* When you transition your movement from pressing **A** to pressing **D** (strafing left, then right), there is an exact micro-window of roughly **8 to 12 frames** where your character's physical velocity crosses through zero as momentum reverses.
* If you time your mouse click to occur during that exact reversal window, your rifle will fire with **100% first-shot accuracy**, even though to your enemy's perspective, your character never stopped moving!
* Mastering dead-zoning makes you an elusive, moving target while delivering laser-accurate headshots.

### 3. Peeking Techniques & Angles

#### The Jump-Peek (Zero-Risk Intel Gathering)
* Used to scout dangerous angles held by Operators (such as Ascent Mid, Breeze A Long, or Haven C Long).
* **Execution:** Sprint toward the corner, leap parallel to the wall, turn your mouse 90 degrees in mid-air to visually spot the angle, and air-strafe backward behind the wall before landing. You gather complete visual intel on enemy positioning while exposing your hitbox for less than 0.15 seconds.

#### The Shoulder-Peek (Baiting the Shot)
* Step out just enough to expose only your character's shoulder, and instantly counter-strafe back into cover.
* Your objective is not to shoot, but to trigger the enemy's reaction time and bait them into firing their Operator or Vandal bullet. Once you hear their shot cycle or whiff, you have a 1-second window to re-swing with crosshair advantage.

#### The Wide-Swing vs. Close Slice
* **Close Slice (Clearing Corners Pie by Pie):** Use when clearing close corners. Stay far back from the wall to maximize your visual angle and clear micro-positions step-by-step.
* **The Wide-Swing:** Use when you know an enemy is holding a tight, stationary angle with an Operator. Swing out 3 to 4 meters past their expected crosshair to completely displace their flick aim.`,

  "crosshair-placement-masterclass": `Over 75% of gunfights in competitive VALORANT are won or lost before either player ever clicks their mouse. Professional players do not consistently win duels because of godlike 180-degree flick reflexes—they win because their crosshair is already resting on the enemy's head before the enemy even appears on screen. Mastering crosshair placement is a spatial science that relies on environmental geometry, angle mathematics, and disciplined pre-aiming.

### 1. The Physics of Angles & Peeker's Advantage
To master crosshair placement, you must understand the geometric law of perspective in tactical shooters:
* **The Distance-From-Cover Law:** The closer you stand to an obstacle (like a corner or box), the earlier an opponent who is positioned farther back will see your shoulder, arm, and weapon barrel before your camera can even see their elbow!
* **The Strategic Application:** Whenever you are holding or slicing an angle, always back up as far as physically possible from the corner. This maximizes your field of view and ensures you spot the enemy at the exact moment—or earlier than—they spot you.

### 2. Environmental Reference Landmarks for Head Height
Every competitive map in VALORANT was designed by Riot Games using a standardized geometric grid. Player character models are exactly **1.8 meters tall**, and map environments are filled with subtle horizontal landmarks calibrated to exact head level:
* **Radenite Box Seams:** The horizontal dark metal band dividing the top and bottom halves of every green radenite crate is positioned at exact standing head height.
* **Wall Trim & Door Frames:** The horizontal wooden trims on Ascent, the tile lines on Split, and the metal panel seams on Bind are aligned to head level.
* **Paint Lines & Decals:** Many walls feature subtle stripe decals designed as visual guides for level geometry.
* **The Rule:** Train your eyes to identify these horizontal lines on every map. Your reticle should glide horizontally across these seams like a train on a track—never pointing toward the floor or scanning empty skies.

### 3. Compensating for Reaction Time: The Buffer Gap
The single most common mistake intermediate players make is gluing their crosshair directly to the edge of the corner they are holding:
* Human visual reaction time under tournament conditions is roughly **180 to 220 milliseconds**.
* If you hold your crosshair flush against the wall, an enemy swinging around the corner will already be 1 to 2 meters past your reticle by the time your brain processes the stimulus and clicks your mouse.
* **The Correct Alignment:** Position your crosshair **one to two model-widths away from the edge** of the wall. Let the enemy run directly into your pre-aimed bullet path. If you suspect the enemy will wide-swing, increase the gap to 3 model-widths.

### 4. Angle Slicing (The Pie Method)
When entering a bombsite, never swing blindly into open space:
* Move along a circular arc, slicing the corner into 5-degree increments.
* Clear each individual hiding cubby one by one: first Wine, then Generator, then Site, then Heaven.
* By clearing angles sequentially, you ensure that you are only ever exposed to one enemy line of sight at any given microsecond.`,

  "sunset-map-meta-compositions": `Sunset is a compact, urban Los Angeles-themed battleground characterized by narrow choke bottlenecks, a critically important central courtyard (Mid Tiles and Market), and dense bombsite layouts that favor aggressive Sentinel utility and explosive Initiator executes. Understanding the territorial tug-of-war for Mid Market is the absolute key to dominating Sunset in ranked and tournament play.

### 1. The Strategic Core: Why B Market Dictates the Map
On Sunset, the central area known as **B Market** is the strategic pivot of the entire match:
* If attackers control B Market, they cut off defender rotations between A and B, gain sightlines directly into Defender Spawn, and can pinch B Site from two completely separate choke angles simultaneously (B Main + Market).
* If defenders lock down B Market, attackers are suffocated into narrow, highly predictable 5-man funnel pushes down A Main or B Main, where Sentinel traps can slaughter them.

### 2. S-Tier Team Composition on Sunset

#### A. Cypher (Sentinel) — The Unshakable B Anchor
Cypher is arguably the most dominant agent on Sunset. His Trapwires placed across the entrance of B Main can be strung diagonally through the archway where attackers cannot destroy them without walking into your line of fire. Paired with a Spycam on B Site pillar and Cyber Cages on the choke, a skilled Cypher can solo-hold B Site against an entire 5-man rush.

#### B. Omen (Controller) — Versatile Vision Denial
Omen's 30-second regenerating Dark Cover smokes are vital for constantly smoking Mid Top, Market, and A Elbow. His **Paranoia** covers the entirety of A Main or B Main, blinding attackers through walls and setting up effortless team counter-swings.

#### C. Raze (Duelist) — Explosive Space Creation
Sunset's tight corridors and high walls make Raze significantly more impactful than Jett:
* **Paint Shells (Grenade):** Tossing a grenade into B Market, A Alley, or B Main forces enemies out of hiding corners or deals lethal 150+ damage in tight spaces.
* **Boom Bot:** Clears A Elbow and B Boba automatically, burning enemy defensive traps without risking teammate lives.

#### D. Fade / Sova (Initiators) — Roof Scanning Intel
Sunset's open roof architecture allows Fade to toss **Haunt** eyes onto high roof ledges overlooking Mid Courtyard, scanning the entire central map instantly. Her **Prowlers** are essential for clearing tight corners in A Main and Market.

#### E. Breach (Flex Initiator) — Concussive Site Clears
Breach's Fault Line daze spans the entire length of Sunset's linear chokepoints (A Main and B Main), concussing attackers, dropping their fire rate, and making site entries effortless.

### 3. Attacker Execute Protocols
* **Default Protocol:** Never 5-man rush on round start. Send 1 player to hold A Main, 2 players to contest Mid Tiles, and 2 players to pressure B Main.
* **Pinching B Site:** Once Mid control is secured with smokes on Mid Top, send your Initiator and Duelist through Market while your Sentinel and Controller push B Main. The defenders on B Site are caught in an inescapable crossfire.`,

  "lotus-3-site-execution-guide": `Lotus is an ancient omega-earth architectural temple featuring three distinct bombsites (A, B, and C), destructible wooden breakout walls, and two rotating mechanical stone doors. With rapid rotation pathways and expansive territorial boundaries, winning on Lotus requires high-tempo macro rotations and disciplined site retakes.

### 1. Core Mechanics: Rotating Doors & Breakable Walls
* **The Mechanical Rotating Doors (A Door & C Door):** Activating the stone door creates a distinctive, map-wide grinding sound that lasts for 8 seconds. You can shoot through the opening slit, toss utility (flashes, grenades), or use the door audio as a distraction to fake rotations across sites.
* **The Breakable Wood Wall (A Link to B Site):** The wooden wall separating A Link and B Site has 400 HP. Breaking it permanently opens a rapid transition corridor, enabling attackers to execute fast site splits between A and B.

### 2. S-Tier Lotus Composition & Roles
* **Omen (Controller):** Global smoke deployment and aggressive teleport angles on elevated site platforms.
* **Killjoy (Sentinel):** Her Lockdown ultimate placed inside C Hall covers all of C Site, forcing defenders out or guaranteeing free defuses.
* **Fade (Initiator):** Haunt thrown atop the central pillars of A Site and C Site reveals defenders behind cover.
* **Raze (Duelist):** Satchel mobility over the C Mound boxes and grenade clearing in A Tree.
* **Breach (Initiator):** Fault Line stuns down A Rubble and C Mound deny opening attacker pushes consistently.

### 3. Step-by-Step Execute Playbook
* **Attacking A Site:** The battle for **A Rubble** decides A Site control. Flood A Rubble with Breach stuns and Fade Prowlers. Smoke A Top (Heaven) and A Drop. Plant the Spike on the lower terrace and fall back to A Rubble for post-plant crossfires.
* **Attacking C Site:** C Site features a narrow bottleneck into C Mound. Smoke C Waterfall and C Hall. Flash behind the central stone pillar to clear anchors. Secure the plant in front of the central pillar for easy line of sight from C Mound.`,

  "clutch-decision-making-guide": `Clutching in VALORANT—stepping onto the battlefield as the last surviving member of your team facing a 1v2, 1v3, or 1v4 deficit—is the ultimate test of tactical poise, spatial reasoning, and mental discipline. Elite clutch players like Chronicle, Boaster, and crashies do not win clutches through reckless aggression; they win because they systematically dismantle multi-enemy advantages through psychology, clock management, and geometry.

### 1. The Fundamental Law of Clutching: The 1v1 Cascade
When you are in a 1v3 situation, you can **never** win if you fight all three opponents at the same time:
* Your primary objective is to use map geometry (corners, pillars, crates, smokes) to create physical line-of-sight barriers that isolate each opponent.
* **The Isolation Rule:** Position your body so that while you are dueling Player A, Players B and C are physically blocked by a wall or smoke and cannot shoot you. You are not fighting a 1v3; you are fighting **three consecutive 1v1 duels**.

### 2. The Psychology of the Spike Audio Tap
In post-plant clutch scenarios, the Spike audio cue is your greatest psychological weapon:
* **The First Tap:** Tapping the defuse key produces a loud, unmistakable chime that reverberates across the entire bombsite.
* **Manipulating Defenders:** Attackers hiding in post-plant corners will immediately experience panic when they hear the defuse tap. Their brain tells them: *"He is defusing, I must swing now!"*
* **The Tap-and-Hold:** Tap the Spike for 0.5 seconds to generate the sound cue, immediately release, step back into an off-angle, and pre-aim the corner. Nine times out of ten, an impatient attacker will sprint blindly around the corner directly into your crosshair.

### 3. The 45-Second Clock is Your Teammate (On Defense)
If you are an attacker holding the planted Spike against two retaking defenders:
* **Do Not Hunt:** The most common clutch mistake is peeking defenders in their spawn to pad your K/D ratio.
* Remember that the Spike takes **45 seconds** to detonate, while a defuse takes **7 full seconds** (or 3.5 seconds to reach the half-defuse checkpoint).
* Every second that ticks away increases defender panic and forces them to make rushed, sloppy pushes. Hide, play off sound, jiggle-peek only to disrupt defuse attempts, and let the bomb timer secure the round.

### 4. Economy Awareness in Clutches
* **Knowing When to Save:** If you are in a 1v4 scenario with 15 seconds remaining, 30 HP, no utility, and hold an expensive Vandal or Operator, **do not attempt the hero play**.
* Concede the round, walk into a safe corner, and save your weapon. Preserving a $2,900 rifle saves your team's economy and guarantees you can full-buy with your teammates on the next round.`,

  "valorant-weapon-tier-list-2026": `A comprehensive, analytical tier ranking of every primary and secondary firearm in the VALORANT competitive arsenal, calibrated against tournament meta statistics, damage dropoff matrices, cost efficiency, and kill-cadence in the 2026 meta.

### S-Tier (Meta-Defining Core Weapons)
* **Vandal ($2,900):** The definitive primary assault rifle. Delivers 160 headshot damage across all ranges (0–50m), guaranteeing instantaneous lethality against opponents wearing full heavy shields. Commands a ~70% competitive pick rate.
* **Phantom ($2,900):** The ultimate close-to-medium range and smoke-spraying rifle. Silenced with zero bullet tracers through smoke, higher fire rate (11 rds/s vs 9.75 rds/s), and faster recoil reset.
* **Operator ($4,700):** The round-defining sniper rifle. Delivers 150 body damage and 255 headshot damage, completely shutting down offensive lanes with single-shot stopping power.

### A-Tier (High-Efficiency Lethal Workhorses)
* **Outlaw ($2,400):** The devastating anti-eco sniper dealing 140 body damage with high-cadence semi-automatic follow-up shots. Instantly eliminates opponents wearing Light Shields.
* **Ghost ($500):** The premier pistol-round sidearm. Delivers 105 headshot damage, high mobile accuracy, and an integral silencer for stealth flank duels.
* **Sheriff ($800):** The pocket guardian hand-cannon. Capable of 159 headshot kills under 30 meters, turning eco rounds into dramatic upsets.
* **Odin ($3,200):** The king of wall-penetration and fire saturation. Overwhelms narrow chokepoints and tears through wallbang surfaces on Ascent, Sunset, and Haven.

### B-Tier (Situational & Tactical Purchases)
* **Spectre ($1,600):** Reliable close-range SMG for anti-eco rounds following pistol victories.
* **Bulldog ($2,050):** Economical rifle featuring a rapid 3-round burst ADS zoom mode that rivals the Vandal at medium range.
* **Guardian ($2,250):** Semi-automatic precision marksman rifle with high wall penetration and 195 headshot damage at any distance.
* **Judge ($1,850):** Full-auto combat shotgun built for holding corners and anchoring bombsites inside smokes.`,

  "best-vandal-skins-ranked": `With over a hundred Vandal weapon skins released across VALORANT's history, selecting the best skin is more than an aesthetic choice—it is a psychological and acoustic advantage. Professional competitors and Radiant players choose skins based on muzzle flash visibility, screen recoil perception, sound design clarity, and that intangible "aimbot" feel.

### The Hall of Fame: Top 5 Vandal Skins Ranked

#### 1. Kuronami Vandal (Exclusive Tier — 2,375 VP)
* **Acoustics & SFX:** Crisp, lightweight aquatic metallic sound effects with subtle water droplet audio cues on kill. The sound profile does not drown out in-game footstep audio during intense firefights.
* **Reload Animation:** Telekinetic ninja chain pull with water orb reconstitution.
* **Finisher:** Summons a torrential storm that traps the eliminated adversary inside a floating sphere of water.
* **Verdict:** Universally voted the cleanest Vandal skin in competitive play.

#### 2. Reaver Vandal (Premium Tier — 1,775 VP)
* **Acoustics & SFX:** Deep cathedral bell chimes that ring with increasing resonance on each successive elimination.
* **Reload Animation:** Telekinetic dark magic magazine extraction with dark soul mist.
* **Finisher:** Underworld shadowy tentacles erupt from the floor to drag the defeated enemy into the abyss.
* **Verdict:** The timeless classic that helped define VALORANT cosmetics. The heavy, deliberate audio promotes calm, disciplined trigger tapping.

#### 3. Prime Vandal (Premium Tier — 1,775 VP)
* **Acoustics & SFX:** High-frequency laser fire with iconic glowing mechanical cartridge ejection.
* **Reload Animation:** Sliding glowing power core inserted into the upper receiver.
* **Finisher:** Golden spectral wolf erupts from the defeated target.
* **Verdict:** Legendary for having the cleanest screen profile and zero distracting visual recoil during full-auto sprays.

#### 4. Araxys Vandal (Exclusive Tier — 2,175 VP)
* **Acoustics & SFX:** Deep alien metallic clatter with breathing kinetic scale panels.
* **Finisher:** Disintegrates the target in a beam of orbital energy.
* **Verdict:** Incredible tactile feedback that makes single-tap burst firing feel exceptionally satisfying.

#### 5. ChronoVoid Vandal (Exclusive Tier — 2,175 VP)
* **Acoustics & SFX:** Kinetic gyroscopic hum with floating spatial orbs.
* **Finisher:** Pulls the enemy into an ancient dimensional astrolabe.
* **Verdict:** Smooth, circular reload animation with crisp headshot audio confirmation.`,

  "corrode-rework-map-guide": `Patch 13.08 introduced the comprehensive competitive rework for Corrode, overhauling hazardous industrial acid pools, rebalancing bombsite geometry, widening narrow chokepoints, and optimizing sightlines for premier VCT tournament play.

### 1. Major Architectural Revisions in Patch 13.08
* **Acid Pit Hazard Grating:** Several exposed industrial chemical vats around A Site and Mid Link were covered with reinforced metal grating. This preserves vertical terrain variation while preventing frustrating accidental hazard deaths during combat.
* **B Long Corridor Expansion:** B Long's narrow corridor was widened by 1.8 meters. Previously, a single defensive smoke completely neutralized attacker entry; the expanded corridor now allows double-peeks and split utility pushes.
* **A Generator Box Adjustment:** The central generator box on A Site was lowered to standard crouch-jump height, making it accessible to all 25+ agents without requiring vertical mobility abilities like Jett Updraft or Raze Satchels.

### 2. Tactical Adaptations for the New Meta
* **Defensive Pacing:** Defenders can no longer rely on singular choke smokes to stall pushes. Play active crossfires between A Generator and A Rafters.
* **Mid Control Priority:** The widened Mid Link corridor makes early Initiator recon essential. Use Sova or Fade to clear Mid before rotating.`,

  "act-6-map-rating-system": `A comprehensive breakdown of how Riot Games' competitive map rotation system, community rating metrics, and active tournament pools operate in 2026.

### 1. The 7-Map Competitive Rotation Pool Architecture
Riot Games strictly limits the active competitive matchmaking and professional VCT pool to exactly **7 maps**:
* **The Pacing Rationale:** Maintaining a 7-map pool prevents strategic bloat, allows professional teams to develop deep playbook lineups, and ensures healthy pick-ban phases in best-of-three series.
* **The Rotation Cycle:** Every major Episode or Act, one or two maps are rotated out of the active pool into the development workshop for reworks and balancing (as seen with Corrode, Split, and Haven), while refreshed maps return.

### 2. Map Balance Metrics Evaluated by Riot
* **Attacker vs. Defender Win-Rate Symmetry:** Maps are continuously monitored to ensure round win rates hover between 48% and 52% for both sides.
* **Agent Diversity Index:** If a single agent achieves a 100% mandatory pick rate on any map (such as Sova on Ascent or Viper on Breeze), the map geometry is flagged for review.
* **Retake Viability:** Bombsites must maintain a healthy 30% to 40% retake success rate to reward strategic post-plant play.`
};

let updatedCount = 0;
for (const guide of guides) {
  if (enrichedPart2[guide.slug]) {
    guide.content = enrichedPart2[guide.slug];
    const wordCount = guide.content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(4, Math.ceil(wordCount / 180));
    guide.readTime = `${minutes} min read`;
    updatedCount++;
    console.log(`Part 2 enriched "${guide.slug}": ${wordCount} words (${guide.readTime})`);
  }
}

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2), "utf-8");
console.log(`\nSuccessfully enriched ${updatedCount} guides in Part 2!`);
