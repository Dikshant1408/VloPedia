"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckSquare, Square, Award, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type CollectionItem = {
  id: string;
  name: string;
  type: string;
  price: number;
};

type Props = {
  slug: string;
  name: string;
  cost: number;
  rating: string;
  items: CollectionItem[];
};

export function CollectionTrackerClient({ slug, name, cost, rating, items }: Props) {
  // Local storage checklist integration
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`valovault_collection_${slug}`);
    if (saved) {
      try {
        setOwnedItems(JSON.parse(saved));
      } catch {
        setOwnedItems([]);
      }
    }
  }, [slug]);

  const toggleItem = (itemId: string, itemName: string) => {
    let next: string[];
    const isOwned = ownedItems.includes(itemId);
    
    if (isOwned) {
      next = ownedItems.filter((id) => id !== itemId);
      toast.info(`Removed "${itemName}" from owned collection.`);
    } else {
      next = [...ownedItems, itemId];
      toast.success(`Added "${itemName}" to owned collection!`, {
        className: "font-mono rounded-none border-[#4AF626]"
      });
    }
    
    setOwnedItems(next);
    localStorage.setItem(`valovault_collection_${slug}`, JSON.stringify(next));
  };

  const totalValue = items.reduce((acc, curr) => acc + curr.price, 0);
  const ownedValue = items
    .filter((item) => ownedItems.includes(item.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  const percentage = totalValue > 0 ? Math.round((ownedValue / totalValue) * 100) : 0;

  return (
    <div className="space-y-10">
      
      {/* Navigation Back */}
      <Link href="/collections">
        <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          BACK TO COLLECTIONS
        </Button>
      </Link>

      {/* Main Split */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-stretch">
        
        {/* Inclusions Checklist */}
        <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 relative flex flex-col justify-between space-y-6">
          <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary" />
          <div className="absolute right-0 top-0 bg-primary-soft border-l border-b border-primary/20 px-3 py-1 text-[9px] text-primary font-black">
            COLLECTION CHECKLIST
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-primary font-bold block">{"// DECK REGISTER"}</span>
              <h1 className="text-4xl font-black text-foreground font-sans uppercase tracking-wider">{name}</h1>
              <div className="flex gap-2 mt-2">
                <Badge className="border-primary/30 bg-primary-soft text-primary">
                  {rating} SET
                </Badge>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 pt-4">
              {items.map((item) => {
                const isOwned = ownedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id, item.name)}
                    className={`w-full flex items-center justify-between border p-4 text-left transition-all cursor-pointer ${
                      isOwned
                        ? "border-[#4AF626] bg-[rgba(34,197,94,0.05)] text-white"
                        : "border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 text-muted hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isOwned ? (
                        <CheckSquare className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-dark shrink-0" />
                      )}
                      <div>
                        <span className="font-sans font-bold text-xs uppercase tracking-wider block">{item.name}</span>
                        <span className="text-[9px] text-muted uppercase tracking-wider block mt-0.5">{item.type}</span>
                      </div>
                    </div>
                    
                    <span className="text-xs font-bold font-mono">{item.price} VP</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Valuation Diagnostics Panel */}
        <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 space-y-6 relative flex flex-col justify-between">
          <div className="space-y-6">
            <span className="font-mono text-xs text-primary font-bold block pb-2 border-b border-border">
              {"// VALUATION DECK DIAGNOSTICS"}
            </span>

            {/* Diagnostics Stats */}
            <div className="space-y-4 text-xs font-mono">
              
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">TOTAL SET COST:</span>
                  <span className="text-white font-bold">{totalValue} VP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">YOUR ACQUIRED VALUE:</span>
                  <span className="text-success font-bold">{ownedValue} VP</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] text-muted font-bold">
                  <span>SET COMPONENT QUANTITY STATUS</span>
                  <span className="text-foreground">{percentage}% COMPLETED</span>
                </div>
                <div className="h-2 bg-black border border-border">
                  <div className="h-full bg-[#4AF626] transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-[10px] text-muted leading-normal font-sans">
            <span className="font-bold text-primary uppercase block font-mono flex items-center gap-1.5">
              <Award className="h-4 w-4" /> VALUATION INSIGHTS
            </span>
            <p>
              {"Adding items compiles your account's skin valuation index. Tracked items are stored locally in your deck diagnostics files."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
