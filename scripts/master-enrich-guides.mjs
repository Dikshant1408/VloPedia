import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidesPath = path.join(__dirname, "../src/data/guides-database.json");
const guides = JSON.parse(fs.readFileSync(guidesPath, "utf-8"));

// Define rich, exhaustive tactical content for all 24 guides
const masterContent = {
  "best-agents-for-beginners": `Embarking on your VALORANT journey can feel overwhelming. With over 25 unique agents, four distinct tactical roles, and an economy system that punishes undisciplined spending, beginners frequently struggle with information overload. The secret to fast-tracking your improvement is selecting agents whose utility is intuitive, transparent, and forgiving—allowing you to concentrate 90% of your mental bandwidth on core mechanics: crosshair placement, strafe-shooting, map awareness, and callouts.

### The Foundation of Beginner-Friendly Agents
Before diving into individual agent kits, it is essential to understand why certain agents are ideal for newcomers while others lead to immediate frustration:
* **Immediate Feedback:** Abilities like Killjoy's Turret or Sova's Recon Bolt clearly announce whether an area is safe or occupied without requiring complex post-plant lineup knowledge.
* **Low Mechanical Execution Floor:** Characters that do not require complex spatial navigation (such as Astra's Astral Form or Yoru's dimensional drift) let you play with your gun out.
* **Forgiveness & Sustainability:** Abilities that heal or provide simple escape angles reduce the penalty of minor positioning mistakes.

### 1. Brimstone (Controller) — The Tactical Overseer
Brimstone represents the gold standard for introductory Controller play. Unlike Omen, who must manipulate a shadowy 3D projection, or Viper, who manages a gas fuel gauge, Brimstone utilizes a straightforward tactical tablet (Sky Smokes):
* **Intuitive Smoke Deployment:** Press your smoke key, click three points on the minimap around site chokepoints (such as A Short and A Main), and right-click to drop them simultaneously. His smokes last an impressive 19.25 seconds—the longest in the game—giving your team ample time to plant the Spike and establish defensive crossfires.
* **Stim Beacon Firepower:** Dropping a Stim Beacon provides a 15% combat stim buff to fire rate, reload speed, and movement speed, turning chaotic retakes into favored duels.
* **Incendiary & Orbital Strike:** His molotov (Incendiary) ricochets off walls to deny defuses, while his Orbital Strike ultimate deals lethal damage through ceilings and floors across an entire bombsite.

### 2. Phoenix (Duelist) — Self-Sustaining Aggression
If your preference leans toward aggressive entry frags and dueling, Phoenix is the most self-sufficient Duelist in the protocol:
* **Self-Healing Utility:** Both his Hot Hands fireball and Blaze flame wall damage adversaries while restoring his own health (up to 50 HP per ability). If you win a gunfight with 20 HP left, you can simply ignite your feet to reset to full combat readiness for the next encounter.
* **Curveball Flashes:** Unlike complex flash agents that blind teammates, Phoenix's Curveball snaps 90 degrees around corners in a predictable arc. Call your flash, peek immediately behind it, and eliminate blinded enemies holding common angles.
* **Run It Back (Ultimate):** His 6-point ultimate gives you a literal second life. Activate it behind hard cover, sprint onto the bombsite to scout enemy positions, and either secure entry frags or safely respawn back at your marker with full health.

### 3. Killjoy (Sentinel) — Automated Site Containment
Sentinels are tasked with locking down bombsites and preventing backline flanks. Killjoy excels because her gadgetry operates autonomously:
* **Turret & Alarmbot Early Warning:** You do not need to dry-peek dangerous angles to determine if an enemy is pushing. Drop your Turret on an elevated box overlooking B Long and an Alarmbot in B Choke. The moment either gadget triggers, an audio and visual alert pings your team's minimap.
* **Nanoswarm Traps:** Conceal Nanoswarm grenades directly on the Spike plant location or inside chokepoints. When you hear the plant audio or footsteps, activate the grenades from complete safety to stall pushes or secure easy post-plant rounds.
* **Lockdown Ultimate:** In retake or execute situations, planting Killjoy's Lockdown forces all defenders out of the bombsite within 13 seconds or detains them in place, guaranteeing free rounds.

### 4. Reyna (Duelist) — Pure Mechanical Duels
For players migrating from other tactical shooters like Counter-Strike, Rainbow Six Siege, or Apex Legends, Reyna simplifies tactical decision-making into pure gun skill:
* **Leer Blind:** Cast Leer through doorways. Enemies must either divert their crosshairs to shoot the eye or remain blind, granting you an immediate peek advantage.
* **Dismiss & Devour:** Scoring a kill or assist spawns a Soul Orb. Devour immediately heals you to 150 HP (overhealing light armor into heavy shields), while Dismiss renders you invulnerable and ethereal, allowing you to walk away from trades.

### 5. Sova (Initiator) — Vision & Wallhack Intel
Sova teaches newcomers the critical value of information gathering before engaging:
* **Recon Bolt Basics:** You do not need complex 3-bounce pixel lineups. Shooting a basic Recon Bolt at a high back wall reveals every enemy within line of sight, allowing your team to pre-fire through wooden walls or smoke screens.
* **Owl Drone:** Pilot your drone through doorways and site entrances. Tagging an opponent tracks them through geometry, giving your duelists the green light to push without risk.

### Beginner's 5-Point Tactical Checklist
1. **Never Move While Shooting:** Rifles have near-100% inaccuracy while walking or running. Practice stopping (counter-strafing) completely before clicking your mouse.
2. **Keep Your Crosshair at Head Level:** Align your reticle with neck-and-head landmarks (boxes, wall lines) rather than scanning the floor.
3. **Communicate Utility Before Casting:** Always inform teammates ("Flashing right!", "Smoking Heaven!") before deploying vision denial.
4. **Manage the Round Economy:** Always check your team's credits before buying. Never buy a Vandal if your team is on 1,500 credits.
5. **Master One Agent per Role:** Start with Brimstone and Killjoy before attempting high-complexity agents like Astra, Yoru, or Viper.`,

  "best-agents-for-solo-queue": `Climbing the ranked competitive ladder in VALORANT as a solo player is one of the most demanding experiences in tactical gaming. Solo queue is notoriously plagued by inconsistent voice communications, conflicting playstyles, uncoordinated pushes, and teammates who refuse to trade kills. To consistently carry rounds and rank up from Silver or Gold into Ascendant and Immortal, you must play agents who possess self-sufficiency, vision control, multi-frag potential, and clutch insurance.

### What Makes an Agent S-Tier in Solo Queue?
In a coordinated 5-stack or VCT match, players can rely on structured execute protocols and synchronized utility. In solo queue, you must assume your teammates may miss their smokes or fail to check corners. Therefore, optimal solo queue agents must satisfy three golden criteria:
1. **Self-Reliant Space Creation or Denial:** You can open up a site or lock down a rotate without requiring two teammates to assist you.
2. **Impact After Death or Escape Mobility:** Agents that can escape lethal crossfires or deploy vital utility even when eliminated early.
3. **Clutch Versatility:** Abilities that can isolate 1v1 gunfights during chaotic 1v2 or 1v3 post-plant situations.

### 1. Omen (Controller) — The Undisputed Solo Queue General
If you are forced into playing smokes (as happens in 70% of solo queue agent selects), Omen is hands-down the best agent in the game:
* **Recharging Smokes (Dark Cover):** Unlike Brimstone, who is limited to 3 static smokes, Omen's smokes regenerate on a 30-second cooldown. In solo queue where rounds drag on or attackers fake rotations, Omen guarantees your team always has vision denial in the late round.
* **Paranoia Teamfight Blind:** Paranoia passes directly through solid walls, deafening and nearsighting every adversary in a wide corridor. It is un-dodgeable at close-to-medium range and stops fast 5-man site rushes dead in their tracks.
* **Shrouded Step (Teleport):** Break crosshairs, teleport on top of unexpected boxes (like Ascent Mid crates or Haven A Short boxes), or escape pinched choke points. In 1v1 clutches, fake-teleporting inside smokes breaks enemy spatial orientation.
* **From the Shadows (Ultimate):** Pick up the Spike from anywhere across the map, scout enemy site setups, or execute instant backline flanks when enemies commit to one site.

### 2. Clove (Controller / Duelist Hybrid) — The High-Tempo Aggressor
Clove revolutionized solo queue by directly fixing the single biggest failure point of ranked controllers: dying early and leaving your team with zero smokes.
* **Post-Death Smokes (Ruse):** Even if you get caught out on an opening duel or trade, you can continue dropping two tactical smokes from your death location. This removes the fear of aggressive play that handicaps traditional smoke players.
* **Pick-Me-Up (Overheal & Haste):** Securing a kill or assist lets you immediately activate Pick-Me-Up to gain temporary invulnerability-tier health (up to 100 bonus HP) and movement speed, enabling rapid re-peeks and multi-kill snowball rounds.
* **Not Dead Yet (Self-Resurrection):** Clove's ultimate allows you to rise from the grave upon death. Securing a kill or assist within 12 seconds cements your survival, turning lost 4v5 rounds into won 5v4 advantages.

### 3. Jett (Duelist) — Mechanical Reset & First Blood King
Jett has remained a competitive staple for six years because Tailwind breaks the foundational law of tactical shooters: the trade-kill rule.
* **Tailwind Dash:** Jett can hold the most aggressive, risky first-shot angles with an Operator or Vandal. The moment she fires, she can dash laterally into hard cover before any enemy can trade her out.
* **Updraft & Cloudburst Space Creation:** On attack, Jett breaks defensive crosshairs by smoking site and dashing inside her own smoke. This forces defenders to turn 180 degrees away from the main chokepoint, giving your hesitant solo queue teammates free entry.
* **Blade Storm Eco Miracle:** Her knife ultimate has 100% pinpoint accuracy while running, jumping, and floating. In solo queue where teammates often force eco rounds, Blade Storm allows Jett to win full-buy rounds with 0 credits spent.

### 4. Cypher (Sentinel) — Flank Denial & Information Fortress
In solo queue, the number one cause of lost defensive rounds is unannounced flankers shooting your team in the back. Cypher completely eliminates this variable:
* **Trapwires (Flank Lockdown):** String Trapwires across enemy flank corridors (such as Ascent B Main or Sunset Mid). Even if you are anchoring on the opposite side of the map, the moment an enemy touches a wire, they are revealed, dazed, and displayed to your entire team.
* **Spycam Intel:** Position your camera high on skyboxes to tag enemies without taking physical damage.
* **Cyber Cages:** Use them as one-way vision blocks to net free headshots on pushing enemies, or pop them as temporary smokes to defuse the Spike in 1v1 clutches.

### 5. Iso (Duelist) — Shield Advantage in 50/50 Duels
Iso was specifically engineered to dominate pure 1v1 engagements:
* **Double Tap (Energy Shield):** Activating Double Tap gives Iso a shield that absorbs any single instance of damage—including an Operator chest shot, Raze rocket, or Vandal headshot. In solo queue where first bloods dictate 75% of round outcomes, entering every duel with a guaranteed second chance is game-breaking.
* **Kill Contract (Ultimate):** Pull the primary enemy anchor into an isolated dimensional arena where utility is locked and you have the health advantage.

### Solo Queue Mental & Strategic Rules
1. **Dodge Toxic Lobbies:** If your teammates are flaming in Agent Select or playing without microphones, spend the 3 RR dodge penalty rather than losing 25 RR over 40 miserable minutes.
2. **Play to Your Agent's Role:** If you lock Sentinel, do not push through enemy smokes on defense within the first 10 seconds. Play patience, gather info, and anchor.
3. **Call Out Damage and Numbers Immediately:** Instead of complaining about how you died, immediately say: "Jett hit 120 B Main, pushing backsite."
4. **Icing the Clutch:** In 1v2 or 1v3 post-plants, tap the Spike to force enemies to peek one by one. Never engage multiple enemies simultaneously.`,

  "best-agents-for-ascent": `Ascent remains the quintessential competitive map in VALORANT—a tactical masterpiece defined by wide mid-courtyard sightlines, destructible mechanical sliding doors, paper-thin wallbang surfaces, and heavily fortified bombsite chokepoints. Success on Ascent requires a rigorous balance between mid control, wallbang suppression, and overwhelming retake utility.

### The Architectural DNA of Ascent
To understand why certain agents dominate Ascent's meta, analyze the map's structural realities:
* **Mid Courtyard Determines the Game:** Mid controls access to Market, Catwalk, Tree, and Pizza. Whichever team controls Mid can rotate between A and B in 6 seconds, while the defending team is forced into 20-second perimeter rotations.
* **Penetrable Architecture:** Ascent has the highest ratio of low and medium-penetration walls in VALORANT. Sites like B Main, B Backsite, Market, and A Heaven can be completely cleared or held through walls using high-penetration rifles and machine guns (Odin, Guardian, Ares).
* **Mechanical Choke Doors:** Both A Tree and B Market feature mechanical steel doors that can be sealed to isolate retakers or broken to expose rotations.

### The S-Tier Ascent Team Composition (88/100 Meta Synergy)

#### 1. Jett (Duelist) — Mid Operator Anchor & Explosive Site Entry
* **Mid Sniping Supremacy:** With high-velocity sightlines down Mid Bottom and Mid Courtyard, Jett is the ultimate Operator platform on Ascent. She can peek Mid Tiles, delete the opening attacker, and dash safely behind Market wall.
* **A Site Dash Entries:** Entering A Site requires crossing the narrow A Main choke under threat from Heaven and Generator. Jett smokes off Generator, dashes into the smoke, and opens the site for her team.

#### 2. Sova (Initiator) — Ascent's Irreplaceable Recon Architect
Sova has maintained a near-100% pick rate on Ascent across professional VCT history:
* **B Main Wallbang Wallhack:** By shooting a Recon Bolt into B Main from B Site or Market, Sova reveals enemies pushing the corridor. Paired with an Odin or Guardian, you can eliminate entire enemy pushes through the wooden wall without exposing your body.
* **A Site Retake Recon:** A single bouncing dart onto the A Site back wall reveals Hell, Wine, and Default plant, completely dismantling post-plant setups.
* **Hunter's Fury (Ultimate):** Ascent's narrow corridors make Hunter's Fury virtually impossible to dodge in B Main, Catwalk, and A Tree.

#### 3. Omen (Controller) — One-Way Vision & Mid Authority
* **A Main & B Main One-Ways:** Omen can place precise one-way Dark Covers on the decorative ledges of A Main and B Main. Pushing enemies see only opaque smoke, while Omen clearly sees their feet and legs for risk-free kills.
* **Mid Pizza & Bottom Smokes:** Recharging smokes allow Omen to smoke Mid Bottom and Mid Top simultaneously, neutralizing enemy snipers and granting attackers free Catwalk control.

#### 4. Killjoy (Sentinel) — Total B Site & Retake Dominance
* **The B Site Solo Anchor:** Killjoy can comfortably hold B Site alone using an Alarmbot in B Choke, an elevated Turret on Market stairs, and Nanoswarms on the lane. This frees up four teammates to stack Mid and A.
* **The Uncounterable B Retake Lockdown:** Placing Killjoy's Lockdown ultimate inside B Retake Cubby or Market completely covers B Site. Defenders must either flee toward B Main or get detained, guaranteeing a free defuse.

#### 5. KAY/O (Flex Initiator) — Utility Suppression & Door Control
* **ZERO/POINT Suppression Knife:** Ascent's compact site layouts allow a single KAY/O knife to suppress entire teams. Tossing ZERO/POINT into B Site instantly disables Killjoy's Turret, Alarmbot, and Lockdown, enabling effortless site rushes.
* **A Main FLASH/DRIVE Pop-Flashes:** KAY/O's right-click underhand flash through A Main smoke detonates instantly, blinding anyone holding Heaven, Generator, or Site.

### Strategic Playbook for Ascent
* **Attacker Protocol:** Never 5-man rush A or B Main on round start. Default 1-2-2. Pressure Mid Courtyard and Catwalk with Sova darts and Omen smokes. Once Mid is conquered, pinch B through Market or A through Tree.
* **Defender Protocol:** Fight for Mid information early. If attackers take Mid, close the mechanical doors in Tree and Market immediately to force them into noisy weapon fire. Utilize Odin wallbangs through B Main wooden boards whenever Sova or fade utility scans.`,

  "how-to-counter-jett": `For six years, Jett has remained the most popular and threatening Duelist in VALORANT. Her ability to secure opening picks with an Operator, dash instantly into complete safety, and float across unexpected vertical angles makes playing against a skilled Jett feel infuriating. However, Jett's kit is strictly governed by predictable activation windows, sound cues, and cooldown timings that can be systematically exploited.

### Understanding Jett's Core Mechanics & Limitations
To counter Jett, you must first understand the strict nerfs and rules applied to her signature ability, Tailwind:
* **The 0.75-Second Priming Delay:** Jett cannot instantly dash on reaction anymore. She must first press E to "prime" her dash, which produces a distinct rushing-wind audio cue.
* **The 12-Second Expiry Window:** Once primed, Jett has exactly 12 seconds to execute her dash. If she does not dash within 12 seconds, the ability goes on complete cooldown until she scores two kills.
* **Two-Kill Recharge Condition:** Jett only earns a second dash after securing two eliminations in the same round.

### 1. The Bait & Wait Strategy (Neutralizing Tailwind)
The most common mistake players make against an aggressive Jett is dry-peeking her angle while her dash is active:
* **Audio Recognition:** The moment you hear Jett prime her Tailwind (the distinctive "swoosh" activation sound), **stop moving and do not peek**.
* **Utility Baits:** Use cheap utility (a Sova Owl Drone, Fade Prowler, Skye Guiding Light, or even a jump-peek shoulder jiggle) to bait her into firing her weapon or panicking.
* **Hold for 12 Seconds:** Once the 12-second activation window expires, Jett loses her escape mechanism. She is now an ordinary, vulnerable agent with no defensive dash. Coordinate a hard flash or swing immediately after the timer lapses.

### 2. Hard Utility Counters (Suppression & Grounding)
Jett relies completely on high mobility to survive. Disabling her mobility renders her ineffective:
* **KAY/O (ZERO/POINT & NULL/cmd):** KAY/O is Jett's hardest natural counter. His suppression knife penetrates through walls. A suppressed Jett cannot dash, cannot updraft, and loses access to her Blade Storm knives. When Jett is suppressed, swing her immediately—she cannot escape trades.
* **Cypher (Trapwires):** Cypher's Trapwires are fatal to aggressive Jett entries. Position your wires at ankle or knee level across site entrances (such as Haven C Long or Bind B Hookah). When Jett dashes into site, she hits the wire, gets yanked backward, nearsighted, and revealed, offering a stationary target.
* **Breach (Fault Line & Flashpoint):** Jett holding an Operator angle relies on holding a razor-thin stationary line of sight. Breach's Fault Line daze travels through walls, concussing Jett, dropping her scope zoom, and slashing her fire rate by 50%.

### 3. Neutralizing the Operator Jett
When Jett purchases an Operator ($4,700), she becomes a round-defining anchor. To shut her down without feeding her kills:
* **Never Dry-Peek Long Angles:** Do not walk around Ascent Mid, Breeze A Main, or Haven C Long with just your crosshair. An Operator shot deals 150 body damage and kills instantly.
* **Vision Denial First:** Drop a smoke directly on top of her vantage point (e.g., Omen smoking A Heaven or Viper tossing a Poison Cloud). This forces her to reposition onto flat ground where she loses her angle advantage.
* **Double-Peeking & Trade Spacing:** If you must fight an Operator Jett, peek simultaneously with a teammate separated by 2 meters. The Operator fires at only 0.75 rounds per second. Even if Jett hits the first player, the second player has a guaranteed 1.25-second window to headshot her before her bolt cycles.

### 4. Countering Blade Storm (Knife Ultimate)
Jett's ultimate grants her 5 pinpoint-accurate throwing knives that reset on kill and fire with 100% precision while jumping, gliding, and running:
* **Play Long-Range Angles:** Blade Storm deals 50 damage to the body and 150 to the head. At close range, right-click shotgun burst kills instantly. Force Jett to duel you beyond 30 meters where your Vandal or Guardian can out-damage her individual knives.
* **Stay Grounded and Avoid High Verticals:** Jett will use Updraft to hover above boxes and rain knives down on your head. Position under roofs or overhangs (such as Ascent Hell or Split B Backsite) where her vertical floating angles are completely blocked.`,

  "vandal-vs-phantom": `The debate between the $2,900 Vandal and $2,900 Phantom has raged since VALORANT's beta launch. Both weapons represent the absolute pinnacle of competitive primary rifles, yet they cater to fundamentally divergent shooting philosophies, combat ranges, and agent roles. Understanding the exact ballistic mathematics and situational trade-offs between them is crucial to optimizing your win rate across different maps and tactical responsibilities.

### 1. The Ballistic Mathematics & Damage Profiles
The core distinction between the two rifles lies in damage falloff and first-bullet lethality:

| Metric | Vandal ($2,900) | Phantom ($2,900) | Advantage |
| :--- | :--- | :--- | :--- |
| **Damage (0–15m)** | Head: 160 / Body: 40 / Leg: 34 | Head: 156 / Body: 39 / Leg: 33 | **Phantom** (Faster fire rate) |
| **Damage (15–30m)** | Head: 160 / Body: 40 / Leg: 34 | Head: 140 / Body: 35 / Leg: 29 | **VANDAL (Lethal 1-Tap)** |
| **Damage (30–50m)** | Head: 160 / Body: 40 / Leg: 34 | Head: 124 / Body: 31 / Leg: 26 | **VANDAL (Lethal 1-Tap)** |
| **Fire Rate** | 9.75 rounds/second | 11.0 rounds/second | **Phantom (+12.8% faster)** |
| **Magazine Size** | 25 rounds (75 reserve) | 30 rounds (90 reserve) | **Phantom (+5 bullets/mag)** |
| **Silencer / Tracers** | Visible bullet tracers | **Invisible tracers through smoke** | **Phantom (Stealth)** |
| **First Shot Spread** | 0.25° | 0.20° | **Phantom (+20% accurate)** |

### 2. The 140 Headshot Dilemma (The Phantom's Curse)
The Vandal's overwhelming popularity (commanding a ~72% pick rate in competitive ranked) stems almost entirely from its **range-independent lethality**:
* **Guaranteed One-Tap:** Regardless of whether your target is standing 5 meters away or 48 meters across Breeze mid, a single Vandal bullet to the head deals 160 damage—cleanly killing an enemy wearing full Heavy Shields (150 HP).
* **The "140" Frustration:** Between 15 and 30 meters (which accounts for over 50% of gunfights in VALORANT), a Phantom headshot deals exactly 140 damage. The enemy survives with 10 HP, turns around, and headshots you with a Vandal. This single mathematical reality causes many competitive players to avoid the Phantom entirely.

### 3. The Phantom's Secret Superpowers
Despite the 140 damage falloff penalty, professional VCT teams frequently run Phantoms due to three hidden tactical mechanics:
* **Stealth Smoke Spraying (No Tracers):** When you shoot through smokes with a Vandal, bright red bullet tracers reveal your exact position, allowing enemies to spray back and kill you through the smoke. The Phantom features an integral silencer with **zero bullet tracers**. You can empty an entire 30-round magazine through a choke smoke with zero risk of return fire.
* **Superior Recoil Recovery & Spray Transfers:** The Phantom resets its crosshair spread 15% faster than the Vandal and possesses a significantly tighter spray grouping. In close-quarters multi-target engagements (e.g., stopping a 5-man rush into B Site), the Phantom's 11.0 rds/s fire rate and larger 30-round magazine enable effortless multi-kills.
* **First-Bullet Accuracy Advantage:** At extreme range (40m+), the Vandal has a 0.25° spread, meaning 1 out of 4 perfectly centered crosshair shots will miss due to random bullet spread. The Phantom's 0.20° spread ensures higher first-shot reliability.

### 4. Which Agents Should Pick Which Rifle?
Your agent role directly dictates which rifle produces the highest mathematical return:
* **Pick Phantom on Controllers (Omen, Viper, Brimstone, Astra, Clove):** You spend 40% of every round deploying and playing inside or behind smokes. Spamming smokes without giving away your position is essential.
* **Pick Phantom on Close-Range Anchor Sentinels (Cypher, Killjoy):** You fight enemies trapped in your cages or tripped in your wires at point-blank range (under 15m), where the Phantom kills instantly with faster fire rate.
* **Pick Vandal on Long-Range Duelists & Initiators (Jett, Reyna, Sova, Chamber):** You take opening long-distance duels down A Long, Mid Courtyards, and B Long where 1-tap headshot consistency is non-negotiable.

### 5. Map-Specific Selection Matrix
* **Vandal Priority Maps:** Breeze, Icebox, Ascent, Haven (Wide, open sightlines exceeding 30 meters).
* **Phantom Priority Maps:** Split, Bind, Sunset, Lotus (Tight corners, chokepoints, indoor corridors, and heavy smoke spam).`,

  "best-sensitivity-for-valorant": `In tactical shooters like VALORANT, precision micro-adjustments trump rapid 360-degree spins. Setting your mouse sensitivity too high introduces involuntary muscle tremors, causes overshooting on micro-corrections, and makes tracking enemy heads at distance nearly impossible. Conversely, setting it too low leaves you unable to clear 90-degree corners or escape flashing utility. Finding your calibrated sweet spot using mathematical eDPI is the foundational step toward consistent Radiant-tier mechanics.

### 1. The Mathematics of Sensitivity: What is eDPI?
Never compare raw in-game sensitivity with friends without factoring in hardware mouse DPI (Dots Per Inch):
* **The Formula:** eDPI = In-Game Sensitivity × Mouse Hardware DPI
* **Example:** Playing on 0.30 In-Game Sens at 800 DPI yields 240 eDPI (0.30 × 800 = 240). An opponent playing on 0.15 In-Game Sens at 1600 DPI also has 240 eDPI (0.15 × 1600 = 240). Their physical crosshair movement distance per inch of mouse travel is mathematically identical.
* **Why 800 or 1600 DPI?** Modern optical sensors (PixArt, Hero, Focus Pro) achieve lower input latency and smoother motion tracking at 800 and 1600 DPI compared to 400 DPI, eliminating micro-pixel skipping.

### 2. Pro Player Meta Benchmarks (The 200–300 eDPI Sweet Spot)
Across professional VCT Champions and Masters tournaments, player sensitivities are remarkably concentrated:
* **The Pro Average:** The median sensitivity across tier-1 international pros hovers between 200 and 280 eDPI.
* **Median cm/360°:** Approximately 45 cm to 55 cm of mouse pad travel required to perform a full 360-degree rotation.
* **Role-Based Variations:**
  * **Duelists (Aspas, Something, TenZ):** Often run slightly higher sensitivities (240–320 eDPI) to accommodate rapid Jett dashes, Raze satchel mobility, and close-quarters entry clearing.
  * **Sentinels & Controllers (Boaster, Chronicle, Less):** Frequently operate on lower sensitivities (190–240 eDPI) to maximize first-bullet accuracy on stationary crosshair holds and anchor angles.

### 3. Wrist Aiming vs. Arm Aiming: The Hybrid Technique
Amateur players frequently make the mistake of using only their wrist or only their arm. Elite aim relies on a coordinated hybrid system:
* **Arm Movement (Elbow Pivot):** Used for large macroscopic adjustments—turning 90 degrees around corners, checking site flanks, and executing 180-degree turnarounds from flashes.
* **Wrist Movement (Wrist Pivot):** Used for medium-range target acquisition within a 30-degree cone in front of your crosshair.
* **Fingertip Micro-Adjustments:** Used for the final 2-to-5 pixel adjustment onto the enemy's nasal bridge or forehead.

### 4. Step-by-Step Sensitivity Calibration Protocol
1. Ensure Raw Input Buffer is toggled ON in VALORANT settings, and Enhance Pointer Precision is turned OFF in Windows Mouse Properties.
2. Set your mouse hardware to 800 DPI.
3. Set your in-game sensitivity to 0.30 (yielding 240 eDPI).
4. Enter The Range and select Eliminate 50 Bots with armor on.
5. Observe your crosshair behavior during flicks:
   * If your crosshair consistently lands past the bot's head, you are overshooting—decrease sensitivity by 0.02.
   * If your crosshair consistently stops before reaching the bot's head, you are undershooting—increase sensitivity by 0.02.
6. Once calibrated, lock in your sensitivity and do not change it for at least 14 days to allow deep neural muscle memory to form.`,

  "how-valorant-economy-works": `Mastering the round economy (Credits / Creds) is the single most critical differentiator between low-ELO players and Radiant-tier competitors in VALORANT. You can possess superhuman aim, but if your team consistently forces low-tier weapons into enemy full-buys, your mathematical probability of winning the match drops below 20%. Understanding round payouts, loss streaks, buy states, and credit thresholds is the bedrock of tactical success.

### 1. The Core Credit Reward Architecture
Every credit awarded in VALORANT is strictly determined by game rules:
* **Round Win (Any condition):** +3,000 Credits
* **Round Loss (Base / 1st loss):** +1,900 Credits
* **Round Loss (2-loss streak):** +2,400 Credits
* **Round Loss (3+ loss streak maximum):** +2,900 Credits
* **Individual Elimination (Per kill):** +200 Credits
* **Spike Plant (Attackers team-wide):** +300 Credits per player (regardless of whether the Spike detonates or is defused!)
* **Maximum Credit Cap:** 9,000 Credits (Any credits earned above 9,000 are permanently lost).

### 2. The Four Fundamental Buy States

#### A. Full Buy (Primary Rifles + Heavy Shields + Full Utility)
* **Target Spend:** ~3,900 to 4,500 Credits per player.
* **Loadout:** Vandal or Phantom ($2,900) + Heavy Shields ($400) + Signature Utility ($600–$1,200).
* **Goal:** Maximize your mathematical duel win rate. Full buys should only be called when all 5 teammates can afford rifles and shields simultaneously.

#### B. Save / Eco Round (Minimum Spend)
* **Rule of Thumb:** Look at the "Minimum Next Round" indicator at the top of the Buy Menu. Ensure every player has **at least 3,900 Credits** going into the following round.
* **Loadout:** Classic (Free), Shorty ($300), or Ghost ($500) with zero shields.
* **Goal:** Accept that this round is statistically unfavored. Your objective is NOT necessarily to win the round—it is to eliminate 1 or 2 expensive enemy weapons (economy damage), plant the Spike for +300 team credits, and guarantee a full rifle buy next round.

#### C. Half-Buy / Light Buy (Targeted Spending)
* **Credit Range:** When your team has around 3,000–3,500 Credits and losing would still leave you with ~2,400 next round.
* **Loadout:** Bulldog ($2,050), Outlaw ($2,400), Spectre ($1,600), or Sheriff ($800) paired with Light Shields ($250).
* **Goal:** Retain enough credits to full-buy next round while presenting a lethal threat against opponents who may be low on armor.

#### D. The Bonus Round (Round 3 Strategy)
* If your team wins Round 1 (Pistol) and buys SMGs/Shotguns to win Round 2 (Anti-Eco), you enter Round 3 as the **Bonus Round**.
* **The Rule:** Do NOT buy Vandals on Round 3! Carry over your surviving Spectres, Bulldogs, and Ghosts against the enemy team's newly bought Vandals. If you lose, your economy remains pristine and you can full-buy on Round 4 with 4,500+ credits.

### 3. Critical Economy Rules You Must Follow
1. **Never Buy Solo:** If four teammates have 1,800 credits and are saving, NEVER buy a Vandal alone. If you die, you lose your gun and have zero credits to buy with your team next round. Die with your team, buy with your team.
2. **Plant the Spike Even in 1v4 Scenarios:** If you are the last attacker alive and cannot win the round, sprint to an open bombsite and plant the Spike before dying. That plant deposits +1,500 credits into your team's collective bank (+300 each).
3. **Save Weapons When Rounds Are Unwinnable:** If you are in a 1v4 post-plant with 15 seconds remaining and hold an Operator or Vandal, do not run in to die. Save your weapon in a corner. Preserving a $2,900 Vandal is functionally equivalent to winning $2,900 in credits.
4. **Light Shield Optimization ($250 vs $400):** If the enemy team is exclusively wielding Vandals and Operators, Heavy Shields (150 HP) provide zero extra survival advantage over Light Shields (125 HP). A Vandal headshot (160) and Operator chest shot (150) kill you regardless. Saving $150 per round by buying Light Shields allows you to buy rifles an extra 2–3 times per half!`,

  "best-crosshair-settings": `In tactical first-person shooters, your crosshair is your primary physical connection to the game world. An oversized, distracting, or dynamically wobbling reticle obscures enemy heads at distance, clutters your screen during spray transfers, and introduces unnecessary cognitive delay when trying to line up precision headshots. In VALORANT, where the time-to-kill is under 200 milliseconds and a single rifle headshot is instantly lethal, optimizing your reticle for visual clarity is one of the quickest mechanical upgrades you can make.

### Core Crosshair Principles for Competitive Play
Before testing specific pro player configurations, every competitive player should internalize four essential rules:
* **Disable Movement & Firing Error:** Always toggle Movement Error and Firing Error to OFF on your primary aiming reticle. Dynamic crosshairs bloom and expand wildly while moving or spraying. While helpful during your first 2 hours of learning gun inaccuracy, in ranked play this visual expansion merely creates distraction and delays your counter-strafe timing.
* **Color Psychology & Environmental Contrast:** Your crosshair must never blend into background geometry.
  * **Cyan / Sky Blue (#00FFFF):** Universally regarded as the best color for VALORANT. Cyan provides extreme contrast against the terracotta brickwork of Bind, the sandy stone of Ascent, the warm orange tones of Sunset, and the lush green flora of Lotus.
  * **Green / Lime (#00FF00):** Exceptional against dark corridors and night-time lighting (such as Pearl or Split).
  * **White (#FFFFFF) with 1px Black Outlines:** The absolute cleanest aesthetic. The black outline guarantees visibility against bright skyboxes (like Icebox or Breeze snow) and dark corners alike.
  * **Avoid Red (#FF0000):** Red crosshairs blend directly into enemy outline shaders and disappear against the brick surfaces of Ascent and Bind.
* **The Center Dot Trade-Off:** Center dots are exceptional for clean pistol rounds and Guardian/Sheriff tapping because they focus your optical attention on a single pixel. However, at extreme ranges (45+ meters on Breeze or Icebox), a center dot larger than 2 pixels can physically cover the enemy player's head, making micro-adjustments difficult.

### Top VCT Champions Crosshair Profiles & Codes

#### 1. TenZ (The Universal Competitive Standard — Cyan 1-4-2-2)
* **Import Code:** 0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;0f;0;1b;0;S;c;4;o;1
* **Configuration:** Primary Color: Cyan | Outlines: Off | Center Dot: Off | Inner Lines: 1 / 4 / 2 / 2.
* **Tactical Breakdown:** This is the most popular crosshair in competitive history. The 2-pixel center gap creates a neat "window" that perfectly frames an enemy head between 15 and 30 meters, while the thin 1-pixel line thickness ensures zero visual obstruction.

#### 2. Demon1 (VCT Champions MVP — Minimalist White Dot)
* **Import Code:** 0;s;1;P;o;1;d;1;m;1;0b;0;1b;0
* **Configuration:** Primary Color: White | Outlines: On (Opacity 1, Thickness 1) | Center Dot: On (Size 2) | Inner Lines: Off.
* **Tactical Breakdown:** Demon1 utilized this exact pixel dot during his historic 2023 Champions run. It eliminates all peripheral lines, forcing your brain to place the exact center point directly on the enemy's nose. Ideal for high-discipline tap-shooters and Vandal purists.

#### 3. Aspas (Lethal Duelist Plus-Sign — 1-4-2-0 Green)
* **Import Code:** 0;P;c;1;h;0;0l;4;0o;0;0a;1;0f;0;1b;0
* **Configuration:** Primary Color: Green | Outlines: Off | Center Dot: Off | Inner Lines: 1 / 4 / 2 / 0 (Zero Center Gap).
* **Tactical Breakdown:** With zero center gap, Aspas's crosshair forms a tight, solid cross. It is outstanding for rapid tracking aim, high-speed flicking, and aggressive Jett/Raze entry entries where you need to track moving targets during air movement.

#### 4. Boaster (Fnatic IGL Clean Box — 1-2-1-3 Green)
* **Import Code:** 0;s;1;P;c;1;o;1;d;0;0b;0;1b;1;1t;1;1l;2;1v;2;1g;1;1o;1;1a;1;1m;0;1f;0
* **Configuration:** Compact hollow box with subtle outlines.
* **Tactical Breakdown:** Hollow box crosshairs allow you to place the enemy's head inside the box like a viewfinder. Many players find this reduces eye fatigue over long multi-game tournament days.

### Step-by-Step In-Game Calibration Routine
1. Enter The Range and approach the shooting range control panel.
2. Set bots to Practice Mode and walk backward to the 30-meter line marker on the floor.
3. Aim your reticle at a bot's head. If the inner lines extend beyond the bot's ears, your Inner Line Length is too high—reduce it to 3 or 4.
4. If your crosshair completely obscures the bot's facial features, increase your Inner Line Offset to 2 or 3 to open up a central visual window.
5. Practice 50 elimination bots focusing on smooth micro-adjustments before jumping into ranked.`,

  "how-to-rank-up-from-gold": `Gold is universally recognized as the most punishing and congested rank bracket in VALORANT. Players in Gold frequently possess decent raw mechanical flick aim, but find themselves trapped in a perpetual 50% win-rate loop. The reason is simple: Gold players treat VALORANT like an aim-trainer deathmatch rather than an asymmetric tactical game of probabilities, positioning, and round management. To break through into Platinum, Diamond, and Ascendant, you must systematically eliminate four fundamental leaks in your game.

### Leak 1: The "Auto-Crouch Spray" Addiction
In Gold lobbies, nearly 90% of players have an ingrained muscle-memory reflex: the split second they see an enemy on their screen, their pinky finger immediately slams the Left Ctrl (Crouch) key and they commit to a 20-bullet spray.
* **Why This Keeps You Hardstuck:** 
  1. Once you crouch, your horizontal movement drops to zero. You are a completely stationary target with zero evasion.
  2. Gold players naturally have sub-optimal crosshair placement—they frequently aim at upper-chest or neck level. When you crouch, you pull your own head directly down into their inaccurate spray!
  3. You eliminate your ability to counter-strafe or reset into cover if your first two bullets miss.
* **The Cure:** Unbind your Crouch key completely in your game settings for 5 Deathmatch games. Force yourself to shoot 2-round bursts with the Vandal, take a horizontal step, and shoot another 2-round burst. This single mechanical adjustment will instantly win you 30% more duels.

### Leak 2: Autopilot Crosshair Placement & Corner Slicing
Gold players often believe their aim is good because they can hit flashy flicks in Aim Lab. However, flicking is merely an emergency compensation mechanism for bad crosshair placement:
* **The "Hugging The Wall" Trap:** When approaching a corner, amateur players glue their reticle to the edge of the wall. When an enemy swings out, the enemy is already 2 feet past your crosshair before your optical nerve can signal your finger to click.
* **The Pro Angle:** Hold your crosshair one to two model-widths away from the corner at exact head height. Give yourself buffer space to account for human reaction latency (roughly 180–220ms). When an enemy wide-swings, they will walk directly into your pre-aimed crosshair.

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

  "best-agents-for-low-elo": `In Iron, Bronze, and Silver (Low ELO), VALORANT matches operate under entirely different dynamics than high-rank or professional games. Communication is virtually non-existent, enemies push through smokes without fear, footsteps are constantly stomped, and players rarely trade kills. To climb rapidly out of Low ELO, you must play agents that exploit chaotic, uncoordinated opponents while protecting you from your own team's mistakes.

### Why Standard Meta Tier Lists Fail in Low ELO
Professional VCT tier lists praise agents like Astra, Harbor, and Breach. In Low ELO, picking Astra is tactical suicide because her abilities require coordinated team pushes that never happen in Bronze. Instead, S-tier Low ELO agents must have:
* **Punishment Utility:** Abilities that instantly kill enemies who mindlessly rush through chokepoints.
* **Self-Sufficiency:** The ability to heal, flash, and escape without relying on teammates.
* **Obvious Intel:** Gadgets that literally tell you where the enemy is on your screen.

### 1. Reyna (Duelist) — The Low ELO Queen
Reyna is universally acknowledged as the greatest Low ELO pub-stomper in VALORANT history:
* In low ranks where gunfights are sloppy and players miss headshots, Reyna's **Devour** heals her back to 150 HP after every single duel.
* Her **Dismiss** allows her to make aggressive positioning mistakes and escape completely unscathed.
* If your mechanical aim is even 10% better than the lobby, Reyna guarantees 25+ kills per match.

### 2. Killjoy (Sentinel) — The Automated Punisher
Low ELO attackers rarely check corners, never destroy utility before entering, and love 5-man rushing through narrow bottlenecks:
* Place Killjoy's Turret and Alarmbot at the choke with two Nanoswarms hidden in the ground.
* When the attackers rush through, trigger both Nanoswarms. In Bronze, enemies will panic, run through the swarm, and die without ever seeing your gun.

### 3. Clove (Controller) — Independent Smoking & High Fragging
* In Low ELO, nobody wants to play Controller. When someone picks Omen or Brimstone, they often die first and leave the team blind.
* Clove can push aggressively, score entry kills, and continue dropping tactical smokes even after being eliminated. Their self-resurrection ultimate (Not Dead Yet) wins rounds that would otherwise be lost.

### 4. Phoenix (Duelist) — Low Cost, High Impact
* Phoenix's flashes curve predictably around walls, making them easy to execute without blinding your teammates.
* His flame wall blocks line of sight for safe bomb plants in lobbies where controllers forget to smoke.
* His 6-point ultimate gives you an extra life every few rounds to practice aggressive site entries.`,

  "how-to-play-abyss-map-guide": `Abyss represents a historic evolution in VALORANT map design as the game's first competitive arena completely stripped of boundary safety barriers.botched satchel jumps, errant knockbacks, and careless backpedaling result in instant death from falling into the dark void below. Beyond its lethal drop hazards, Abyss features multi-layered vertical routing, destructible wooden trapdoors, and long-range sniper sightlines that reward deliberate map control.

### 1. Understanding Environmental Hazards & Jump Mechanics
The defining feature of Abyss is that the void is an active combat element:
* **The A Site Void Bridge:** Spanning across the center of A Site is an open wooden bridge flanked on both sides by open air. Knockback abilities—such as Raze Blast Packs, Astra Gravity Wells, and Breach Rolling Thunder ultimates—will physically throw players into the void for instant un-revivable kills.
* **The High-Risk A Main Jump Shortcut:** Attackers pushing A Main can air-strafe across the open void directly onto the site bridge. This cuts rotation time by 4 seconds and bypasses common defensive choke angles, but requires precise jump timing.
* **Fall Damage & Footstep Audio:** Several elevated drops (such as dropping from A Tower or B Nest) deal up to 30 fall damage unless cushioned by abilities or caught on intermediate ledges.

### 2. S-Tier Agent Composition on Abyss

#### A. Astra / Omen (Controllers)
Due to Abyss's colossal footprint and long rotation distances, Controllers with limited range (like Brimstone) struggle severely. Astra and Omen reign supreme:
* Astra can place stars globally across both sites and Mid from anywhere on the map. Her Gravity Well placed near the void bridge pulls enemies off the edge to their deaths.
* Omen's 30-second regenerating Dark Cover smokes provide continuous vision denial down the massive B Danger and A Main corridors.

#### B. Sova (Initiator)
Abyss possesses completely open skyboxes with zero invisible ceiling barriers. Sova can launch high-trajectory Recon Bolts from Defender Spawn that land cleanly on A Main or B Lobby, scanning enemy execute pathways before attackers even cross the choke.

#### C. Jett (Duelist)
With unpredictable verticality and narrow void pathways, Jett's Tailwind dash and Updraft glide mechanics make her the safest Duelist on the map. If she misjudges an edge or gets forced into a void drop, she can hover and dash back onto solid geometry.

#### D. Cypher (Sentinel)
Cypher's Trapwires are lethal on Abyss because corridors flanking the void offer attackers zero horizontal room to maneuver around them. An enemy caught in an ankle-height wire along the narrow B Danger walkway is a stationary, helpless target.

### 3. Step-by-Step Strategic Playbook

#### Attacking A Site
* Never 5-man rush through A Main. Default with 1 player pressuring Mid Catwalk, 1 holding A Danger, and 3 preparing the A Main execute.
* Smoke off A Tower (Heaven) and A Link.
* Clear the backsite pillars with Sova Shock Darts or molotovs before crossing the void bridge.
* Plant the Spike behind the solid stone center monument to shield the planter from A Tower sniper fire.

#### Defending B Site
* B Site is an anchor's dream. Position a Sentinel (Cypher or Killjoy) on B Site with utility covering B Danger and B Main.
* Have your second defender play from elevated B Nest with an Outlaw or Operator. B Nest gives you a direct downward sightline into B Main while shielding your lower body with hard stone cover.
* If attackers overwhelm the choke, immediately concede site and play for retake through B Tower with coordinated flashes.`,

  "how-to-master-clove-controller": `Introduced in Episode 8, Clove disrupted the Controller meta by directly fixing the single biggest psychological hurdle in competitive ranked: the fear of dying early as a smoke player. Traditional controllers like Brimstone or Viper must play passively behind their team because their death eliminates all smokes for the remainder of the round. Clove reverses this dynamic, empowering players with duelist-tier survivability, aggressive self-buffs, and the revolutionary ability to deploy tactical smokes from beyond the grave.

### 1. Ability Breakdown & Hidden Mechanics

#### Ruse (Tactical Smokes)
* **Mechanic:** Press your smoke key to open a tactical overhead circular map. Clove can deploy up to two dense smokes with a 30-second recharge timer.
* **The Post-Mortem Superpower:** The true power of Ruse is that **it can be cast after you die**. If you die on bombsite entry or in an early defense trade, your ghost retains access to your smoke map within a circular radius of your death location.
* **Critical Positioning Rule:** Because your post-mortem smoke range is anchored to your corpse, **never die deep in your own spawn**. Always push forward to contest chokepoints or site perimeters so your death location covers both bombsites and key retake routes.

#### Pick-Me-Up (Overheal & Combat Haste)
* **Mechanic:** Damaging or killing an opponent activates a prompt to immediately absorb their vitality.
* **Combat Effect:** Grants up to 100 temporary health (overhealing up to a hard cap of 150 HP, functionally restoring full heavy shields) and a 15% movement speed boost for 10 seconds.
* **Strategic Usage:** Use Pick-Me-Up immediately after winning an opening 1v1 duel to aggressively swing the second enemy player before they can trade you. The temporary speed boost also breaks enemy crosshair tracking during re-peeks.

#### Meddle (Decay Orb)
* **Mechanic:** Throw an entropic mineral fragment that detonates after a brief windup, applying a devastating 90 HP decay debuff to all players caught within the blast radius.
* **Lethal Combos:** Enemies afflicted with Meddle drop to 10 to 60 HP. A single bullet from a Ghost, Phantom, or Classic will kill them instantly. Pair Meddle with teammate utility (such as Raze Paint Shells, Sova Shock Darts, or a simple Phantom spray through smoke) to wipe out clustered enemy rushes.

#### Not Dead Yet (Ultimate — Self-Resurrection)
* **Mechanic:** Upon taking fatal damage, activate your ultimate within 2 seconds to resurrect on the spot in an invulnerable, intangible ethereal state.
* **The Survival Condition:** You have exactly 12 seconds to secure an elimination or a damaging assist. If you fail to earn a kill/assist before the timer expires, you instantly perish.
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
* **The Jamming Debuff:** Any enemy caught in the radius has their primary weapon physically jammed for 8 full seconds. They are forcefully swapped to their secondary sidearm or melee.
* **Winning Full-Buy Rounds:** In rounds where enemies hold Vandals, Phantoms, or Operators, casting Steel Garden forces them onto Classics and Ghosts. Your team can simply swing with full-auto rifles for an uncontested site retake or execute.

### 2. Map-Specific Defensive Setups
* **Ascent B Site:** Place Shear across the inner B Main entrance. Place Arc Rose on the Pillar facing B Choke. Hide Razorvine on the lane. The moment attackers rush, pop Arc Rose, trigger Razorvine, and watch Shear trap the first two attackers inside your kill zone.
* **Bind A Site:** Place Shear across the A Short teleporter exit. Position Arc Rose high on U-Hall. When enemies push out of Short, the wall isolates them while your U-Hall flash blinds their entire approach.`,

  "iso-duelist-guide-1v1-arena": `Iso is the ultimate tactical dueling specialist in VALORANT—an operative engineered to bypass the chaotic crossfires of 5v5 teamfights and force pure, mechanical aim duels. With energy shielding that absorbs lethal single-hit damage and a pocket dimension that drags opponents into isolated 1v1 arenas, mastering Iso requires fearless confidence in your first-shot headshot precision.

### 1. In-Depth Ability Breakdown

#### Double Tap (Energy Shield)
* **Mechanic:** Activate a focus timer. While active, securing a kill or damaging an enemy that subsequently dies spawns a floating energy orb above their corpse. Shooting this orb grants Iso an indestructible energy shield.
* **The Damage Negation Rule:** Iso's shield absorbs any single instance of damage, regardless of magnitude! A Vandal headshot (160 damage), an Operator chest shot (150 damage), or even a direct hit from a Raze Showstopper rocket launcher is reduced to exactly 0 damage.
* **Dueling Value:** Entering an engagement with Double Tap active mathematically guarantees you a second chance. If both you and an enemy Vandal user click each other's heads at the exact same millisecond, you survive with 100% health while they die.

#### Contingency (Prismatic Bulletproof Wall)
* **Mechanic:** Push forward an indestructible, moving bulletproof energy barrier that travels along the floor in a straight trajectory.
* **Space Creation:** Contingency cannot be broken by bullets, Operator shots, or Odin spam. Use it to safely cross wide sniper alleys (like Breeze Mid, Ascent Mid Courtyard, or Icebox B Lane) or to push narrow chokepoints like Bind Hookah without exposing your body to defensive crossfires.

#### Undercut (Molecular Fragile Beam)
* **Mechanic:** Fire a molecular bolt through solid geometry and walls that applies the Fragile status debuff to all players in its path for 4 seconds.
* **Damage Multiplication:** Fragile doubles all incoming damage. An enemy afflicted with Fragile takes 80 damage from a single Vandal body shot and 150 damage from a Sheriff shot, allowing you to tear through full-armor defenders effortlessly.

#### Kill Contract (Ultimate — The Interdimensional Arena)
* **Mechanic:** Cast an expansive column of energy that pulls you and the first enemy hit into an interdimensional battle arena.
* **Arena Rules:** Inside the arena, all external abilities are locked. You spawn with two protective barricades, while the enemy spawns with one. A countdown timer begins immediately; if neither player dies before the timer expires, both players are instantly eliminated.
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
* In high-ELO and professional play, players frequently purchase Light Shields ($250) instead of Heavy Shields ($400) to save $150 per round, giving them a maximum health pool of 125 HP.
* An Outlaw body shot deals 140 damage. Against an enemy wearing Light Shields, you do not need to aim for the head. Simply placing your crosshair on their torso or shoulder yields an instantaneous one-hit kill!
* Furthermore, in rounds where enemies take even 10 damage from a stray bullet, fall damage, or chip utility (like a Brimstone stim burn or Viper decay), an Outlaw body shot kills full-armor opponents instantly.

### 3. The Dual-Barrel Cadence & Scope Mechanics
* **Semi-Automatic Firing:** Unlike the bolt-action Marshal or Operator, the Outlaw houses two chambers and can fire both rounds back-to-back at 2.75 rounds per second without un-scoping. If your first shot hits an enemy for 140 and they survive with Heavy Shields, you can instantly double-tap the second round within 0.36 seconds to finish them off.
* **The Reload Trap (Crucial Mechanic!):** The Outlaw uses a break-action dual cartridge mechanism:
  * **Partial Reload (1 Bullet Fired):** Takes only 1.25 seconds.
  * **Full Empty Reload (Both Bullets Fired):** Takes a massive 3.80 seconds, leaving you completely defenseless for nearly four full seconds!
  * **The Pro Rule:** Always reload immediately after firing your first shot whenever you are in safe cover. Never empty both barrels unless you are in an emergency kill-or-be-killed situation.

### 4. Economic Situational Matrix
* **Buy the Outlaw on Round 2 (After Winning Pistol):** The enemy team will almost certainly buy Light Shields or zero armor. The Outlaw is a 100% guaranteed 1-shot body kill against every single player on the enemy team!
* **Buy on Defense Half-Buys ($3,000 Credits):** Pair the Outlaw with Light Shields. You can anchor long sightlines (Ascent Mid, Breeze A Long, Sunset B Alley) and delete enemy Duelists before they enter your bombsite.`,

  "valorant-movement-guide": `In tactical first-person shooters, movement and gun accuracy are inextricably linked. Many players spend hundreds of hours training their mouse aim in third-party software, yet struggle to climb past Silver or Gold because their keyboard mechanics are sloppy. In VALORANT, you cannot fire rifles accurately while your character model retains horizontal momentum. Mastering counter-strafing, dead-zoning, silent bunny hopping, and jiggle-peeking is the true mechanical foundation of high-rank gameplay.

### 1. Counter-Strafing: The Mechanical Truth
In VALORANT, firing a rifle while moving results in severe, randomized bullet bloom. To achieve 100% first-bullet laser accuracy, your movement speed must drop below 25% of maximum velocity:
* **The Physics:** If you are strafing to the right by holding D, simply releasing the key allows your character model to coast to a natural stop over roughly 0.22 seconds.
* **The Counter-Strafe:** Instead of letting go of D and coasting, you release D and instantly tap A (the opposite direction key) once. This active counter-input immediately cancels your character's forward momentum, bringing your velocity to zero in under 0.08 seconds.
* **The Payoff:** Counter-strafing allows you to shoot with pinpoint accuracy 0.14 seconds faster than an opponent who simply releases their key. In a duel where TTK is 0.18 seconds, that 0.14-second advantage is the difference between victory and defeat.

### 2. Dead-Zoning: Moving While Shooting Accurately
Dead-zoning is an advanced mechanical technique heavily utilized by Radiant Duelists:
* When you transition your movement from pressing A to pressing D (strafing left, then right), there is an exact micro-window of roughly 8 to 12 frames where your character's physical velocity crosses through zero as momentum reverses.
* If you time your mouse click to occur during that exact reversal window, your rifle will fire with 100% first-shot accuracy, even though to your enemy's perspective, your character never stopped moving!
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
Every competitive map in VALORANT was designed by Riot Games using a standardized geometric grid. Player character models are exactly 1.8 meters tall, and map environments are filled with subtle horizontal landmarks calibrated to exact head level:
* **Radenite Box Seams:** The horizontal dark metal band dividing the top and bottom halves of every green radenite crate is positioned at exact standing head height.
* **Wall Trim & Door Frames:** The horizontal wooden trims on Ascent, the tile lines on Split, and the metal panel seams on Bind are aligned to head level.
* **Paint Lines & Decals:** Many walls feature subtle stripe decals designed as visual guides for level geometry.
* **The Rule:** Train your eyes to identify these horizontal lines on every map. Your reticle should glide horizontally across these seams like a train on a track—never pointing toward the floor or scanning empty skies.

### 3. Compensating for Reaction Time: The Buffer Gap
The single most common mistake intermediate players make is gluing their crosshair directly to the edge of the corner they are holding:
* Human visual reaction time under tournament conditions is roughly 180 to 220 milliseconds.
* If you hold your crosshair flush against the wall, an enemy swinging around the corner will already be 1 to 2 meters past your reticle by the time your brain processes the stimulus and clicks your mouse.
* **The Correct Alignment:** Position your crosshair one to two model-widths away from the edge of the wall. Let the enemy run directly into your pre-aimed bullet path. If you suspect the enemy will wide-swing, increase the gap to 3 model-widths.

### 4. Angle Slicing (The Pie Method)
When entering a bombsite, never swing blindly into open space:
* Move along a circular arc, slicing the corner into 5-degree increments.
* Clear each individual hiding cubby one by one: first Wine, then Generator, then Site, then Heaven.
* By clearing angles sequentially, you ensure that you are only ever exposed to one enemy line of sight at any given microsecond.`,

  "sunset-map-meta-compositions": `Sunset is a compact, urban Los Angeles-themed battleground characterized by narrow choke bottlenecks, a critically important central courtyard (Mid Tiles and Market), and dense bombsite layouts that favor aggressive Sentinel utility and explosive Initiator executes. Understanding the territorial tug-of-war for Mid Market is the absolute key to dominating Sunset in ranked and tournament play.

### 1. The Strategic Core: Why B Market Dictates the Map
On Sunset, the central area known as B Market is the strategic pivot of the entire match:
* If attackers control B Market, they cut off defender rotations between A and B, gain sightlines directly into Defender Spawn, and can pinch B Site from two completely separate choke angles simultaneously (B Main + Market).
* If defenders lock down B Market, attackers are suffocated into narrow, highly predictable 5-man funnel pushes down A Main or B Main, where Sentinel traps can slaughter them.

### 2. S-Tier Team Composition on Sunset

#### A. Cypher (Sentinel) — The Unshakable B Anchor
Cypher is arguably the most dominant agent on Sunset. His Trapwires placed across the entrance of B Main can be strung diagonally through the archway where attackers cannot destroy them without walking into your line of fire. Paired with a Spycam on B Site pillar and Cyber Cages on the choke, a skilled Cypher can solo-hold B Site against an entire 5-man rush.

#### B. Omen (Controller) — Versatile Vision Denial
Omen's 30-second regenerating Dark Cover smokes are vital for constantly smoking Mid Top, Market, and A Elbow. His Paranoia covers the entirety of A Main or B Main, blinding attackers through walls and setting up effortless team counter-swings.

#### C. Raze (Duelist) — Explosive Space Creation
Sunset's tight corridors and high walls make Raze significantly more impactful than Jett:
* **Paint Shells (Grenade):** Tossing a grenade into B Market, A Alley, or B Main forces enemies out of hiding corners or deals lethal 150+ damage in tight spaces.
* **Boom Bot:** Clears A Elbow and B Boba automatically, burning enemy defensive traps without risking teammate lives.

#### D. Fade / Sova (Initiators) — Roof Scanning Intel
Sunset's open roof architecture allows Fade to toss Haunt eyes onto high roof ledges overlooking Mid Courtyard, scanning the entire central map instantly. Her Prowlers are essential for clearing tight corners in A Main and Market.

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
* **Attacking A Site:** The battle for A Rubble decides A Site control. Flood A Rubble with Breach stuns and Fade Prowlers. Smoke A Top (Heaven) and A Drop. Plant the Spike on the lower terrace and fall back to A Rubble for post-plant crossfires.
* **Attacking C Site:** C Site features a narrow bottleneck into C Mound. Smoke C Waterfall and C Hall. Flash behind the central stone pillar to clear anchors. Secure the plant in front of the central pillar for easy line of sight from C Mound.`,

  "clutch-decision-making-guide": `Clutching in VALORANT—stepping onto the battlefield as the last surviving member of your team facing a 1v2, 1v3, or 1v4 deficit—is the ultimate test of tactical poise, spatial reasoning, and mental discipline. Elite clutch players like Chronicle, Boaster, and crashies do not win clutches through reckless aggression; they win because they systematically dismantle multi-enemy advantages through psychology, clock management, and geometry.

### 1. The Fundamental Law of Clutching: The 1v1 Cascade
When you are in a 1v3 situation, you can never win if you fight all three opponents at the same time:
* Your primary objective is to use map geometry (corners, pillars, crates, smokes) to create physical line-of-sight barriers that isolate each opponent.
* **The Isolation Rule:** Position your body so that while you are dueling Player A, Players B and C are physically blocked by a wall or smoke and cannot shoot you. You are not fighting a 1v3; you are fighting three consecutive 1v1 duels.

### 2. The Psychology of the Spike Audio Tap
In post-plant clutch scenarios, the Spike audio cue is your greatest psychological weapon:
* **The First Tap:** Tapping the defuse key produces a loud, unmistakable chime that reverberates across the entire bombsite.
* **Manipulating Defenders:** Attackers hiding in post-plant corners will immediately experience panic when they hear the defuse tap. Their brain tells them: "He is defusing, I must swing now!"
* **The Tap-and-Hold:** Tap the Spike for 0.5 seconds to generate the sound cue, immediately release, step back into an off-angle, and pre-aim the corner. Nine times out of ten, an impatient attacker will sprint blindly around the corner directly into your crosshair.

### 3. The 45-Second Clock is Your Teammate (On Defense)
If you are an attacker holding the planted Spike against two retaking defenders:
* **Do Not Hunt:** The most common clutch mistake is peeking defenders in their spawn to pad your K/D ratio.
* Remember that the Spike takes 45 seconds to detonate, while a defuse takes 7 full seconds (or 3.5 seconds to reach the half-defuse checkpoint).
* Every second that ticks away increases defender panic and forces them to make rushed, sloppy pushes. Hide, play off sound, jiggle-peek only to disrupt defuse attempts, and let the bomb timer secure the round.

### 4. Economy Awareness in Clutches
* **Knowing When to Save:** If you are in a 1v4 scenario with 15 seconds remaining, 30 HP, no utility, and hold an expensive Vandal or Operator, do not attempt the hero play.
* Concede the round, walk into a safe corner, and save your weapon. Preserving a $2,900 rifle saves your team's economy and guarantees you can full-buy with your teammates on the next round.`,

  "valorant-weapon-tier-list-2026": `An authoritative, data-driven tier ranking of all primary and secondary weapons in the competitive VALORANT meta based on damage metrics, kill-cadence, cost efficiency, and VCT tournament pick rates.

### S-Tier (Meta-Defining Primaries)
* **Vandal ($2,900):** Range-independent 1-tap headshot lethality (160 damage). The undisputed king of competitive rifle play.
* **Phantom ($2,900):** Silenced, tracerless stealth spraying through smoke with superior fire rate and recoil recovery.
* **Operator ($4,700):** The definitive one-shot sniper rifle that locks down defensive sightlines.

### A-Tier (High-Efficiency Weapons)
* **Outlaw ($2,400):** Deadly anti-eco and light-shield sniper dealing 140 body damage with two rapid semi-auto shots.
* **Ghost ($500):** The gold standard pistol round sidearm offering high accuracy, silencer benefits, and 105 headshot damage.
* **Sheriff ($800):** Budget hand-cannon capable of 159 headshot kills under 30 meters.
* **Odin ($3,200):** Overwhelming suppressive fire and extreme wall-penetration on maps with paper-thin walls (Ascent, Sunset).

### B-Tier (Situational & Eco Weapons)
* **Spectre ($1,600):** Reliable close-quarters SMG for anti-eco rounds.
* **Bulldog ($2,050):** Economical rifle featuring a 3-round burst zoom mode for long-range holds.
* **Guardian ($2,250):** Semi-automatic marksman rifle with high wall penetration and 195 headshot damage.
* **Judge ($1,850):** Close-range automated shotgun built for holding corners inside smokes.`,

  "best-vandal-skins-ranked": `With hundreds of weapon skins available in VALORANT, selecting the best Vandal skin comes down to sound design, muzzle flash clarity, reload animations, and psychological "aimbot" feel.

### Top Tier Vandal Skins Ranked

#### 1. Kuronami Vandal (Exclusive Tier)
* **Sound Design:** Crisp, aquatic blade-drawing sound effects with minimalist water droplet audio cues on kill.
* **Finisher:** Summons a torrential storm vortex that suspends enemies in a sphere of water.
* **Why Pros Love It:** The light, sharp sound profile provides instant audio feedback without overwhelming game sound.

#### 2. Reaver Vandal (Premium Tier)
* **Sound Design:** Dark, deep cathedral bell chimes that ring on each successive kill.
* **Finisher:** Underworld tentacles erupt from the floor to drag the target into darkness.
* **Why Pros Love It:** The heavy, deliberate reload animation promotes calm, disciplined trigger tapping.

#### 3. Prime Vandal (Premium Tier)
* **Sound Design:** High-frequency laser sound with iconic mechanical reload cartridge ejection.
* **Why Pros Love It:** Widely regarded as the cleanest shooting skin in the game, with zero visual clutter on screen during rapid sprays.

#### 4. Araxys Vandal (Exclusive Tier)
* **Sound Design:** Mechanical alien armor plating that flexes and breathes during weapon inspects.
* **Finisher:** Disintegrates the defeated player in a beam of orbital energy.`,

  "corrode-rework-map-guide": `Patch 13.08 introduced the comprehensive Corrode rework, overhauling hazardous industrial waste pools, widening narrow chokepoints, and balancing bombsite sightlines for competitive tournament play.

### Key Rework Changes in Patch 13.08
* **Acid Pit Safety:** Several non-railed industrial chemical pools were replaced with solid metal grating, reducing accidental hazard deaths while maintaining tight combat zones.
* **B Long Sightline Expansion:** B Long's corridor was widened by 1.8 meters, preventing single smokes from completely suffocating attacker movement.
* **A Site Generator Elevation:** The high-ground generator box on A Site was adjusted to standard crouch-jump height, making it accessible to all agents without requiring vertical mobility abilities.`,

  "act-6-map-rating-system": `A comprehensive breakdown of how VALORANT's map rating and competitive pool rotation system functions in 2026, including map-weighting algorithms and win-rate balance metrics across casual and professional play.

### The 7-Map Competitive Rotation Pool
Riot Games maintains a strict 7-map pool for competitive matchmaking and VCT tournaments:
* **The Pacing Rationale:** Limiting the active pool to 7 maps prevents strategy fatigue, ensures teams can develop deep lineups, and maintains healthy ban-pick phases in best-of-three series.
* **Community Rating Factors:** Maps are continuously evaluated based on:
  * Attacker vs. Defender round-win symmetry (targeting a 50% / 50% balance).
  * Agent diversity index (preventing maps where a single agent has a 100% mandatory pick rate).
  * Post-plant retake success rates.`
};

let count = 0;
for (const guide of guides) {
  if (masterContent[guide.slug]) {
    guide.content = masterContent[guide.slug];
    const wordCount = guide.content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(4, Math.ceil(wordCount / 180));
    guide.readTime = `${minutes} min read`;
    count++;
    console.log(`Updated "${guide.slug}": ${wordCount} words (${guide.readTime})`);
  }
}

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2), "utf-8");
console.log(`\nSuccessfully master-enriched ${count} guides!`);
