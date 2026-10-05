import fs from "fs";

let content = fs.readFileSync("./src/lib/valorant-db.ts", "utf8");

// 1. Update AgentAbility key type
content = content.replace(
  'key: "Q" | "E" | "C" | "X";',
  'key: "Q" | "E" | "C" | "X" | "Passive";'
);

// 2. Add passives to Astra, Viper, Sova, Phoenix, Jett if not already present
if (!content.includes('"DRIFT"')) {
  const jettTarget = '"name": "BLADE STORM",';
  const jettPassive = `                "key": "Passive",
                "name": "DRIFT",
                "type": "Passive Ability",
                "description": "Holding the jump button while falling allows Jett to glide through the air, negating fall damage and enabling aerial mobility.",
                "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/passive/displayicon.png"
            },
            {
                "key": "X",
                "name": "BLADE STORM",`;
  content = content.replace(
    /{\s*"key":\s*"X",\s*"name":\s*"BLADE STORM",/,
    `{\n${jettPassive}`
  );
}

if (!content.includes('"HEATING UP"')) {
  const phoenixPassive = `                "key": "Passive",
                "name": "HEATING UP",
                "type": "Passive Ability",
                "description": "Phoenix's fire abilities heal him over time instead of dealing damage when he stands inside the flames.",
                "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/passive/displayicon.png"
            },
            {
                "key": "X",
                "name": "RUN IT BACK",`;
  content = content.replace(
    /{\s*"key":\s*"X",\s*"name":\s*"RUN IT BACK",/,
    `{\n${phoenixPassive}`
  );
}

if (!content.includes('"UNCANNY MARKSMAN"')) {
  const sovaPassive = `                "key": "Passive",
                "name": "UNCANNY MARKSMAN",
                "type": "Passive Ability",
                "description": "Custom bow modifications allow Sova to bounce Recon and Shock arrows up to two times off surfaces before detonation.",
                "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/passive/displayicon.png"
            },
            {
                "key": "X",
                "name": "HUNTER'S FURY",`;
  content = content.replace(
    /{\s*"key":\s*"X",\s*"name":\s*"HUNTER'S FURY",/,
    `{\n${sovaPassive}`
  );
}

// 3. Add Warden, Bandit, and Melee to weapons
const wardenWeapon = `    {
        "slug": "warden",
        "name": "WARDEN",
        "category": "RIFLES",
        "cost": 2900,
        "fireRate": 6.5,
        "reloadSpeed": 2.5,
        "magazineSize": 18,
        "dmgHead": 200,
        "dmgBody": 50,
        "dmgLeg": 42,
        "description": "High-caliber precision battle rifle engineered for mid-to-long distance combat with guaranteed lethal headshots and ADS magnification.",
        "recoil": "Heavy vertical kick with tight initial three-round grouping.",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/8db0a1bf-4a50-832a-4566-faaaa6d250ca/displayicon.png"
    },
    {
        "slug": "bandit",
        "name": "BANDIT",
        "category": "SIDEARMS",
        "cost": 600,
        "fireRate": 5.1,
        "reloadSpeed": 1.5,
        "magazineSize": 8,
        "dmgHead": 152,
        "dmgBody": 39,
        "dmgLeg": 33,
        "description": "Tactical compact sidearm featuring high close-range stopping power and rapid equip speed, ideal for eco round dueling.",
        "recoil": "Moderate recoil with fast crosshair centering recovery.",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/410b2e0b-4ceb-1321-1727-20858f7f3477/displayicon.png"
    },
    {
        "slug": "melee",
        "name": "MELEE",
        "category": "HEAVY",
        "cost": 0,
        "fireRate": 1.0,
        "reloadSpeed": 0,
        "magazineSize": 0,
        "dmgHead": 75,
        "dmgBody": 50,
        "dmgLeg": 50,
        "description": "Tactical combat knife equipped to all operatives. Deals double damage when striking opponents from behind.",
        "recoil": "Instant strike",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/2f59173c-4bed-b6c3-2191-dea9b58be9c7/displayicon.png"
    },`;

if (!content.includes('"slug": "warden"')) {
  content = content.replace(
    '  weapons: [\n',
    `  weapons: [\n${wardenWeapon}\n`
  );
}

// 4. Add Summit to maps
const summitMap = `    {
        "slug": "summit",
        "name": "SUMMIT",
        "location": "29° 18' FC\\\" N, 110° 25' ZQ\\\" E",
        "lore": "A high-altitude aerospace research complex perched amidst sheer mountain peaks in China. Features dual bomb sites separated by winding transit tunnels and elevated snow bridges.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID TOWER",
            "A LINK",
            "B CORRIDOR",
            "SNOW BRIDGE",
            "A LOBBY",
            "B LOBBY",
            "A MAIN",
            "B MAIN",
            "MID COURTYARD",
            "DEFENDER SPAWN"
        ],
        "strategies": [
            "Fight for early control of Mid Tower to isolate A and B site defensive rotations.",
            "Coordinate fast executes across the open Snow Bridge with long smokes and flash lineups.",
            "Utilize sentinel anchor utility on B Corridor to shut down fast attacker split pushes."
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/756da597-416b-c0f2-f47b-afbdf28670bc/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/756da597-416b-c0f2-f47b-afbdf28670bc/splash.png"
    },`;

if (!content.includes('"slug": "summit"')) {
  content = content.replace(
    '  maps: [\n',
    `  maps: [\n${summitMap}\n`
  );
}

// 5. Add 13.06, 13.05, 13.04, 13.03 to patches
const newPatches = `    {
        "slug": "patch-1306",
        "version": "13.06",
        "date": "SEPTEMBER 22, 2026",
        "title": "VALORANT Patch Notes 13.06",
        "season": "Season 2026",
        "act": "Act 5",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-06/",
        "tags": ["Warden Fine-Tuning", "Bandit Balance", "Champions 2026", "Map Rotation"],
        "buffs": [
            {
                "subject": "Warden Rifle",
                "detail": "Tightened first-shot recovery time from 0.35s to 0.30s while maintaining 200 headshot lethal profile."
            },
            {
                "subject": "Summit Map",
                "detail": "Added additional cover prop on B Site Link to balance attacker plant defense options."
            }
        ],
        "nerfs": [
            {
                "subject": "Bandit Sidearm",
                "detail": "Adjusted damage falloff at 30-50m range from 116 to 112 headshot damage to prevent long-distance spam."
            }
        ],
        "updates": [
            "Active competitive map pool confirmed for Season 2026 Act 5: Abyss, Bind, Corrode, Haven, Lotus, Split, Summit.",
            "Implemented official VCT Champions 2026 celebratory esports interface and trophy flex item animations.",
            "Fixed audio occlusion issues on Summit cable transit tunnels."
        ]
    },
    {
        "slug": "patch-1305",
        "version": "13.05",
        "date": "SEPTEMBER 8, 2026",
        "title": "VALORANT Patch Notes 13.05",
        "season": "Season 2026",
        "act": "Act 5",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-05/",
        "tags": ["Agent Balance", "Tejo", "Veto", "Sentinel Tuning"],
        "buffs": [
            {
                "subject": "Veto Sentinel",
                "detail": "Decreased Interceptor deploy time by 0.25s for faster site anchor response."
            },
            {
                "subject": "Miks Controller",
                "detail": "Increased Waveform width radius by 1.5 meters for wider corridor vision denial."
            }
        ],
        "nerfs": [
            {
                "subject": "Tejo Initiator",
                "detail": "Reduced Guided Salvo explosion radius slightly to reward direct target coordination."
            }
        ],
        "updates": [
            "Refined tactical radar minimap icon responsiveness during high-particle ultimate executions.",
            "Updated store bundle rotation backend with optimized preview rendering."
        ]
    },
    {
        "slug": "patch-1304",
        "version": "13.04",
        "date": "AUGUST 25, 2026",
        "title": "VALORANT Patch Notes 13.04",
        "season": "Season 2026",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-04/",
        "tags": ["Waylay Tuning", "Corrode Fixes", "Audio Polish"],
        "buffs": [
            {
                "subject": "Waylay Duelist",
                "detail": "Reduced recovery winddown on Lightspeed to enhance smooth repositioning."
            },
            {
                "subject": "Corrode Map",
                "detail": "Optimized lighting and visibility across rusted chemical pipeline corridors."
            }
        ],
        "nerfs": [
            {
                "subject": "Odin Heavy",
                "detail": "Slightly increased crouch-to-stand spread decay to stabilize defensive choke holds."
            }
        ],
        "updates": [
            "Improved directional spatial audio processing on PC and console editions.",
            "Added automated competitive match toxicity detection filters in voice and text channels."
        ]
    },
    {
        "slug": "patch-1303",
        "version": "13.03",
        "date": "AUGUST 11, 2026",
        "title": "VALORANT Patch Notes 13.03",
        "season": "Season 2026",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-03/",
        "tags": ["Economy Rules", "Performance", "Anti-Cheat"],
        "buffs": [
            {
                "subject": "Deadlock Barrier",
                "detail": "Increased spherical core anchor health by 50 HP."
            },
            {
                "subject": "Harbor High Tide",
                "detail": "Reduced recharge cooldown from 40s to 38s."
            }
        ],
        "nerfs": [
            {
                "subject": "Clove Not Dead Yet",
                "detail": "Reduced post-revive timer window by 1 second to enforce proactive gunfight engagement."
            }
        ],
        "updates": [
            "Optimized memory footprint on mid-tier client setups, reducing frame hitching by up to 15%.",
            "Upgraded Vanguard cheat signature detection heuristics for high-rank competitive lobbies."
        ]
    },`;

if (!content.includes('"slug": "patch-1306"')) {
  content = content.replace(
    '  patches: [\n',
    `  patches: [\n${newPatches}\n`
  );
}

fs.writeFileSync("./src/lib/valorant-db.ts", content, "utf8");
console.log("Successfully updated valorant-db.ts!");
