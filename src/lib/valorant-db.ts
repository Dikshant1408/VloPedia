export interface AgentAbility {
  key: "Q" | "E" | "C" | "X";
  name: string;
  description: string;
  type: string;
  icon?: string;
}

export interface Agent {
  slug: string;
  name: string;
  role: "DUELIST" | "CONTROLLER" | "INITIATOR" | "SENTINEL";
  origin: string;
  bio: string;
  abilities: AgentAbility[];
  counters: string[];
  bestMaps: string[];
  voiceLines: { context: string; text: string }[];
  portrait: string;
  trailerUrl?: string;
}

export interface Weapon {
  slug: string;
  name: string;
  category: "RIFLES" | "SNIPERS" | "SIDEARMS" | "SMGS" | "SHOTGUNS" | "HEAVY";
  cost: number;
  fireRate: number;
  reloadSpeed: number;
  magazineSize: number;
  dmgHead: number;
  dmgBody: number;
  dmgLeg: number;
  description: string;
  recoil: string;
  skins: string[];
  portrait?: string;
}

export interface Skin {
  slug: string;
  name: string;
  weaponSlug: string;
  price: number;
  rarity: "SELECT" | "DELUXE" | "PREMIUM" | "ULTRA" | "EXCLUSIVE";
  variants: { id: string; name: string; hex: string; hueRotate: string }[];
  inspectVideoUrl: string;
  reloadVideoUrl: string;
  communityRating: number;
  popularity: number;
}

export interface Bundle {
  slug: string;
  name: string;
  price: number;
  active: boolean;
  endsInSeconds: number;
  skins: string[];
  description: string;
  trailerUrl: string;
}

export interface MapData {
  slug: string;
  name: string;
  location: string;
  lore: string;
  callouts: string[];
  strategies: string[];
  minimapUrl: string;
  splashUrl?: string;
}

export interface LoreChapter {
  slug: string;
  title: string;
  chapter: number;
  content: string;
  summary: string;
}

export interface PatchNotes {
  slug: string;
  version: string;
  date: string;
  buffs: { subject: string; detail: string }[];
  nerfs: { subject: string; detail: string }[];
  updates: string[];
  title?: string;
  season?: string;
  act?: string;
  url?: string;
  tags?: string[];
}

export interface LeakFile {
  slug: string;
  codename: string;
  category: "AGENT" | "SKIN" | "MAP";
  discoveredDate: string;
  details: string;
  credibility: "HIGH" | "MEDIUM" | "SPECULATION";
}

