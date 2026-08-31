/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Grid, Layers, Shield, Sparkles, Sliders, Search, DollarSign, Clock, HelpCircle, Heart } from "lucide-react";
import { fetchWeapons, fetchBundles, fetchBuddies, fetchSprays, fetchPlayerCards, Weapon, WeaponSkin, Bundle, Buddy, Spray, PlayerCard } from "../services/valorantService";
import { playSFX } from "../utils/sfx";

interface CollectionHubProps {
  subTab: string;
}

export default function CollectionHub({ subTab }: CollectionHubProps) {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [allSkins, setAllSkins] = useState<WeaponSkin[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [sprays, setSprays] = useState<Spray[]>([]);
  const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeaponFilter, setSelectedWeaponFilter] = useState("all");
  
  // Store simulation state
  const [vpBalance, setVpBalance] = useState(10000);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(["Default Vandal", "Default Phantom"]);
  const [storeCountdown, setStoreCountdown] = useState("18:42:09");

  // Battlepass simulator state
  const [battlepassXP, setBattlepassXP] = useState(125000);
  const maxXP = 500000;

  useEffect(() => {
    async function loadData() {
      try {
        const [w, bun, bud, spr, pc] = await Promise.all([
          fetchWeapons(),
          fetchBundles(),
          fetchBuddies(),
          fetchSprays(),
          fetchPlayerCards()
        ]);
        setWeapons(w);
        setBundles(bun);
        setBuddies(bud);
        setSprays(spr);
        setPlayerCards(pc);
        
        // Extract all skins across all weapons
        const skins: WeaponSkin[] = [];
        w.forEach((weapon) => {
          weapon.skins.forEach((skin) => {
            if (skin.displayIcon && !skin.displayName.includes("Standard")) {
              skins.push(skin);
            }
          });
        });
        setAllSkins(skins);
      } catch (err) {
        console.error("Error loading CollectionHub data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update store countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const mins = 59 - now.getMinutes();
      const secs = 59 - now.getSeconds();
      setStoreCountdown(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBuySkin = (skinName: string, price: number) => {
    if (ownedSkins.includes(skinName)) {
      return;
    }
    if (vpBalance >= price) {
      setVpBalance(vpBalance - price);
      setOwnedSkins([...ownedSkins, skinName]);
      playSFX.selectSurge();
    } else {
      alert("INSUFFICIENT VALORANT POINTS (VP). RESET TO FULL DEPOSIT VIA ADMIN OVERRIDE.");
    }
  };

  const handleAddVP = () => {
    setVpBalance(vpBalance + 5000);
    playSFX.scanBeep();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-t-transparent border-[#FA4454] rounded-full animate-spin mb-4" />
        <div className="font-mono text-xs text-white/40 tracking-[0.2em] uppercase">
          ESTABLISHING SECURE COMM-LINK // DECRYPTING PROTOCOL ASSETS...
        </div>
      </div>
    );
  }

  // 1. WEAPON SKINS BROWSER
  if (subTab === "skins") {
    const filteredSkins = allSkins.filter((skin) => {
      const matchesSearch = skin.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      // Find which weapon this skin belongs to, or check search
      if (selectedWeaponFilter === "all") return matchesSearch;
      
      const weapon = weapons.find((w) => w.skins.some((s) => s.uuid === skin.uuid));
      const matchesWeapon = weapon ? weapon.uuid === selectedWeaponFilter : false;
      return matchesSearch && matchesWeapon;
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">
              <span className="w-2 h-2 bg-[#FA4454]" />
              <span>COLLECTION CABINET</span>
            </div>
<h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
               WEAPON SKINS GALLERY
            </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              Browse complete weapon skin levels and models. Loaded directly from official Valorant Protocol data caches.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#05080B]/60 border border-white/10 p-3 clip-diagonal-sm font-mono text-xs text-right">
            <span className="text-white/40 block uppercase">TOTAL MODELS INDEXED</span>
            <span className="text-[#0DF2F2] font-black text-lg">{allSkins.length} SKINS</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH SKIN COLLECTION (e.g. prime, reaver, rgx)..."
              className="w-full bg-[#0B141A]/90 border border-white/10 focus:border-[#0DF2F2]/40 rounded-none p-3 pl-10 font-mono text-xs text-white uppercase tracking-widest focus:outline-none placeholder-white/30"
            />
          </div>

          {/* Weapon Filter Select */}
          <select
value={selectedWeaponFilter}
             onChange={(e) => setSelectedWeaponFilter(e.target.value)}
             className="bg-[#0B141A]/90 border border-white/10 p-3 font-mono text-xs text-white uppercase tracking-widest focus:outline-none focus:border-[#0DF2F2]/40 rounded-none"
          >
            <option value="all">ALL WEAPONS</option>
            {weapons.map((w) => (
              <option key={w.uuid} value={w.uuid}>
                {w.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Skins Grid */}
        {loading ? (
          <div className="text-center py-20 font-mono text-white/40 tracking-widest">
            SYNCHRONIZING REPOSITORY CACHES...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredSkins.slice(0, 150).map((skin) => (
              <div
                  key={skin.uuid}
                  className="surface-glass border-[rgba(236,232,225,0.12)] hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 p-6 clip-diagonal-sm group transition-all relative flex flex-col justify-between min-h-[220px]"
               >
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                 {/* Skin Rarity Tag line decoration */}
                 <div className="absolute top-0 right-0 left-0 h-[2px] bg-white/5 group-hover:bg-[#FA4454]/50 transition-colors" />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#ECE8E1] tracking-wider group-hover:text-[#0DF2F2] transition-colors uppercase">
                      {skin.displayName}
                    </h3>
                  </div>

                  {/* Skin Display Image */}
                  <div className="h-28 flex items-center justify-center p-2 relative overflow-hidden">
                    <img
                      src={skin.displayIcon || ""}
                      alt={skin.displayName}
                      className="max-h-24 max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>


              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // 2. FEATURED STORE SIMULATOR
  if (subTab === "store") {
    // We dynamically choose 4 skins from the live API dataset for daily store rotation
    const storeDeals = allSkins.length >= 4 
      ? [
          { name: allSkins[15 % allSkins.length].displayName, price: 1775, image: allSkins[15 % allSkins.length].displayIcon || "", tier: "Premium" },
          { name: allSkins[42 % allSkins.length].displayName, price: 1775, image: allSkins[42 % allSkins.length].displayIcon || "", tier: "Premium" },
          { name: allSkins[68 % allSkins.length].displayName, price: 4350, image: allSkins[68 % allSkins.length].displayIcon || "", tier: "Exclusive" },
          { name: allSkins[104 % allSkins.length].displayName, price: 2475, image: allSkins[104 % allSkins.length].displayIcon || "", tier: "Ultra" }
        ]
      : [
          { name: "Reaver Vandal", price: 1775, image: "https://media.valorant-api.com/weaponskins/44c6c67c-440e-3558-a96c-739b69b59695/displayicon.png", tier: "Premium" },
          { name: "Prime Phantom", price: 1775, image: "https://media.valorant-api.com/weaponskins/3ff650d5-45be-0df7-621e-d4a1c5d0ef46/displayicon.png", tier: "Premium" },
          { name: "RGX 11z Pro Blade", price: 4350, image: "https://media.valorant-api.com/weaponskins/e781198f-4cb1-807c-9b6d-aa9556da0284/displayicon.png", tier: "Exclusive" },
          { name: "Elderflame Operator", price: 2475, image: "https://media.valorant-api.com/weaponskins/1b7470f7-4184-f2a8-a579-2c9748b6f3c1/displayicon.png", tier: "Ultra" }
        ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">
              <span className="w-2 h-2 bg-[#FA4454]" />
              <span>STORES TERMINAL</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
              FEATURED ARSENAL STORE
            </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              Daily rotational tactical stock. Simulate purchasing skins using Radianite/VP. Balance refills instantly.
            </p>
          </div>

          {/* VP Balance Display */}
          <div className="flex items-center gap-4 bg-[#0B141A]/80 border border-white/10 p-4 clip-diagonal">
            <div className="font-mono text-left">
              <span className="text-white/40 text-[9px] uppercase block">YOUR SECURED VP</span>
              <span className="text-xl font-black text-[#FA4454] tracking-wider">{vpBalance} VP</span>
            </div>
            <button
              onClick={handleAddVP}
              onMouseEnter={() => playSFX.hoverClick()}
              className="bg-[#0DF2F2]/10 hover:bg-[#0DF2F2]/20 border border-[#0DF2F2] text-[#0DF2F2] font-mono text-[10px] px-3 py-2 uppercase tracking-wider clip-diagonal-sm cursor-none interactive-tactical"
            >
              + ADD 5000
            </button>
          </div>
        </div>

        {/* Featured Store Banner */}
        <div className="border border-white/10 bg-[#0B141A]/90 p-6 clip-diagonal mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-xs text-white/30 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FA4454] animate-pulse" />
            <span>RESET COUNTDOWN: <span className="text-white font-bold">{storeCountdown}</span></span>
          </div>
          <span className="font-mono text-xs text-[#FA4454] tracking-widest font-bold block mb-1">FEATURED OFFERING</span>
              <h3 className="font-display font-black text-2xl text-white tracking-wide">PROTOCOL DAILY ROTATION</h3>
          <p className="text-white/50 text-xs max-w-xl">
            Simulate actual store purchases. Bought skins will register as owned under active terminal parameters.
          </p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {storeDeals.map((deal) => {
            const isOwned = ownedSkins.includes(deal.name);
            return (
              <div
                key={deal.name}
                className="bg-[#0B141A]/90 border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative flex flex-col justify-between hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all group min-h-[300px]"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="corner-chip">{deal.tier} TIER</div>
                  <div className="flex justify-between items-center mb-2 pt-2">
                    <span className="font-mono text-xs text-[#FA4454] font-bold">{deal.price} VP</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-[#ECE8E1] tracking-wide group-hover:text-[#FA4454] transition-colors">
                    {deal.name}
                  </h4>
                  <div className="h-32 flex items-center justify-center p-4">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="max-h-24 max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                <button
                  onClick={() => handleBuySkin(deal.name, deal.price)}
                  onMouseEnter={() => playSFX.hoverClick()}
                  disabled={isOwned}
                  className={`w-full py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all clip-diagonal-sm cursor-none interactive-tactical ${
                    isOwned
                      ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                      : "bg-[#FA4454]/10 hover:bg-[#FA4454] border border-[#FA4454] text-[#FA4454] hover:text-white"
                  }`}
                >
                  {isOwned ? "ALREADY PURCHASED" : `PURCHASE ITEM // ${deal.price} VP`}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 3. BUNDLE CATALOG
  if (subTab === "bundles") {
    const activeBundles = bundles.length > 0 
      ? bundles.filter(b => b.displayIcon2 || b.displayIcon).map((b, idx) => ({
          name: b.displayName,
          price: idx % 2 === 0 ? "7,100 VP" : "8,700 VP",
          theme: b.extraDescription || b.description || "Premium Weapon Cosmetics",
          release: b.promoDescription || "EXCLUSIVE DIRECTIVE",
          cover: b.displayIcon2 || b.displayIcon,
          weapons: ["Assorted Skins", "Buddies Included"]
        }))
      : [
          { name: "REAVER 2.0 BUNDLE", price: "7,100 VP", theme: "Necromantic / Demonic", release: "EP 5 ACT 1", cover: "https://media.valorant-api.com/bundles/10e05697-4007-0744-f9b4-3fa0e9982464/displayicon.png", weapons: ["Ghost", "Spectre", "Odin", "Phantom", "Karambit Melee"] },
          { name: "PRIME COLLECTION 1.0", price: "7,100 VP", theme: "Luxury Tech / Gold & Purple", release: "EP 1 ACT 1", cover: "https://media.valorant-api.com/bundles/6b177e7a-4228-5696-93d3-1ca73fa8ff48/displayicon.png", weapons: ["Classic", "Spectre", "Bucky", "Vandal", "Prime Axe Melee"] },
          { name: "RGX 11Z PRO BUNDLE", price: "8,700 VP", theme: "Gaming Hardware / LED RGB", release: "EP 3 ACT 2", cover: "https://media.valorant-api.com/bundles/dbf813c0-435b-1175-6f91-dca60bf47671/displayicon.png", weapons: ["Frenzy", "Stinger", "Guardian", "Vandal", "RGX Katana Melee"] },
          { name: "SOVEREIGN COLLECTION", price: "7,100 VP", theme: "Angelic / High Fantasy", release: "EP 1 ACT 1", cover: "https://media.valorant-api.com/bundles/451737f1-4db8-b1ff-9701-d7af99347895/displayicon.png", weapons: ["Ghost", "Stinger", "Guardian", "Marshal", "Sovereign Sword"] }
        ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-10">
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>HISTORIC BUNDLES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            PREMIUM BUNDLE CATALOG
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Historical overview of major bundle releases. Relive legendary premium collections released during protocol seasons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{activeBundles.map((bundle) => (
              <div
                key={bundle.name}
                className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all flex flex-col justify-between group relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <img
                  src={bundle.cover}
                  alt={bundle.name}
                  className="w-full h-48 object-cover mb-4 rounded-xs border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-black text-xl text-[#ECE8E1] tracking-wider line-clamp-1">
                    {bundle.name}
                  </h3>
                  <span className="font-mono text-sm text-[#FA4454] font-bold shrink-0">{bundle.price}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
                  <div className="border-b border-white/5 pb-1">
                    <span className="text-white/40 block">THEME DESIGN</span>
                    <span className="text-white/60 font-semibold line-clamp-1">{bundle.theme}</span>
                  </div>
                  <div className="border-b border-white/5 pb-1">
                    <span className="text-white/40 block">RELEASE WINDOW</span>
                    <span className="text-white/60 font-semibold line-clamp-1">{bundle.release}</span>
                  </div>
                </div>
              </div>

<div>
                   <h4 className="font-mono text-[10px] text-[#0DF2F2] tracking-widest mb-2 uppercase">BUNDLE WEAPONS INCLUDED</h4>
                 <div className="flex flex-wrap gap-2">
                  {bundle.weapons.map((w) => (
                    <span key={w} className="font-mono text-[10px] bg-white/[0.03] border border-white/10 px-2.5 py-1 text-white/80 uppercase">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // 4. CONTRACTS & PASSES
  if (subTab === "contracts") {
    const battlepassRewards = [
      { tier: "Tier 1", reward: "Stardust Classic Skin", type: "Weapon Skin", icon: "https://media.valorant-api.com/weaponskins/7bc80590-48fc-4309-8472-3ab65a953a3c/displayicon.png", xp: "20,000" },
      { tier: "Tier 15", reward: "Tactical Panda Gun Buddy", type: "Buddy Accessory", icon: "https://media.valorant-api.com/buddies/51296c05-4c07-6b45-2b47-669e46950228/displayicon.png", xp: "85,000" },
      { tier: "Tier 30", reward: "Dimensional Portal Card", type: "Player Card", icon: "https://media.valorant-api.com/playercards/60e704de-4d43-23df-b4a1-87ab0cfbd00e/largeart.png", xp: "180,000" },
      { tier: "Tier 50", reward: "Aero Phantom Skin", type: "Weapon Skin", icon: "https://media.valorant-api.com/weaponskins/22467b7a-42fc-1191-ff55-7ca5402636f1/displayicon.png", xp: "500,000" }
    ];

    const currentPercentage = Math.round((battlepassXP / maxXP) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-10">
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>SEASON PROGRESSION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            CONTRACTS &amp; BATTLEPASS
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Monitor active combat contracts and battlepass levels. Gain match XP to unlock premium weaponry components.
          </p>
        </div>

        {/* Interactive Battlepass Progression Tracker */}
        <div className="bg-[#05080B]/95 border border-white/10 p-8 clip-diagonal mb-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-mono text-xs text-[#0DF2F2] block mb-1">EPISODE 9 // ACT 1 PASS</span>
               <h3 className="font-display font-black text-2xl text-[#ECE8E1] tracking-wide">ACTIVE MISSION TRACKER</h3>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-white/40 block">CURRENT XP STANDING</span>
              <span className="text-white font-bold">{battlepassXP.toLocaleString()} / {maxXP.toLocaleString()} XP ({currentPercentage}%)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 h-4 overflow-hidden relative border border-white/10 mb-6">
            <div 
              className="bg-gradient-to-r from-[#FA4454] to-[#0DF2F2] h-full transition-all duration-500" 
              style={{ width: `${currentPercentage}%` }}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => { setBattlepassXP(Math.min(battlepassXP + 25000, maxXP)); playSFX.tick(); }}
              className="border border-[#FA4454] text-[#FA4454] hover:bg-[#FA4454]/10 font-mono text-[10px] uppercase tracking-wider px-4 py-2 clip-diagonal-sm cursor-none interactive-tactical"
            >
              SIMULATE COMBAT WIN (+25,000 XP)
            </button>
            <button
              onClick={() => { setBattlepassXP(0); playSFX.scanBeep(); }}
              className="border border-white/10 text-white/40 hover:text-white font-mono text-[10px] uppercase px-4 py-2 clip-diagonal-sm cursor-none interactive-tactical"
            >
              RESET PROGRESS
            </button>
          </div>
        </div>

        {/* Featured Battlepass Milestone Rewards */}
        <h3 className="font-display font-black text-2xl text-[#ECE8E1] tracking-wider mb-6">FEATURED MILESTONE REWARDS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {battlepassRewards.map((reward) => {
            const rewardXP = parseInt(reward.xp.replace(/,/g, ""));
            const isUnlocked = battlepassXP >= rewardXP;

            return (
              <div 
                key={reward.tier}
                className={`surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative flex flex-col justify-between min-h-[260px] transition-all duration-300 group hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 ${
                  isUnlocked ? "" : "opacity-70"
                }`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 bg-[#FA4454] px-3 py-1 font-mono text-[9px] font-black tracking-wider text-[#0B141A]">
                  {isUnlocked ? "UNLOCKED" : "LOCKED"}
                </div>
                <div>
                  <span className="font-mono text-xs text-[#FA4454] font-bold block mb-2">{reward.tier}</span>
                  <h4 className="font-display font-bold text-sm text-[#ECE8E1] leading-tight uppercase tracking-wider">
                    {reward.reward}
                  </h4>
                  <span className="font-mono text-[9px] text-white/40 block mt-1 uppercase">{reward.type}</span>
                  
                  <div className="h-24 flex items-center justify-center p-2 my-2">
                    <img 
                      src={reward.icon} 
                      alt={reward.reward} 
                      className={`max-h-20 max-w-full object-contain ${!isUnlocked && "filter grayscale opacity-40"}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="font-mono text-[9px] text-white/30 border-t border-white/5 pt-3">
                  REQUIRED XP: {reward.xp}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 5. GUN BUDDIES GALLERY
  if (subTab === "buddies") {
    const filteredBuddies = buddies.filter((b) => 
      b.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedBuddies = searchQuery 
      ? filteredBuddies 
      : filteredBuddies.slice(0, 48);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>CHARM CODES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            GUN BUDDIES COLLECTION
          </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              Browse weapon charms and tactical gun buddies. Filter through our live database repository.
            </p>
          </div>

          <div className="bg-[#05080B]/60 border border-white/10 p-3 clip-diagonal-sm font-mono text-xs text-right">
            <span className="text-white/40 block uppercase">TOTAL BUDDIES INDEXED</span>
            <span className="text-[#0DF2F2] font-black text-lg">{buddies.length} CHARMS</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH GUN BUDDIES ACCORDING TO PROTOCOL..."
            className="w-full bg-[#05080B]/90 border border-white/10 focus:border-[#0DF2F2]/40 rounded-none p-3 pl-10 font-mono text-xs text-white uppercase tracking-widest focus:outline-none placeholder-white/30"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedBuddies.map((buddy, idx) => {
            const rarity = idx % 3 === 0 ? "Premium" : (idx % 3 === 1 ? "Deluxe" : "Exclusive");
            return (
              <div 
                key={buddy.uuid}
                className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm relative hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all flex flex-col items-center justify-between min-h-[220px] group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="corner-chip">{rarity}</div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-sm text-[#ECE8E1] tracking-wide uppercase leading-tight mb-2 line-clamp-1 pt-2">
                    {buddy.displayName}
                  </h3>
                </div>
                <div className="w-24 h-24 flex items-center justify-center relative my-4">

                  <img 
                    src={buddy.displayIcon} 
                    alt={buddy.displayName} 
                    className="w-16 h-16 object-contain z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>

              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 6. SPRAYS SEARCH GRID
  if (subTab === "sprays") {
    const filteredSprays = sprays.filter((s) => 
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedSprays = searchQuery 
      ? filteredSprays 
      : filteredSprays.slice(0, 48);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>COMMUNITY DECALS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            TACTICAL SPRAYS MATRIX
          </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              Dynamic spray deck. Fully decrypted tactical spray inventory.
            </p>
          </div>

          <div className="bg-[#05080B]/60 border border-white/10 p-3 clip-diagonal-sm font-mono text-xs text-right">
            <span className="text-white/40 block uppercase">TOTAL SPRAYS INDEXED</span>
            <span className="text-[#FA4454] font-black text-lg">{sprays.length} SPRAYS</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH SYSTEM SPRAYS CACHE..."
            className="w-full bg-[#05080B]/90 border border-white/10 focus:border-[#FA4454]/40 rounded-none p-3 pl-10 font-mono text-xs text-white uppercase tracking-widest focus:outline-none placeholder-white/30"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedSprays.map((spray) => {
            const style = spray.category ? spray.category.replace("EAresCategory::", "") : "Tactical Decal";
            const anim = spray.animationGif ? "Animated" : "Static";
            return (
              <div 
                key={spray.uuid}
                className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all flex flex-col justify-between items-center text-center min-h-[220px] group relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="corner-chip">{anim}</div>
                <div className="pt-2">
                  <h3 className="font-display font-bold text-sm text-[#ECE8E1] uppercase leading-tight mb-4 line-clamp-1">
                    {spray.displayName}
                  </h3>
                </div>
                <img 
                  src={spray.fullIcon || spray.displayIcon || ""} 
                  alt={spray.displayName} 
                  className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_4px_12px_rgba(250,68,84,0.15)]"
                  referrerPolicy="no-referrer"
                />

              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 7. PLAYER CARDS
  if (subTab === "cards") {
    const filteredCards = playerCards.filter((c) => 
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedCards = searchQuery 
      ? filteredCards 
      : filteredCards.slice(0, 48);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>IDENTITY PLATES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            PLAYER CARDS VAULT
          </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              High-resolution player banner cards. Explore official Valorant identity badges.
            </p>
          </div>

          <div className="bg-[#05080B]/60 border border-white/10 p-3 clip-diagonal-sm font-mono text-xs text-right">
            <span className="text-white/40 block uppercase">TOTAL CARDS INDEXED</span>
            <span className="text-[#0DF2F2] font-black text-lg">{playerCards.length} CARDS</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PLAYER IDENTITY CARDS..."
            className="w-full bg-[#05080B]/90 border border-white/10 focus:border-[#0DF2F2]/40 rounded-none p-3 pl-10 font-mono text-xs text-white uppercase tracking-widest focus:outline-none placeholder-white/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedCards.map((card, idx) => {
            const rarity = idx % 3 === 0 ? "Legendary" : (idx % 3 === 1 ? "Premium" : "Exclusive");
            return (
              <div 
                key={card.uuid}
                className="surface-glass border-[rgba(236,232,225,0.12)] p-4 clip-diagonal-sm group hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all flex flex-col justify-between relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="corner-chip">{rarity}</div>
                <div className="overflow-hidden relative border border-white/5 mb-4 aspect-[9/16] bg-black mt-2">
                  <img 
                    src={card.largeArt || card.displayIcon || ""} 
                    alt={card.displayName} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="font-mono text-[9px] text-[#0DF2F2] block uppercase tracking-widest">EPISODE LEVEL</span>
                      <h3 className="font-display font-black text-sm text-[#ECE8E1] tracking-wide uppercase leading-tight mt-1 line-clamp-1">
                      {card.displayName}
                    </h3>
                  </div>
                </div>
                <div className="flex justify-between items-center font-mono text-[9px] text-white/40 uppercase">
                  <span>EPISODE LEVEL</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return null;
}
