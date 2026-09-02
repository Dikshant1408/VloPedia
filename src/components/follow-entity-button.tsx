"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Check, Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

interface Props {
  entityId: string; // e.g. "agent:jett", "weapon:vandal", "map:ascent"
  entityName: string;
  className?: string;
}

export function FollowEntityButton({ entityId, entityName, className = "" }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vlopedia_followed_entities") || "[]");
      setIsFollowing(saved.includes(entityId));
    } catch (e) {}
  }, [entityId]);

  const toggleFollow = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem("vlopedia_followed_entities") || "[]");
      let next: string[];
      if (saved.includes(entityId)) {
        next = saved.filter(id => id !== entityId);
        setIsFollowing(false);
        toast.info(`Unfollowed ${entityName}.`);
      } else {
        next = [...saved, entityId];
        setIsFollowing(true);
        toast.success(`Following ${entityName}! You will receive patch and meta alerts in My VALORANT.`);
      }
      localStorage.setItem("vlopedia_followed_entities", JSON.stringify(next));
    } catch (e) {
      toast.error("Failed to update followed status.");
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
        isFollowing
          ? "border-[#0DF2F2] bg-[#0DF2F2]/15 text-[#0DF2F2] font-bold shadow-sm"
          : "border-[rgba(236,232,225,0.15)] bg-[#08111A] text-secondary hover:text-white hover:border-primary/40"
      } ${className}`}
      title={isFollowing ? `Unfollow ${entityName}` : `Follow ${entityName} for patch alerts`}
    >
      {isFollowing ? (
        <>
          <Bell className="h-3.5 w-3.5 text-[#0DF2F2]" />
          <span>Following</span>
        </>
      ) : (
        <>
          <BellOff className="h-3.5 w-3.5 text-muted" />
          <span>Follow Updates</span>
        </>
      )}
    </button>
  );
}
