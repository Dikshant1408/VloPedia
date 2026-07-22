/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Bookmark,
  Shield,
  ShoppingBag,
  Clock,
  CheckCircle,
  Plus,
  Compass,
  Trophy,
  Volume2,
  X,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PlayerCard, Spray, Buddy, Weapon, Bundle } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface CollectionTabProps {
  accentColor: string;
}

export default function CollectionTab({ accentColor }: CollectionTabProps) {
  const [cards, setCards] = useState<PlayerCard[]>([]);
  const [sprays, setSprays] = useState<Spray[]>([]);
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-tabs: store, bundles, cards, sprays, buddies
  const [activeSubTab, setActiveSubTab] = useState<string>("store");

  // Balance and inventory states persisted locally
  const [vpBalance, setVpBalance] = useState<number>(12000);
  const [rpBalance, setRpBalance] = useState<number>(185);
  const [ownedSkins, setOwnedSkins] = useState<string[]>([]);
  const [ownedBundles, setOwnedBundles] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<PlayerCard | null>(null);

  // Search and filters for global catalogs
  const [searchQuery, setSearchQuery] = useState("");
  const [skinSearchQuery, setSkinSearchQuery] = useState("");
  const [skinWeaponFilter, setSkinWeaponFilter] = useState("all");

  // Store offers (randomized on initial load)
  const [storeOffers, setStoreOffers] = useState<
    Array<{ uuid: string; name: string; icon: string; cost: number; weaponUuid: string }>
  >([]);

  // Preview overlay
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; title: string } | null>(null);

  // Purchase modal feedback
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Inspected bundle for detailed cinematic view
  const [inspectedBundle, setInspectedBundle] = useState<Bundle | null>(null);

  // 3D Carousel states for Bundles tab
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCollectionData() {
      try {
        const [cardsData, spraysData, buddiesData, weaponsData, bundlesData] = await Promise.all([
          valorantApi.getPlayerCards(),
          valorantApi.getSprays(),
          valorantApi.getBuddies(),
          valorantApi.getWeapons(),
          valorantApi.getBundles(),
        ]);

        setCards(cardsData);
        setSprays(spraysData);
        setBuddies(buddiesData);
        setWeapons(weaponsData);

        // Filter and set valid bundles with visual assets
        const validBundles = (bundlesData || []).filter(
          (b) => b && b.displayName && (b.displayIcon || b.displayIcon2)
        );
        setBundles(validBundles);

        // Load persisted balance, inventory, and bundles
        const savedVp = localStorage.getItem("vlopedia_vp");
        const savedRp = localStorage.getItem("vlopedia_rp");
        const savedOwned = localStorage.getItem("vlopedia_owned");
        const savedBundles = localStorage.getItem("vlopedia_owned_bundles");

        if (savedVp) setVpBalance(Number(savedVp));
        if (savedRp) setRpBalance(Number(savedRp));
        if (savedOwned) setOwnedSkins(JSON.parse(savedOwned));
        if (savedBundles) setOwnedBundles(JSON.parse(savedBundles));

        if (cardsData.length > 0) {
          const equippedUuid = localStorage.getItem("vlopedia_active_card");
          const found = cardsData.find((c) => c.uuid === equippedUuid);
          setActiveCard(found || cardsData[0]);
        }

        // Initialize Daily rotating featured offers with actual weapon skins!
        const skinOffers: typeof storeOffers = [];
        const possibleSkins: Array<{ uuid: string; name: string; icon: string; weaponUuid: string }> = [];

        weaponsData.forEach((w) => {
          if (w.skins) {
            w.skins.forEach((s) => {
              if (s.displayIcon && !s.displayName.includes("Standard")) {
                possibleSkins.push({
                  uuid: s.uuid,
                  name: s.displayName,
                  icon: s.displayIcon,
                  weaponUuid: w.uuid,
                });
              }
            });
          }
        });

        // Pick 4 random skins
        const shuffled = possibleSkins.sort(() => 0.5 - Math.random());
        const picked = shuffled.slice(0, 4);

        const priceTiers = [1775, 2175, 2475, 1275];
        picked.forEach((item, idx) => {
          skinOffers.push({
            ...item,
            cost: priceTiers[idx % priceTiers.length],
          });
        });

        setStoreOffers(skinOffers);
      } catch (err) {
        console.error("Error loading collection data", err);
      } finally {
        setLoading(false);
      }
    }
    loadCollectionData();
  }, []);

  // Compute all premium skins available across all weapons
  const allAvailableSkins = React.useMemo(() => {
    const list: Array<{ uuid: string; name: string; icon: string; weaponName: string; cost: number }> = [];
    weapons.forEach((w) => {
      if (w.skins) {
        w.skins.forEach((s) => {
          if (s.displayIcon && !s.displayName.includes("Standard")) {
            let baseCost = 1775;
            if (w.displayName === "Vandal" || w.displayName === "Phantom" || w.displayName === "Operator") {
              baseCost = 2175;
            } else if (w.displayName === "Sheriff" || w.displayName === "Spectre") {
              baseCost = 1775;
            } else if (
              s.displayName.toLowerCase().includes("knife") ||
              s.displayName.toLowerCase().includes("melee") ||
              s.displayName.toLowerCase().includes("scythe") ||
              s.displayName.toLowerCase().includes("axe") ||
              s.displayName.toLowerCase().includes("bat") ||
              s.displayName.toLowerCase().includes("sword")
            ) {
              baseCost = 3550;
            } else {
              baseCost = 1275;
            }
            list.push({
              uuid: s.uuid,
              name: s.displayName,
              icon: s.displayIcon,
              weaponName: w.displayName,
              cost: baseCost,
            });
          }
        });
      }
    });
    return list;
  }, [weapons]);

  // Search / filter logic for the giant catalog
  const filteredCatalogSkins = React.useMemo(() => {
    return allAvailableSkins.filter((skin) => {
      const matchesSearch =
        skin.name.toLowerCase().includes(skinSearchQuery.toLowerCase()) ||
        skin.weaponName.toLowerCase().includes(skinSearchQuery.toLowerCase());
      const matchesWeapon =
        skinWeaponFilter === "all" || skin.weaponName.toLowerCase() === skinWeaponFilter.toLowerCase();
      return matchesSearch && matchesWeapon;
    });
  }, [allAvailableSkins, skinSearchQuery, skinWeaponFilter]);

  // Dynamically extract unique weapon classes for filter drop-downs
  const weaponNamesList = React.useMemo(() => {
    const names = weapons.map((w) => w.displayName);
    return Array.from(new Set(names)).sort();
  }, [weapons]);

  const handleBuySkin = (skin: { uuid: string; name: string; icon: string; cost: number }) => {
    if (ownedSkins.includes(skin.uuid)) {
      audio.playError();
      return;
    }

    if (vpBalance < skin.cost) {
      audio.playError();
      alert("INSUFFICIENT VP BALANCE! Simulated credit can be refilled via the VP buy button (+).");
      return;
    }

    audio.playPurchase();

    const newVp = vpBalance - skin.cost;
    const newOwned = [...ownedSkins, skin.uuid];

    setVpBalance(newVp);
    setOwnedSkins(newOwned);

    localStorage.setItem("vlopedia_vp", newVp.toString());
    localStorage.setItem("vlopedia_owned", JSON.stringify(newOwned));

    setPurchaseSuccess(skin.name);
  };

  const handleBuyBundle = (bundle: Bundle) => {
    if (ownedBundles.includes(bundle.uuid)) {
      audio.playError();
      return;
    }

    const bundleCost = 7100; // Simulated premium bundle price
    if (vpBalance < bundleCost) {
      audio.playError();
      alert("INSUFFICIENT VP BALANCE! Simulated credit can be refilled via the VP buy button (+).");
      return;
    }

    audio.playPurchase();

    const newVp = vpBalance - bundleCost;
    const newOwnedBundles = [...ownedBundles, bundle.uuid];

    setVpBalance(newVp);
    setOwnedBundles(newOwnedBundles);

    localStorage.setItem("vlopedia_vp", newVp.toString());
    localStorage.setItem("vlopedia_owned_bundles", JSON.stringify(newOwnedBundles));

    // Automated matching logic to unlock all individual skins matching the bundle prefix!
    // e.g. "Prime" bundle unlocks "Prime Vandal", "Prime Spectre", "Prime Guardian", etc.
    const bundleNameClean = bundle.displayName
      .replace("//", "")
      .replace("Bundle", "")
      .trim()
      .split(" ")[0]
      .toLowerCase();

    const newlyOwnedSkinUuids = [...ownedSkins];

    weapons.forEach((w) => {
      if (w.skins) {
        w.skins.forEach((s) => {
          if (s.displayName.toLowerCase().includes(bundleNameClean) && !s.displayName.includes("Standard")) {
            if (!newlyOwnedSkinUuids.includes(s.uuid)) {
              newlyOwnedSkinUuids.push(s.uuid);
            }
          }
        });
      }
    });

    setOwnedSkins(newlyOwnedSkinUuids);
    localStorage.setItem("vlopedia_owned", JSON.stringify(newlyOwnedSkinUuids));

    setPurchaseSuccess(`${bundle.displayName} Bundle`);
  };

  const getBundleSkins = (bundleName: string) => {
    const bundleNameClean = bundleName
      .replace("//", "")
      .replace("Bundle", "")
      .trim()
      .split(" ")[0]
      .toLowerCase();
    return allAvailableSkins.filter((s) => s.name.toLowerCase().includes(bundleNameClean)).slice(0, 5);
  };

  const getBundleReleaseDetails = (bundle: Bundle) => {
    const name = bundle.displayName;
    let year = 2021;
    let tier = "Premium Edition";
    let season = "Episode 2: Act I";

    const nameLower = name.toLowerCase();
    if (nameLower.includes("reaver") || nameLower.includes("prime")) {
      tier = "Exclusive Edition";
      year = 2020;
      season = "Episode 1: Act I/III";
    } else if (nameLower.includes("spectrum") || nameLower.includes("elderflame") || nameLower.includes("champions")) {
      tier = "Ultra Edition";
      year = 2021;
      season = "Episode 3: Act II";
    } else if (nameLower.includes("rgx") || nameLower.includes("protocol")) {
      tier = "Exclusive Edition";
      year = 2022;
      season = "Episode 4: Act I";
    } else if (nameLower.includes("magepunk") || nameLower.includes("glitchpop")) {
      tier = "Premium Edition";
      year = 2021;
      season = "Episode 2: Act II";
    } else if (nameLower.includes("kuronami") || nameLower.includes("xenohunter")) {
      tier = "Exclusive Edition";
      year = 2024;
      season = "Episode 8: Act I";
    } else if (nameLower.includes("sentinels") || nameLower.includes("ruination")) {
      tier = "Exclusive Edition";
      year = 2021;
      season = "Episode 3: Act I";
    }

    const hash = bundle.uuid.charCodeAt(0) + (bundle.uuid.charCodeAt(1) || 45);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[hash % 12];
    const day = (hash % 28) + 1;
    const releaseDate = `${month} ${day}, ${year}`;

    return {
      tier,
      releaseDate,
      season,
    };
  };

  const getBundleItems = (bundleName: string) => {
    const clean = bundleName
      .replace("//", "")
      .replace("Bundle", "")
      .trim()
      .split(" ")[0]
      .toLowerCase();

    const matchedSkins = allAvailableSkins.filter((s) => s.name.toLowerCase().includes(clean));
    const matchedCards = cards.filter((c) => c.displayName.toLowerCase().includes(clean));
    const matchedSprays = sprays.filter((s) => s.displayName.toLowerCase().includes(clean));
    const matchedBuddies = buddies.filter((b) => b.displayName.toLowerCase().includes(clean));

    const items: Array<{
      id: string;
      type: "skin" | "card" | "spray" | "buddy";
      name: string;
      icon: string;
      cost?: number;
      owned: boolean;
    }> = [];

    matchedSkins.forEach((s) => {
      items.push({
        id: s.uuid,
        type: "skin",
        name: s.name,
        icon: s.icon,
        cost: s.cost,
        owned: ownedSkins.includes(s.uuid),
      });
    });

    matchedCards.forEach((c) => {
      items.push({
        id: c.uuid,
        type: "card",
        name: c.displayName,
        icon: c.largeArt || c.displayIcon,
        owned: activeCard?.uuid === c.uuid,
      });
    });

    matchedSprays.forEach((s) => {
      items.push({
        id: s.uuid,
        type: "spray",
        name: s.displayName,
        icon: s.fullIcon || s.displayIcon,
        owned: false,
      });
    });

    matchedBuddies.forEach((b) => {
      items.push({
        id: b.uuid,
        type: "buddy",
        name: b.displayName,
        icon: b.displayIcon,
        owned: false,
      });
    });

    // Fallbacks if items is empty
    if (items.length === 0) {
      items.push({
        id: `fallback-skin-${clean}`,
        type: "skin",
        name: `${bundleName.replace("//", "").replace("Bundle", "").trim()} Vandal`,
        icon: "https://media.valorant-api.com/weaponskins/3efd464f-4d9f-16fb-1811-1da390779fe4/displayicon.png",
        cost: 2175,
        owned: ownedSkins.includes(`fallback-skin-${clean}`),
      });
      if (cards.length > 0) {
        items.push({
          id: `fallback-card-${clean}`,
          type: "card",
          name: `${bundleName.replace("//", "").replace("Bundle", "").trim()} Card`,
          icon: cards[0].largeArt,
          owned: activeCard?.uuid === cards[0].uuid,
        });
      }
    }

    return items;
  };

  const refillVp = () => {
    audio.playSuccess();
    const newVp = vpBalance + 5000;
    setVpBalance(newVp);
    localStorage.setItem("vlopedia_vp", newVp.toString());
  };

  const handleEquipCard = (card: PlayerCard) => {
    audio.playSelect();
    setActiveCard(card);
    localStorage.setItem("vlopedia_active_card", card.uuid);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-purple border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-purple animate-pulse">
          OPENING VALORANT INVENTORY SECURE // API_REQ
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* BALANCES BANNER HUD */}
      <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {activeCard && (
            <div
              className="w-12 h-12 rounded border border-val-red overflow-hidden bg-val-black relative cursor-pointer group"
              onClick={() => setFullscreenImage({ src: activeCard.largeArt, title: activeCard.displayName })}
            >
              <img
                src={activeCard.smallArt || activeCard.displayIcon}
                alt="Active Avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          <div>
            <div className="text-xs font-display font-black text-white uppercase tracking-wider">
              {activeCard ? activeCard.displayName : "RECRUIT INVENTORY"}
            </div>
            <div className="font-mono text-[9px] text-gray-500 uppercase">
              OWNED COSMETICS INVENTORY FILE
            </div>
          </div>
        </div>

        {/* Currency simulated HUD */}
        <div className="flex items-center space-x-4">
          <div className="bg-val-black border border-white/[0.05] px-4 py-2 rounded flex items-center space-x-2.5">
            <span className="text-val-cyan font-black text-sm">¤</span>
            <div className="text-right">
              <div className="font-mono text-[11px] font-bold text-white">
                {vpBalance.toLocaleString()} VP
              </div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">VALORANT POINTS</div>
            </div>
            <button
              onClick={refillVp}
              className="p-1 hover:bg-white/10 rounded transition-colors text-val-cyan ml-1.5"
              title="Add 5,000 VP (Simulated)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-val-black border border-white/[0.05] px-4 py-2 rounded flex items-center space-x-2.5">
            <span className="text-val-orange font-black text-sm">♦</span>
            <div className="text-right">
              <div className="font-mono text-[11px] font-bold text-white">
                {rpBalance} RP
              </div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">RADIANITE POINTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* COLLECTION SUB-TABS */}
      <div className="flex border-b border-white/[0.05] gap-1 overflow-x-auto">
        {[
          { id: "store", label: "SKINS STORE", icon: ShoppingBag },
          { id: "bundles", label: "BUNDLES STORE", icon: Compass },
          { id: "cards", label: "PLAYER CARDS", icon: Bookmark },
          { id: "sprays", label: "SPRAYS", icon: Trophy },
          { id: "buddies", label: "GUN BUDDIES", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playSelect();
                setActiveSubTab(tab.id);
                setSearchQuery("");
                setSkinSearchQuery("");
              }}
              className={`px-5 py-3 text-xs font-display font-medium uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all relative whitespace-nowrap ${
                isActive
                  ? "border-val-purple text-val-purple bg-val-purple/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC CONTENT CONTAINER */}
      <div className="min-h-[400px]">
        {/* SKIN STORE TAB WITH BOTH DAILY OFFERS AND EXPANDABLE ALL-SKINS CATALOG */}
        {activeSubTab === "store" && (
          <div className="space-y-10">
            {/* Daily Offers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-val-purple animate-pulse" />
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                    VP DAILY ROTATION SPEC // 24H_ROT
                  </span>
                </div>
                <span className="font-mono text-xs text-val-purple font-bold">FEATURING 4 FLASH SALES</span>
              </div>

              {/* 4 Cards offers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {storeOffers.map((offer) => {
                  const isOwned = ownedSkins.includes(offer.uuid);
                  return (
                    <div
                      key={offer.uuid}
                      className={`bg-gradient-to-b from-white/[0.01] to-val-dark border rounded-xl p-5 flex flex-col justify-between relative group overflow-hidden transition-colors ${
                        isOwned ? "border-white/10 opacity-70" : "border-val-purple/30 hover:border-val-purple"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-val-purple/5 rounded-full blur-[30px] pointer-events-none" />

                      <div>
                        <div className="flex justify-between items-start font-mono text-[9px] text-gray-500 mb-4">
                          <span>DAILY FLASHSALE</span>
                          <span>-20% CRIT_SPEC</span>
                        </div>

                        {/* Skin icon visual */}
                        <div className="h-28 flex items-center justify-center mb-6">
                          <img
                            src={offer.icon}
                            alt={offer.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(200,70,255,0.25)] transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide truncate">
                            {offer.name}
                          </h4>
                          <span className="font-mono text-[9px] text-gray-500 uppercase">
                            OFFICIAL STORE PREMIUM SPEC
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-val-cyan font-bold">¤</span>
                            <span className="font-mono text-xs font-bold text-white">{offer.cost}</span>
                          </div>

                          <button
                            onClick={() => handleBuySkin(offer)}
                            disabled={isOwned}
                            className={`px-3 py-1.5 rounded text-[10px] font-display font-bold uppercase tracking-wider border transition-all ${
                              isOwned
                                ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                                : "bg-val-purple/15 border-val-purple text-val-purple hover:bg-val-purple hover:text-white"
                            }`}
                          >
                            {isOwned ? "OWNED" : "PURCHASE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FULL SKIN BROWSER MARKETPLACE */}
            <div className="pt-8 border-t border-white/[0.05] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                    ALL WEAPON SKINS CATALOG
                  </h3>
                  <p className="font-mono text-[10px] text-gray-500 uppercase">
                    Browse, filter and unlock any premium skin in Valorant history ({filteredCatalogSkins.length} SKINS)
                  </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={skinSearchQuery}
                      onChange={(e) => setSkinSearchQuery(e.target.value)}
                      placeholder="Search skin catalog (Reaver, Prime...)"
                      className="bg-val-black border border-white/[0.08] rounded px-3 py-1.5 pl-9 text-xs text-white focus:outline-none focus:border-val-purple w-52"
                    />
                  </div>

                  {/* Dropdown */}
                  <div className="relative flex items-center">
                    <Sliders className="absolute left-3 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    <select
                      value={skinWeaponFilter}
                      onChange={(e) => {
                        audio.playClick();
                        setSkinWeaponFilter(e.target.value);
                      }}
                      className="bg-val-black border border-white/[0.08] rounded px-3 py-1.5 pl-9 text-xs text-white focus:outline-none focus:border-val-purple appearance-none pr-8 cursor-pointer"
                    >
                      <option value="all">ALL WEAPONS</option>
                      {weaponNamesList.map((name) => (
                        <option key={name} value={name}>
                          {name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Skins grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {filteredCatalogSkins.slice(0, 50).map((skin) => {
                  const isOwned = ownedSkins.includes(skin.uuid);
                  return (
                    <div
                      key={skin.uuid}
                      className={`bg-white/[0.01] border rounded-lg p-4 flex flex-col justify-between group hover:border-white/20 transition-all ${
                        isOwned ? "border-white/[0.03] opacity-70" : "border-white/[0.06]"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[8px] text-gray-500 block uppercase mb-2">
                          {skin.weaponName} DESIGN
                        </span>

                        <div className="h-20 flex items-center justify-center mb-4">
                          <img
                            src={skin.icon}
                            alt={skin.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-103 transition-transform duration-200"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-display font-bold text-xs text-white uppercase tracking-wide truncate">
                          {skin.name}
                        </h5>

                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-2">
                          <div className="flex items-center space-x-1 font-mono text-[10px] text-gray-400">
                            <span className="text-val-cyan">¤</span>
                            <span>{skin.cost}</span>
                          </div>

                          <button
                            onClick={() => handleBuySkin(skin)}
                            disabled={isOwned}
                            className={`px-2 py-1 rounded text-[9px] font-display font-bold uppercase transition-colors ${
                              isOwned
                                ? "bg-white/5 text-gray-500 cursor-default"
                                : "bg-val-cyan/10 text-val-cyan border border-val-cyan/20 hover:bg-val-cyan hover:text-white"
                            }`}
                          >
                            {isOwned ? "OWNED" : "UNLOCK"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCatalogSkins.length > 50 && (
                <div className="text-center font-mono text-[10px] text-gray-500 uppercase py-2">
                  Showing first 50 results. Refine your query to see more designs.
                </div>
              )}
            </div>

            {/* Quick Inventory listing of owned skins */}
            {ownedSkins.length > 0 && (
              <div className="pt-6 border-t border-white/[0.05] space-y-3">
                <div className="font-display font-bold text-xs text-white uppercase tracking-wider">
                  MY OWNED CUSTOM WEAPONS SKIN CACHE ({ownedSkins.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {ownedSkins.map((ownedUuid) => {
                    let skinName = "Custom Skin";
                    weapons.forEach((w) => {
                      if (w.skins) {
                        const found = w.skins.find((s) => s.uuid === ownedUuid);
                        if (found) skinName = found.displayName;
                      }
                    });
                    return (
                      <span
                        key={ownedUuid}
                        className="bg-val-purple/10 border border-val-purple/20 text-val-purple font-mono text-[9px] px-2.5 py-1 rounded uppercase tracking-wider"
                      >
                        {skinName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BUNDLES STORE TAB */}
        {activeSubTab === "bundles" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <div>
                <h3 className="font-display font-black text-base text-white uppercase tracking-wider">
                  PREMIUM COLLECTION BUNDLES
                </h3>
                <p className="font-mono text-[10px] text-gray-500 uppercase">
                  Buy a complete thematic bundle to instantly unlock all of its premium weapon designs
                </p>
              </div>
              <span className="font-mono text-xs text-val-cyan font-bold">¤7,100 VP PER BUNDLE</span>
            </div>

            {/* 3D CAROUSEL CONTAINER */}
            <div className="relative w-full py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden min-h-[550px] md:min-h-[600px] bg-black/40 rounded-2xl border border-white/5 shadow-inner">
              {/* Radial gradient backing glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.12)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Backing technical radar line or grid */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-val-cyan/15 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30" />

              {bundles.length === 0 ? (
                <div className="text-center space-y-2 relative z-10">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                    <ShoppingBag className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                    No Bundles Available In Cache
                  </p>
                </div>
              ) : (
                <>
                  {/* Left / Right arrow navigation controls */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
                    <button
                      onClick={() => {
                        if (carouselIndex > 0) {
                          audio.playClick();
                          setCarouselIndex(carouselIndex - 1);
                        }
                      }}
                      disabled={carouselIndex === 0}
                      className={`p-3 rounded-full border transition-all duration-300 backdrop-blur-md ${
                        carouselIndex === 0
                          ? "bg-white/2 border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                          : "bg-val-black/60 border-white/10 text-gray-300 hover:text-val-cyan hover:border-val-cyan hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      }`}
                      title="PREVIOUS BUNDLE"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
                    <button
                      onClick={() => {
                        if (carouselIndex < bundles.length - 1) {
                          audio.playClick();
                          setCarouselIndex(carouselIndex + 1);
                        }
                      }}
                      disabled={carouselIndex === bundles.length - 1}
                      className={`p-3 rounded-full border transition-all duration-300 backdrop-blur-md ${
                        carouselIndex === bundles.length - 1
                          ? "bg-white/2 border-white/5 text-gray-600 cursor-not-allowed opacity-30"
                          : "bg-val-black/60 border-white/10 text-gray-300 hover:text-val-cyan hover:border-val-cyan hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      }`}
                      title="NEXT BUNDLE"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 3D Cards Track */}
                  <div 
                    className="relative w-full max-w-4xl flex items-center justify-center h-[340px]"
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                  >
                    {bundles.map((bundle, index) => {
                      const isOwned = ownedBundles.includes(bundle.uuid);
                      const bundleSkins = getBundleSkins(bundle.displayName);
                      const diff = index - carouselIndex;
                      const absDiff = Math.abs(diff);

                      // Hide elements far outside active range
                      if (absDiff > 2) return null;

                      // Exact placement parameters on the 3D arc
                      let xOffset = 0;
                      if (diff === -2) xOffset = -420;
                      else if (diff === -1) xOffset = -220;
                      else if (diff === 0) xOffset = 0;
                      else if (diff === 1) xOffset = 220;
                      else if (diff === 2) xOffset = 420;

                      const rotateYVal = diff * -18;
                      const zVal = absDiff * -100;
                      const scaleVal = 1 - absDiff * 0.12;
                      const opacityVal = 1 - absDiff * 0.45;

                      // Depth-of-Field (dynamic blur on hover) logic
                      let blurAmount = absDiff * 2.5;
                      if (hoveredIndex !== null) {
                        if (index === hoveredIndex) {
                          blurAmount = 0; // Hovered is absolutely sharp
                        } else {
                          blurAmount = absDiff * 2.5 + 3.0; // Other cards get blurred even more
                        }
                      }

                      const isActive = diff === 0;

                      return (
                        <motion.div
                          key={bundle.uuid}
                          initial={false}
                          animate={{
                            x: xOffset,
                            scale: scaleVal,
                            rotateY: rotateYVal,
                            z: zVal,
                            opacity: opacityVal,
                            filter: `blur(${blurAmount}px)`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 14,
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => {
                            if (!isActive) {
                              audio.playSelect();
                              setCarouselIndex(index);
                            }
                          }}
                          style={{
                            position: "absolute",
                            zIndex: 10 - absDiff,
                            transformStyle: "preserve-3d",
                            pointerEvents: "all",
                          }}
                          className={`w-[270px] sm:w-[320px] md:w-[380px] rounded-2xl overflow-hidden border cursor-pointer select-none transition-shadow ${
                            isActive
                              ? "border-val-cyan/40 bg-gradient-to-b from-[#0b0f19] to-[#040811] shadow-[0_15px_45px_rgba(0,180,216,0.15)]"
                              : "border-white/5 bg-white/[0.01] hover:border-white/10"
                          }`}
                        >
                          {/* Card Banner */}
                          <div className="aspect-[1.9/1] relative bg-val-black overflow-hidden border-b border-white/[0.05]">
                            {isActive && (
                              <div className="absolute inset-0 bg-radial-gradient from-val-cyan/10 to-transparent pointer-events-none" />
                            )}
                            <img
                              src={bundle.displayIcon2 || bundle.displayIcon}
                              alt={bundle.displayName}
                              className={`w-full h-full object-cover transition-transform duration-700 ${
                                isActive ? "scale-103" : "scale-100 opacity-70"
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040811] via-[#040811]/10 to-transparent" />

                            {/* Overlays */}
                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                              <span className="bg-val-cyan/10 border border-val-cyan/30 text-val-cyan font-mono text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                COLLECTION
                              </span>
                              {isOwned && (
                                <span className="bg-val-cyan text-val-black font-display font-bold text-[8px] px-2 py-0.5 rounded tracking-wider shadow-[0_2px_10px_rgba(0,180,216,0.3)]">
                                  OWNED
                                </span>
                              )}
                            </div>

                            {/* Info overlay */}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h4 className="font-display font-black text-sm md:text-base text-white uppercase tracking-tight line-clamp-1">
                                {bundle.displayName.replace("//", "").replace("Bundle", "").trim()}
                              </h4>
                              <p className="font-sans text-[9px] text-gray-400 line-clamp-1 font-light">
                                {bundle.description || "Premium tactical theme package."}
                              </p>
                            </div>
                          </div>

                          {/* Content & Action block */}
                          <div className="p-4 space-y-3 bg-[#040811] flex flex-col justify-between">
                            {bundleSkins.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="font-mono text-[8px] text-gray-500 block uppercase tracking-widest font-semibold">
                                  Skins Included ({bundleSkins.length})
                                </span>
                                <div className="flex flex-wrap gap-1 max-h-[48px] overflow-hidden">
                                  {bundleSkins.slice(0, 3).map((s) => {
                                    const skinOwned = ownedSkins.includes(s.uuid);
                                    return (
                                      <span
                                        key={s.uuid}
                                        className={`font-mono text-[7px] px-1.5 py-0.5 rounded uppercase border ${
                                          skinOwned
                                            ? "bg-val-cyan/10 border-val-cyan/30 text-val-cyan"
                                            : "bg-white/5 border-white/5 text-gray-400"
                                        }`}
                                      >
                                        {s.name}
                                      </span>
                                    );
                                  })}
                                  {bundleSkins.length > 3 && (
                                    <span className="font-mono text-[7px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">
                                      +{bundleSkins.length - 3} MORE
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Bottom CTA Actions */}
                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-val-cyan font-black text-xs">¤</span>
                                <span className="font-mono text-xs font-bold text-white">7,100</span>
                                <span className="font-mono text-[8px] text-gray-500">VP</span>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    audio.playSelect();
                                    setInspectedBundle(bundle);
                                  }}
                                  className="px-2 py-1.5 rounded text-[9px] font-display font-bold uppercase border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all flex items-center space-x-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>INSPECT</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyBundle(bundle);
                                  }}
                                  disabled={isOwned || !isActive}
                                  className={`px-3 py-1.5 rounded text-[9px] font-display font-bold uppercase border transition-all ${
                                    isOwned
                                      ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                                      : isActive
                                      ? "bg-val-cyan/20 border-val-cyan text-val-cyan hover:bg-val-cyan hover:text-val-black"
                                      : "bg-white/5 border-white/10 text-gray-400 cursor-default"
                                  }`}
                                >
                                  {isOwned ? "OWNED" : "UNLOCK"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Indicators */}
                  <div className="flex items-center space-x-2.5 mt-8 relative z-10">
                    {bundles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          audio.playClick();
                          setCarouselIndex(i);
                        }}
                        className={`transition-all duration-300 h-1.5 rounded-full ${
                          i === carouselIndex
                            ? "w-7 bg-val-cyan shadow-[0_0_8px_rgba(0,180,216,0.6)]"
                            : "w-1.5 bg-white/25 hover:bg-white/40"
                        }`}
                        title={`Go to bundle ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PLAYER CARDS SUB TAB */}
        {activeSubTab === "cards" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Player Cards..."
                  className="w-full bg-val-black border border-white/[0.08] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-val-purple"
                />
              </div>
              <span className="font-mono text-[9px] text-gray-500 uppercase">
                TOTAL CARDS RETRIEVED: {cards.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
              {cards
                .filter((card) => card.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((card) => {
                  const isEquipped = activeCard?.uuid === card.uuid;
                  return (
                    <div
                      key={card.uuid}
                      className="bg-white/[0.01] border border-white/[0.05] rounded-lg p-2.5 flex flex-col justify-between group hover:border-val-purple/40 transition-all"
                    >
                      <div
                        className="aspect-[1/2] rounded overflow-hidden bg-val-black border border-white/[0.05] relative cursor-pointer"
                        onClick={() => setFullscreenImage({ src: card.largeArt, title: card.displayName })}
                      >
                        <img
                          src={card.largeArt}
                          alt={card.displayName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-val-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <h4 className="font-display font-bold text-[10px] text-white truncate uppercase" title={card.displayName}>
                          {card.displayName}
                        </h4>

                        <button
                          onClick={() => handleEquipCard(card)}
                          className={`w-full py-1 text-[8px] font-mono font-bold uppercase rounded border tracking-wider transition-all ${
                            isEquipped
                              ? "bg-val-purple/10 border-val-purple text-val-purple cursor-default"
                              : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          {isEquipped ? "EQUIPPED" : "EQUIP CARD"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SPRAYS SUB TAB */}
        {activeSubTab === "sprays" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Sprays..."
                  className="w-full bg-val-black border border-white/[0.08] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-val-purple"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-8 gap-3">
              {sprays
                .filter((spray) => spray.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((spray) => (
                  <div
                    key={spray.uuid}
                    className="bg-white/[0.01] border border-white/[0.05] hover:border-val-purple/40 p-3 rounded-lg text-center flex flex-col justify-between aspect-square relative"
                  >
                    <div className="flex-1 flex items-center justify-center p-2">
                      <img
                        src={spray.animationGif || spray.fullIcon || spray.displayIcon}
                        alt={spray.displayName}
                        className="max-h-[80%] max-w-[80%] object-contain filter hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="font-display font-bold text-[9px] text-gray-300 truncate uppercase mt-1">
                      {spray.displayName}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* GUN BUDDIES SUB TAB */}
        {activeSubTab === "buddies" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Buddies..."
                  className="w-full bg-val-black border border-white/[0.08] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-val-purple"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-8 gap-3">
              {buddies
                .filter((buddy) => buddy.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((buddy) => (
                  <div
                    key={buddy.uuid}
                    className="bg-white/[0.01] border border-white/[0.05] hover:border-val-purple/40 p-3 rounded-lg text-center flex flex-col justify-between aspect-square"
                  >
                    <div className="flex-1 flex items-center justify-center p-2">
                      <img
                        src={buddy.displayIcon}
                        alt={buddy.displayName}
                        className="max-h-[85%] max-w-[85%] object-contain filter hover:rotate-12 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="font-display font-bold text-[9px] text-gray-300 truncate uppercase mt-1">
                      {buddy.displayName}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN PREVIEW OVERLAY */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-val-black/95 flex items-center justify-center z-50 p-6"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="max-w-md w-full bg-val-dark border border-white/10 rounded-xl overflow-hidden p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenImage.src}
                alt={fullscreenImage.title}
                className="w-full h-auto object-contain max-h-[80vh] rounded"
                referrerPolicy="no-referrer"
              />
              <div className="mt-3 text-center font-display font-bold text-sm text-white uppercase">
                {fullscreenImage.title}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CINEMATIC BUNDLE INSPECT MODAL */}
      <AnimatePresence>
        {inspectedBundle && (() => {
          const isOwned = ownedBundles.includes(inspectedBundle.uuid);
          const { tier, releaseDate, season } = getBundleReleaseDetails(inspectedBundle);
          const bundleItems = getBundleItems(inspectedBundle.displayName);

          // Calculate raw value
          const totalRawCost = bundleItems.reduce((acc, curr) => acc + (curr.cost || 1775), 0);
          const bundleDiscountedCost = 7100;
          const totalSavings = totalRawCost - bundleDiscountedCost;

          // Define cinematic stagger variants
          const listVariants = {
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          };

          const itemVariants = {
            hidden: { opacity: 0, x: -20, y: 10 },
            show: {
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                type: "spring" as const,
                stiffness: 110,
                damping: 12,
              },
            },
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-val-black/95 flex items-center justify-center z-50 p-4 md:p-8 overflow-y-auto"
              onClick={() => {
                audio.playClick();
                setInspectedBundle(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="max-w-6xl w-full bg-[#0b0f19] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE ICON */}
                <button
                  onClick={() => {
                    audio.playClick();
                    setInspectedBundle(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 z-20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* LEFT HERO ARTWORK PANEL (42% width) */}
                <div className="w-full lg:w-[42%] bg-gradient-to-br from-val-dark to-[#040811] relative border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between overflow-hidden">
                  {/* Subtle decorative grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                  {/* Top Header */}
                  <div className="p-6 relative z-10 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-val-cyan text-val-black font-mono font-black text-[9px] px-2.5 py-0.5 rounded tracking-wider uppercase">
                        {tier}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                        API // RES_ID: {inspectedBundle.uuid.substring(0, 8)}
                      </span>
                    </div>
                    <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight leading-none">
                      {inspectedBundle.displayName.replace("//", "").replace("Bundle", "").trim()}
                    </h2>
                    <p className="font-sans text-[11px] text-gray-400 leading-normal max-w-sm font-light">
                      {inspectedBundle.description || "Simulated ultra premium tactical weapon, spray, and accessory package collection."}
                    </p>
                  </div>

                  {/* Main Hero visual image with glowing shadows */}
                  <div className="h-64 lg:h-auto flex-1 flex items-center justify-center p-6 relative">
                    <div className="absolute w-48 h-48 bg-val-cyan/10 rounded-full blur-[60px] animate-pulse pointer-events-none" />
                    <img
                      src={inspectedBundle.displayIcon2 || inspectedBundle.displayIcon}
                      alt={inspectedBundle.displayName}
                      className="max-h-[85%] max-w-[90%] object-contain filter drop-shadow-[0_10px_25px_rgba(0,180,216,0.3)] hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Bottom Stats details */}
                  <div className="p-6 bg-black/40 border-t border-white/5 relative z-10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-gray-500 block uppercase tracking-wider">RELEASE DATE</span>
                        <span className="font-sans text-[11px] font-medium text-white">{releaseDate}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-gray-500 block uppercase tracking-wider">SEASON TIMING</span>
                        <span className="font-sans text-[11px] font-medium text-white">{season}</span>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <span className="font-mono text-[8px] text-gray-500 block uppercase tracking-wider font-semibold">ASSET PATH</span>
                        <span className="font-mono text-[9px] text-val-cyan truncate block">{inspectedBundle.assetPath}</span>
                      </div>
                    </div>

                    {/* VP Cost summary section */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="text-val-cyan font-black text-lg">¤</span>
                          <span className="font-mono text-xl font-bold text-white">{bundleDiscountedCost.toLocaleString()}</span>
                        </div>
                        <span className="font-mono text-[8px] text-gray-500 block uppercase">BUNDLE PROMO PRICE</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="text-right">
                          <div className="text-val-purple font-mono text-xs font-bold uppercase tracking-wider">
                            -{Math.round((totalSavings / totalRawCost) * 100)}% DISCOUNT
                          </div>
                          <span className="font-mono text-[8px] text-gray-500 block uppercase">SAVE {totalSavings.toLocaleString()} VP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT CONTENT ITEMS SECTION (58% width) */}
                <div className="w-full lg:w-[58%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] lg:max-h-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-black text-sm text-white uppercase tracking-widest flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-val-cyan" />
                        <span>FEATURED COLLECTION ITEMS ({bundleItems.length})</span>
                      </h3>
                      <p className="font-mono text-[9px] text-gray-500 uppercase mt-0.5">
                        Hover or select any specific design below to inspect individual cosmetics
                      </p>
                    </div>

                    {/* ITEMS LIST GRID WITH STAGGERED MOTION SLIDE-IN */}
                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto pr-1"
                    >
                      {bundleItems.map((item) => {
                        const itemOwned = item.owned || (item.type === "skin" && ownedSkins.includes(item.id));
                        return (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              audio.playSelect();
                              if (item.type === "skin" && item.cost) {
                                handleBuySkin({ uuid: item.id, name: item.name, icon: item.icon, cost: item.cost });
                              } else {
                                setFullscreenImage({ src: item.icon, title: item.name });
                              }
                            }}
                            className={`p-3 rounded-xl border bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                              itemOwned ? "border-val-cyan/25 opacity-90" : "border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div className="w-12 h-12 rounded bg-black/40 border border-white/5 flex items-center justify-center p-1 relative shrink-0">
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className="max-h-full max-w-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-display font-bold text-xs text-white uppercase tracking-wide truncate">
                                  {item.name.replace("//", "")}
                                </h4>
                                <span className="font-mono text-[8px] text-gray-500 uppercase block">
                                  {item.type} SPEC // {item.cost ? `${item.cost} VP` : "COMPLIMENTARY"}
                                </span>
                              </div>
                            </div>

                            <button
                              disabled={itemOwned}
                              className={`px-2 py-1 rounded text-[8px] font-mono font-black uppercase shrink-0 transition-colors ${
                                itemOwned
                                  ? "bg-val-cyan/15 text-val-cyan border border-val-cyan/30"
                                  : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {itemOwned ? "OWNED" : "UNLOCK"}
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="pt-6 border-t border-white/5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-sans text-[10px] text-gray-500 max-w-xs leading-relaxed">
                      Simulating official microtransaction parameters. Refilling virtual points is completely free.
                    </p>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          audio.playClick();
                          setInspectedBundle(null);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded font-display font-bold text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        CLOSE COMMS
                      </button>

                      <button
                        onClick={() => {
                          handleBuyBundle(inspectedBundle);
                        }}
                        disabled={isOwned}
                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider border transition-all ${
                          isOwned
                            ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                            : "bg-val-cyan text-val-black hover:bg-white hover:text-val-black border-transparent shadow-[0_0_20px_rgba(0,180,216,0.3)]"
                        }`}
                      >
                        {isOwned ? "COLLECTION UNLOCKED" : "UNLOCK BUNDLE"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* PURCHASE SUCCESS CELEBRATION MODAL */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-val-black/90 flex items-center justify-center z-50 p-6"
            onClick={() => setPurchaseSuccess(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full bg-gradient-to-br from-val-purple/20 via-val-dark to-val-black border-2 border-val-purple p-6 rounded-xl text-center space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-val-purple/25 text-val-purple border border-val-purple rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  PURCHASE COMPLETED
                </h3>
                <p className="font-mono text-xs text-val-purple font-bold">
                  {purchaseSuccess.toUpperCase()}
                </p>
                <p className="font-sans text-[11px] text-gray-400 leading-normal font-light pt-2">
                  Simulated Radianite synchronization completed. Skin design has been safely loaded into your local client inventory cache!
                </p>
              </div>

              <button
                onClick={() => setPurchaseSuccess(null)}
                className="w-full bg-val-purple text-white hover:bg-val-purple/80 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors"
              >
                DISMISS COMMS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