// Monolithic Game Database
export const valorantDb = {
  agents: [
    {
        "slug": "astra",
        "name": "ASTRA",
        "role": "CONTROLLER",
        "origin": "Ghana",
        "bio": "Ghanaian Agent Astra harnesses the energies of the cosmos to reshape battlefields to her whim. With full command of her astral form and a talent for deep strategic foresight, she's always eons ahead of her enemy's next move.",
        "portrait": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Astra online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "NOVA PULSE",
                "type": "Basic Utility",
                "description": "Place Stars in Astral Form (Ultimate Key).\r\n\r\nACTIVATE a Star to detonate a Nova Pulse. The Nova Pulse charges briefly then strikes, Concussing all players in its area.",
                "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "NEBULA  / DISSIPATE",
                "type": "Basic Utility",
                "description": "Place Stars in Astral Form (Ultimate Key). \r\n\r\nACTIVATE a Star to transform it into a Nebula (smoke).\r\n\r\nUSE a Star to Dissipate it, returning the Star to be placed in a new location after a delay.\r\n\r\nDissipate briefly forms a fake Nebula at the Star's location before returning.",
                "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "GRAVITY WELL",
                "type": "Signature Utility",
                "description": "Place Stars in Astral Form (Ultimate Key).\r\n\r\nACTIVATE a Star to form a Gravity Well. Players in the area are pulled toward the center before it explodes, making all players still trapped inside Vulnerable.",
                "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "ASTRAL FORM / COSMIC DIVIDE",
                "type": "Ultimate Ability",
                "description": "ACTIVATE to enter Astral Form where you can place Stars with FIRE. Stars can be reactivated later, transforming them into a Nova Pulse, Nebula, or Gravity Well.\r\n\r\nWhen Cosmic Divide is charged, use ALT FIRE in Astral Form to begin aiming it, then FIRE to select two locations. An infinite Cosmic Divide connects the two points you select. Cosmic Divide blocks bullets and sound.",
                "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "brimstone",
        "name": "BRIMSTONE",
        "role": "CONTROLLER",
        "origin": "USA",
        "bio": "Joining from the U.S.A., Brimstone's orbital arsenal ensures his squad always has the advantage. His ability to deliver utility precisely and safely make him the unmatched boots-on-the-ground commander.",
        "portrait": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Brimstone online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "STIM BEACON",
                "type": "Signature Utility",
                "description": "INSTANTLY toss down a stim beacon. Upon landing, it creates a field that grants players a Combat Stim and a Speed Boost.",
                "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "INCENDIARY",
                "type": "Basic Utility",
                "description": "EQUIP an incendiary grenade launcher. FIRE to launch a grenade that detonates as it comes to a rest on the floor, creating a lingering fire zone that damages players within the zone.",
                "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "SKY SMOKE",
                "type": "Basic Utility",
                "description": "EQUIP a tactical map. FIRE to set locations where Brimstone's smoke clouds will land. ALT FIRE to confirm, launching long-lasting smoke clouds that block vision in the selected area.",
                "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "ORBITAL STRIKE",
                "type": "Ultimate Ability",
                "description": "EQUIP a tactical map. FIRE to launch a lingering orbital strike laser at the selected location, dealing high damage-over-time to players caught in the selected area.",
                "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "clove",
        "name": "CLOVE",
        "role": "CONTROLLER",
        "origin": "Scotland",
        "bio": "Scottish troublemaker Clove makes mischief for enemies in both the heat of combat and the cold of death. The young immortal keeps foes guessing, even from beyond the grave, their return to the living only ever a moment away.",
        "portrait": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Clove online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "PICK-ME-UP",
                "type": "Signature Utility",
                "description": "ACTIVATE to absorb the life force of a fallen enemy that Clove damaged or killed, gaining haste and temporary health.",
                "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/grenade/displayicon.png"
            },
            {
                "key": "C",
                "name": "RUSE",
                "type": "Basic Utility",
                "description": "EQUIP a view of the battlefield. FIRE to set the locations where Clove\u2019s clouds will settle. ALT FIRE to confirm, launching clouds that block vision in the chosen areas. Clove can use this ability after death.",
                "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "NOT DEAD YET",
                "type": "Ultimate Ability",
                "description": "After dying, ACTIVATE to resurrect. Once resurrected, Clove must earn a kill or a damaging assist within a set time or they will die. REACTIVATE to cancel early.",
                "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ultimate/displayicon.png"
            },
            {
                "key": "Q",
                "name": "MEDDLE",
                "type": "Basic Utility",
                "description": "EQUIP a fragment of immortality essence. FIRE to throw the fragment, which upon landing on the floor, erupts after a short delay and temporarily Decays all targets caught inside.",
                "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ability1/displayicon.png"
            }
        ]
    },
    {
        "slug": "harbor",
        "name": "HARBOR",
        "role": "CONTROLLER",
        "origin": "India",
        "bio": "Hailing from India\u2019s coast, Harbor storms the field wielding ancient technology with dominion over water. He unleashes frothing rapids and crushing waves to shield his allies, or pummel those that oppose him.",
        "portrait": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Harbor online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "HIGH TIDE",
                "type": "Basic Utility",
                "description": "EQUIP High Tide. FIRE to send water forward along the ground. HOLD FIRE to guide the water towards your crosshair spawning a vision blocking Screen along the path. ALT FIRE to stop the water early. All players crossing High Tide are Slowed.",
                "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ability1/displayicon.png"
            },
            {
                "key": "E",
                "name": "STORM SURGE",
                "type": "Signature Utility",
                "description": "EQUIP Storm Surge. FIRE to throw, creating an explosive whirlpool that Slows and Nearsights players within it after a short duration.",
                "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/grenade/displayicon.png"
            },
            {
                "key": "C",
                "name": "COVE",
                "type": "Basic Utility",
                "description": "EQUIP Cove. ACTIVATE to form a water Smoke in the select location. HOLD FIRE while targeting to move the marker further away and HOLD ALT FIRE to move it closer. RELOAD to toggle targeting view. REACTIVATE to Shield the water Smoke, blocking any bullets that hit it. The Shielded water Smoke can be destroyed.",
                "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "RECKONING",
                "type": "Ultimate Ability",
                "description": "EQUIP Reckoning. FIRE to unleash the full power of your artifact, releasing a surge of water that barrels forward to Nearsight and Slow enemies that are hit.",
                "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "miks",
        "name": "MIKS",
        "role": "CONTROLLER",
        "origin": "Unknown",
        "bio": "Straight from Croatia, Miks takes the stage channeling pure sound energy. With his infectious passion and sonic powers, he rallies his squad to move as one as they set the tempo on the battlefield together.",
        "portrait": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Miks online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "M-PULSE",
                "type": "Signature Utility",
                "description": "EQUIP M-pulse. ALT-FIRE to toggle between Concuss and Healing outputs. FIRE to throw the device. Upon landing, M-pulse sends out sound waves, either Concussing or Healing players.",
                "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/grenade/displayicon.png"
            },
            {
                "key": "C",
                "name": "WAVEFORM",
                "type": "Basic Utility",
                "description": "EQUIP a Map Targeter. FIRE to set locations. ALT-FIRE to spawn Smokes at selected locations.",
                "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ability2/displayicon.png"
            },
            {
                "key": "Q",
                "name": "HARMONIZE",
                "type": "Basic Utility",
                "description": "EQUIP Harmonize. Target an ally and FIRE to activate a Combat Stim and a speed boost on yourself and the ally that refreshes with each kill. ALT-FIRE to grant Combat Stim and speed boost to yourself.",
                "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ability1/displayicon.png"
            },
            {
                "key": "X",
                "name": "BASSQUAKE",
                "type": "Ultimate Ability",
                "description": "EQUIP Bassquake. FIRE to build up and unleash Sonic Radiance forward, knocking back, Deafening, and Slowing players.",
                "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "omen",
        "name": "OMEN",
        "role": "CONTROLLER",
        "origin": "Unknown",
        "bio": "A phantom of a memory, Omen hunts in the shadows. He renders enemies blind, teleports across the field, then lets paranoia take hold as his foe scrambles to uncover where he might strike next.",
        "portrait": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png",
        "bestMaps": [
            "split",
            "bind",
            "ascent"
        ],
        "counters": [
            "Sova",
            "Fade",
            "KAY/O"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Look at them scramble. They do not see what lies beneath."
            },
            {
                "context": "Ultimate Ready",
                "text": "Scatter!"
            },
            {
                "context": "Kill Spike Carrier",
                "text": "The carrier falls."
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "PARANOIA",
                "type": "Basic Utility",
                "description": "EQUIP a blinding orb.  FIRE to throw it forward, briefly Nearsighting and Deafening all players it touches. This projectile can pass straight through walls.",
                "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "DARK COVER",
                "type": "Basic Utility",
                "description": "EQUIP a shadow orb, entering a phased world to place and target the orbs. PRESS the ability key to throw the shadow orb to the marked location, creating a long-lasting shadow sphere that blocks vision. HOLD FIRE while targeting to move the marker further away. HOLD ALT FIRE while targeting to move the marker closer. PRESS RELOAD to toggle normal targeting view.",
                "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "SHROUDED STEP",
                "type": "Signature Utility",
                "description": "EQUIP a shrouded step ability and see its range indicator. FIRE to begin a brief channel, then teleport to the marked location.",
                "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "FROM THE SHADOWS",
                "type": "Ultimate Ability",
                "description": "EQUIP a tactical map. FIRE to begin teleporting to the selected location. While teleporting, Omen will appear as a Shade that can be destroyed by an enemy to cancel his teleport, or PRESS EQUIP for Omen to cancel his teleport.",
                "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "viper",
        "name": "VIPER",
        "role": "CONTROLLER",
        "origin": "USA",
        "bio": "The American Chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mindgames surely will.",
        "portrait": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Viper online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "POISON CLOUD",
                "type": "Basic Utility",
                "description": "EQUIP a gas emitter. FIRE to throw the emitter that perpetually remains throughout the round. ALT FIRE to lob. RE-USE the ability to create a toxic gas cloud that Decays opponents inside it at the cost of fuel. This ability can be picked up to be REDEPLOYED before the round starts and can be RE-USED more than once throughout the round.",
                "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "TOXIC SCREEN",
                "type": "Basic Utility",
                "description": "EQUIP a gas emitter launcher that penetrates terrain. FIRE to deploy a long line of gas emitters. RE-USE the ability to create a tall wall of toxic gas that Decays opponents that cross it at the cost of fuel. This ability can be RE-USED more than once.",
                "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "SNAKE BITE",
                "type": "Signature Utility",
                "description": "EQUIP a chemical launcher. FIRE to launch a canister that shatters upon hitting the floor, creating a lingering chemical zone that damages and applies Vulnerable.",
                "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "VIPER'S PIT",
                "type": "Ultimate Ability",
                "description": "EQUIP a chemical sprayer. FIRE to spray a chemical cloud in all directions around Viper, creating a large cloud that Nearsights players and Decays the health of enemies inside of it. HOLD the ability key to disperse the cloud early.",
                "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "iso",
        "name": "ISO",
        "role": "DUELIST",
        "origin": "China",
        "bio": "Chinese fixer for hire Iso falls into a flow state to dismantle the opposition. Reconfiguring ambient energy into bulletproof protection, he advances with focus towards his next duel to the death.",
        "portrait": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Iso online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "UNDERCUT",
                "type": "Basic Utility",
                "description": "EQUIP a molecular bolt. FIRE to throw it forward, briefly applying Vulnerable & Suppress to all players it touches. The bolt can pass through solid objects, including walls.",
                "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ability1/displayicon.png"
            },
            {
                "key": "X",
                "name": "KILL CONTRACT",
                "type": "Ultimate Ability",
                "description": "EQUIP an interdimensional arena. FIRE to hurl a column of energy through the battlefield, pulling and healing both you and the first enemy hit into the arena to duel to the death.",
                "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ultimate/displayicon.png"
            },
            {
                "key": "C",
                "name": "DOUBLE TAP",
                "type": "Basic Utility",
                "description": "INSTANTLY start channeling your focus. Once focused: gain a shield which absorbs one instance of damage from any source, reload more quickly, and enter a flow state during which downed enemies you kill or damage spawn an energy orb. Shooting this orb refreshes your flow state and your existing shield, or grants another.",
                "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "CONTINGENCY",
                "type": "Signature Utility",
                "description": "EQUIP to assemble prismatic energy. FIRE to push an indestructible wall of energy forward that blocks bullets. ALT FIRE to push out a slower version of the wall.",
                "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/grenade/displayicon.png"
            }
        ]
    },
    {
        "slug": "jett",
        "name": "JETT",
        "role": "DUELIST",
        "origin": "South Korea",
        "bio": "Representing her home country of South Korea, Jett's agile and evasive fighting style lets her take risks no one else can. She runs circles around every skirmish, cutting enemies up before they even know what hit them.",
        "portrait": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
        "bestMaps": [
            "ascent",
            "haven",
            "breeze"
        ],
        "counters": [
            "Cypher",
            "Killjoy",
            "Breach"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Watch your backs. I'm not playing nice today."
            },
            {
                "context": "Ultimate Ready",
                "text": "Get out of my way!"
            },
            {
                "context": "Ace Kill",
                "text": "You guys are too slow."
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "UPDRAFT",
                "type": "Basic Utility",
                "description": "INSTANTLY propel Jett high into the air.",
                "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "TAILWIND",
                "type": "Basic Utility",
                "description": "ACTIVATE to prepare a gust of wind for a limited time. RE-USE the wind to propel Jett in the direction she is moving. If Jett is standing still, she propels forward. Tailwind charge resets every two kills.",
                "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "CLOUDBURST",
                "type": "Signature Utility",
                "description": "INSTANTLY throw a projectile that expands into a brief vision-blocking cloud on impact with a surface. HOLD the ability key to curve the smoke in the direction of your crosshair.",
                "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "BLADE STORM",
                "type": "Ultimate Ability",
                "description": "EQUIP a set of highly accurate throwing knives. FIRE to throw a single knife and recharge knives on a kill. ALT FIRE to throw all remaining daggers but does not recharge on a kill.",
                "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ultimate/displayicon.png"
            }
        ],
        "trailerUrl": "https://www.youtube.com/watch?v=xU2U73Tk-DM&list=RDxU2U73Tk-DM&start_radio=1&pp=ygUVamV0dCB2YWxvcmFudCB0cmFpbGVyoAcB"
    },
    {
        "slug": "neon",
        "name": "NEON",
        "role": "DUELIST",
        "origin": "Philippines",
        "bio": "Filipino Agent Neon surges forward at shocking speeds, discharging bursts of bioelectric radiance as fast as her body generates it. She races ahead to catch enemies off guard then strikes them down quicker than lightning.",
        "portrait": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Neon online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "C",
                "name": "HIGH GEAR",
                "type": "Basic Utility",
                "description": "INSTANTLY channel Neon\u2019s power for Increased Speed. When charged, ALT FIRE to trigger an electric slide dash. Slide charge resets every two kills.",
                "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ability2/displayicon.png"
            },
            {
                "key": "Q",
                "name": "RELAY BOLT",
                "type": "Basic Utility",
                "description": "INSTANTLY throw an energy bolt that bounces once. Upon hitting each surface, the bolt electrifies the ground below with a Concussive blast.",
                "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ability1/displayicon.png"
            },
            {
                "key": "E",
                "name": "FAST LANE",
                "type": "Signature Utility",
                "description": "FIRE two energy lines forward on the ground that extend a short distance or until they hit a surface. The lines rise into walls of static electricity that block vision.",
                "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "OVERDRIVE",
                "type": "Ultimate Ability",
                "description": "Unleash Neon\u2019s full power and speed for a short duration, regaining all her fuel and a slide charge. FIRE to channel the power into a deadly lightning beam with high movement accuracy. Kills reset the duration of the effect. ",
                "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "phoenix",
        "name": "PHOENIX",
        "role": "DUELIST",
        "origin": "UK",
        "bio": "Hailing from the U.K., Phoenix's star power shines through in his fighting style, igniting the battlefield with flash and flare. Whether he's got backup or not, he's rushing in to fight on his own terms.",
        "portrait": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Phoenix online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "BLAZE",
                "type": "Signature Utility",
                "description": "EQUIP a flame wall. FIRE to create a line of flame that moves forward, passing through the world and creating a wall of fire that blocks vision and damages players passing through it. The fire wall heals Phoenix instead of dealing damage. HOLD FIRE to bend the wall in the direction of your crosshair.",
                "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "HOT HANDS",
                "type": "Basic Utility",
                "description": "EQUIP a fireball. FIRE to throw a fireball that explodes after a set amount of time or upon hitting the ground, creating a lingering fire zone that damages enemies. The fire zone heals Phoenix instead of dealing damage. ALT FIRE to lob.",
                "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "CURVEBALL",
                "type": "Basic Utility",
                "description": "EQUIP a flare orb that takes a curving path and detonates shortly after throwing. FIRE to curve the flare orb to the left, detonating and Blinding any player who sees the orb. ALT FIRE to curve the flare orb to the right. Curveball resets a charge every two kills.",
                "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "RUN IT BACK",
                "type": "Ultimate Ability",
                "description": "INSTANTLY place a marker at Phoenix's location. While this ability is active, dying or allowing the timer to expire will end this ability and bring Phoenix back to this location with full health and the amount of armor he had when the ability was cast.",
                "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "raze",
        "name": "RAZE",
        "role": "DUELIST",
        "origin": "Brazil",
        "bio": "Raze explodes out of Brazil with her big personality and big guns. With her blunt-force-trauma playstyle, she excels at flushing entrenched enemies and clearing tight spaces with a generous dose of \"boom.\"",
        "portrait": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Raze online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "BLAST PACK",
                "type": "Basic Utility",
                "description": "INSTANTLY throw a Blast Pack that will stick to surfaces. RE-USE the ability after deployment to detonate, moving anything hit and dealing damage if fully armed.",
                "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "PAINT SHELLS",
                "type": "Basic Utility",
                "description": "EQUIP a cluster grenade. FIRE to throw the grenade, which does damage and creates sub-munitions, each doing damage to anyone in their range. ALT FIRE to lob. Paint Shells charge resets every two kills.",
                "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "BOOM BOT",
                "type": "Signature Utility",
                "description": "EQUIP a Boom Bot. FIRE will deploy the bot, causing it to travel in a straight line on the ground, bouncing off walls. The Boom Bot will lock on to any enemies in its frontal cone and chase them, exploding for heavy damage if it reaches them.",
                "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "SHOWSTOPPER",
                "type": "Ultimate Ability",
                "description": "EQUIP a rocket launcher. FIRE to shoot a rocket that does massive area damage on contact with anything.",
                "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "reyna",
        "name": "REYNA",
        "role": "DUELIST",
        "origin": "Mexico",
        "bio": "Forged in the heart of Mexico, Reyna dominates single combat, popping off with each kill she scores. Her capability is only limited by her raw skill, making her sharply dependent on performance. ",
        "portrait": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Reyna online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "DEVOUR",
                "type": "Basic Utility",
                "description": "Soul Harvest: Enemies that die within 3 seconds of taking damage from Reyna leave behind Soul Orbs that last 3 seconds.\r\nDevour: INSTANTLY consume a soul orb, rapidly gaining Temporary Health. If EMPRESS is active then Devour automatically casts, does not consume the Soul Orb, and Healing is permanent.",
                "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "DISMISS",
                "type": "Basic Utility",
                "description": "INSTANTLY consume a nearby Soul Orb, becoming Intangible for a short duration. If EMPRESS is active, also become Invisible.",
                "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "LEER",
                "type": "Signature Utility",
                "description": "EQUIP an ethereal, destructible eye. ACTIVATE to cast the eye a short distance forward. The eye will Nearsight all enemies who look at it.",
                "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "EMPRESS",
                "type": "Ultimate Ability",
                "description": "INSTANTLY enter a frenzy, gaining a Combat Stim that increases firing, equip and reload speed dramatically. Gain infinite charges of Soul Harvest abilities.",
                "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "waylay",
        "name": "WAYLAY",
        "role": "DUELIST",
        "origin": "Thailand",
        "bio": "Thailand's prismatic radiant Waylay transforms into light itself as she darts across the battlefield, striking down her targets through shards of light before flitting back to safety, all in the blink of an eye.",
        "portrait": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Waylay online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "C",
                "name": "REFRACT",
                "type": "Basic Utility",
                "description": "INSTANTLY create a beacon of light on the floor. REACTIVATE to speed back to your beacon as a mote of pure light. You are invulnerable as you travel. Refract resets a charge every two kills.",
                "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "SATURATE",
                "type": "Signature Utility",
                "description": "EQUIP a cluster of light. FIRE to throw the cluster, which upon contact with the ground explodes, Hindering nearby players with a powerful movement and weapon slow.",
                "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "LIGHTSPEED",
                "type": "Basic Utility",
                "description": "EQUIP to prepare for a burst of speed. FIRE to dash forward twice. ALT FIRE to dash once. Only your first dash can send you upward.",
                "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ability1/displayicon.png"
            },
            {
                "key": "X",
                "name": "CONVERGENT PATHS",
                "type": "Ultimate Ability",
                "description": "EQUIP to focus your prismatic power. FIRE to create an afterimage of yourself that projects a beam of light. After a brief delay, you gain a powerful speed boost and the beam expands, Hindering other players in the area.",
                "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "yoru",
        "name": "YORU",
        "role": "DUELIST",
        "origin": "Japan",
        "bio": "Japanese native Yoru rips holes straight through reality to infiltrate enemy lines unseen. Using deception and aggression in equal measure, he gets the drop on each target before they know where to look.",
        "portrait": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Yoru online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "FAKEOUT",
                "type": "Signature Utility",
                "description": "EQUIP an echo that transforms into a mirror image of Yoru when activated. FIRE to instantly activate the mirror image and send it forward. ALT FIRE to place an inactive echo. USE to transform an inactive echo into a mirror image and send it forward.  Mirror images explode in a Blinding flash when destroyed by enemies.",
                "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "BLINDSIDE",
                "type": "Basic Utility",
                "description": "EQUIP to rip an unstable dimensional fragment from reality. FIRE to throw the fragment, activating a flash that winds up once it collides with a hard surface.",
                "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "GATECRASH",
                "type": "Basic Utility",
                "description": "EQUIP a rift tether FIRE to send the tether forward. ALT FIRE to place a stationary tether. ACTIVATE to teleport to the tether's location. USE to trigger a fake teleport. GATECRASH resets a charge every two kills.",
                "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "DIMENSIONAL DRIFT",
                "type": "Ultimate Ability",
                "description": "EQUIP a mask that can see between dimensions. FIRE to drift into Yoru's dimension, unable to be affected or seen by enemies from the outside. REACTIVATE to exit Yoru's dimension early.",
                "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "breach",
        "name": "BREACH",
        "role": "INITIATOR",
        "origin": "Sweden",
        "bio": "The bionic Swede Breach fires powerful, targeted kinetic blasts to aggressively clear a path through enemy ground. The damage and disruption he inflicts ensures no fight is ever fair.",
        "portrait": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Breach online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "FLASHPOINT",
                "type": "Basic Utility",
                "description": "EQUIP a Blinding charge. FIRE the charge to set a fast-acting burst through the wall. The charge detonates to Blind all players looking at it.",
                "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "FAULT LINE",
                "type": "Basic Utility",
                "description": "EQUIP a Seismic Blast. HOLD FIRE to increase the distance. RELEASE to set off the quake, Concussing all players in its zone and in a line up to the zone.",
                "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "AFTERSHOCK",
                "type": "Signature Utility",
                "description": "EQUIP a fusion charge. FIRE the charge to set a slow-acting burst through the wall. The burst does heavy damage to anyone caught in its area.",
                "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "ROLLING THUNDER",
                "type": "Ultimate Ability",
                "description": "EQUIP a Seismic Charge. FIRE to send a cascading quake through all terrain in a large zone. The quake Concusses and knocks up anyone caught in it.",
                "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "fade",
        "name": "FADE",
        "role": "INITIATOR",
        "origin": "T\u00fcrkiye",
        "bio": "Turkish bounty hunter Fade unleashes the power of raw nightmare to seize enemy secrets. Attuned with terror itself, she hunts down targets and reveals their deepest fears - before crushing them in the dark.",
        "portrait": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Fade online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "SEIZE",
                "type": "Basic Utility",
                "description": "EQUIP a knot of raw fear. FIRE to throw. The knot drops down after a set time. RE-USE to drop the knot early. The knot ruptures on impact, holding nearby enemies in place. Held enemies are Deafened, and Decayed.",
                "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "HAUNT",
                "type": "Basic Utility",
                "description": "EQUIP a haunting watcher. FIRE to throw. The watcher drops down after a set time. RE-USE to drop the watcher early. The watcher lashes out on impact, Revealing enemies in its line of sight and creating terror trails to them. Enemies can destroy the watcher.",
                "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "PROWLER",
                "type": "Signature Utility",
                "description": "EQUIP a prowler. FIRE to send the prowler forward. HOLD FIRE to steer the prowler towards your crosshair. The prowler will chase down the first enemy or terror trail it sees, and Nearsight the enemy on impact.",
                "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "NIGHTFALL",
                "type": "Ultimate Ability",
                "description": "EQUIP the power of nightmare itself. FIRE to unleash a wave of unstoppable nightmare energy. Enemies caught in the wave are Marked by terror trails, Deafened, and Decayed.",
                "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "gekko",
        "name": "GEKKO",
        "role": "INITIATOR",
        "origin": "USA",
        "bio": "Gekko the Angeleno leads a tight-knit crew of calamitous creatures. His buddies bound forward, scattering enemies out of the way, with Gekko chasing them down to regroup and go again.",
        "portrait": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Gekko online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "WINGMAN",
                "type": "Basic Utility",
                "description": "EQUIP Wingman. FIRE to send Wingman forward seeking enemies. Wingman unleashes a concussive blast toward the first enemy he sees. ALT FIRE when targeting a Spike site or planted Spike to have Wingman defuse or plant the Spike. To plant, Gekko must have the Spike in his inventory. When Wingman expires he reverts into a dormant globule. INTERACT to reclaim the globule and gain another Wingman charge after a short cooldown.",
                "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "DIZZY",
                "type": "Basic Utility",
                "description": "EQUIP Dizzy. FIRE to send Dizzy soaring forward through the air. Dizzy charges then unleashes plasma blasts at enemies in line of sight. Enemies hit by her plasma are Blinded. When Dizzy expires she reverts into a dormant globule. INTERACT to reclaim the globule and gain another Dizzy charge after a short cooldown.",
                "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "MOSH PIT",
                "type": "Signature Utility",
                "description": "EQUIP Mosh. FIRE to throw Mosh like a grenade. ALT FIRE to lob. Upon landing Mosh duplicates across a large area that deals a small amount of damage over time then after a short delay explodes. INTERACT to reclaim the globule and gain another Mosh charge after a short cooldown.",
                "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "THRASH",
                "type": "Ultimate Ability",
                "description": "EQUIP Thrash. FIRE to link with Thrash\u2019s mind and steer her through enemy territory. ACTIVATE to lunge forward and explode, Detaining any players in a small radius. When Thrash expires she reverts into a dormant globule. INTERACT to reclaim the globule and gain another Thrash charge after a short cooldown. Thrash can be reclaimed once.",
                "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "kay/o",
        "name": "KAY/O",
        "role": "INITIATOR",
        "origin": "Robot",
        "bio": "KAY/O is a machine of war built for a single purpose: neutralizing radiants. His power to Suppress enemy abilities dismantles his opponents' capacity to fight back, securing him and his allies the ultimate edge.",
        "portrait": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "KAY/O online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "FRAG/MENT",
                "type": "Signature Utility",
                "description": "EQUIP an explosive fragment. FIRE to throw. ALT FIRE to lob. The fragment sticks to the floor and explodes multiple times, dealing near lethal damage at the center with each explosion.",
                "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "FLASH/DRIVE",
                "type": "Basic Utility",
                "description": "EQUIP a flash grenade. FIRE to overhand throw. ALT FIRE to lob a weaker version that explodes quickly. The flash grenade explodes after a short fuse, Blinding anyone in line of sight.",
                "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "ZERO/POINT",
                "type": "Basic Utility",
                "description": "EQUIP a suppression blade. FIRE to throw. The blade sticks to the first surface it hits, winds up, and Suppresses anyone in the radius of the explosion. Enemies can destroy this blade.",
                "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "NULL/CMD",
                "type": "Ultimate Ability",
                "description": "INSTANTLY overload with polarized radianite energy that pulses from KAY/O in a massive radius. Enemies hit with pulses are Suppressed for a short duration. While overloaded, KAY/O gains Combat Stim and can be re-stabilized if downed.",
                "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "skye",
        "name": "SKYE",
        "role": "INITIATOR",
        "origin": "Australia",
        "bio": "Hailing from Australia, Skye and her band of beasts trailblaze the way through hostile territory. With her creations hampering the enemy, and her power to heal others, the team is strongest and safest by Skye's side.",
        "portrait": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Skye online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "TRAILBLAZER",
                "type": "Basic Utility",
                "description": "EQUIP a Tasmanian tiger trinket. FIRE to send out and take control of the predator. While in control, FIRE to leap forward, exploding in a Concussive blast on impact and damaging directly hit enemies.",
                "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "GUIDING LIGHT",
                "type": "Basic Utility",
                "description": "EQUIP a hawk trinket. FIRE to send it forward. HOLD FIRE to guide the hawk in the direction of your crosshair. RE-USE while the hawk is in flight to transform it into a flash. The flash reaches max potency after a short duration during the hawk's flight.",
                "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "REGROWTH",
                "type": "Signature Utility",
                "description": "EQUIP a healing trinket. HOLD FIRE to channel, Healing allies in range and line of sight. Can be reused until her healing pool is depleted. Skye cannot heal herself.",
                "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "SEEKERS",
                "type": "Ultimate Ability",
                "description": "EQUIP a Seeker trinket. FIRE to send out three Seekers to track down the three closest enemies. If a Seeker reaches its target, it Nearsights and slows them. Enemies can destroy the Seekers.",
                "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "sova",
        "name": "SOVA",
        "role": "INITIATOR",
        "origin": "Russia",
        "bio": "Born from the eternal winter of Russia's tundra, Sova tracks, finds, and eliminates enemies with ruthless efficiency and precision. His custom bow and incredible scouting abilities ensure that even if you run, you cannot hide. ",
        "portrait": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png",
        "bestMaps": [
            "ascent",
            "haven",
            "bind"
        ],
        "counters": [
            "Jett",
            "Neon",
            "Reyna"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "The wind guides my arrow. Let us find them."
            },
            {
                "context": "Ultimate Ready",
                "text": "Nowhere to hide!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "SHOCK BOLT",
                "type": "Basic Utility",
                "description": "EQUIP a bow with a shock bolt. FIRE to send the explosive bolt forward, detonating upon collision and damaging players nearby. HOLD FIRE to extend the range of the projectile. ALT FIRE to add up to two bounces to this arrow.",
                "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "RECON BOLT",
                "type": "Basic Utility",
                "description": "EQUIP a bow with recon bolt. FIRE to send the recon bolt forward, activating upon collision and Revealing the location of nearby enemies caught in the line of sight of the bolt. Enemies can destroy this bolt. HOLD FIRE to extend the range of the projectile. ALT FIRE to add up to two bounces to this arrow. ",
                "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "OWL DRONE",
                "type": "Signature Utility",
                "description": "EQUIP an owl drone. FIRE to deploy and take control of movement of the drone. While in control of the drone, FIRE to shoot a marking dart. This dart will Reveal the location of any player struck by the dart. Enemies can destroy the Owl Drone.",
                "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "HUNTER'S FURY",
                "type": "Ultimate Ability",
                "description": "EQUIP a bow with three long-range, wall-piercing energy blasts. FIRE to release an energy blast in a line in front of Sova, dealing damage and Revealing the location of enemies caught in the line. This ability can be RE-USED up to two more times while the ability timer is active.",
                "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "tejo",
        "name": "TEJO",
        "role": "INITIATOR",
        "origin": "Colombia",
        "bio": "A veteran intelligence consultant from Colombia, Tejo\u2019s ballistic guidance system pressures the enemy to relinquish their ground - or their lives. His targeted strikes keep opponents off balance and under his heel.",
        "portrait": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Tejo online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "C",
                "name": "GUIDED SALVO",
                "type": "Basic Utility",
                "description": "EQUIP an AR targeting system. FIRE to select up to two target locations on the map. ALT FIRE to launch missiles that autonomously navigate to target locations, detonating repeatedly for damage on arrival.",
                "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ability2/displayicon.png"
            },
            {
                "key": "Q",
                "name": "SPECIAL DELIVERY",
                "type": "Basic Utility",
                "description": "EQUIP a sticky grenade. FIRE to launch. The grenade sticks to the first surface it hits and explodes, Concussing and dealing damage to any targets caught in the blast. ALT FIRE to launch the grenade with a single bounce instead.",
                "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ability1/displayicon.png"
            },
            {
                "key": "X",
                "name": "ARMAGEDDON",
                "type": "Ultimate Ability",
                "description": "EQUIP a tactical strike targeting map. FIRE to select the origin point of the strike. FIRE again to set the end point and launch the attack, unleashing a wave of lethal damaging explosions along the strike path. ALT FIRE during map targeting to cancel the origin point.",
                "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ultimate/displayicon.png"
            },
            {
                "key": "E",
                "name": "STEALTH DRONE",
                "type": "Signature Utility",
                "description": "EQUIP a stealth drone. FIRE to throw the drone forward, assuming direct control of its movement. FIRE again to trigger a pulse that Suppresses and Reveals enemies hit.",
                "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/grenade/displayicon.png"
            }
        ]
    },
    {
        "slug": "chamber",
        "name": "CHAMBER",
        "role": "SENTINEL",
        "origin": "France",
        "bio": "Well-dressed and well-armed, French weapons designer Chamber expels aggressors with deadly precision. He leverages his custom arsenal to hold the line and pick off enemies from afar, with a contingency built for every plan.",
        "portrait": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Chamber online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "C",
                "name": "RENDEZVOUS",
                "type": "Basic Utility",
                "description": "EQUIP a teleport anchor. FIRE to place it on the ground. While on the ground and in range of the anchor, REACTIVATE to quickly teleport to the anchor. The anchor can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "TRADEMARK",
                "type": "Signature Utility",
                "description": "EQUIP a trap that scans for enemies. FIRE to place it on the ground. When a visible enemy comes in range, the trap counts down and then destabilizes the terrain around them, creating a lingering field that Slows players caught inside of it. The trap can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "HEADHUNTER",
                "type": "Basic Utility",
                "description": "ACTIVATE to equip a heavy pistol. ALT FIRE with the pistol equipped to aim down sights.",
                "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ability1/displayicon.png"
            },
            {
                "key": "X",
                "name": "TOUR DE FORCE",
                "type": "Ultimate Ability",
                "description": "ACTIVATE to summon a powerful, custom sniper rifle that will kill an enemy with any direct hit to the upper body. ALT FIRE to aim down sights. Killing an enemy creates a lingering field that Slows players caught inside of it.",
                "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "cypher",
        "name": "CYPHER",
        "role": "SENTINEL",
        "origin": "Morocco",
        "bio": "The Moroccan information broker, Cypher is a one-man surveillance network who keeps tabs on the enemy's every move. No secret is safe. No maneuver goes unseen. Cypher is always watching.",
        "portrait": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Cypher online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "CYBER CAGE",
                "type": "Basic Utility",
                "description": "INSTANTLY toss the cyber cage in front of Cypher. ACTIVATE to create a zone that blocks vision and plays an audio cue when enemies pass through it.",
                "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "SPYCAM",
                "type": "Basic Utility",
                "description": "EQUIP a spycam. FIRE to place the spycam at the targeted location. RE-USE this ability to take control of the camera's view. While in control of the camera, FIRE to shoot a marking dart. This dart will Reveal the location of any player struck by the dart. This ability can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "TRAPWIRE",
                "type": "Signature Utility",
                "description": "EQUIP a trapwire. FIRE to place a destructible and covert trapwire at the targeted location, creating a line that spans between the placed location and the wall opposite. Enemy players who cross a trapwire will be Slowed and Revealed after a short period if they do not destroy the device in time. This ability can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "NEURAL THEFT",
                "type": "Ultimate Ability",
                "description": "INSTANTLY use on a targeted dead enemy to download information on their team.  After a brief delay, the location of all living enemy players will be Revealed twice.",
                "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "deadlock",
        "name": "DEADLOCK",
        "role": "SENTINEL",
        "origin": "Norway",
        "bio": "Norwegian operative Deadlock deploys an array of cutting-edge nanowire to secure the battlefield from even the most lethal assault. No one escapes her vigilant watch, nor survives her unyielding ferocity.",
        "portrait": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Deadlock online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "SONIC SENSOR",
                "type": "Basic Utility",
                "description": "EQUIP a Sonic Sensor. FIRE to deploy. The sensor monitors an area for enemies making sound. It concusses that area if footsteps, weapons fire, or significant noise are detected. This ability can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ability1/displayicon.png"
            },
            {
                "key": "E",
                "name": "BARRIER MESH",
                "type": "Signature Utility",
                "description": "EQUIP a Barrier Mesh disc. FIRE to throw forward. Upon landing, the disc generates barriers from the origin point that block character movement.",
                "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/grenade/displayicon.png"
            },
            {
                "key": "C",
                "name": "GRAVNET",
                "type": "Basic Utility",
                "description": "EQUIP a GravNet grenade. FIRE to throw. ALT FIRE to lob. The GravNet detonates upon landing, forcing any characters caught within to crouch and move slowly.",
                "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "ANNIHILATION",
                "type": "Ultimate Ability",
                "description": "EQUIP a Nanowire Accelerator. FIRE to unleash a pulse of nanowires that captures the first enemy contacted. The cocooned enemy is pulled along a nanowire path and will die unless they are freed. The nanowire cocoon is destructible.",
                "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "killjoy",
        "name": "KILLJOY",
        "role": "SENTINEL",
        "origin": "Germany",
        "bio": "The genius of Germany, Killjoy effortlessly secures key battlefield positions with her arsenal of inventions. If their damage doesn't take her enemies out, the debuff her robots provide will make short work of them.",
        "portrait": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Killjoy online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "E",
                "name": "NANOSWARM",
                "type": "Signature Utility",
                "description": "EQUIP a Nanoswarm grenade. FIRE to throw the grenade. Upon landing, the Nanoswarm goes covert. ALT FIRE to lob. ACTIVATE the Nanoswarm to deploy a damaging swarm of nanobots.  ",
                "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/grenade/displayicon.png"
            },
            {
                "key": "Q",
                "name": "ALARMBOT",
                "type": "Basic Utility",
                "description": "EQUIP a covert Alarmbot. FIRE to deploy a bot that hunts down enemies that get in range.  After reaching its target, the bot explodes and applies Vulnerable to enemies in the area. HOLD EQUIP to recall a deployed bot.",
                "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "TURRET",
                "type": "Basic Utility",
                "description": "EQUIP a Turret. FIRE to deploy a turret that fires at enemies in a 100 degree cone. While targeting, EQUIP again to swap turret direction, HOLD ALT FIRE to rotate. HOLD EQUIP to recall the deployed turret.",
                "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability2/displayicon.png"
            },
            {
                "key": "X",
                "name": "LOCKDOWN",
                "type": "Ultimate Ability",
                "description": "EQUIP the Lockdown device. FIRE to deploy the device. After a long windup, the device Detains all enemies caught in the radius. The device can be destroyed by enemies.",
                "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "sage",
        "name": "SAGE",
        "role": "SENTINEL",
        "origin": "China",
        "bio": "The bastion of China, Sage creates safety for herself and her team wherever she goes. Able to revive fallen friends and stave off forceful assaults, she provides a calm center to a hellish battlefield.",
        "portrait": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Sage online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "SLOW ORB",
                "type": "Basic Utility",
                "description": "EQUIP a slowing orb. FIRE to throw a slowing orb forward that detonates upon landing, creating a lingering field that Slows and reduces the dash speed of players caught inside of it.",
                "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "HEALING ORB",
                "type": "Basic Utility",
                "description": "EQUIP a healing orb. FIRE with your crosshairs over a damaged ally to activate a Heal-Over-Time on them. ALT FIRE while Sage is damaged to activate a self Heal-Over-Time.",
                "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "BARRIER ORB",
                "type": "Signature Utility",
                "description": "EQUIP a barrier orb. FIRE places a wall that fortifies after a few seconds. ALT FIRE rotates the targeter.",
                "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "RESURRECTION",
                "type": "Ultimate Ability",
                "description": "EQUIP a resurrection ability. FIRE with your crosshairs placed over a dead ally to begin resurrecting them. After a brief channel, the ally will be brought back to life with full health.",
                "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ultimate/displayicon.png"
            }
        ]
    },
    {
        "slug": "veto",
        "name": "VETO",
        "role": "SENTINEL",
        "origin": "Unknown",
        "bio": "Empowered by an unstoppable DNA mutation, Senegalese enforcer Veto defies the rules of engagement by nullifying his opponent's powers and technology. On Veto's battlefield, gunplay is your only guarantee.",
        "portrait": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Veto online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "C",
                "name": "INTERCEPTOR",
                "type": "Basic Utility",
                "description": "EQUIP the Interceptor. FIRE to place the Interceptor at projected location. Once placed, RE-USE to activate. Once active, it will destroy any utility that would BOUNCE off a player and/or be destroyed naturally by gunfire. Enemies can destroy the Interceptor.",
                "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "CROSSCUT",
                "type": "Signature Utility",
                "description": "EQUIP a vortex. FIRE to place on the ground. While in range and looking at the vortex, ACTIVATE to teleport to the vortex. During the BUY PHASE, the vortex can be reclaimed to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "EVOLUTION",
                "type": "Ultimate Ability",
                "description": "INSTANTLY begin to fully mutate, gaining a combat stim, regeneration, and becoming IMMUNE to all forms of debuffs.",
                "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ultimate/displayicon.png"
            },
            {
                "key": "Q",
                "name": "CHOKEHOLD",
                "type": "Basic Utility",
                "description": "EQUIP a viscous fragment of your mutation. FIRE to throw. The fragment deploys upon hitting the ground, creating a trap to hold enemies in place. Held enemies are Deafened, and Decayed. Enemies can destroy the trap before activation.",
                "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ability1/displayicon.png"
            }
        ]
    },
    {
        "slug": "vyse",
        "name": "VYSE",
        "role": "SENTINEL",
        "origin": "Unknown",
        "bio": "Metallic mastermind Vyse unleashes liquid metal to isolate, trap, and disarm her enemies. Through cunning and manipulation, she forces all who oppose her to fear the battlefield itself.",
        "portrait": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/fullportrait.png",
        "bestMaps": [
            "ascent",
            "bind",
            "haven"
        ],
        "counters": [
            "Jett",
            "Omen"
        ],
        "voiceLines": [
            {
                "context": "Match Start",
                "text": "Vyse online. Let's get to work."
            },
            {
                "context": "Ultimate Ready",
                "text": "Ultimate is ready!"
            }
        ],
        "abilities": [
            {
                "key": "Q",
                "name": "SHEAR",
                "type": "Basic Utility",
                "description": "EQUIP filaments of liquid metal. FIRE to place a hidden wall trap. When an enemy crosses, an indestructible wall bursts from the ground behind them. The wall lasts for a brief time before dissipating.",
                "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ability1/displayicon.png"
            },
            {
                "key": "C",
                "name": "ARC ROSE",
                "type": "Basic Utility",
                "description": "EQUIP an Arc Rose. Target a surface and FIRE to place a stealthed Arc Rose, or ALT FIRE to place the Arc Rose through it. REUSE to blind all players looking at it. This ability can be picked up to be REDEPLOYED.",
                "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ability2/displayicon.png"
            },
            {
                "key": "E",
                "name": "RAZORVINE",
                "type": "Signature Utility",
                "description": "EQUIP a nest of liquid metal. FIRE to launch. Upon landing, the nest becomes invisible. When ACTIVATED, it sprawls out into a large razorvine nest which slows and damages all players who move through it.",
                "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/grenade/displayicon.png"
            },
            {
                "key": "X",
                "name": "STEEL GARDEN",
                "type": "Ultimate Ability",
                "description": "EQUIP a bramble of liquid metal. FIRE to send the metal erupting from you as a torrent of metal thorns, JAMMING enemy primary weapons after a brief windup.",
                "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ultimate/displayicon.png"
            }
        ]
    }
],
  weapons: [
    {
        "slug": "classic",
        "name": "CLASSIC",
        "category": "SIDEARMS",
        "cost": 0,
        "fireRate": 6.75,
        "reloadSpeed": 1.75,
        "magazineSize": 12,
        "dmgHead": 78,
        "dmgBody": 26,
        "dmgLeg": 22,
        "description": "Standard issue classic tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/29a0cfab-485b-f5d5-779a-b59f85e204a8/displayicon.png"
    },
    {
        "slug": "shorty",
        "name": "SHORTY",
        "category": "SIDEARMS",
        "cost": 300,
        "fireRate": 3,
        "reloadSpeed": 1.75,
        "magazineSize": 2,
        "dmgHead": 22,
        "dmgBody": 11,
        "dmgLeg": 9,
        "description": "Standard issue shorty tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/42da8ccc-40d5-affc-beec-15aa47b42eda/displayicon.png"
    },
    {
        "slug": "frenzy",
        "name": "FRENZY",
        "category": "SIDEARMS",
        "cost": 450,
        "fireRate": 10,
        "reloadSpeed": 1.5,
        "magazineSize": 15,
        "dmgHead": 78,
        "dmgBody": 26,
        "dmgLeg": 22,
        "description": "Standard issue frenzy tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/44d4e95c-4157-0037-81b2-17841bf2e8e3/displayicon.png"
    },
    {
        "slug": "ghost",
        "name": "GHOST",
        "category": "SIDEARMS",
        "cost": 500,
        "fireRate": 6.75,
        "reloadSpeed": 1.5,
        "magazineSize": 13,
        "dmgHead": 105,
        "dmgBody": 30,
        "dmgLeg": 25,
        "description": "Standard issue ghost tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-6481dfc3bb4e/displayicon.png"
    },
    {
        "slug": "sheriff",
        "name": "SHERIFF",
        "category": "SIDEARMS",
        "cost": 800,
        "fireRate": 4,
        "reloadSpeed": 2.25,
        "magazineSize": 6,
        "dmgHead": 159,
        "dmgBody": 55,
        "dmgLeg": 46,
        "description": "Standard issue sheriff tactical gear.",
        "recoil": "HEAVY KICKBACK, SLOW RECOVERY DRIFT",
        "skins": [
            "reaver-sheriff",
            "kuronami-sheriff"
        ],
        "portrait": "https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png"
    },
    {
        "slug": "stinger",
        "name": "STINGER",
        "category": "SMGS",
        "cost": 1100,
        "fireRate": 16,
        "reloadSpeed": 2.25,
        "magazineSize": 20,
        "dmgHead": 67,
        "dmgBody": 27,
        "dmgLeg": 22,
        "description": "Standard issue stinger tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/f7e1b454-4ad4-1063-ec0a-159e56b58941/displayicon.png"
    },
    {
        "slug": "spectre",
        "name": "SPECTRE",
        "category": "SMGS",
        "cost": 1600,
        "fireRate": 13.333,
        "reloadSpeed": 2.25,
        "magazineSize": 30,
        "dmgHead": 78,
        "dmgBody": 26,
        "dmgLeg": 22,
        "description": "Standard issue spectre tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png"
    },
    {
        "slug": "bucky",
        "name": "BUCKY",
        "category": "SHOTGUNS",
        "cost": 850,
        "fireRate": 1.1,
        "reloadSpeed": 2.5,
        "magazineSize": 5,
        "dmgHead": 34,
        "dmgBody": 17,
        "dmgLeg": 14,
        "description": "Standard issue bucky tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/910be174-449b-c412-ab22-d0873436b21b/displayicon.png"
    },
    {
        "slug": "judge",
        "name": "JUDGE",
        "category": "SHOTGUNS",
        "cost": 1850,
        "fireRate": 3.5,
        "reloadSpeed": 2.2,
        "magazineSize": 5,
        "dmgHead": 34,
        "dmgBody": 17,
        "dmgLeg": 14,
        "description": "Standard issue judge tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/ec845bf4-4f79-ddda-a3da-0db3774b2794/displayicon.png"
    },
    {
        "slug": "bulldog",
        "name": "BULLDOG",
        "category": "RIFLES",
        "cost": 2050,
        "fireRate": 10,
        "reloadSpeed": 2.5,
        "magazineSize": 24,
        "dmgHead": 115,
        "dmgBody": 35,
        "dmgLeg": 29,
        "description": "Standard issue bulldog tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/ae3de142-4d85-2547-dd26-4e90bed35cf7/displayicon.png"
    },
    {
        "slug": "guardian",
        "name": "GUARDIAN",
        "category": "RIFLES",
        "cost": 2250,
        "fireRate": 5.25,
        "reloadSpeed": 2.5,
        "magazineSize": 12,
        "dmgHead": 195,
        "dmgBody": 65,
        "dmgLeg": 48,
        "description": "Standard issue guardian tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/4ade7faa-4cf1-8376-95ef-39884480959b/displayicon.png"
    },
    {
        "slug": "phantom",
        "name": "PHANTOM",
        "category": "RIFLES",
        "cost": 2900,
        "fireRate": 11,
        "reloadSpeed": 2.5,
        "magazineSize": 30,
        "dmgHead": 156,
        "dmgBody": 39,
        "dmgLeg": 33,
        "description": "Standard issue phantom tactical gear.",
        "recoil": "EASY TO SPRAY, SILENCED FIRING AND ZERO BULLET TRACERS",
        "skins": [
            "oni-phantom"
        ],
        "portrait": "https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png"
    },
    {
        "slug": "vandal",
        "name": "VANDAL",
        "category": "RIFLES",
        "cost": 2900,
        "fireRate": 9.75,
        "reloadSpeed": 2.5,
        "magazineSize": 25,
        "dmgHead": 160,
        "dmgBody": 40,
        "dmgLeg": 34,
        "description": "Standard issue vandal tactical gear.",
        "recoil": "HIGH VERTICAL KICK, HEAVY LATERAL SWAY AFTER 5 BULLETS",
        "skins": [
            "reaver-vandal",
            "kuronami-vandal"
        ],
        "portrait": "https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png"
    },
    {
        "slug": "marshal",
        "name": "MARSHAL",
        "category": "SNIPERS",
        "cost": 950,
        "fireRate": 1.5,
        "reloadSpeed": 2.5,
        "magazineSize": 5,
        "dmgHead": 202,
        "dmgBody": 101,
        "dmgLeg": 85,
        "description": "Standard issue marshal tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png"
    },
    {
        "slug": "outlaw",
        "name": "OUTLAW",
        "category": "SNIPERS",
        "cost": 2400,
        "fireRate": 2.75,
        "reloadSpeed": 3.8,
        "magazineSize": 2,
        "dmgHead": 238,
        "dmgBody": 140,
        "dmgLeg": 119,
        "description": "Standard issue outlaw tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/5f0aaf7a-4289-3998-d5ff-eb9a5cf7ef5c/displayicon.png"
    },
    {
        "slug": "operator",
        "name": "OPERATOR",
        "category": "SNIPERS",
        "cost": 4700,
        "fireRate": 0.6,
        "reloadSpeed": 3.7,
        "magazineSize": 5,
        "dmgHead": 255,
        "dmgBody": 150,
        "dmgLeg": 120,
        "description": "Standard issue operator tactical gear.",
        "recoil": "EXTREME SCOPED KICKBACK, ACCURATE ONLY WHEN STATIONARY",
        "skins": [
            "elderflame-operator"
        ],
        "portrait": "https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png"
    },
    {
        "slug": "ares",
        "name": "ARES",
        "category": "HEAVY",
        "cost": 1600,
        "fireRate": 13,
        "reloadSpeed": 3.25,
        "magazineSize": 50,
        "dmgHead": 75,
        "dmgBody": 30,
        "dmgLeg": 25,
        "description": "Standard issue ares tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/55d8a0f4-4274-ca67-fe2c-06ab45efdf58/displayicon.png"
    },
    {
        "slug": "odin",
        "name": "ODIN",
        "category": "HEAVY",
        "cost": 3200,
        "fireRate": 12,
        "reloadSpeed": 5,
        "magazineSize": 100,
        "dmgHead": 95,
        "dmgBody": 38,
        "dmgLeg": 32,
        "description": "Standard issue odin tactical gear.",
        "recoil": "MODERATE STABLE RECOIL PROFILE",
        "skins": [],
        "portrait": "https://media.valorant-api.com/weapons/63e6c2b6-4a8e-869c-3d4c-e38355226584/displayicon.png"
    }
],
  skins: [
    {
        "slug": "reaver-vandal",
        "name": "REAVER VANDAL",
        "weaponSlug": "vandal",
        "price": 1775,
        "rarity": "PREMIUM",
        "variants": [
            {
                "id": "default",
                "name": "Reaver Purple",
                "hex": "#8b5cf6",
                "hueRotate": "hue-rotate-0"
            },
            {
                "id": "black",
                "name": "Reaver Black",
                "hex": "#111827",
                "hueRotate": "hue-rotate-[120deg] saturate-[0.5] brightness-[0.7]"
            },
            {
                "id": "white",
                "name": "Reaver White",
                "hex": "#f9fafb",
                "hueRotate": "hue-rotate-[240deg] brightness-[1.3] saturate-[0.8]"
            },
            {
                "id": "red",
                "name": "Reaver Red",
                "hex": "#ef4444",
                "hueRotate": "hue-rotate-[280deg] saturate-[1.4]"
            }
        ],
        "inspectVideoUrl": null,
        "reloadVideoUrl": null,
        "communityRating": 4.9,
        "popularity": 98
    },
    {
        "slug": "kuronami-vandal",
        "name": "KURONAMI VANDAL",
        "weaponSlug": "vandal",
        "price": 2375,
        "rarity": "EXCLUSIVE",
        "variants": [
            {
                "id": "default",
                "name": "Kuronami Blue",
                "hex": "#3b82f6",
                "hueRotate": "hue-rotate-0"
            },
            {
                "id": "purple",
                "name": "Kuronami Purple",
                "hex": "#a855f7",
                "hueRotate": "hue-rotate-[290deg]"
            },
            {
                "id": "white",
                "name": "Kuronami White",
                "hex": "#f3f4f6",
                "hueRotate": "hue-rotate-[180deg] brightness-[1.2]"
            }
        ],
        "inspectVideoUrl": null,
        "reloadVideoUrl": null,
        "communityRating": 4.8,
        "popularity": 96
    },
    {
        "slug": "oni-phantom",
        "name": "ONI PHANTOM",
        "weaponSlug": "phantom",
        "price": 1775,
        "rarity": "PREMIUM",
        "variants": [
            {
                "id": "default",
                "name": "Oni Red",
                "hex": "#dc2626",
                "hueRotate": "hue-rotate-0"
            },
            {
                "id": "green",
                "name": "Oni Green",
                "hex": "#10b981",
                "hueRotate": "hue-rotate-[120deg]"
            },
            {
                "id": "white",
                "name": "Oni White",
                "hex": "#f3f4f6",
                "hueRotate": "hue-rotate-[200deg] brightness-[1.1]"
            }
        ],
        "inspectVideoUrl": null,
        "reloadVideoUrl": null,
        "communityRating": 4.7,
        "popularity": 92
    }
],
  bundles: [
    {
        "slug": "eviction-bundle",
        "name": "Eviction ultra",
        "price": 7100,
        "active": true,
        "endsInSeconds": 51789,
        "skins": [
            "reaver-vandal",
            "oni-phantom"
        ],
        "description": "Clean tactical designs optimized for raw competitive efficiency. Eviction features custom digital HUD visualizers and mechanical eject animations.",
        "trailerUrl": "https://www.youtube.com/embed/e_E9W2GD7Zw"
    },
    {
        "slug": "kuronami-bundle",
        "name": "KURONAMI",
        "price": 9500,
        "active": false,
        "endsInSeconds": 0,
        "skins": [
            "vandal-kuronami",
            "sheriff-kuronami",
            "melee-kuronami"
        ],
        "description": "Forged in lightning and shadows. Kuronami captures weather-altering reload effects and dynamic lightning strikes.",
        "trailerUrl": "https://www.youtube.com/embed/e_E9W2GD7Zw"
    }
],
  maps: [
    {
        "slug": "ascent",
        "name": "ASCENT",
        "location": "45\u00b026'BF'N,12\u00b020'Q'E",
        "lore": "An open playground for small skirmishes, Ascent is characterized by deep open sightlines and large metal doors that can be sealed shut to secure a site.",
        "callouts": [
            "A MAIN",
            "B BOAT HOUSE",
            "MID LINK",
            "A GARDEN",
            "B HEAVEN"
        ],
        "strategies": [
            "Control Mid to block splits to B Heaven or A Link",
            "Force seal A doors during retakes to slow attackers"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png"
    },
    {
        "slug": "bind",
        "name": "BIND",
        "location": "34\u00b02'A'N,6\u00b051'Z'W",
        "lore": "Two sites. No middle. Fights are centered on narrow choke points on both sides, connected by fast-travel teleportation links.",
        "callouts": [
            "U HALL",
            "HOOKAH",
            "SHOWER",
            "A SHORT",
            "B LONG"
        ],
        "strategies": [
            "Fake rotations using teleporter audio queues",
            "Hold Hookah with heavy utility to deny B splits"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png"
    },
    {
        "slug": "haven",
        "name": "HAVEN",
        "location": "27\u00b028'A'N,89\u00b038'WZ'E",
        "lore": "VALORANT tactical map layout for Haven.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png"
    },
    {
        "slug": "split",
        "name": "SPLIT",
        "location": "35\u00b041'CD'N,139\u00b041'WX'E",
        "lore": "VALORANT tactical map layout for Split.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png"
    },
    {
        "slug": "icebox",
        "name": "ICEBOX",
        "location": "76\u00b044' A\"N 149\u00b030' Z\"E",
        "lore": "VALORANT tactical map layout for Icebox.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png"
    },
    {
        "slug": "breeze",
        "name": "BREEZE",
        "location": "26\u00b011'AG\"N 71\u00b010'WY\"W",
        "lore": "VALORANT tactical map layout for Breeze.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png"
    },
    {
        "slug": "fracture",
        "name": "FRACTURE",
        "location": "35\u00b048'BI\"N 106\u00b008'YQ\"W",
        "lore": "VALORANT tactical map layout for Fracture.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/splash.png"
    },
    {
        "slug": "pearl",
        "name": "PEARL",
        "location": "38\u00b042'ED\"N8 9\u00b008'XS\"W8",
        "lore": "VALORANT tactical map layout for Pearl.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png"
    },
    {
        "slug": "lotus",
        "name": "LOTUS",
        "location": "14\u00b007'AD.4\"N8 74\u00b053'XY\"E8",
        "lore": "VALORANT tactical map layout for Lotus.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png"
    },
    {
        "slug": "sunset",
        "name": "SUNSET",
        "location": "34\u00b0 2\u2032 C\u2033 N, 118\u00b0 12\u2032 YT\u2033 W",
        "lore": "VALORANT tactical map layout for Sunset.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png"
    },
    {
        "slug": "abyss",
        "name": "ABYSS",
        "location": "70\u00b0 50' AJ\" N, 9\u00b0 00' VX\" W",
        "lore": "VALORANT tactical map layout for Abyss.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/splash.png"
    },
    {
        "slug": "corrode",
        "name": "CORRODE",
        "location": "48\u00b0 38' FH\" N8, 1\u00b0 33' YV\" W8",
        "lore": "VALORANT tactical map layout for Corrode.",
        "callouts": [
            "A SITE",
            "B SITE",
            "MID AREA"
        ],
        "strategies": [
            "Control key choke points and block sightlines with smokes"
        ],
        "minimapUrl": "https://media.valorant-api.com/maps/1c18ab1f-420d-0d8b-71d0-77ad3c439115/displayicon.png",
        "splashUrl": "https://media.valorant-api.com/maps/1c18ab1f-420d-0d8b-71d0-77ad3c439115/splash.png"
    }
],
  lore: [
    {
        "slug": "first-light",
        "title": "THE FIRST LIGHT EFFECT",
        "chapter": 1,
        "content": "First Light occurred in 2039, sweeping across Earth to introduce Radianite. This chemical energy altered selected humans (Radiants) and triggered technological leaps funded by the Kingdom Corporation.",
        "summary": "The catastrophic event that gave birth to Radiants and Radianite."
    },
    {
        "slug": "kingdom-corp",
        "title": "KINGDOM CORPORATION ASCENT",
        "chapter": 2,
        "content": "Kingdom Corporation controls three-quarters of global Radianite energy, generating clean energy but hiding industrial weapons programs beneath secure sectors.",
        "summary": "The global conglomerate steering the Radianite industry."
    }
],
  patches: [
    {
        "slug": "patch-1302",
        "version": "13.02",
        "date": "JULY 28, 2026",
        "title": "VALORANT Patch Notes 13.02",
        "season": "Season 2026",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-02/",
        "tags": ["Agent Balance", "Bug Fixes", "Retake"],
        "buffs": [
            {
                "subject": "Retakes Mode",
                "detail": "Split, Corrode, and Lotus maps have been added to the Retakes map pool."
            }
        ],
        "nerfs": [
            {
                "subject": "Phoenix Run It Back",
                "detail": "Ultimate casting frequency and recovery rates adjusted to line up with other agents (Ultimate points increased from 6 to 7)."
            }
        ],
        "updates": [
            "Fixed door and ability rendering bugs on Summit map",
            "Delayed replication mode queues for matchmaking optimization"
        ]
    },
    {
        "slug": "patch-1301",
        "version": "13.01",
        "date": "JULY 14, 2026",
        "title": "VALORANT Patch Notes 13.01",
        "season": "Season 2026",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-01/",
        "tags": ["Agent Balance", "Outlaw Tuning", "Anti-Cheat"],
        "buffs": [
            {
                "subject": "Iso Double Tap",
                "detail": "Increased weapon equip speed immediately following shield depletion."
            },
            {
                "subject": "Yoru Gatecrash",
                "detail": "Increased overall ability duration parameter."
            }
        ],
        "nerfs": [
            {
                "subject": "Outlaw Sniper",
                "detail": "Balanced handling adjustments to stabilize mid-range control."
            }
        ],
        "updates": [
            "Implemented advanced cheat and rank manipulation detection systems",
            "Added penalties for confirmed rank boosting offenses"
        ]
    },
    {
        "slug": "patch-1300",
        "version": "13.00",
        "date": "JUNE 23, 2026",
        "title": "VALORANT Patch Notes 13.00",
        "season": "Season 2026",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-00/",
        "tags": ["Sentinel Buffs", "New Map", "System Adjustments"],
        "buffs": [
            {
                "subject": "Sentinels",
                "detail": "Major balance and utility tuning buffs applied to Cypher, Killjoy, Sage, Deadlock, and Veto."
            },
            {
                "subject": "Initiators",
                "detail": "Cooldown periods decreased for signature abilities of Sova, Fade, Skye, Breach, and KAY/O."
            },
            {
                "subject": "Summit Map",
                "detail": "Released brand new high-altitude facility map 'Summit' into active rotations."
            }
        ],
        "nerfs": [
            {
                "subject": "Bandit Weapon",
                "detail": "Balanced early round penetration rates."
            }
        ],
        "updates": [
            "Launched competitive matchmaking Act 4",
            "Added in-client Notification Inbox system",
            "Updated Omen Shrouded Step sound signature"
        ]
    },
    {
        "slug": "patch-1200",
        "version": "12.00",
        "date": "JANUARY 6, 2026",
        "title": "VALORANT Patch Notes 12.00",
        "season": "Season 2026",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-12-00/",
        "tags": ["New Sidearm", "Replay Support", "Breeze Rework"],
        "buffs": [
            {
                "subject": "Breeze Map",
                "detail": "Returned to competitive pool with a complete visual and mechanical rework."
            },
            {
                "subject": "Bandit Weapon",
                "detail": "Introduced a new high-fire-rate tactical sidearm (Bandit) to the armory."
            }
        ],
        "nerfs": [
            {
                "subject": "Harbor Cascade",
                "detail": "Reduced shield health parameters to improve defensive counterplays."
            }
        ],
        "updates": [
            "Added Custom match Replay System recording support",
            "Released limited-time game mode: 'All Random, One Site'"
        ]
    },
    {
        "slug": "patch-1100",
        "version": "11.00",
        "date": "JUNE 24, 2025",
        "title": "VALORANT Patch Notes 11.00",
        "season": "Season 2025",
        "act": "Act 4",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-11-00/",
        "tags": ["New Map", "Waylay Agent", "Placement Adjustment"],
        "buffs": [
            {
                "subject": "Corrode Map",
                "detail": "Released brand-new highly interactive vertical map 'Corrode'."
            },
            {
                "subject": "Reyna Devour",
                "detail": "Increased standard heal rate capability."
            }
        ],
        "nerfs": [
            {
                "subject": "Neon High Gear",
                "detail": "Decreased maximum sliding accuracy boost parameters."
            }
        ],
        "updates": [
            "Increased maximum placement rank capability to Ascendant 3",
            "Bind and Corrode added to competitive map pool rotations"
        ]
    },
    {
        "slug": "patch-1000",
        "version": "10.00",
        "date": "JANUARY 7, 2025",
        "title": "VALORANT Patch Notes 10.00",
        "season": "Season 2025",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-10-00/",
        "tags": ["Tejo Agent", "6 Acts Calendar", "Voting System"],
        "buffs": [
            {
                "subject": "Tejo Agent",
                "detail": "Released Colombia-based tactical utility Initiator agent Tejo."
            },
            {
                "subject": "Fracture Map",
                "detail": "Returned to active competitive matching pools with entry point tweaks."
            }
        ],
        "nerfs": [
            {
                "subject": "Lotus C Site",
                "detail": "Reduced default plant zone radius to prevent remote defusal angles."
            }
        ],
        "updates": [
            "Transitioned seasonal schedule to year-long Act cycles consisting of 6 Acts",
            "Implemented Automatic Remake Voting system inside matchmaking lobbies"
        ]
    },
    {
        "slug": "patch-900",
        "version": "9.00",
        "date": "JUNE 25, 2024",
        "title": "VALORANT Patch Notes 9.00",
        "season": "Episode 09: COLLISION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-9-00/",
        "tags": ["Console Launch", "Abyss Map", "Iso Nerf"],
        "buffs": [
            {
                "subject": "Abyss Map",
                "detail": "Added first-ever map featuring dangerous drop-off spots."
            }
        ],
        "nerfs": [
            {
                "subject": "Iso Double Tap",
                "detail": "Shield duration reduced to decrease raw run-and-gun dominance."
            }
        ],
        "updates": [
            "Added console version support with cross-progression.",
            "Released dynamic audio improvements for console controllers."
        ]
    },
    {
        "slug": "patch-800",
        "version": "8.00",
        "date": "JANUARY 9, 2024",
        "title": "VALORANT Patch Notes 8.00",
        "season": "Episode 08: DEFIANCE",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-8-00/",
        "tags": ["Outlaw Weapon", "Clove Agent", "Deadlock Buff"],
        "buffs": [
            {
                "subject": "Deadlock Barrier",
                "detail": "Mesh health scale increased for faster setups."
            },
            {
                "subject": "Outlaw Sniper",
                "detail": "Brand new double-barrel sniper weapon added to armory."
            }
        ],
        "nerfs": [
            {
                "subject": "Killjoy Turret",
                "detail": "Reduced vision cone degree and target tracking range."
            }
        ],
        "updates": [
            "Introduced the Outlaw weapon for anti-half-shield eco rounds.",
            "Readjusted Icebox map layout structures."
        ]
    },
    {
        "slug": "patch-700",
        "version": "7.00",
        "date": "JUNE 27, 2023",
        "title": "VALORANT Patch Notes 7.00",
        "season": "Episode 07: EVOLUTION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-7-00/",
        "tags": ["Deadlock Agent", "TDM Mode", "Progression Rework"],
        "buffs": [
            {
                "subject": "Team Deathmatch Mode",
                "detail": "Added instant respawns on custom small arenas."
            },
            {
                "subject": "Deadlock Agent",
                "detail": "Released brand new Sentinel agent from Norway."
            }
        ],
        "nerfs": [
            {
                "subject": "Chamber Tour De Force",
                "detail": "Slow duration decreased upon scoring sniper kills."
            }
        ],
        "updates": [
            "Added the brand-new Progression System and Kingdom Credits.",
            "Released three custom Team Deathmatch maps: Piazza, District, Kasbah."
        ]
    },
    {
        "slug": "patch-600",
        "version": "6.00",
        "date": "JANUARY 10, 2023",
        "title": "VALORANT Patch Notes 6.00",
        "season": "Episode 06: REVELATION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-6-00/",
        "tags": ["Lotus Map", "Split Returns", "Favoriting System"],
        "buffs": [
            {
                "subject": "Split Map",
                "detail": "Returned to competitive pool with layout updates on A site."
            },
            {
                "subject": "Lotus Map",
                "detail": "Brand-new 3-site ancient temple map added to rotation."
            }
        ],
        "nerfs": [
            {
                "subject": "Omen Dark Cover",
                "detail": "Decreased shadow travel speeds inside walls."
            }
        ],
        "updates": [
            "Added weapon skin variant favoriting features.",
            "Released Lotus map to active matchmaking queue."
        ]
    },
    {
        "slug": "patch-500",
        "version": "5.00",
        "date": "JUNE 22, 2022",
        "title": "VALORANT Patch Notes 5.00",
        "season": "Episode 05: DIMENSION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-5-00/",
        "tags": ["Pearl Map", "Ascendant Rank", "Map Pool Adjustments"],
        "buffs": [
            {
                "subject": "Pearl Map",
                "detail": "Brand-new underwater Portuguese city map added."
            },
            {
                "subject": "Ascendant Rank",
                "detail": "Added brand new rank tier between Diamond and Immortal."
            }
        ],
        "nerfs": [
            {
                "subject": "Split Map",
                "detail": "Removed from competitive map pools temporarily."
            }
        ],
        "updates": [
            "Introduced Ascendant rank to combat rank distribution inflation.",
            "Released Pearl map to active matchmaking queue."
        ]
    },
    {
        "slug": "patch-400",
        "version": "4.00",
        "date": "JANUARY 11, 2022",
        "title": "VALORANT Patch Notes 4.00",
        "season": "Episode 04: DISRUPTION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-4-00/",
        "tags": ["Neon Agent", "Ares Buff", "Spectre Nerf"],
        "buffs": [
            {
                "subject": "Neon Agent",
                "detail": "Released brand new fast-paced Duelist agent from Philippines."
            },
            {
                "subject": "Ares LMG",
                "detail": "Removed spin-up delay to improve early firefight capability."
            }
        ],
        "nerfs": [
            {
                "subject": "Spectre SMG",
                "detail": "Added harsher accuracy penalties at medium range."
            }
        ],
        "updates": [
            "Added competitive pool level gate (Level 20 account required).",
            "Released balance adjustments for Breeze and Bind."
        ]
    },
    {
        "slug": "patch-300",
        "version": "3.00",
        "date": "JUNE 22, 2021",
        "title": "VALORANT Patch Notes 3.00",
        "season": "Episode 03: REFLECTION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-3-00/",
        "tags": ["KAY/O Agent", "Price Changes", "Ability Adjustments"],
        "buffs": [
            {
                "subject": "KAY/O Agent",
                "detail": "Released brand new suppression Initiator war machine."
            }
        ],
        "nerfs": [
            {
                "subject": "Weapon Prices",
                "detail": "Increased economy costs of Vandal, Phantom, and Operator."
            },
            {
                "subject": "Signature Abilities",
                "detail": "Adjusted cooldown rates for duelists."
            }
        ],
        "updates": [
            "Revamped agent ability price weights across all classes.",
            "Introduced the first-ever Run-It-Back bundle charity collection."
        ]
    },
    {
        "slug": "patch-200",
        "version": "2.00",
        "date": "JANUARY 12, 2021",
        "title": "VALORANT Patch Notes 2.00",
        "season": "Episode 02: FORMATION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-2-00/",
        "tags": ["Yoru Agent", "Omen Nerf", "Leaderboards"],
        "buffs": [
            {
                "subject": "Yoru Agent",
                "detail": "Released brand new stealth-teleporting Duelist from Japan."
            }
        ],
        "nerfs": [
            {
                "subject": "Omen Paranoia",
                "detail": "Increased purchase cost from 200 to 400 credits."
            },
            {
                "subject": "Jett Tailwind",
                "detail": "Increased dash windup animations."
            }
        ],
        "updates": [
            "Added real-time Competitive leaderboards inside the client.",
            "Adjusted Brimstone stim beacon casting rates."
        ]
    },
    {
        "slug": "patch-100",
        "version": "1.00",
        "date": "JUNE 2, 2020",
        "title": "VALORANT Patch Notes 1.00",
        "season": "Episode 01: IGNITION",
        "act": "Act 1",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-1-00/",
        "tags": ["Launch Update", "Reyna Agent", "Ascent Map"],
        "buffs": [
            {
                "subject": "Ascent Map",
                "detail": "Brand new Italy-based tactical map added."
            },
            {
                "subject": "Reyna Agent",
                "detail": "Released brand new self-healing Duelist from Mexico."
            },
            {
                "subject": "Spike Rush Mode",
                "detail": "Introduced fast-paced casual random-orb mode."
            }
        ],
        "nerfs": [
            {
                "subject": "Sage Barrier Orb",
                "detail": "Reduced health from 1000 to 800 HP."
            }
        ],
        "updates": [
            "Official global release of VALORANT on PC.",
            "Implemented full competitive system rulesets post-closed beta."
        ]
    },
    {
        "slug": "patch-050",
        "version": "0.50",
        "date": "APRIL 7, 2020",
        "title": "VALORANT Closed Beta Notes 0.50",
        "season": "Closed Beta",
        "act": "Beta",
        "url": "https://playvalorant.com/en-us/news/game-updates/valorant-closed-beta-notes-0-50/",
        "tags": ["Beta Launch", "Haven Map", "Bind Map"],
        "buffs": [
            {
                "subject": "Beta Launch",
                "detail": "Initiated closed beta access for selected regions."
            }
        ],
        "nerfs": [
            {
                "subject": "Split Map",
                "detail": "Optimized sightlines on B site to improve attacker options."
            }
        ],
        "updates": [
            "Released maps Haven, Bind, and Split.",
            "Configured primary weapon accuracy mechanics and spray profiles."
        ]
    }
  ],
  leaks: [
    {
        "slug": "agent-26-claw",
        "codename": "CLAW",
        "category": "AGENT",
        "discoveredDate": "2026-07-10",
        "details": "Encrypted raw asset directories found in the PBE patch index. Target files show references to energy absorption nets and magnetic claws. Suspected Initiator release in Q3.",
        "credibility": "HIGH"
    }
  ],
  flexItems: [
    {
        "uuid": "stat-com-flex",
        "displayName": "STAT-COM",
        "description": "The default starter accessory, displaying personal agent diagnostics and statistics on a handheld panel.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/1/11/STAT-COM_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102841",
        "animated": false,
        "category": "Free Starter"
    },
    {
        "uuid": "stellar-dendrite-flex",
        "displayName": "Stellar Dendrite",
        "description": "A delicate, glowing ice crystal that spins beautifully in your agent's hand. Season 2025 Act 1 Battle Pass reward.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/c/cb/Stellar_Dendrite_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102918",
        "animated": true,
        "category": "Battle Pass"
    },
    {
        "uuid": "tactibear-flex",
        "displayName": "Tactibear",
        "description": "Your favorite cuddly companion, perfect for squeezing to calm down during high-pressure match scenarios.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/b/ba/Tactibear_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102912",
        "animated": false,
        "category": "Battle Pass"
    },
    {
        "uuid": "killbanner-flex",
        "displayName": "Killbanner",
        "description": "A handheld holographic simulator showing your active kill banners in real-time.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/2/29/Killbanner_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102900",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "spike-rush-cup-flex",
        "displayName": "Spike Rush Cup",
        "description": "A victory trophy commemorating your fast-paced Spike Rush triumphs.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/9/95/Spike_Rush_Cup_Flex.png/revision/latest/scale-to-width-down/300?cb=20250820144839",
        "animated": false,
        "category": "Event Reward"
    },
    {
        "uuid": "pb-j-flex",
        "displayName": "PB&J",
        "description": "A delicious looking peanut butter and jelly sandwich to snack on between rounds.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/e/ec/PB%26J_Flex.png/revision/latest/scale-to-width-down/300?cb=20251218224326",
        "animated": false,
        "category": "Battle Pass"
    },
    {
        "uuid": "5-years-flex",
        "displayName": "5 Years",
        "description": "A special 5-year anniversary cake accessory released during the 5 Years of Valorant festival.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/a/ae/5_Years_Flex.png/revision/latest/scale-to-width-down/300?cb=20250603180556",
        "animated": true,
        "category": "Exclusive Event"
    },
    {
        "uuid": "dragon-gate-flex",
        "displayName": "Dragon Gate",
        "description": "A majestic dragon gateway miniature from the Dragon Gate Collection. Season 2026 Act 2 Battle Pass.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/4/45/Dragon_Gate_Flex.png/revision/latest/scale-to-width-down/300?cb=20260317165532",
        "animated": true,
        "category": "Battle Pass"
    },
    {
        "uuid": "mr-sprinklebottom-flex",
        "displayName": "Mr. Sprinklebottom",
        "description": "A adorable gingerbread mascot from the holiday Cookie Kit Capsule.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/7/7d/Mr._Sprinklebottom_Flex.png/revision/latest/scale-to-width-down/300?cb=20251218224310",
        "animated": false,
        "category": "Premium Store"
    },
    {
        "uuid": "burnard-brioche-flex",
        "displayName": "Burnard & Brioche",
        "description": "Duo ducks ready to play and cuddle. Originally from the Duo's Day / Duckling Duo Capsule.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/6/69/Burnard_%26_Brioche_Flex.png/revision/latest/scale-to-width-down/300?cb=20260512181418",
        "animated": false,
        "category": "Premium Store"
    },
    {
        "uuid": "vct-2026-flex",
        "displayName": "VCT 2026",
        "description": "Celebrate the VCT 2026 season with the official handheld trophy simulator.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/9/9a/VCT_2026_Flex.png/revision/latest/scale-to-width-down/300?cb=20260219080449",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "fdgt-spnr-flex",
        "displayName": "FDGT // SPNR",
        "description": "The ultimate fidget toy, spinning indefinitely on a custom metallic bearing. Run It Back Collection.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/c/c2/FDGT_SPNR_Flex.png/revision/latest/scale-to-width-down/300?cb=20260203205449",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "ora-by-onetap-flex",
        "displayName": "ORA by OneTap",
        "description": "Sleek tactical headset widget with full frequency visualizers. ORA Collection.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/6/67/ORA_by_OneTap_Flex.png/revision/latest/scale-to-width-down/300?cb=20251218224319",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "helix-flex",
        "displayName": "Helix",
        "description": "A mechanical shifting snake-like device that twists and locks into various shapes.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/e/e1/Helix_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102928",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "sharkx-flex",
        "displayName": "SharkX",
        "description": "A tiny mechanical shark swimming in a miniature holographic sphere.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/7/73/SharkX_Flex.png/revision/latest/scale-to-width-down/300?cb=20250731204859",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "champions-2025-trophy-flex",
        "displayName": "Champions 2025 Trophy",
        "description": "Show off the VCT Champions 2025 golden trophy on a miniature base.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/f/f5/Champions_2025_Trophy_Flex.png/revision/latest/scale-to-width-down/300?cb=20250907220624",
        "animated": true,
        "category": "Exclusive Bundle"
    },
    {
        "uuid": "bolt-prism-flex",
        "displayName": "Bolt Prism",
        "description": "A floating prismatic device that charges electrical currents in your hand.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/7/7d/Bolt_Prism_Flex.png/revision/latest/scale-to-width-down/300?cb=20250501102934",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "blackthorn-flex",
        "displayName": "Blackthorn",
        "description": "A blooming thorn ornament from the Blackthorn collection that grows on command.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/0/00/Blackthorn_Flex.png/revision/latest/scale-to-width-down/300?cb=20260318094851",
        "animated": true,
        "category": "Premium Store"
    },
    {
        "uuid": "smiley-flex",
        "displayName": ":D",
        "description": "A cute digital smiley face emulator showing custom emotional expressions.",
        "imageUrl": "https://static.wikia.nocookie.net/valorant/images/3/39/D_Flex.png/revision/latest/scale-to-width-down/300?cb=20250820144812",
        "animated": false,
        "category": "Premium Store"
    }
  ]
};
