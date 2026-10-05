import fs from "fs";

let text = fs.readFileSync("./src/lib/valorant-db.ts", "utf8");

// 1. Add Warden, Bandit, Melee to weapons
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

if (!text.includes('"slug": "warden"')) {
  text = text.replace(/weapons:\s*\[\r?\n/, `weapons: [\r\n${wardenWeapon}\r\n`);
}

// 2. Add Summit to maps
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

if (!text.includes('"slug": "summit"')) {
  text = text.replace(/maps:\s*\[\r?\n/, `maps: [\r\n${summitMap}\r\n`);
}

// 3. Add passives for Astra and Viper
if (!text.includes('"ASTRAL FORM"')) {
  const astraPassive = `            {
                "key": "Passive",
                "name": "ASTRAL FORM",
                "type": "Passive Ability",
                "description": "ACTIVATE (Ultimate Key) to enter Astral Form where you can survey the map and place Stars with PRIMARY FIRE. Stars can later be transformed into Nova Pulse, Nebula, or Gravity Well.",
                "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/passive/displayicon.png"
            },`;
  text = text.replace(
    /("name":\s*"ASTRAL FORM \/ COSMIC DIVIDE",[\s\S]*?"icon":\s*"[^"]*"\s*})(\r?\n\s*\])/,
    `$1,\r\n${astraPassive}$2`
  );
}

if (!text.includes('"TOXIC"')) {
  const viperPassive = `            {
                "key": "Passive",
                "name": "TOXIC",
                "type": "Passive Ability",
                "description": "Viper's chemical weapons inflict a Decay debuff that instantly subtracts enemy health while exposed. Health begins regenerating shortly after leaving the chemical zone.",
                "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/passive/displayicon.png"
            },`;
  text = text.replace(
    /("name":\s*"VIPER'S PIT",[\s\S]*?"icon":\s*"[^"]*"\s*})(\r?\n\s*\])/,
    `$1,\r\n${viperPassive}$2`
  );
}

// 4. Update weapon stat decimals for exact Riot API parity
text = text.replace(/"name": "ARES",[\s\S]*?"dmgLeg": 25,/, (m) => m.replace('"dmgLeg": 25,', '"dmgLeg": 25.5,'));
text = text.replace(/"name": "BULLDOG",[\s\S]*?"dmgHead": 115,[\s\S]*?"dmgLeg": 29,/, (m) =>
  m.replace('"dmgHead": 115,', '"dmgHead": 115.5,').replace('"dmgLeg": 29,', '"dmgLeg": 29.75,')
);
text = text.replace(/"name": "GHOST",[\s\S]*?"dmgLeg": 25,/, (m) => m.replace('"dmgLeg": 25,', '"dmgLeg": 25.5,'));
text = text.replace(/"name": "SHERIFF",[\s\S]*?"dmgHead": 159,[\s\S]*?"dmgLeg": 46,/, (m) =>
  m.replace('"dmgHead": 159,', '"dmgHead": 159.5,').replace('"dmgLeg": 46,', '"dmgLeg": 46.75,')
);
text = text.replace(/"name": "GUARDIAN",[\s\S]*?"dmgLeg": 48,/, (m) => m.replace('"dmgLeg": 48,', '"dmgLeg": 48.75,'));
text = text.replace(/"name": "MARSHAL",[\s\S]*?"dmgLeg": 85,/, (m) => m.replace('"dmgLeg": 85,', '"dmgLeg": 85.85,'));
text = text.replace(/"name": "STINGER",[\s\S]*?"dmgHead": 67,[\s\S]*?"dmgLeg": 22,/, (m) =>
  m.replace('"dmgHead": 67,', '"dmgHead": 67.5,').replace('"dmgLeg": 22,', '"dmgLeg": 22.95,')
);

fs.writeFileSync("./src/lib/valorant-db.ts", text, "utf8");
console.log("Successfully patched valorant-db.ts with CRLF support!");
