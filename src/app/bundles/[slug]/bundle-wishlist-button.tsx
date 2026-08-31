"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";

interface Props {
  bundleName: string;
  bundleUuid: string;
}

export function BundleWishlistButton({ bundleName, bundleUuid }: Props) {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items } = useUserWishlist();

  const alreadySaved = items.some(w => w.title === bundleName);

  const handleClick = async () => {
    if (!user) {
      toast.info("Sign in to save bundles", {
        action: { label: "Sign In", onClick: signInWithDiscord },
        className: "font-mono-tactical rounded-none",
      });
      return;
    }
    if (alreadySaved) {
      toast.info(`"${bundleName}" already wishlisted`, { className: "font-mono-tactical rounded-none" });
      return;
    }
    try {
      await addWishlistItem({ title: bundleName, category: "bundle" });
      toast.success(`Added "${bundleName}" to wishlist`, {
        className: "font-mono-tactical rounded-none border-primary/40",
      });
    } catch {
      toast.error("Could not add to wishlist", { className: "font-mono-tactical rounded-none" });
    }
  };

  return (
    <Button
      variant={alreadySaved ? "secondary" : "primary"}
      onClick={handleClick}
      className="cut-corner-br gap-2"
      aria-label={alreadySaved ? "Already wishlisted" : `Add ${bundleName} to wishlist`}
    >
      <Heart className={`h-4 w-4 ${alreadySaved ? "fill-current" : ""}`} aria-hidden="true" />
      {alreadySaved ? "Wishlisted" : "Add to Wishlist"}
    </Button>
  );
}
